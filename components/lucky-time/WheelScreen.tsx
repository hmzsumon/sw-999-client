// components/lucky-time/WheelScreen.tsx
"use client";

/* ── Imports ─────────────────────────────────────────────────────────────── */
import ActionBar from "./ActionBar";
import BetBoard from "./BetBoard";
import ChipsBar from "./ChipsBar";
import HeaderStats from "./HeaderStats";
import LuckyWheel from "./LuckyWheel";

/* ── Component ──────────────────────────────────────────────────────────── */
export default function WheelScreen() {
  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div
      className="
        min-h-[100dvh] w-full text-white
        bg-[#0e0904]
        bg-[radial-gradient(1000px_600px_at_50%_-10%,#7a4a12_0%,transparent_60%),radial-gradient(900px_500px_at_50%_120%,#2a1a0e_0%,transparent_55%)]
        flex flex-col items-center gap-2 pb-6
      "
    >
      {/* top HUD */}
      <div className="pt-1 w-full">
        <HeaderStats />
      </div>

      {/* wheel */}
      <div className="mt-2">
        <LuckyWheel />
      </div>

      {/* bet board */}
      <div className="w-full px-3">
        <BetBoard />
      </div>

      {/* chips */}
      <div className="w-full mt-2">
        <ChipsBar />
      </div>

      {/* actions */}
      <ActionBar />
    </div>
  );
}
