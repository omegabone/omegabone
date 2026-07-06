export interface WarmupManifestEntry {
  id: number;
  file: string;
  title: string;
  technique: string;
  instruction: string;
  defaultKey: string;
  /** 1-based measure range of this exercise within the warm-ups score. */
  measures: [number, number];
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
  },
];
