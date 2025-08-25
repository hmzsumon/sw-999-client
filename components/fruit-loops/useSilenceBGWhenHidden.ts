// components/fruit-loops/useSilenceBGWhenHidden.ts
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { useEffect } from "react";
import { Sound } from "./soundManager";

/* ── Hook ──────────────────────────────────────────────────────────────── */
/** ট্যাব hidden/blur/pagehide/beforeunload হলে BG সাউন্ড থামায় */
export default function useSilenceBGWhenHidden() {
  useEffect(() => {
    const stopBg = () => Sound.stopBG();
    const onVis = () => {
      if (typeof document !== "undefined" && document.hidden) Sound.stopBG();
    };

    window.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", stopBg);
    window.addEventListener("beforeunload", stopBg);
    window.addEventListener("blur", stopBg);
    // @ts-ignore (chromium freeze)
    window.addEventListener("freeze", stopBg);

    return () => {
      window.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", stopBg);
      window.removeEventListener("beforeunload", stopBg);
      window.removeEventListener("blur", stopBg);
      // @ts-ignore
      window.removeEventListener("freeze", stopBg);
    };
  }, []);
}
