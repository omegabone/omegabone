import { z } from 'zod';

/** One caption cue, timed relative to the start of the clip. */
export const captionCue = z.object({
  start: z.number(),
  end: z.number(),
  text: z.string(),
});

/**
 * Props for one rendered clip. These map directly onto a clip entry in the
 * extractor's manifest.json, plus the local video file to cut from.
 */
export const clipSchema = z.object({
  id: z.string(),

  /** Local source video. Empty string renders a typographic card with no footage. */
  videoSrc: z.string(),
  /** Where the clip starts inside the source video, in seconds. */
  startSeconds: z.number(),
  /** Clip length in seconds. */
  durationSeconds: z.number(),

  awarenessLabel: z.string(),
  topic: z.string(),
  student: z.string(),
  suggestedCaption: z.string(),
  cta: z.string(),

  captions: z.array(captionCue),
  showCaptions: z.boolean(),

  /** Brand system: vme (default), frequency, or learn2sing. */
  brand: z.string(),
});

export type ClipProps = z.infer<typeof clipSchema>;
export type CaptionCue = z.infer<typeof captionCue>;
