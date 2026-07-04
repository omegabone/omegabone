import * as SliderPrimitive from "@radix-ui/react-slider";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import {
  MAX_KEY_SEMITONES,
  MAX_TEMPO_PERCENT,
  MIN_KEY_SEMITONES,
  MIN_TEMPO_PERCENT,
  useWarmupRoutine,
} from "../hooks/useWarmupRoutine";
import { toFlatSymbol, transposeNoteLabel } from "../lib/musicTheory";
import { buzzNote, howToPractice, repCues } from "../data/warmupManifest";

// Site font stack from omegabone-fonts.css — system fonts throughout.
const systemFont = { fontFamily: "system-ui, -apple-system, sans-serif" };

const COLORS = {
  bg: "#081812",
  panel: "#0f261a",
  card: "#122d1e",
  border: "#1f4a32",
  trackBg: "#173b28",
  lightGreen: "#7CE8A0",
  lightGreenBright: "#9CFFC0",
  buttonText: "#08160f",
  white: "#ffffff",
  whiteDim: "rgba(255,255,255,0.65)",
  whiteFaint: "rgba(255,255,255,0.42)",
};

/* ── Decorative waveform, mirrors the one used elsewhere on the site ── */
function Waveform({ active, color }: { active: boolean; color: string }) {
  const bars = [6, 11, 16, 9, 13, 7, 12, 5];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "20px" }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: "3px",
            borderRadius: "999px",
            background: color,
            height: active ? `${h}px` : "4px",
            transition: "height 0.15s ease",
            animation: active ? `warmup-wave ${0.4 + i * 0.06}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
      <style>{`@keyframes warmup-wave { from { transform: scaleY(0.5); } to { transform: scaleY(1.3); } }`}</style>
    </div>
  );
}

/* ── Step progress dots — one per rep, grouped in pairs per file ── */
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
      {Array.from({ length: total }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={i}
            style={{
              width: active ? "12px" : "9px",
              height: active ? "12px" : "9px",
              borderRadius: "50%",
              background: done ? COLORS.lightGreen : active ? COLORS.lightGreenBright : "transparent",
              border: `1.5px solid ${done ? COLORS.lightGreen : active ? COLORS.lightGreenBright : COLORS.border}`,
              boxShadow: active ? `0 0 10px ${COLORS.lightGreenBright}80` : "none",
              transition: "all 0.25s ease",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Shared slider row (Key or Tempo) ── */
function SliderRow({
  label,
  valueLabel,
  value,
  min,
  max,
  step,
  onChange,
  trackColor,
}: {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  trackColor: string;
}) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
        <span style={{ ...systemFont, color: COLORS.white, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span style={{ ...systemFont, color: trackColor, fontSize: "0.95rem", fontWeight: 700 }}>{valueLabel}</span>
      </div>
      <SliderPrimitive.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        style={{ position: "relative", display: "flex", alignItems: "center", width: "100%", height: "28px", touchAction: "none" }}
      >
        <SliderPrimitive.Track style={{ position: "relative", flexGrow: 1, height: "6px", borderRadius: "999px", background: COLORS.trackBg }}>
          <SliderPrimitive.Range style={{ position: "absolute", height: "100%", borderRadius: "999px", background: trackColor }} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          style={{
            display: "block",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: COLORS.white,
            border: `2px solid ${trackColor}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            cursor: "pointer",
          }}
          aria-label={label}
        />
      </SliderPrimitive.Root>
    </div>
  );
}

