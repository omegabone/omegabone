export interface WarmupManifestEntry {
  id: number;
  file: string;
  title: string;
  technique: string;
  instruction: string;
  defaultKey: string;
  /** 1-based measure range of this exercise within the warm-ups score. */
  measures: [number, number];
  /** Length of the audio file in seconds. */
  duration: number;
  /** Start time (seconds) of each of the 13 rounds: C up by half steps to B, then high C. Measured from the audio 2026-11-19. */
  rounds: number[];
}

/** Shown before the routine starts — how the whole practice works. */
export const howToPractice =
  "Set your OOH shape: lips soft and round, space between your teeth, creating a dark cave inside your mouth. " +
  "Play each exercise twice: first buzz the melody, then repeat it singing the vowels. " +
  "And keep checking: are you breathing?";

/** The Buzz — what the first pass of every exercise is for. */
export const buzzNote =
  "Buzz the melody through your lips before adding any vowels. " +
  "Your lips act as resistance to your breath, like a runner training underwater. " +
  "If the buzz sputters, that's data about your breath.";

/** Live cue per rep: rep 1 is the buzz pass, rep 2 is the sung pass. */
export const repCues = ["Buzz the melody", "Sing the vowels"] as const;

/**
 * Order matters — the routine plays these in sequence, each file twice,
 * before auto-advancing. Files live in public/audio/.
 */
export const warmupManifest: WarmupManifestEntry[] = [
  {
    id: 1,
    file: "exercise-1-C.mp3",
    title: "Exercise 1",
    technique: "EE / AH — Tongue Isolation",
    instruction:
      "Buzz it first, then sing it on “ee” and “ah” while your OOH shape stays fixed, " +
      "lips soft and round with the dark cave inside. Only your tongue moves: flat for “ah,” " +
      "up for “ee,” jaw completely still, pushing enough air to travel across the room.",
    defaultKey: "C",
    measures: [1, 3],
    duration: 87.943,
    rounds: [0.0, 7.89, 13.93, 20.2, 26.47, 32.74, 38.78, 45.05, 51.32, 57.35, 63.39, 69.66, 75.7],
  },
  {
    id: 2,
    file: "exercise-2-C.mp3",
    title: "Exercise 2",
    technique: "KEE / KEH — Abdominal Engagement",
    instruction:
      "Buzz it first, then sing it on “kee” and “keh.” The K is percussive: each one is " +
      "a sharp punch from your abdominals. Once your K is set, don't chew. Keep the OOH shape " +
      "in place and move only your tongue, pressing one clean note at a time.",
    defaultKey: "C",
    measures: [4, 5],
    duration: 72.844,
    rounds: [0.0, 6.97, 12.31, 17.65, 22.76, 28.1, 33.44, 38.78, 43.89, 49.23, 54.33, 59.44, 64.32],
  },
  {
    id: 3,
    file: "exercise-3-C.mp3",
    title: "Exercise 3",
    technique: "OohWah / EE / AH — One Tone Across Chest & Head Voice",
    instruction:
      "Buzz it first, then attack the phrase on “OohWah.” The W launches you straight from " +
      "your OOH shape, so the tone begins round and connected. Carry that same dark, smooth line " +
      "through the “ee” and “ah” vowels, raising your eyebrows and easing the breath as you " +
      "cross from chest into head voice, so it all sounds like one voice.",
    defaultKey: "C",
    measures: [6, 9],
    duration: 105.284,
    rounds: [0.0, 9.06, 16.95, 24.61, 32.28, 39.94, 47.6, 55.26, 62.93, 70.59, 78.25, 86.15, 93.81],
  },
  {
    id: 4,
    file: "exercise-4-C.mp3",
    title: "Exercise 4",
    technique: "K with the OOH Shape — Big Leaps",
    instruction:
      "Buzz it first, then sing it with the OOH shape locked in place, dark cave intact, while " +
      "the “K” engages your abdominals. Let your breath support, not your mouth, carry you through " +
      "the big leaps.",
    defaultKey: "C",
    measures: [10, 12],
    duration: 84.244,
    rounds: [0.0, 7.43, 13.7, 19.97, 26.01, 32.28, 38.55, 44.58, 50.62, 56.66, 62.93, 68.96, 75.0],
  },
];
