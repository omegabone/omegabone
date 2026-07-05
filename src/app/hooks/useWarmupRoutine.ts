import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { warmupManifest } from "../data/warmupManifest";
import { PitchAudioEngine } from "../lib/pitchAudioEngine";

export const REPS_PER_FILE = 2;
export const MIN_KEY_SEMITONES = -6;
export const MAX_KEY_SEMITONES = 6;
export const MIN_TEMPO_PERCENT = 50;
export const MAX_TEMPO_PERCENT = 120;

// "buffering" = mid-routine wait for a file still downloading; the routine
// resumes on its own the moment that file is ready.
export type RoutineStatus = "idle" | "loading" | "buffering" | "playing" | "paused" | "finished" | "error";

interface Step {
  fileIndex: number;
  rep: 1 | 2;
}

function buildSteps(fileCount: number): Step[] {
  const steps: Step[] = [];
  for (let f = 0; f < fileCount; f++) {
    for (let r = 1; r <= REPS_PER_FILE; r++) {
      steps.push({ fileIndex: f, rep: r as 1 | 2 });
    }
  }
  return steps;
}

export function useWarmupRoutine() {
  const engineRef = useRef<PitchAudioEngine | null>(null);
  if (!engineRef.current) engineRef.current = new PitchAudioEngine();

  const buffersRef = useRef<(AudioBuffer | null)[]>(warmupManifest.map(() => null));
  const decodePromisesRef = useRef<Promise<AudioBuffer | null>[] | null>(null);
  const stepIndexRef = useRef(0);
  const lastProgressRef = useRef(-1);
  // Guards stale async continuations: bumped on every navigation so that a
  // buffering wait abandoned by Skip/Restart doesn't also start playback.
  const playRequestRef = useRef(0);

  const [status, setStatus] = useState<RoutineStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [keySemitones, setKeySemitonesState] = useState(0);
  const [tempoPercent, setTempoPercentState] = useState(100);

  const steps = useMemo(() => buildSteps(warmupManifest.length), []);
  const totalSteps = steps.length;

  // Kick off downloads immediately (also called on page mount, so the audio
  // is fetching while the student reads the how-to card). Files load
  // SEQUENTIALLY so exercise 1 gets the full bandwidth and becomes playable
  // as fast as possible — the rest arrive while it plays. Parallel loading
  // would split the pipe four ways and delay the first playable file to
  // nearly the full download time.
  const ensureLoading = useCallback((): Promise<AudioBuffer | null>[] => {
    if (decodePromisesRef.current) return decodePromisesRef.current;
    let previous: Promise<unknown> = Promise.resolve();
    decodePromisesRef.current = warmupManifest.map((entry, i) => {
      const load = previous.then(() =>
        engineRef.current!
          .decode(`/audio/${entry.file}`)
          .then((buffer) => {
            buffersRef.current[i] = buffer;
            return buffer;
          })
          .catch(() => {
            setLoadErrors((prev) => (prev.includes(entry.file) ? prev : [...prev, entry.file]));
            return null;
          }),
      );
      previous = load;
      return load;
    });
    return decodePromisesRef.current;
  }, []);

  const playStepAt = useCallback(
    async (index: number) => {
      const requestId = ++playRequestRef.current;
      if (index >= totalSteps) {
        engineRef.current?.stop();
        setStatus("finished");
        return;
      }
      const step = steps[index];
      let buffer = buffersRef.current[step.fileIndex];

      if (!buffer) {
        // Still downloading (or failed). Show the step as buffering and wait
        // for this specific file only.
        const promises = ensureLoading();
        stepIndexRef.current = index;
        setStepIndex(index);
        setProgress(0);
        engineRef.current?.stop();
        setStatus("buffering");
        buffer = await promises[step.fileIndex];
        // User skipped/restarted while we were waiting — that action wins.
        if (playRequestRef.current !== requestId) return;
        if (!buffer) {
          // Download failed — skip this file's steps rather than stall.
          playStepAt(index + 1);
          return;
        }
      }

      stepIndexRef.current = index;
      setStepIndex(index);
      setProgress(0);
      lastProgressRef.current = -1;
      setStatus("playing");
      engineRef.current!.play(buffer, {
        onEnded: () => playStepAt(index + 1),
        onProgress: (percent) => {
          const rounded = Math.floor(percent);
          if (rounded !== lastProgressRef.current) {
            lastProgressRef.current = rounded;
            setProgress(Math.min(100, Math.max(0, rounded)));
          }
        },
      });
    },
    [steps, totalSteps, ensureLoading],
  );

  // Prefetch on mount: by the time Start is pressed the first file is
  // usually already decoded, and the rest keep arriving during exercise 1.
  useEffect(() => {
    ensureLoading();
  }, [ensureLoading]);

  const start = useCallback(async () => {
    if (status === "playing" || status === "loading" || status === "buffering") return;

    // Must happen before any await: mobile browsers only let audio start
    // from inside the tap's synchronous call stack.
    engineRef.current!.unlock();

    const promises = ensureLoading();
    // Only wait for the FIRST playable file, not all four.
    setStatus("loading");
    const requestId = ++playRequestRef.current;
    let firstPlayable = -1;
    for (let i = 0; i < promises.length; i++) {
      const buffer = await promises[i];
      if (playRequestRef.current !== requestId) return;
      if (buffer) {
        firstPlayable = i;
        break;
      }
    }
    if (firstPlayable === -1) {
      setStatus("error");
      return;
    }

    engineRef.current!.setTempo(tempoPercent / 100);
    engineRef.current!.setPitchSemitones(keySemitones);
    playStepAt(firstPlayable * REPS_PER_FILE);
  }, [status, tempoPercent, keySemitones, playStepAt, ensureLoading]);

  const pause = useCallback(() => {
    if (status !== "playing") return;
    engineRef.current?.pause();
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    // iOS may have suspended the context during the pause
    engineRef.current?.unlock();
    engineRef.current?.resume();
    setStatus("playing");
  }, [status]);

  const skip = useCallback(() => {
    if (status !== "playing" && status !== "paused" && status !== "buffering") return;
    playStepAt(stepIndexRef.current + 1);
  }, [status, playStepAt]);

  const restart = useCallback(() => {
    if (status === "idle" || status === "loading" || status === "error") return;
    playStepAt(0);
  }, [status, playStepAt]);

  const setKeySemitones = useCallback((value: number) => {
    const clamped = Math.max(MIN_KEY_SEMITONES, Math.min(MAX_KEY_SEMITONES, value));
    setKeySemitonesState(clamped);
    engineRef.current?.setPitchSemitones(clamped);
  }, []);

  const setTempoPercent = useCallback((value: number) => {
    const clamped = Math.max(MIN_TEMPO_PERCENT, Math.min(MAX_TEMPO_PERCENT, value));
    setTempoPercentState(clamped);
    engineRef.current?.setTempo(clamped / 100);
  }, []);

  const resetKeyTempo = useCallback(() => {
    setKeySemitones(0);
    setTempoPercent(100);
  }, [setKeySemitones, setTempoPercent]);

  useEffect(() => {
    return () => {
      engineRef.current?.close();
    };
  }, []);

  const currentStep = steps[stepIndex];

  return {
    status,
    stepIndex,
    totalSteps,
    currentFile: warmupManifest[currentStep.fileIndex],
    rep: currentStep.rep,
    progress,
    loadErrors,
    keySemitones,
    tempoPercent,
    start,
    pause,
    resume,
    skip,
    restart,
    setKeySemitones,
    setTempoPercent,
    resetKeyTempo,
  };
}
