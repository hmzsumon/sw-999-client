// components/fruit-loops/soundManager.ts
"use client";

/* ── Simple Audio Manager (unlock + fallbacks + safe play) ───────────────
   লক্ষ্য: সব সাউন্ড এক জায়গা থেকে ম্যানেজ করা, autoplay policy-safe রাখা,
   আর ব্যাকগ্রাউন্ড সাউন্ড (BG) আলাদা করে কন্ট্রোল করা।
────────────────────────────────────────────────────────────────────────── */

/* ── Keys ──────────────────────────────────────────────────────────────── */
type Key = "bg" | "chipSelect" | "placeBet" | "spin" | "win" | "reset" | "lose";

/* ── Expected files (under /public/sounds) ───────────────────────────────
   1) bg_sound_1.mp3
   2) chip_sound_1.mp3
   3) coin_1.wav
   4) spiner_sound_1.mp3
   5) win_1.wav
   6) rest_1.wav
   7) lose_1.wav
────────────────────────────────────────────────────────────────────────── */
const SPEC: Record<
  Key,
  { src: string; mime?: string; loop?: boolean; volume: number }
> = {
  bg: {
    src: "/sounds/bg_sound_1.mp3",
    mime: "audio/mpeg",
    loop: true,
    volume: 0.2,
  },
  chipSelect: {
    src: "/sounds/chip_sound_1.mp3",
    mime: "audio/mpeg",
    volume: 0.8,
  },
  placeBet: { src: "/sounds/coin_1.wav", mime: "audio/wav", volume: 1.0 },
  spin: { src: "/sounds/spiner_sound_1.mp3", mime: "audio/mpeg", volume: 0.01 },
  win: { src: "/sounds/win_1.wav", mime: "audio/wav", volume: 1.0 },
  reset: { src: "/sounds/rest_1.wav", mime: "audio/wav", volume: 0.7 },
  lose: { src: "/sounds/lose_1.wav", mime: "audio/wav", volume: 0.8 },
};

/* ── Store ─────────────────────────────────────────────────────────────── */
const audios: Partial<Record<Key, HTMLAudioElement>> = {};
let unlocked = false;

/* ── Unlock: first user gesture-এ ছোট্ট silent play দিয়ে ─────────────── */
function attachUnlockOnce() {
  if (typeof window === "undefined" || unlocked) return;
  const tryUnlock = () => {
    unlocked = true;
    // Tiny silent play-pause to unlock on iOS/Safari
    const a = new Audio();
    const p = a.play();
    if (p?.catch) p.catch(() => {});
    a.pause();

    window.removeEventListener("pointerdown", tryUnlock);
    window.removeEventListener("keydown", tryUnlock);
    window.removeEventListener("touchstart", tryUnlock);
  };
  window.addEventListener("pointerdown", tryUnlock, { once: true });
  window.addEventListener("keydown", tryUnlock, { once: true });
  window.addEventListener("touchstart", tryUnlock, { once: true });
}

/* ── Create one audio lazily ───────────────────────────────────────────── */
function make(key: Key) {
  if (typeof window === "undefined") return;
  if (audios[key]) return;

  const spec = SPEC[key];
  const a = new Audio();

  // Optional capability probe (console warn only)
  try {
    const can = a.canPlayType(spec.mime || "");
    if (spec.mime && can === "") {
      console.warn(
        `[Sound] "${key}" (${spec.src}) may not be supported: mime=${spec.mime}`
      );
    }
  } catch {
    // ignore probe errors
  }

  a.preload = "auto";
  a.loop = !!spec.loop;
  a.volume = spec.volume;
  a.src = spec.src;

  a.addEventListener("error", () => {
    // ব্রাউজার যদি লোড করতে না পারে → কনসোলে দেখাবো
    const err = (a as any)?.error;
    console.error(
      `[Sound] Failed to load "${key}" from ${spec.src}`,
      err?.code ? `(code ${err.code})` : ""
    );
  });

  // একেবারে শেষে অ্যাসাইন (ready after listeners)
  audios[key] = a;
}

/* ── Public API ────────────────────────────────────────────────────────── */
export const Sound = {
  /* Play (safe): সর্বদা Promise রিটার্ন, unhandled rejection হবে না */
  play(name: Key, opts?: { volume?: number; loop?: boolean }) {
    make(name);
    attachUnlockOnce();
    const a = audios[name];
    if (!a) return Promise.resolve();

    if (opts?.volume != null) {
      a.volume = Math.max(0, Math.min(1, opts.volume));
    }
    if (opts?.loop != null) {
      a.loop = !!opts.loop;
    }

    try {
      a.currentTime = 0; // restart from beginning every trigger
      const p = a.play();
      return p?.catch((err) => {
        // autoplay policy বা অন্য কোনো কারণে reject হলে কনসোলে gentle warn
        console.warn(`[Sound] play("${name}") rejected →`, err?.name || err);
      });
    } catch (err) {
      console.warn(`[Sound] play("${name}") threw →`, err);
      return Promise.resolve();
    }
  },

  stop(name: Key) {
    const a = audios[name];
    if (!a) return;
    try {
      a.pause();
      a.loop = !!SPEC[name].loop; // default loop state restore
      a.currentTime = 0;
    } catch {}
  },

  stopAll() {
    (Object.keys(audios) as Key[]).forEach((k) => {
      Sound.stop(k);
    });
  },

  /* ── BG helpers ─────────────────────────────────────────────────────── */
  startBG() {
    make("bg");
    attachUnlockOnce();
    return Sound.play("bg", { loop: true });
  },

  stopBG() {
    const a = audios["bg"];
    if (!a) return;
    try {
      a.pause();
      a.loop = true; // keep default loop flag
      a.currentTime = 0;
    } catch {}
  },

  /* ✅ status helper (optional) */
  isBGPlaying(): boolean {
    const a = audios["bg"];
    return !!a && !a.paused && a.currentTime > 0;
  },

  /* Optional: per-sound volume set */
  setVolume(name: Key, volume: number) {
    const a = audios[name];
    if (!a) return;
    a.volume = Math.max(0, Math.min(1, volume));
  },
};
