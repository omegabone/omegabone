/**
 * The review server.
 *
 * A page opened over file:// cannot read the lesson videos or write the render
 * manifest, so the page is served by this instead. It binds to localhost only —
 * it reads and writes your working directories, and that is not something to
 * expose on a network.
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLibrary, countStatuses, readLessons, ID_PATTERN } from './library.mjs';
import {
  loadReviews,
  saveReviews,
  applyVerdict,
  writeApprovedIndex,
  writeRenderManifest,
} from './reviews.mjs';
import { loadTranscripts, windowFor, captionsFor } from './transcript.mjs';
import { resolveSources } from './sources.mjs';

// The page is one self-contained file so that it also works when it is opened
// straight from the filesystem, with no server at all. Serving it from here is
// the other half of the same file.
const PAGE = fileURLToPath(new URL('../review.html', import.meta.url));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.webm': 'video/webm',
};

export function createReviewServer(config) {
  const {
    manifestPath,
    transcriptsPath,
    renderDir,
    approvedDir,
    stateDir,
    videoDir,
    video,
    move,
  } = config;

  const { lessons, rules } = readLessons(manifestPath);
  const transcripts = loadTranscripts(transcriptsPath);
  const sources = resolveSources(lessons, { videoDir, video });

  // Reviews are held in memory for the session and flushed on every edit, so a
  // closed laptop loses nothing.
  const reviews = loadReviews(stateDir);
  const renderManifestPath = join(stateDir, 'approved-manifest.json');

  const library = () => buildLibrary({ manifestPath, renderDir, reviews, sources });

  /** Everything derived from a change, written in one go. */
  function commit() {
    const clips = library();
    saveReviews(stateDir, reviews);
    writeApprovedIndex(approvedDir, clips);
    writeRenderManifest(renderManifestPath, clips, { lessons, transcripts, captionsFor });
    return clips;
  }

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);

      // The page probes this with HEAD to work out whether it is being served
      // or was opened from the filesystem, so it has to answer one.
      if (path === '/api/clips' && req.method === 'HEAD') {
        res.writeHead(200, { 'Content-Type': MIME['.json'] });
        return res.end();
      }

      if (path === '/api/clips' && req.method === 'GET') {
        const clips = library();
        return json(res, 200, {
          clips,
          counts: countStatuses(clips),
          rules,
          lessons: lessons.map((lesson) => ({
            id: lesson.id,
            videoTitle: lesson.videoTitle,
            hasSource: sources.has(lesson.id),
            hasWords: Boolean(transcripts.get(lesson.id)?.hasWords),
            hasTranscript: transcripts.has(lesson.id),
          })),
          renderDir,
          approvedDir,
          renderManifest: renderManifestPath,
          mode: move ? 'move' : 'copy',
        });
      }

      // Words are fetched per clip rather than shipped with the list: a lesson
      // is an hour of speech, and only the window around one clip is clickable
      // at a time.
      if (path.startsWith('/api/words/') && req.method === 'GET') {
        return words(path.slice('/api/words/'.length), url, res);
      }

      if (path.startsWith('/api/captions/') && req.method === 'GET') {
        return captions(path.slice('/api/captions/'.length), res);
      }

      if (path.startsWith('/api/clips/') && (req.method === 'PATCH' || req.method === 'POST')) {
        return await patchClip(path.slice('/api/clips/'.length), req, res);
      }

      if (path.startsWith('/source/') && (req.method === 'GET' || req.method === 'HEAD')) {
        return sourceVideo(path.slice('/source/'.length), req, res);
      }

      if (path.startsWith('/media/') && (req.method === 'GET' || req.method === 'HEAD')) {
        return streamFile(mediaPath(path.slice('/media/'.length)), req, res);
      }

      return servePage(path, res);
    } catch (err) {
      json(res, 500, { error: err.message });
    }
  });

  function words(clipId, url, res) {
    if (!ID_PATTERN.test(clipId)) return json(res, 400, { error: 'bad clip id' });

    const clip = library().find((c) => c.id === clipId);
    if (!clip) return json(res, 404, { error: 'no such clip' });

    const transcript = transcripts.get(clip.lessonId);
    if (!transcript) {
      return json(res, 200, { words: [], hasWords: false, hasTranscript: false });
    }

    const context = Number(url.searchParams.get('context')) || 45;
    const from = clip.start ?? 0;
    const to = clip.end ?? from;

    return json(res, 200, {
      words: windowFor(transcript, from, to, context),
      hasWords: transcript.hasWords,
      hasTranscript: true,
    });
  }

  // For the composed preview: the cues that actually fall inside the clip's
  // current in/out points, in the lesson's own (absolute) timeline — the same
  // timeline the video element plays in, so a cue lines up with the frame it
  // was said in without any rebasing.
  function captions(clipId, res) {
    if (!ID_PATTERN.test(clipId)) return json(res, 400, { error: 'bad clip id' });

    const clip = library().find((c) => c.id === clipId);
    if (!clip) return json(res, 404, { error: 'no such clip' });

    const transcript = transcripts.get(clip.lessonId);
    if (!transcript || clip.start === null || clip.end === null) {
      return json(res, 200, { cues: [] });
    }

    const cues = (transcript.cues ?? [])
      .filter((cue) => cue.end > clip.start && cue.start < clip.end)
      .map((cue) => ({ start: cue.start, end: cue.end, text: cue.text }));

    return json(res, 200, { cues });
  }

  async function patchClip(id, req, res) {
    if (!ID_PATTERN.test(id)) return json(res, 400, { error: 'bad clip id' });

    const clip = library().find((c) => c.id === id);
    if (!clip) return json(res, 404, { error: 'no such clip' });

    let patch;
    try {
      patch = JSON.parse((await readBody(req)) || '{}');
    } catch {
      return json(res, 400, { error: 'body is not JSON' });
    }

    try {
      applyVerdict(reviews, id, patch, { renderDir, approvedDir, move, file: clip.file });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }

    const updated = commit();
    return json(res, 200, {
      clip: updated.find((c) => c.id === id) ?? clip,
      counts: countStatuses(updated),
    });
  }

  /** The lesson video a clip was cut from, for reviewing before rendering. */
  function sourceVideo(lessonId, req, res) {
    const path = sources.get(decodeURIComponent(lessonId));
    if (!path || !existsSync(path)) return json(res, 404, { error: 'no source video for that lesson' });
    return streamFile(path, req, res);
  }

  function mediaPath(name) {
    // An approved clip in move mode is no longer in the render directory, so
    // both are searched before giving up.
    return safeJoin(renderDir, name) ?? safeJoin(approvedDir, name);
  }

  function streamFile(file, req, res) {
    if (!file || !existsSync(file)) return json(res, 404, { error: 'no such file' });

    const { size } = statSync(file);
    const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
    const range = parseRange(req.headers.range, size);

    if (range === 'unsatisfiable') {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }

    // Range support is what makes seeking work. Without it the browser can only
    // play from the start — and a clip 40 minutes into a lesson is all seek.
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

  function servePage(path, res) {
    if (path !== '/' && path !== '/review.html') return json(res, 404, { error: 'not found' });

    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    createReadStream(PAGE).pipe(res);
  }

  // Written once at start-up too, so the renderer has something to read even if
  // the batch was reviewed in an earlier session.
  commit();

  server.on('close', () => {});
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
    'Content-Type': MIME['.json'],
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
