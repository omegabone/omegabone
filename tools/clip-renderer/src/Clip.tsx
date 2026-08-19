import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import type { ClipProps } from './schema';
import { layout, brandFor } from './theme';
import { Captions } from './Captions';

/** Thin rule with an accent core. */
const Rule: React.FC<{ accent: string; width: number }> = ({ accent, width }) => (
  <div
    style={{
      width,
      height: 2,
      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
    }}
  />
);

export const Clip: React.FC<ClipProps> = ({
  videoSrc,
  startSeconds,
  awarenessLabel,
  topic,
  student,
  suggestedCaption,
  cta,
  captions,
  showCaptions,
  brand: brandName,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const brand = brandFor(brandName);
  const hasCues = showCaptions && captions.length > 0;

  // Remotion serves assets over its own http server: absolute filesystem paths
  // and file:// URLs are both rejected. Anything that is not already an http
  // URL is treated as a path inside public/, which is what render-all.mjs
  // stages source videos into.
  const src = videoSrc
    ? /^https?:\/\//.test(videoSrc)
      ? videoSrc
      : staticFile(videoSrc)
    : '';

  // Everything settles in over the first half-second.
  const settle = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  // The title holds for the entire clip and never fades out, so a viewer
  // landing mid-scroll at any second still sees what the lesson is.
  const header = settle;
  // The footer still eases out at the tail so the clip does not end on a hard
  // cut of the call to action.
  const footer = Math.min(
    settle,
    interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
      extrapolateLeft: 'clamp',
    }),
  );

  const labelCase = brand.uppercaseLabels ? ('uppercase' as const) : ('none' as const);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg }}>
      {/* Ground: brand base with a faint accent wash behind the footage. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 26%, ${brand.panel} 0%, transparent 64%),
                       radial-gradient(90% 50% at 50% 22%, ${brand.accent}14 0%, transparent 70%)`,
        }}
      />

      {/* Footage. */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'absolute',
            top: layout.videoTop,
            width: layout.width,
            height: Math.round((layout.width * 9) / 16),
            overflow: 'hidden',
            boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 2px ${brand.border}`,
          }}
        >
          {src ? (
            <OffthreadVideo
              src={src}
              trimBefore={Math.round(startSeconds * fps)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // No footage attached — the composition still previews so captions
            // and framing can be reviewed before any video is downloaded.
            <AbsoluteFill
              style={{
                background: brand.panel,
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: brand.text,
                fontSize: 26,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: brand.inkDim,
              }}
            >
              no footage attached
            </AbsoluteFill>
          )}
        </div>
      </AbsoluteFill>

      {/* Title block — holds for the full duration. */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: layout.headerTop,
          opacity: header,
          transform: `translateY(${(1 - header) * -18}px)`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              fontFamily: brand.text,
              fontWeight: 600,
              fontSize: 25,
              letterSpacing: '0.3em',
              textTransform: labelCase,
              color: brand.accent,
            }}
          >
            {awarenessLabel}
          </div>
          <Rule accent={brand.accent} width={420} />
          <div
            style={{
              fontFamily: brand.display,
              fontWeight: brand.displayWeight,
              fontSize: 52,
              letterSpacing: '-0.02em',
              color: brand.ink,
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.12,
            }}
          >
            {topic}
          </div>
          {student ? (
            <div style={{ fontFamily: brand.text, fontSize: 27, color: brand.inkDim }}>
              with {student}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      {/*
        Words under the footage. Timed clips burn the real transcript cues.
        Clips cut from an untimed source have no cues to sync to, so they carry
        the hook line as a single held card instead of faking cue timings.

        Only ever one of the two: burning the cues and the hook line together
        prints the same sentence twice.
      */}
      {hasCues ? (
        <Captions cues={captions} brand={brand} />
      ) : (
        <div
          style={{
            position: 'absolute',
            left: layout.safeX,
            right: layout.safeX,
            bottom: layout.captionBottom,
            fontFamily: brand.display,
            fontWeight: brand.displayWeight,
            fontSize: 62,
            lineHeight: 1.18,
            textAlign: 'center',
            textWrap: 'balance',
            color: brand.ink,
            opacity: footer,
            textShadow: `0 2px 18px rgba(0,0,0,0.55), 0 0 44px ${brand.accent}33`,
          }}
        >
          {suggestedCaption}
        </div>
      )}

      {/* Footer: the call to action alone. */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: layout.footerBottom,
          opacity: footer,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <Rule accent={brand.accent} width={300} />
          <div
            style={{
              fontFamily: brand.display,
              fontWeight: brand.displayWeight,
              fontSize: 33,
              letterSpacing: '0.04em',
              color: brand.accentBright,
            }}
          >
            {cta}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
