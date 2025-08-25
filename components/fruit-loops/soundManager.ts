// components/fruit-loops/soundManager.ts
"use client";

/* ── Simple Audio Manager ──────────────────────────────────────────────── */
type Key = "spin" | "chip" | "win" | "big";

const audios: Partial<Record<Key, HTMLAudioElement>> = {};

function ensure() {
  if (typeof window === "undefined") return;

  if (!audios.spin) {
    audios.spin = new Audio("/sounds/sound_1.mp3");
    audios.spin.preload = "auto";
    audios.spin.volume = 0.7;
  }
  if (!audios.chip) {
    audios.chip = new Audio("/sounds/coin.wav");
    audios.chip.preload = "auto";
    audios.chip.volume = 0.9;
  }
  if (!audios.win) {
    audios.win = new Audio("/sounds/chip_sound.mp3");
    audios.win.preload = "auto";
    audios.win.volume = 1.0;
  }
  if (!audios.big) {
    audios.big = new Audio("/sounds/golden_ball.wav");
    audios.big.preload = "auto";
    audios.big.volume = 1.0;
  }
}

export const Sound = {
  play(name: Key, opts?: { volume?: number; loop?: boolean }) {
    ensure();
    const a = audios[name];
    if (!a) return;
    if (opts?.volume != null) a.volume = Math.max(0, Math.min(1, opts.volume));
    a.loop = !!opts?.loop;
    try {
      // একই সাউন্ড রি-স্টার্ট
      a.currentTime = 0;
      a.play();
    } catch {}
  },
  stop(name: Key) {
    const a = audios[name];
    if (!a) return;
    try {
      a.pause();
      a.loop = false;
      a.currentTime = 0;
    } catch {}
  },
  stopAll() {
    (Object.keys(audios) as Key[]).forEach((k) => Sound.stop(k));
  },
};
