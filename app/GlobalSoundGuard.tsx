// app/GlobalSoundGuard.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { Sound } from "@/components/fruit-loops/soundManager";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* ── Component ─────────────────────────────────────────────────────────── */
/**
 * রুট/পাথ চেঞ্জ হলেই সব সাউন্ড থামিয়ে দেয়।
 * চাইলে শুধু BG থামাতে Sound.stopBG() ব্যবহার করতে পারো।
 */
export default function GlobalSoundGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // নতুন পেজে ঢুকলেই আগের সব সাউন্ড থামাও
    Sound.stopAll();
  }, [pathname]);

  // আনমাউন্ট হলে সেফলি থামাও (SSR/refresh/route unmount)
  useEffect(() => {
    return () => {
      Sound.stopAll();
    };
  }, []);

  return null;
}
