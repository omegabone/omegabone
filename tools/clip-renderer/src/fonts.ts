import { staticFile } from 'remotion';

/**
 * Locally bundled typefaces.
 *
 * Deliberately not @remotion/google-fonts: that fetches from fonts.gstatic.com
 * at render time, which makes every render depend on the network, breaks behind
 * a proxy or offline, and can silently fall back to a system font mid-batch so
 * two clips in the same run don't match.
 *
 * The woff2 files in public/fonts are latin-subset only.
 *
 * Note on Inter: the VME and Learn 2 Sing portals specify `system-ui`, which
 * resolves to a different face on every machine and to a poor one inside
 * headless Chromium. Inter is bundled as a deterministic stand-in so batches
 * render identically. The Frequency series names real families (Cinzel,
 * EB Garamond), which are bundled as specified.
 *
 * ---
 *
 * This is plain CSS, with no delayRender holding the frame, and that is
 * deliberate.
 *
 * Holding frames on a FontFace promise lost whole batches: one render tab in a
 * hundred never resolved, and the run died two thirds of the way through on a
 * typeface. Raising the deadline only moved where it died. Racing the promise
 * against a timer does not work either — Remotion controls the clock while
 * rendering, so a setTimeout inside a composition never fires.
 *
 * Declared this way the browser loads the files itself, off its own timeline,
 * with no promise anyone can be left waiting on. The files are served by
 * Remotion's own local server, so they arrive in the first frame or two;
 * `font-display: swap` means the worst case is a moment in the fallback face
 * rather than a batch that does not finish.
 */

type Face = { family: string; file: string; weight: string; style: string };

const FACES: Face[] = [
  { family: 'Inter', file: 'inter-500-normal.woff2', weight: '500', style: 'normal' },
  { family: 'Inter', file: 'inter-600-normal.woff2', weight: '600', style: 'normal' },
  { family: 'Inter', file: 'inter-700-normal.woff2', weight: '700', style: 'normal' },
  { family: 'Cinzel', file: 'cinzel-600-normal.woff2', weight: '600', style: 'normal' },
  { family: 'Cinzel', file: 'cinzel-700-normal.woff2', weight: '700', style: 'normal' },
  { family: 'EB Garamond', file: 'eb-garamond-400-normal.woff2', weight: '400', style: 'normal' },
  { family: 'EB Garamond', file: 'eb-garamond-600-normal.woff2', weight: '600', style: 'normal' },
  { family: 'EB Garamond', file: 'eb-garamond-400-italic.woff2', weight: '400', style: 'italic' },
];

let started = false;

export const loadFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const style = document.createElement('style');
  style.setAttribute('data-clip-fonts', '');
  style.textContent = FACES.map(
    (face) =>
      `@font-face{` +
      `font-family:'${face.family}';` +
      `src:url('${staticFile(`fonts/${face.file}`)}') format('woff2');` +
      `font-weight:${face.weight};` +
      `font-style:${face.style};` +
      `font-display:swap;` +
      `}`,
  ).join('');

  document.head.appendChild(style);
};

loadFonts();
