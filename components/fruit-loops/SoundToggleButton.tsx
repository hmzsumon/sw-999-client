// components/fruit-loops/SoundToggleButton.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import { toggleSound } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import { Volume2, VolumeX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CircleIconButton from "../game-ui/CircleIconButton";
import { Sound } from "./soundManager";

/* ── Component ─────────────────────────────────────────────────────────── */
export default function SoundToggleButton() {
  const dispatch = useDispatch();
  const soundOn = useSelector((s: any) => s.fruitLoops?.soundOn) ?? true;

  const icon = soundOn ? (
    <Volume2 size={24} strokeWidth={3} />
  ) : (
    <VolumeX size={24} strokeWidth={3} />
  );

  const colors = soundOn
    ? { start: "#2e7d32", mid: "#1b5e20", end: "#43a047" }
    : { start: "#7f8c8d", mid: "#616a6b", end: "#95a5a6" };

  const onClick = () => {
    const next = !soundOn;
    dispatch(toggleSound());
    if (next) {
      // ইউজার ক্লিক → BG অন (browser autoplay safe)
      Sound.startBG();
    } else {
      // সব সাউন্ড বন্ধ
      Sound.stopBG();
      // চাইলে Spin ইত্যাদিও থামাতে পারো → Sound.stopAll();
    }
  };

  return (
    <CircleIconButton
      size={42}
      onClick={onClick}
      icon={<span className="font-extrabold">{icon}</span>}
      colors={colors}
    />
  );
}
