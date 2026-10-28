#!/usr/bin/env node
/**
 * Fold freshly extracted lessons into a batch that is already being reviewed.
 *
 * The review page reads one manifest, so a student who was clipped later has
 * no way into the queue except through the batch that is already open. Adding
 * them by re-running the extractor over the whole lessons folder is the wrong
 * move — it hands out new clip ids and orphans every approval on record (see
 * the omegabone-clip skill's "re-running the clip picker destroys review
 * progress"). This only appends, so nothing already reviewed changes.
 *
 * New lessons go to the *front* of the list. The review page walks the
 * manifest in order, so the front is what gets reviewed next.
 *
 *   node merge-into-batch.mjs --into <batch-dir> --from <batch-dir> [--from ...]
 *
 * Both directories are extractor output: manifest.json plus transcripts.json.
 * A lesson whose id is already in the target is left alone rather than
 * duplicated, so re-running this is safe.
 */

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const { values: args } = parseArgs({
  options: {
    into: { type: 'string' },
    from: { type: 'string', multiple: true },
    append: { type: 'boolean', default: false },
    'no-backup': { type: 'boolean', default: false },
  },
});

if (!args.into || !args.from?.length) {
  console.error('Usage: merge-into-batch.mjs --into <batch-dir> --from <batch-dir> [--from <batch-dir>]');
  process.exit(1);
}

const target = resolve(args.into);
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));

/**
 * One file's worth of the merge. Manifest and transcripts are the same shape
 * as far as this is concerned — { lessons: [...] } keyed by lesson id — so
 * they go through the same path rather than two near-identical ones.
 */
function mergeFile(name) {
  const path = join(target, name);
  if (!existsSync(path)) {
    console.error(`  ${name}: not in ${target}, skipping`);
    return;
  }

  const into = read(path);
  const have = new Set((into.lessons ?? []).map((l) => l.id));
  const incoming = [];

  for (const dir of args.from) {
    const source = join(resolve(dir), name);
    if (!existsSync(source)) {
      console.error(`  ${name}: not in ${dir}, skipping that source`);
      continue;
    }
    for (const lesson of read(source).lessons ?? []) {
      if (have.has(lesson.id)) {
        console.log(`  ${name}: already there — ${lesson.id}`);
        continue;
      }
      have.add(lesson.id);
      incoming.push(lesson);
    }
  }

  if (!incoming.length) {
    console.log(`  ${name}: nothing new`);
    return;
  }

  if (!args['no-backup']) copyFileSync(path, `${path}.bak`);
  into.lessons = args.append
    ? [...(into.lessons ?? []), ...incoming]
    : [...incoming, ...(into.lessons ?? [])];
  writeFileSync(path, `${JSON.stringify(into, null, 2)}\n`, 'utf8');

  const where = args.append ? 'appended' : 'added to the top';
  console.log(`  ${name}: ${incoming.length} lesson(s) ${where} — ${into.lessons.length} total`);
}

console.log(`Merging into ${target}`);
mergeFile('manifest.json');
mergeFile('transcripts.json');
