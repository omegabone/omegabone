import { PitchShifter } from "soundtouchjs";

interface PlayEvents {
  onProgress?: (percentagePlayed: number, timePlayed: number, duration: number) => void;
  onEnded?: () => void;
}

/**
 * Thin wrapper around SoundTouchJS's PitchShifter. Tempo and pitch are
 * independent (SoundTouch's whole reason to exist), which is what lets the
 * key and tempo sliders move without dragging each other along.
 *
 * Pause/resume works by connecting/disconnecting the underlying
 * ScriptProcessorNode — the shifter keeps its source position while
 * disconnected, so reconnecting continues from the same spot.
 */
// Shortest possible valid silent WAV — looped through an <audio> element to
// switch iOS's audio session to "playback", which stops the hardware
// ring/silent switch from muting Web Audio output.
const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQQAAAAAAAAA";

export class PitchAudioEngine {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private shifter: PitchShifter | null = null;
  private tempo = 1;
  private pitchSemitones = 0;
  private silentEl: HTMLAudioElement | null = null;
  private unlocked = false;

  /**
   * MUST be called synchronously inside a user gesture (tap/click) before
   * playback. Mobile browsers — iOS Safari above all — only allow an
   * AudioContext to start from within the gesture's call stack; anything
   * after an `await` is too late. Also kicks a silent buffer (the classic
   * iOS unlock) and starts a looping silent <audio> element so the iPhone
   * mute switch doesn't silence Web Audio.
   */
  unlock() {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    if (this.unlocked) return;
    this.unlocked = true;
    try {
      const kick = ctx.createBufferSource();
      kick.buffer = ctx.createBuffer(1, 1, 22050);
      kick.connect(ctx.destination);
      kick.start(0);
    } catch {
      // best-effort — some browsers don't need it
    }
    try {
      const el = document.createElement("audio");
      el.loop = true;
      el.src = SILENT_WAV;
      el.play().catch(() => {});
      this.silentEl = el;
    } catch {
      // best-effort
    }
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctx();
      this.gain = this.ctx.createGain();
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  async decode(url: string): Promise<AudioBuffer> {
    const ctx = this.ensureContext();
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url} (HTTP ${res.status})`);
    const arrayBuffer = await res.arrayBuffer();
    return ctx.decodeAudioData(arrayBuffer);
  }

  setTempo(tempo: number) {
    this.tempo = tempo;
    if (this.shifter) this.shifter.tempo = tempo;
  }

  setPitchSemitones(semitones: number) {
    this.pitchSemitones = semitones;
    if (this.shifter) this.shifter.pitchSemitones = semitones;
  }

  play(buffer: AudioBuffer, events: PlayEvents = {}) {
    const ctx = this.ensureContext();
    this.stop();

    let ended = false;
    const shifter = new PitchShifter(ctx, buffer, 4096, () => {
      if (ended) return;
      ended = true;
      this.stop();
      events.onEnded?.();
    });
    shifter.tempo = this.tempo;
    shifter.pitchSemitones = this.pitchSemitones;

    if (events.onProgress) {
      shifter.on("play", (detail: any) => {
        events.onProgress?.(detail.percentagePlayed, detail.timePlayed, shifter.duration);
      });
    }

    shifter.connect(this.gain!);
    this.shifter = shifter;
  }

  pause() {
    this.shifter?.disconnect();
  }

  resume() {
    if (this.shifter && this.gain) this.shifter.connect(this.gain);
  }

  stop() {
    if (this.shifter) {
      this.shifter.off();
      this.shifter.disconnect();
      this.shifter = null;
    }
  }

  close() {
    this.stop();
    if (this.silentEl) {
      this.silentEl.pause();
      this.silentEl.src = "";
      this.silentEl = null;
    }
    this.unlocked = false;
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.gain = null;
  }
}