export function PracticePage() {
  const {
    status,
    stepIndex,
    totalSteps,
    currentFile,
    rep,
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
  } = useWarmupRoutine();

  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isLoading = status === "loading";
  const isFinished = status === "finished";
  const isError = status === "error";
  const hasStarted = isPlaying || isPaused || isFinished;

  const resultKey = transposeNoteLabel(currentFile.defaultKey, keySemitones);
  const keyLabel =
    keySemitones === 0
      ? currentFile.defaultKey
      : `${currentFile.defaultKey} → ${toFlatSymbol(resultKey)}`;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.white, overflowX: "hidden" }}>
      {/* Noise texture, same treatment as the rest of the dark pages */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "3rem 1.25rem 5rem", position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <a
            href="/"
            style={{ ...systemFont, color: COLORS.whiteFaint, fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}
          >
            Omega Bone
          </a>
          <h1
            style={{
              ...systemFont,
              color: COLORS.white,
              fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
              fontWeight: 700,
              marginTop: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            Daily Warm-Up
          </h1>
          <p style={{ ...systemFont, color: COLORS.whiteDim, fontStyle: "italic", fontSize: "1rem" }}>
            Press Start. Follow along. ~12 minutes.
          </p>
        </div>

        {/* ── Now playing card ── */}
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "20px",
            padding: "2rem 1.5rem",
            marginBottom: "1.5rem",
            boxShadow: isPlaying ? `0 0 50px ${COLORS.lightGreen}22, inset 0 0 30px ${COLORS.lightGreen}08` : "none",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <p style={{ ...systemFont, color: COLORS.lightGreen, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", textAlign: "center", marginBottom: "1rem" }}>
            {isLoading
              ? "Loading Exercises..."
              : isFinished
                ? "Warm-Up Complete"
                : isError
                  ? "Couldn't Load Audio"
                  : `Step ${stepIndex + 1} of ${totalSteps} · Rep ${rep} of 2`}
          </p>

          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ ...systemFont, color: COLORS.white, fontSize: "clamp(1.4rem, 5vw, 1.9rem)", fontWeight: 700 }}>
              {isFinished
                ? "Nice work"
                : isError
                  ? "Add your exercise files"
                  : `${currentFile.title}: ${rep === 1 ? "Buzz" : "Syllables"}`}
            </h2>
            {!isFinished && !isError && (
              <p style={{ ...systemFont, color: COLORS.whiteDim, fontSize: "0.9rem", fontWeight: 600, marginTop: "0.4rem" }}>
                {currentFile.technique}
              </p>
            )}
          </div>

          {/* Live rep cue: pass 1 buzzes, pass 2 sings */}
          {(isPlaying || isPaused) && (
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span
                style={{
                  ...systemFont,
                  display: "inline-block",
                  background: `${COLORS.lightGreen}1f`,
                  border: `1px solid ${COLORS.lightGreen}66`,
                  color: COLORS.lightGreenBright,
                  borderRadius: "999px",
                  padding: "0.45rem 1.1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Pass {rep}: {repCues[rep - 1]}
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <Waveform active={isPlaying} color={COLORS.lightGreen} />
          </div>

          {/* Progress bar for the current file */}
          {!isFinished && !isError && (
            <div style={{ width: "100%", height: "4px", borderRadius: "999px", background: COLORS.trackBg, overflow: "hidden", marginBottom: "1.5rem" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${COLORS.lightGreen}, ${COLORS.lightGreenBright})`,
                  transition: "width 0.2s linear",
                }}
              />
            </div>
          )}

          <StepDots total={totalSteps} current={isFinished ? totalSteps : hasStarted ? stepIndex : -1} />

          {!isFinished && !isError && (
            <p
              style={{
                ...systemFont,
                color: COLORS.whiteDim,
                fontSize: "0.95rem",
                lineHeight: 1.7,
                marginTop: "1.5rem",
                textAlign: "left",
              }}
            >
              {currentFile.instruction}
            </p>
          )}

          {isError && (
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ ...systemFont, color: COLORS.whiteDim, fontSize: "0.9rem", lineHeight: 1.7 }}>
                None of the warm-up files could be found. Drop{" "}
                <code style={{ color: COLORS.lightGreen }}>exercise-1-C.mp3</code> through{" "}
                <code style={{ color: COLORS.lightGreen }}>exercise-4-C.mp3</code> into{" "}
                <code style={{ color: COLORS.lightGreen }}>public/audio/</code>.
              </p>
            </div>
          )}
        </div>

        {loadErrors.length > 0 && !isError && (
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.lightGreen}44`,
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ ...systemFont, color: COLORS.whiteDim, fontSize: "0.85rem", lineHeight: 1.6 }}>
              Skipped missing file{loadErrors.length > 1 ? "s" : ""}:{" "}
              <span style={{ color: COLORS.lightGreen }}>{loadErrors.join(", ")}</span>. Add{loadErrors.length > 1 ? "" : " it"} to{" "}
              <code>public/audio/</code> to include {loadErrors.length > 1 ? "them" : "it"} in the routine.
            </p>
          </div>
        )}

        {/* ── Transport controls ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
          {!hasStarted && !isError && (
            <button
              onClick={start}
              disabled={isLoading}
              style={{
                ...systemFont,
                background: isLoading ? COLORS.trackBg : `linear-gradient(135deg, ${COLORS.lightGreenBright}, ${COLORS.lightGreen})`,
                color: COLORS.buttonText,
                border: "none",
                borderRadius: "999px",
                padding: "1rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: isLoading ? "default" : "pointer",
                boxShadow: isLoading ? "none" : `0 0 30px ${COLORS.lightGreen}40`,
              }}
            >
              {isLoading ? "Loading..." : "Start Warm-Up"}
            </button>
          )}

          {isError && (
            <button
              onClick={start}
              style={{
                ...systemFont,
                background: "transparent",
                color: COLORS.lightGreen,
                border: `1px solid ${COLORS.lightGreen}`,
                borderRadius: "999px",
                padding: "1rem 1.5rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          )}

          {(isPlaying || isPaused) && (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={isPlaying ? pause : resume}
                style={{
                  ...systemFont,
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: `linear-gradient(135deg, ${COLORS.lightGreenBright}, ${COLORS.lightGreen})`,
                  color: COLORS.buttonText,
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.9rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {isPlaying ? <Pause size={16} fill={COLORS.buttonText} /> : <Play size={16} fill={COLORS.buttonText} />}
                {isPlaying ? "Pause" : "Resume"}
              </button>
              <button
                onClick={skip}
                style={{
                  ...systemFont,
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  background: "transparent",
                  color: COLORS.lightGreen,
                  border: `1px solid ${COLORS.lightGreen}66`,
                  borderRadius: "999px",
                  padding: "0.9rem 1rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                <SkipForward size={15} /> Skip
              </button>
            </div>
          )}

          {hasStarted && (
            <button
              onClick={restart}
              style={{
                ...systemFont,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                background: "transparent",
                color: COLORS.lightGreen,
                border: `1px solid ${COLORS.lightGreen}66`,
                borderRadius: "999px",
                padding: "0.75rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Restart Routine
            </button>
          )}
        </div>

        {/* ── How to practice (shown until the routine starts) ── */}
        {!hasStarted && (
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "20px",
              padding: "1.75rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ ...systemFont, color: COLORS.lightGreen, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.75rem" }}>
              How to Practice
            </p>
            <p style={{ ...systemFont, color: COLORS.whiteDim, fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              {howToPractice}
            </p>
            <p style={{ ...systemFont, color: COLORS.lightGreen, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.75rem" }}>
              The Buzz — First Pass of Every Exercise
            </p>
            <p style={{ ...systemFont, color: COLORS.whiteDim, fontSize: "0.95rem", lineHeight: 1.7 }}>
              {buzzNote}
            </p>
          </div>
        )}

        {/* ── Key + tempo controls ── */}
        <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "1.75rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <p style={{ ...systemFont, color: COLORS.whiteFaint, fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
              Key &amp; Tempo — Applies To The Whole Routine
            </p>
          </div>

          <SliderRow
            label="Key"
            valueLabel={`${keyLabel}${keySemitones !== 0 ? ` (${keySemitones > 0 ? "+" : ""}${keySemitones})` : ""}`}
            value={keySemitones}
            min={MIN_KEY_SEMITONES}
            max={MAX_KEY_SEMITONES}
            step={1}
            onChange={setKeySemitones}
            trackColor={COLORS.lightGreen}
          />

          <SliderRow
            label="Tempo"
            valueLabel={`${tempoPercent}%`}
            value={tempoPercent}
            min={MIN_TEMPO_PERCENT}
            max={MAX_TEMPO_PERCENT}
            step={5}
            onChange={setTempoPercent}
            trackColor={COLORS.lightGreen}
          />

          <button
            onClick={resetKeyTempo}
            style={{
              ...systemFont,
              display: "block",
              margin: "0.5rem auto 0",
              background: "transparent",
              color: COLORS.whiteFaint,
              border: "none",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              cursor: "pointer",
            }}
          >
            Reset to original key &amp; tempo
          </button>
        </div>

        <p style={{ ...systemFont, color: COLORS.whiteFaint, textAlign: "center", fontStyle: "italic", fontSize: "0.85rem", marginTop: "2.5rem" }}>
          Pitch-shifted with tempo preserved — practice at your own key and speed.
        </p>
      </div>
    </div>
  );
}
