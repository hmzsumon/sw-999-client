// components/fruit-loops/BetPotCard.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import PotCard, { PotCardPalette } from "@/components/game-ui/PotCard";
import { placeBetOn } from "@/redux/features/fruit-loops/fruitLoopsSlice";
import React from "react";
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

/* ── Component ─────────────────────────────────────────────────────────── */
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

  // Rule: সর্বোচ্চ ২টা পটে বেট (নিজেরটা ধরে)
  const activeOthers = Object.entries(bets || {}).filter(
    ([k, v]) => Number(v) > 0 && Number(k) !== id
  ).length;
  const hasHere = myAmount > 0;
  const ruleOk = hasHere || activeOthers < 2;

  const canBet = !isSpinning && Number(selectedChip) > 0 && ruleOk;

  const handleClick = () => {
    if (!canBet) return;
    if (soundOn) Sound.play("placeBet");
    dispatch(placeBetOn({ itemId: id, amount: Number(selectedChip) }));
  };

  return (
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
      className={className}
    />
  );
}
