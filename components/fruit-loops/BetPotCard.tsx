"use client";

import PotCard, { PotCardPalette } from "@/components/game-ui/PotCard";
import { placeBetOn } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Sound } from "./soundManager";

/* ── Types ─────────────────────────────────────────────────────────────── */
type Seg = "apple" | "watermelon" | "mango";
type Props = {
  seg: Seg;
  title: string;
  multiplier?: string | number;
  pot?: number;
  topLift?: number;
  palette?: PotCardPalette;
  watermark?:
    | React.ReactNode
    | { kind?: "watermelon" | "none"; opacity?: number };
  isWinner?: boolean;
  winKey?: string | number;
  emitCount?: number;
  className?: string;
};

/* ── Segment → numeric itemId (slice expects number) ───────────────────── */
const SEG_ID: Record<Seg, number> = { apple: 1, watermelon: 2, mango: 3 };

export default function BetPotCard({
  seg,
  title,
  multiplier,
  pot,
  topLift,
  palette,
  watermark,
  isWinner,
  winKey,
  emitCount,
  className,
}: Props) {
  const dispatch = useDispatch();
  const { selectedChip, isSpinning, bets, soundOn } =
    (useSelector((s: any) => s.fruitLoops) as any) || {};

  const id = SEG_ID[seg];
  const myAmount = Number(bets?.[id] || 0);

  // Rule: সর্বোচ্চ ২টা আলাদা পটে বেট (নিজেরটা ধরলে সমস্যা নেই)
  const activeOthers = Object.entries(bets || {}).filter(
    ([k, v]) => Number(v) > 0 && Number(k) !== id
  ).length;
  const hasHere = myAmount > 0;
  const ruleOk = hasHere || activeOthers < 2;

  const canBet = !isSpinning && Number(selectedChip) > 0 && ruleOk;

  // 🔎 কেন ব্লক হচ্ছে—হিউম্যান ফিডব্যাক
  const disabledReason = isSpinning
    ? "Wheel is spinning"
    : !(Number(selectedChip) > 0)
    ? "Select a chip first"
    : !ruleOk
    ? "Only two pots per round"
    : "";

  const handleClick = () => {
    if (!canBet) {
      // ডিজাইন না বদলে ইউজারকে কারণ দেখাই
      if (disabledReason) toast.error(disabledReason);
      return;
    }
    if (soundOn) Sound.play("chip");
    dispatch(placeBetOn({ itemId: id, amount: Number(selectedChip) }));
  };

  // টুলটিপ/কার্সর—ডিজাইন নষ্ট না করে হিন্ট
  const wrapperStyle: React.CSSProperties = canBet
    ? {}
    : { cursor: "not-allowed" };

  return (
    <div
      title={disabledReason || undefined}
      style={wrapperStyle}
      className={className}
    >
      <PotCard
        title={title}
        multiplier={multiplier}
        pot={pot}
        my={myAmount}
        topLift={topLift}
        palette={palette}
        watermark={watermark}
        isWinner={isWinner}
        winKey={winKey}
        emitCount={emitCount}
        onClick={handleClick}
        disabled={!canBet}
      />
    </div>
  );
}
