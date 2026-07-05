import * as SliderPrimitive from "@radix-ui/react-slider";
import { Flame, Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect } from "react";
import {
  MAX_KEY_SEMITONES,
  MAX_TEMPO_PERCENT,
  MIN_KEY_SEMITONES,
  MIN_TEMPO_PERCENT,
  useWarmupRoutine,
} from "../hooks/useWarmupRoutine";
import { toFlatSymbol, transposeNoteLabel } from "../lib/musicTheory";
import { buzzNote, howToPractice, repCues } from "../data/warmupManifest";
import { useStreak } from "../hooks/useStreak";
import logoImg from "../../assets/omegabone-logo-trimmed.png";
import { ExerciseNotation } from "../components/ExerciseNotation";

declare const __BUILD_DATE__: string;

// Site font stack from omegabone-fonts.css — system fonts throughout.
const systemFont = { fontFamily: "system-ui, -apple-system, sans-serif" };

interface PracticePalette {
  bg: string;
  panel: string;
  card: string;
  border: string;
  trackBg: string;
  accent: string;
  accentBright: string;
  buttonText: string;
  white: string;
  whiteDim: string;
  whiteFaint: string;
}

/** Vocal Mastery portal: dark forest green with light green accents. */
const FOREST_GREEN: PracticePalette = {
  bg: "#081812",
  panel: "#0f261a",
  card: "#122d1e",
  border: "#1f4a32",
  trackBg: "#173b28",
  accent: "#7CE8A0",
  accentBright: "#9CFFC0",
  buttonText: "#08160f",
  white: "#ffffff",
  whiteDim: "rgba(255,255,255,0.65)",
  whiteFaint: "rgba(255,255,255,0.42)",
};

