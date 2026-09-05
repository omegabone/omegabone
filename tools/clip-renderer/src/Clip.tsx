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
import { layoutFor, brandFor } from './theme';
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
  topic,
  student,
  suggestedCaption,
  captions,
  showCaptions,
  brand: brandName,
  format = 'vertical',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const layout = layoutFor(format);
  const brand = brandFor(brandName);
  const hasCues = showCaptions && captions.length > 0;
  // Horizontal overlays text on the footage; vertical seats it on the ground.
  const overlay = layout.overlay;

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
      {/* Ground: brand base with a faint accent wash behind everything. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 26%, ${brand.panel} 0%, transparent 64%),
                       radial-gradient(90% 50% at 50% 22%, ${brand.accent}14 0%, transparent 70%)`,
        }}
      />

      {/* Footage. Vertical: a centered band. Horizontal: full-bleed. */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={
            overlay
              ? {
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                }
              : {
                  position: 'absolute',
                  top: layout.videoTop,
                  width: '100%',
                  height: layout.videoHeight,
                  overflow: 'hidden',
                  boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 2px ${brand.border}`,
                }
          }
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
          {/* Scrim only where text sits over footage — keeps type legible
              without tinting the whole frame. */}
          {overlay ? (
            <>
              <AbsoluteFill
                style={{
                  background: `linear-gradient(180deg, rgba(4,10,8,0.78) 0%, rgba(4,10,8,0.45) 16%, rgba(4,10,8,0) 34%)`,
                  pointerEvents: 'none',
                }}
              />
              <AbsoluteFill
                style={{
                  background: `linear-gradient(0deg, rgba(4,10,8,0.82) 0%, rgba(4,10,8,0.5) 14%, rgba(4,10,8,0) 30%)`,
                  pointerEvents: 'none',
                }}
              />
            </>
          ) : null}
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
              fontSize: overlay ? 22 : 25,
              letterSpacing: '0.3em',
              textTransform: labelCase,
              color: brand.accent,
              textShadow: overlay ? '0 2px 12px rgba(0,0,0,0.6)' : undefined,
            }}
          >
            {brand.presents} presents
          </div>
          <Rule accent={brand.accent} width={overlay ? 360 : 420} />
          <div
            style={{
              fontFamily: brand.display,
              fontWeight: brand.displayWeight,
              fontSize: overlay ? 46 : 52,
              letterSpacing: '-0.02em',
              color: brand.ink,
              textAlign: 'center',
              maxWidth: overlay ? 1500 : 900,
              lineHeight: 1.12,
              textShadow: overlay ? '0 2px 18px rgba(0,0,0,0.65)' : undefined,
            }}
          >
            {topic}
          </div>
          {student ? (
            <div
              style={{
                fontFamily: brand.text,
                fontSize: overlay ? 24 : 27,
                color: brand.inkDim,
                textShadow: overlay ? '0 2px 12px rgba(0,0,0,0.6)' : undefined,
              }}
            >
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
        <Captions cues={captions} brand={brand} format={format} />
      ) : (
        <div
          style={{
            position: 'absolute',
            left: layout.safeX,
            right: layout.safeX,
            bottom: layout.captionBottom,
            fontFamily: brand.display,
            fontWeight: brand.displayWeight,
            fontSize: overlay ? 54 : 62,
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
    </AbsoluteFill>
  );
};
