import { useEffect, useRef, useState } from "react";
import scoreXml from "../data/notation/vocal-warmups.melody.musicxml?raw";

interface Props {
  /** 1-based inclusive measure range of the exercise within the score. */
  measures: [number, number];
}

/**
 * Renders one exercise's bars from the warm-ups score (melody staff with
 * syllable lyrics) using OpenSheetMusicDisplay. OSMD is imported dynamically
 * so the page paints and the audio prefetch starts before its ~1 MB engine
 * downloads — the notation pops in when ready.
 *
 * The SVG draws in black; the container's CSS invert flips it to white for
 * the dark background.
 */
export function ExerciseNotation({ measures }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { OpenSheetMusicDisplay } = await import("opensheetmusicdisplay");
        if (cancelled || !hostRef.current) return;

        if (!osmdRef.current) {
          osmdRef.current = new OpenSheetMusicDisplay(hostRef.current, {
            autoResize: true,
            backend: "svg",
            drawTitle: false,
            drawSubtitle: false,
            drawComposer: false,
            drawLyricist: false,
            drawPartNames: false,
            drawCredits: false,
            drawingParameters: "compacttight",
          });
          await osmdRef.current.load(scoreXml);
        }

        if (cancelled) return;
        osmdRef.current.setOptions({
          drawFromMeasureNumber: measures[0],
          drawUpToMeasureNumber: measures[1],
        });
        osmdRef.current.render();
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [measures]);

  if (failed) return null;

  return (
    <div
      ref={hostRef}
      aria-label="Sheet music for this exercise"
      style={{
        filter: "invert(1)",
        opacity: 0.92,
        overflow: "hidden",
      }}
    />
  );
}
