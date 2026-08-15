/**
 * Brand detection tests. Run with: npm test
 *
 * Titles below are taken verbatim from the lesson library, inconsistencies and
 * all, because those are what the detector actually has to survive.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brandFromTitle, FALLBACK_BRAND } from '../scripts/brand-from-title.mjs';

const vmeTitles = [
  'Vocal Mastery with Ameesha',
  'Vocal Mastery Live, Ameesha',
  'Vocal Mastery with Brittany',
  'Vocal Mastery Live, Meta Muse',
  'Vocal Mastery with Chris',
  'Vocal  Mastery with Antoine', // double space, as typed in the sheet
  'Vocal Mastery with Brittany 19.May.2026', // trailing date
];

const l2sTitles = [
  'Learn 2 Sing with Antoine',
  'Learn 2 Sing Antoine', // no "with"
  'Learn 2 Sing with Omega Live @ Network School',
  'Learn 2 Sing with Antoine (muted...sorry)',
];

test('Vocal Mastery titles render green', () => {
  for (const title of vmeTitles) {
    const { brand, matched } = brandFromTitle(title);
    assert.equal(brand, 'vme', `expected vme for "${title}"`);
    assert.equal(matched, true);
  }
});

test('Learn 2 Sing titles render purple', () => {
  for (const title of l2sTitles) {
    const { brand, matched } = brandFromTitle(title);
    assert.equal(brand, 'learn2sing', `expected learn2sing for "${title}"`);
    assert.equal(matched, true);
  }
});

test('L2S wins over a Vocal Mastery mention in the same title', () => {
  // Rule order matters: an L2S session that name-drops Vocal Mastery is still
  // an L2S video.
  assert.equal(
    brandFromTitle('Learn 2 Sing — a Vocal Mastery series').brand,
    'learn2sing',
  );
});

test('Frequency titles render red', () => {
  assert.equal(brandFromTitle('The Frequency Series, Episode 1').brand, 'frequency');
});

test('unrecognised titles fall back and report that they did not match', () => {
  const { brand, matched } = brandFromTitle('Untitled session');
  assert.equal(brand, FALLBACK_BRAND);
  assert.equal(matched, false);
});

test('missing or empty titles do not throw', () => {
  for (const value of [undefined, null, '']) {
    const { brand, matched } = brandFromTitle(value);
    assert.equal(brand, FALLBACK_BRAND);
    assert.equal(matched, false);
  }
});
