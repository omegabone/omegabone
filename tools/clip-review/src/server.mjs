/**
 * The review server.
 *
 * A page opened over file:// cannot move a file into another folder, so the
 * review page is served by this instead. It binds to localhost only — it reads
 * and writes the render directory, and that is not something to expose on a
 * network.
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLibrary, countStatuses, ID_PATTERN } from './library.mjs';
import { loadReviews, saveReviews, applyVerdict, writeApprovedIndex } from './reviews.mjs';

const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.svg': 'image/svg+xml',
};

export function createReviewServer({ renderDir, approvedDir, manifestPath, move }) {
  // Reviews are held in memory for the session and flushed on every verdict, so
  // a closed laptop loses nothing.
  const reviews = loadReviews(renderDir);

  const library = () => buildLibrary({ manifestPath, renderDir, reviews });

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);

      if (path === '/api/clips' && req.method === 'GET') {
        const clips = library();
        return json(res, 200, {
          clips,
          counts: countStatuses(clips),
          renderDir,
          approvedDir,
          mode: move ? 'move' : 'copy',
        });
      }

      // POST is accepted alongside PATCH because sendBeacon — how the page
      // saves feedback the moment a tab is closed — can only send POST.
      if (path.startsWith('/api/clips/') && (req.method === 'PATCH' || req.method === 'POST')) {
        return await patchClip(path.slice('/api/clips/'.length), req, res);
      }

      if (path.startsWith('/media/') && (req.method === 'GET' || req.method === 'HEAD')) {
        return streamMedia(path.slice('/media/'.length), req, res);
      }

      return serveStatic(path, res);
    } catch (err) {
      json(res, 500, { error: err.message });
    }
  });

  async function patchClip(id, req, res) {
    if (!ID_PATTERN.test(id)) return json(res, 400, { error: 'bad clip id' });

    const clips = library();
    const clip = clips.find((c) => c.id === id);
    if (!clip) return json(res, 404, { error: 'no such clip' });

    let patch;
    try {
      patch = JSON.parse(await readBody(req) || '{}');
    } catch {
      return json(res, 400, { error: 'body is not JSON' });
    }

    let record;
    try {
      record = applyVerdict(reviews, id, patch, {
        renderDir,
        approvedDir,
        move,
        file: clip.file,
      });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }

    saveReviews(renderDir, reviews);

    // Rebuild after the verdict so the index reflects it, and so the response
    // carries the clip as it now stands on disk.
    const updated = library();
    writeApprovedIndex(approvedDir, updated);

    return json(res, 200, {
      clip: updated.find((c) => c.id === id) ?? { ...clip, ...record },
      counts: countStatuses(updated),
    });
  }

  function streamMedia(name, req, res) {
    // An approved clip in move mode is no longer in the render directory, so
    // both are searched before giving up.
    const file = safeJoin(renderDir, name) ?? safeJoin(approvedDir, name);
    if (!file || !existsSync(file)) return json(res, 404, { error: 'no such file' });

    const { size } = statSync(file);
    const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
    const range = parseRange(req.headers.range, size);

    if (range === 'unsatisfiable') {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }

    // Range support is what makes the scrubber work; without it the browser
    // can only play a clip straight through from the start.
    if (range) {
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': range.end - range.start + 1,
        'Content-Range': `bytes ${range.start}-${range.end}/${size}`,
        'Accept-Ranges': 'bytes',
      });
      if (req.method === 'HEAD') return res.end();
      return createReadStream(file, { start: range.start, end: range.end }).pipe(res);
    }

    res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
    if (req.method === 'HEAD') return res.end();
    return createReadStream(file).pipe(res);
  }

  function serveStatic(path, res) {
    const name = path === '/' ? 'index.html' : path.replace(/^\//, '');
    const file = safeJoin(PUBLIC_DIR, name);
    if (!file || !existsSync(file) || !statSync(file).isFile()) {
      return json(res, 404, { error: 'not found' });
    }

    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(file).pipe(res);
  }

  return server;
}

/** Join under a root, refusing anything that escapes it. */
export function safeJoin(root, name) {
  if (!name || name.includes('\0')) return null;
  // join() would quietly reinterpret an absolute name as relative to the root.
  // That stays inside the folder, but serving out/etc/passwd for a request for
  // /etc/passwd is a confusing thing to do — refuse it instead.
  if (isAbsolute(name)) return null;

  const base = resolve(root);
  const target = resolve(join(base, name));
  return target === base || target.startsWith(base + sep) ? target : null;
}

/** Parse a single `bytes=` range. Multi-range requests fall back to the whole file. */
export function parseRange(header, size) {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (rawStart === '' && rawEnd === '') return null;

  // A suffix range ("bytes=-500") asks for the last N bytes.
  let start = rawStart === '' ? size - Number(rawEnd) : Number(rawStart);
  let end = rawStart === '' || rawEnd === '' ? size - 1 : Number(rawEnd);

  start = Math.max(0, start);
  end = Math.min(end, size - 1);

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
    return 'unsatisfiable';
  }
  return { start, end };
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store',
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      // Feedback is prose, not an upload.
      if (body.length > 1e6) reject(new Error('body too large'));
    });
    req.on('end', () => resolveBody(body));
    req.on('error', reject);
  });
}
