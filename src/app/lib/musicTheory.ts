const FLAT_NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

/** Prettier flat symbol for display (Eb -> E♭). */
export function toFlatSymbol(note: string): string {
  return note.replace("b", "♭");
}

export function transposeNoteLabel(rootNote: string, semitones: number): string {
  const idx = FLAT_NOTE_NAMES.indexOf(rootNote);
  if (idx === -1) return rootNote;
  const shifted = (((idx + semitones) % 12) + 12) % 12;
  return FLAT_NOTE_NAMES[shifted];
}
