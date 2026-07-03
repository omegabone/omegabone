export interface WarmupManifestEntry {
  id: number;
  file: string;
  title: string;
  instruction: string;
  defaultKey: string;
}

/**
 * Order matters — the routine plays these in sequence, each file twice,
 * before auto-advancing. Files live in public/audio/.
 */
export const warmupManifest: WarmupManifestEntry[] = [
  { id: 1, file: "exercise-1-C.mp3", title: "Exercise 1", instruction: "", defaultKey: "C" },
  { id: 2, file: "exercise-2-C.mp3", title: "Exercise 2", instruction: "", defaultKey: "C" },
  { id: 3, file: "exercise-3-C.mp3", title: "Exercise 3", instruction: "", defaultKey: "C" },
  { id: 4, file: "exercise-4-C.mp3", title: "Exercise 4", instruction: "", defaultKey: "C" },
];
