import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { warmupManifest } from "../data/warmupManifest";
import { PitchAudioEngine } from "../lib/pitchAudioEngine";

export const REPS_PER_FILE = 2;
export const MIN_KEY_SEMITONES = -6;
export const MAX_KEY_SEMITONES = 6;
export const MIN_TEMPO_PERCENT = 50;
export const MAX_TEMPO_PERCENT = 120;

export type RoutineStatus = "idle" | "loading" | "playing" | "paused" | "finished" | "error";

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

  const buffersRef = useRef<(AudioBuffer | null)[]>([]);
  const stepIndexRef = useRef(0);
  const lastProgressRef = useRef(-1);

  const [status, setStatus] = useState<RoutineStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [keySemitones, setKeySemitonesState] = useState(0);
  const [tempoPercent, setTempoPercentState] = useState(100);

  const steps = useMemo(() => buildSteps(warmupManifest.length), []);
  const totalSteps = steps.length;

  const playStepAt = useCallback(
    (index: number) => {
      if (index >= totalSteps) {
        engineRef.current?.stop();
        setStatus("finished");
        return;
      }
      const step = steps[index];
      const buffer = buffersRef.current[step.fileIndex];
      if (!buffer) {
        // File failed to load — skip it and move on rather than stall the routine.
        playStepAt(index + 1);
        return;
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
    [steps, totalSteps],
  );

  const start = useCallback(async () => {
    if (status === "playing" || status === "loading") return;

    if (buffersRef.current.length === 0) {
      setStatus("loading");
      const results = await Promise.allSettled(
        warmupManifest.map((entry) => engineRef.current!.decode(`/audio/${entry.file}`)),
      );
      const errors: string[] = [];
      buffersRef.current = results.map((result, i) => {
        if (result.status === "fulfilled") return result.value;
        errors.push(warmupManifest[i].file);
        return null;
      });
      setLoadErrors(errors);
      if (buffersRef.current.every((b) => !b)) {
        setStatus("error");
        return;
      }
    }

    engineRef.current!.setTempo(tempoPercent / 100);
    engineRef.current!.setPitchSemitones(keySemitones);
    playStepAt(0);
  }, [status, tempoPercent, keySemitones, playStepAt]);

  const pause = useCallback(() => {
    if (status !== "playing") return;
    engineRef.current?.pause();
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    engineRef.current?.resume();
    setStatus("playing");
  }, [status]);

  const skip = useCallback(() => {
    if (status !== "playing" && status !== "paused") return;
    playStepAt(stepIndexRef.current + 1);
  }, [status, playStepAt]);

  const restart = useCallback(() => {
    if (buffersRef.current.length === 0) return;
    playStepAt(0);
  }, [playStepAt]);

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
