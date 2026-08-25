import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import type { CaptionCue } from './schema';
import { layoutFor, type BrandTokens } from './theme';

/**
 * Cue-level captions, seated directly below the footage in brand type.
 *
 * The cues come from the lesson's own subtitle track, so vocal terminology
 * ("soft palate", "lip buzz") is spelled the way Omega says it rather than the
 * way an auto-transcriber guesses at it.
 *
 * Highlighting is per cue, not per word: the source gives cue-level timings
 * only, and inventing word timings by dividing the cue evenly desynchronises
 * against real speech. Better an honest cue than a confident wrong word.
 *
 * Vertical: captions sit on the brand ground beneath the footage band.
 * Horizontal: they overlay the footage near the bottom, on a soft scrim pill,
 * the way YouTube subtitles do.
 */
export const Captions: React.FC<{
  cues: CaptionCue[];
  brand: BrandTokens;
  /** Defaults to 'vertical' so callers that predate formats still typecheck. */
  format?: 'vertical' | 'horizontal';
}> = ({ cues, brand, format = 'vertical' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const layout = layoutFor(format);
  const overlay = layout.overlay;

  const active = cues.find((c) => t >= c.start && t < c.end);
  if (!active) return null;

  // Short rise as the cue lands, so successive cues read as separate beats.
  const age = t - active.start;
  const rise = interpolate(age, [0, 0.18], [22, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const fade = interpolate(age, [0, 0.14], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: layout.safeX,
        right: layout.safeX,
        bottom: layout.captionBottom,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          opacity: fade,
          transform: `translateY(${rise}px)`,
          padding: overlay ? '8px 24px' : '10px 26px',
          borderRadius: 14,
          /*
           * The highlight is where the brand shows. A marker swipe behind the
           * words in the brand accent, with a solid bar under them — the words
           * themselves stay white, because a whole sentence set in an accent
           * colour is harder to read at arm's length on a phone.
           *
           * Swap the brand and this is what changes: green for VME, red for
           * Frequency, purple for Learn 2 Sing, blue for Music 33.
           *
           * Over footage (horizontal) the accent alpha is doubled so the
           * highlight survives sitting on moving video instead of flat ground.
           */
          background: overlay ? `${brand.accent}5C` : `${brand.accent}2E`,
          boxShadow: `inset 0 -6px 0 0 ${brand.accent}`,
        }}
      >
        <div
          style={{
            fontFamily: brand.display,
            fontWeight: brand.displayWeight,
            fontSize: overlay ? 52 : 66,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            textAlign: 'center',
            textWrap: 'balance',
            color: brand.ink,
            // Over footage needs lift rather than a ground behind it.
            textShadow: overlay
              ? `0 2px 14px rgba(0,0,0,0.75), 0 0 30px rgba(0,0,0,0.5)`
              : `0 2px 18px rgba(0,0,0,0.55), 0 0 44px ${brand.accent}44`,
          }}
        >
          {active.text}
        </div>
      </div>
    </div>
  );
};