/** Learn-2-Sing portal: dark purple with lavender accents. */
const LAVENDER: PracticePalette = {
  bg: "#130a1e",
  panel: "#1d122c",
  card: "#241636",
  border: "#453061",
  trackBg: "#2f2047",
  accent: "#C9A9F0",
  accentBright: "#E2CCFF",
  buttonText: "#170d24",
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
function StepDots({ total, current, colors }: { total: number; current: number; colors: PracticePalette }) {
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
              background: done ? colors.accent : active ? colors.accentBright : "transparent",
              border: `1.5px solid ${done ? colors.accent : active ? colors.accentBright : colors.border}`,
              boxShadow: active ? `0 0 10px ${colors.accentBright}80` : "none",
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
  colors,
}: {
  label: string;
  valueLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  trackColor: string;
  colors: PracticePalette;
}) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
        <span style={{ ...systemFont, color: colors.white, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
        <SliderPrimitive.Track style={{ position: "relative", flexGrow: 1, height: "6px", borderRadius: "999px", background: colors.trackBg }}>
          <SliderPrimitive.Range style={{ position: "absolute", height: "100%", borderRadius: "999px", background: trackColor }} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          style={{
            display: "block",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: colors.white,
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

function PracticePortal({ colors }: { colors: PracticePalette }) {
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

  const { streak, practicedToday, recordPractice } = useStreak();

  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isLoading = status === "loading";
  const isBuffering = status === "buffering";
  const isFinished = status === "finished";
  const isError = status === "error";
  const hasStarted = isPlaying || isPaused || isBuffering || isFinished;

  // Completing the routine counts as today's practice.
  useEffect(() => {
    if (isFinished) recordPractice();
  }, [isFinished, recordPractice]);

  const resultKey = transposeNoteLabel(currentFile.defaultKey, keySemitones);
  const keyLabel =
    keySemitones === 0
      ? currentFile.defaultKey
      : `${currentFile.defaultKey} → ${toFlatSymbol(resultKey)}`;

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.white, overflowX: "hidden" }}>
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
          <a href="/" style={{ display: "inline-block" }}>
            <img
              src={logoImg}
              alt="Omega Bone"
              style={{ width: "min(280px, 75vw)", height: "auto", display: "block", margin: "0 auto", filter: "invert(1)" }}
            />
          </a>
          <h1
            style={{
              ...systemFont,
              color: colors.white,
              fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
              fontWeight: 700,
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Daily Warm-Up
          </h1>
          <p style={{ ...systemFont, color: colors.whiteDim, fontStyle: "italic", fontSize: "1rem" }}>
            Press Start. Follow along.
          </p>

          {streak > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "1rem",
                background: `${colors.accent}1f`,
                border: `1px solid ${colors.accent}66`,
                borderRadius: "999px",
                padding: "0.45rem 1.1rem",
              }}
            >
              <Flame size={16} color={colors.accentBright} fill={colors.accent} />
              <span style={{ ...systemFont, color: colors.accentBright, fontSize: "0.9rem", fontWeight: 700 }}>
                Day {streak}
              </span>
              {!practicedToday && (
                <span style={{ ...systemFont, color: colors.whiteDim, fontSize: "0.8rem" }}>
                  — practice today to keep it
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Now playing card ── */}
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "20px",
            padding: "2rem 1.5rem",
            marginBottom: "1.5rem",
            boxShadow: isPlaying ? `0 0 50px ${colors.accent}22, inset 0 0 30px ${colors.accent}08` : "none",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <p style={{ ...systemFont, color: colors.accent, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", textAlign: "center", marginBottom: "1rem" }}>
            {isLoading
              ? "Loading Exercises..."
              : isBuffering
                ? `Step ${stepIndex + 1} of ${totalSteps} · Loading...`
                : isFinished
                  ? "Warm-Up Complete"
                  : isError
                    ? "Couldn't Load Audio"
                    : `Step ${stepIndex + 1} of ${totalSteps} · Rep ${rep} of 2`}
          </p>

          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ ...systemFont, color: colors.white, fontSize: "clamp(1.4rem, 5vw, 1.9rem)", fontWeight: 700 }}>
              {isFinished
                ? "Nice work"
                : isError
                  ? "Add your exercise files"
                  : `${currentFile.title}: ${rep === 1 ? "Buzz" : "Syllables"}`}
            </h2>
            {isFinished && streak > 0 && (
              <p style={{ ...systemFont, color: colors.accentBright, fontSize: "1.05rem", fontWeight: 700, marginTop: "0.5rem" }}>
                Day {streak} 🔥 {streak === 1 ? "Your streak starts now." : "Keep it alive tomorrow."}
              </p>
            )}
            {!isFinished && !isError && (
              <p style={{ ...systemFont, color: colors.whiteDim, fontSize: "0.9rem", fontWeight: 600, marginTop: "0.4rem" }}>
                {currentFile.technique}
              </p>
            )}
          </div>

          {/* Live rep cue: pass 1 buzzes, pass 2 sings */}
          {(isPlaying || isPaused || isBuffering) && (
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span
                style={{
                  ...systemFont,
                  display: "inline-block",
                  background: `${colors.accent}1f`,
                  border: `1px solid ${colors.accent}66`,
                  color: colors.accentBright,
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

          {/* Sheet music: melody + syllables for the current exercise */}
          {!isFinished && !isError && (
            <div style={{ marginBottom: "1rem" }}>
              <ExerciseNotation measures={currentFile.measures} />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <Waveform active={isPlaying} color={colors.accent} />
          </div>

          {/* Progress bar for the current file */}
          {!isFinished && !isError && (
            <div style={{ width: "100%", height: "4px", borderRadius: "999px", background: colors.trackBg, overflow: "hidden", marginBottom: "1.5rem" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentBright})`,
                  transition: "width 0.2s linear",
                }}
              />
            </div>
          )}

          <StepDots total={totalSteps} current={isFinished ? totalSteps : hasStarted ? stepIndex : -1} colors={colors} />

          {!isFinished && !isError && (
            <p
              style={{
                ...systemFont,
                color: colors.whiteDim,
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
              <p style={{ ...systemFont, color: colors.whiteDim, fontSize: "0.9rem", lineHeight: 1.7 }}>
                None of the warm-up files could be found. Drop{" "}
                <code style={{ color: colors.accent }}>exercise-1-C.mp3</code> through{" "}
                <code style={{ color: colors.accent }}>exercise-4-C.mp3</code> into{" "}
                <code style={{ color: colors.accent }}>public/audio/</code>.
              </p>
            </div>
          )}
        </div>

        {loadErrors.length > 0 && !isError && (
          <div
            style={{
              background: colors.panel,
              border: `1px solid ${colors.accent}44`,
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ ...systemFont, color: colors.whiteDim, fontSize: "0.85rem", lineHeight: 1.6 }}>
              Skipped missing file{loadErrors.length > 1 ? "s" : ""}:{" "}
              <span style={{ color: colors.accent }}>{loadErrors.join(", ")}</span>. Add{loadErrors.length > 1 ? "" : " it"} to{" "}
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
                background: isLoading ? colors.trackBg : `linear-gradient(135deg, ${colors.accentBright}, ${colors.accent})`,
                color: colors.buttonText,
                border: "none",
                borderRadius: "999px",
                padding: "1rem 1.5rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: isLoading ? "default" : "pointer",
                boxShadow: isLoading ? "none" : `0 0 30px ${colors.accent}40`,
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
                color: colors.accent,
                border: `1px solid ${colors.accent}`,
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

          {(isPlaying || isPaused || isBuffering) && (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={isPlaying ? pause : isPaused ? resume : undefined}
                disabled={isBuffering}
                style={{
                  ...systemFont,
                  flex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background: isBuffering
                    ? colors.trackBg
                    : `linear-gradient(135deg, ${colors.accentBright}, ${colors.accent})`,
                  color: isBuffering ? colors.whiteDim : colors.buttonText,
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.9rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isBuffering ? "default" : "pointer",
                }}
              >
                {isPlaying ? <Pause size={16} fill={colors.buttonText} /> : isPaused ? <Play size={16} fill={colors.buttonText} /> : null}
                {isPlaying ? "Pause" : isPaused ? "Resume" : "Loading..."}
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
                  color: colors.accent,
                  border: `1px solid ${colors.accent}66`,
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
                color: colors.accent,
                border: `1px solid ${colors.accent}66`,
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
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              borderRadius: "20px",
              padding: "1.75rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ ...systemFont, color: colors.accent, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.75rem" }}>
              How to Practice
            </p>
            <p style={{ ...systemFont, color: colors.whiteDim, fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              {howToPractice}
            </p>
            <p style={{ ...systemFont, color: colors.accent, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.75rem" }}>
              The Buzz — First Pass of Every Exercise
            </p>
            <p style={{ ...systemFont, color: colors.whiteDim, fontSize: "0.95rem", lineHeight: 1.7 }}>
              {buzzNote}
            </p>
          </div>
        )}

        {/* ── Key + tempo controls ── */}
        <div style={{ background: colors.panel, border: `1px solid ${colors.border}`, borderRadius: "20px", padding: "1.75rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <p style={{ ...systemFont, color: colors.whiteFaint, fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
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
            trackColor={colors.accent}
            colors={colors}
          />

          <SliderRow
            label="Tempo"
            valueLabel={`${tempoPercent}%`}
            value={tempoPercent}
            min={MIN_TEMPO_PERCENT}
            max={MAX_TEMPO_PERCENT}
            step={5}
            onChange={setTempoPercent}
            trackColor={colors.accent}
            colors={colors}
          />

          <button
            onClick={resetKeyTempo}
            style={{
              ...systemFont,
              display: "block",
              margin: "0.5rem auto 0",
              background: "transparent",
              color: colors.whiteFaint,
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

        <p style={{ ...systemFont, color: colors.whiteFaint, textAlign: "center", fontStyle: "italic", fontSize: "0.85rem", marginTop: "2.5rem" }}>
          Pitch-shifted with tempo preserved — practice at your own key and speed.
        </p>
        <p style={{ ...systemFont, color: colors.whiteFaint, textAlign: "center", fontSize: "0.65rem", marginTop: "0.75rem", opacity: 0.7 }}>
          v{__BUILD_DATE__}
        </p>
      </div>
    </div>
  );
}

/** Vocal Mastery practice portal — omegabone.com/vocalmastery */
export function PracticePage() {
  return <PracticePortal colors={FOREST_GREEN} />;
}

/** Learn-2-Sing practice portal — omegabone.com/learn2sing/practice */
export function Learn2SingPracticePage() {
  return <PracticePortal colors={LAVENDER} />;
}
