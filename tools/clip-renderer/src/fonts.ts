import { staticFile, delayRender, continueRender, cancelRender } from 'remotion';

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
 * delayRender holds the frame until the faces are ready, otherwise the first
 * frames render in a fallback font.
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

  const handle = delayRender('Loading local fonts');

  Promise.all(
    FACES.map(async (face) => {
      const f = new FontFace(
        face.family,
        `url(${staticFile(`fonts/${face.file}`)}) format('woff2')`,
        { weight: face.weight, style: face.style },
      );
      await f.load();
      document.fonts.add(f);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};

loadFonts();
