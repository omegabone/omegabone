/**
 * Brand detection from a lesson's video title.
 *
 * The title already states which product a lesson belongs to, so the brand is
 * derived rather than passed in:
 *
 *   "Learn 2 Sing with Antoine"      -> learn2sing (purple)
 *   "Vocal Mastery with Brittany"    -> vme        (green)
 *   "Vocal Mastery Live, Meta Muse"  -> vme        (green)
 *
 * Titles in the library are hand-typed and inconsistent — "Vocal  Mastery"
 * with a double space, "Learn 2 Sing Antoine" with no "with", trailing dates
 * like "Brittany 19.May.2026" — so matching is whitespace-tolerant and
 * substring-based rather than exact.
 */

/** Ordered: the first rule that matches wins. */
const RULES = [
  { brand: 'learn2sing', pattern: /learn\s*2\s*sing|\bl2s\b/i },
  { brand: 'frequency', pattern: /\bfrequency\b/i },
  { brand: 'mr33', pattern: /music\s*33|\bm(?:r)?33\b/i },
  { brand: 'vme', pattern: /vocal\s+mastery|\bvme\b/i },
];

/** Used when a title matches nothing — the library is predominantly VME. */
export const FALLBACK_BRAND = 'vme';

/**
 * @param {string} title
 * @returns {{brand: string, matched: boolean}}
 */
export function brandFromTitle(title) {
  const t = String(title || '');
  for (const rule of RULES) {
    if (rule.pattern.test(t)) return { brand: rule.brand, matched: true };
  }
  return { brand: FALLBACK_BRAND, matched: false };
}
