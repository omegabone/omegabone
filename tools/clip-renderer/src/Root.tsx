import React from 'react';
import { Composition } from 'remotion';
// Side-effect import: registers the bundled faces before any frame renders.
import './fonts';
import { Clip } from './Clip';
import { clipSchema, type ClipProps } from './schema';
import { layout, DEFAULT_BRAND } from './theme';

/**
 * Stand-in props so the composition opens in Studio and renders a still
 * without any footage or manifest attached. render-all.mjs overrides every
 * field per clip.
 */
const preview: ClipProps = {
  id: 'preview',
  videoSrc: '',
  startSeconds: 0,
  durationSeconds: 42,
  awarenessLabel: 'Solution Aware',
  topic: 'Vocal Technique & Breath',
  student: 'Brittany',
  suggestedCaption: 'Raise your eyebrows. The ceiling of the room goes up with them.',
  cta: '🟠 Buy Course',
  showCaptions: true,
  brand: DEFAULT_BRAND,
  captions: [
    { start: 0, end: 3.2, text: 'Raise your eyebrows' },
    { start: 3.2, end: 7.4, text: 'not for expression, for architecture' },
    { start: 7.4, end: 12, text: 'the soft palate lifts when the eyebrows lift' },
  ],
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Clip"
      component={Clip}
      schema={clipSchema}
      defaultProps={preview}
      width={layout.width}
      height={layout.height}
      fps={layout.fps}
      durationInFrames={Math.round(preview.durationSeconds * layout.fps)}
      // Length follows the clip, so each render is exactly as long as the
      // moment it was cut from.
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(1, Math.round(props.durationSeconds * layout.fps)),
      })}
    />
  </>
);
