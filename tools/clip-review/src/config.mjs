/**
 * Saved settings, so a review is a double-click.
 *
 * The paths a review needs — which batch, where the lesson videos are — do not
 * change between runs, and typing them every time is the thing that stops a
 * page from being opened at all. They live in review.config.json beside the
 * tool; anything passed on the command line still wins over the file.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

// CLIP_REVIEW_CONFIG moves the file. Tests set it so that running them cannot
// overwrite the settings of whoever is reviewing on this machine.
const CONFIG_PATH =
  process.env.CLIP_REVIEW_CONFIG ||
  fileURLToPath(new URL('../review.config.json', import.meta.url));

const KEYS = ['manifest', 'transcripts', 'video-dir', 'video', 'clips', 'approved', 'state', 'port'];

export function configPath() {
  return CONFIG_PATH;
}

/** Read saved settings. Paths are resolved against the config file's folder. */
export function loadConfig() {
  if (!existsSync(CONFIG_PATH)) return {};

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    console.warn(`  ignoring ${CONFIG_PATH}: ${err.message}`);
    return {};
  }

  const base = dirname(CONFIG_PATH);
  const config = {};
  for (const key of KEYS) {
    const value = parsed[key];
    if (value === undefined || value === null || value === '') continue;
    config[key] = key === 'port' ? String(value) : resolve(base, String(value));
  }
  return config;
}

/**
 * Remember the settings this run used, so the next one needs no arguments.
 *
 * Only what was actually passed is written — saving defaults would freeze them,
 * and a default that later changes should follow the tool, not the file.
 */
export function saveConfig(passed) {
  const keep = {};
  for (const key of KEYS) {
    if (passed[key] !== undefined && passed[key] !== null && passed[key] !== '') {
      keep[key] = passed[key];
    }
  }
  if (!Object.keys(keep).length) return null;

  writeFileSync(CONFIG_PATH, `${JSON.stringify(keep, null, 2)}\n`, 'utf8');
  return CONFIG_PATH;
}
