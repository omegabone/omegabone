/**
 * Brand systems, taken from the site so clips match it rather than inventing a
 * second identity.
 *
 * These lesson clips are VME — the Vocal Mastery portal's dark forest green
 * (src/app/pages/PracticePage.tsx → FOREST_GREEN). That is the default.
 *
 * The other two are here because the same renderer serves them and the tokens
 * are cheap to carry; they are not what the lesson library renders as:
 *   - frequency   The Frequency series red (src/app/pages/FrequencyPage.tsx)
 *   - learn2sing  The Learn 2 Sing purple (PracticePage → LAVENDER)
 */

export type BrandTokens = {
  /** Page ground. */
  bg: string;
  /** Slightly raised ground, used for the wash behind the footage. */
  panel: string;
  /** Hairline / frame colour. */
  border: string;
  /** Primary accent. */
  accent: string;
  /** Emphasis accent. */
  accentBright: string;
  /** Primary type colour. */
  ink: string;
  /** Secondary type colour. */
  inkDim: string;
  /** Heading face. */
  display: string;
  /** Body face. */
  text: string;
  /** Heading weight — the serif brand sets this lower than the sans brands. */
  displayWeight: number;
  /** Uppercase the small label and CTA. */
  uppercaseLabels: boolean;
};

export const BRANDS: Record<string, BrandTokens> = {
  /** VME — Vocal Mastery. The default for lesson clips. */
  vme: {
    bg: '#081812',
    panel: '#122d1e',
    border: '#1f4a32',
    accent: '#7CE8A0',
    accentBright: '#9CFFC0',
    ink: '#ffffff',
    inkDim: 'rgba(255,255,255,0.65)',
    display: 'Inter, system-ui, sans-serif',
    text: 'Inter, system-ui, sans-serif',
    displayWeight: 700,
    uppercaseLabels: true,
  },

  /** The Frequency series. */
  frequency: {
    bg: '#33090E',
    panel: '#3F0D12',
    border: '#8D775F',
    accent: '#C42A40',
    accentBright: '#D5BF86',
    ink: '#F1F0CC',
    inkDim: '#BAB09A',
    display: "'EB Garamond', Georgia, serif",
    text: "'EB Garamond', Georgia, serif",
    displayWeight: 600,
    uppercaseLabels: false,
  },

  /** Learn 2 Sing. */
  learn2sing: {
    bg: '#130a1e',
    panel: '#241636',
    border: '#453061',
    accent: '#C9A9F0',
    accentBright: '#E2CCFF',
    ink: '#ffffff',
    inkDim: 'rgba(255,255,255,0.65)',
    display: 'Inter, system-ui, sans-serif',
    text: 'Inter, system-ui, sans-serif',
    displayWeight: 700,
    uppercaseLabels: true,
  },
};

export const DEFAULT_BRAND = 'vme';

export const brandFor = (name: string): BrandTokens =>
  BRANDS[name] ?? BRANDS[DEFAULT_BRAND];

export const layout = {
  width: 1080,
  height: 1920,
  fps: 30,
  safeX: 72,

  /** Footage band. 16:9 at full width is 608px tall. */
  videoTop: 430,
  /** Captions sit directly beneath the footage. */
  captionBottom: 430,
  headerTop: 96,
  footerBottom: 96,
};
