// components/fruit-loops/BetControlBar.tsx
"use client";

/* ── Imports ───────────────────────────────────────────────────────────── */
import {
  clearBets,
  rebet,
  requestSpin,
} from "@/redux/features/fruit-loops/fruitLoopsSlice";
import { RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ChipPicker from "../game-ui/ChipPicker";
import CircleIconButton from "../game-ui/CircleIconButton";
import GlassBar from "../game-ui/GlassBar";
import RulesBtn from "../game-ui/RulesBtn";

/* ── Component ─────────────────────────────────────────────────────────── */
export default function BetControlBar() {
  const dispatch = useDispatch();
  const { isSpinning, balance, totalBet, bets } = useSelector(
    (s: any) => s.fruitLoops
  );

  const canSpin = !isSpinning && totalBet > 0;
  const canRebet = !isSpinning && Object.keys(bets || {}).length > 0;

  const onSpinIntent = () => {
    if (!canSpin) return;
    dispatch(requestSpin());
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-3 z-50 w-[min(100%-5px,1046px)] pb-[env(safe-area-inset-bottom)]">
      <GlassBar
        height={{ base: 200, md: 110 }}
        radius={18}
        gradient={{
          start: "#FFE09A",
          mid1: "#FFD067",
          mid2: "#FFB33B",
          mid3: "#FFA224",
          end: "#FF8D15",
        }}
        ringColor="rgba(255,255,255,.22)"
        bottomBeam={{
          color: "#fff0b3",
          height: 3,
          offset: 12,
          opacity: 0.8,
          blur: 0.5,
        }}
        paddingX={12}
        contentClassName="flex flex-col md:flex-row items-center md:justify-between justify-center gap-y-2 w-full"
      >
        <div className="flex flex-col md:grid grid-cols-3 items-center justify-between w-full gap-2">
          {/* ── Left: Balance & Total Bet ──────────────────────────────────── */}
          <div className="flex items-center justify-center order-1 gap-x-2 md:order-2">
            <ChipPicker />

            {/* Clear Bets */}
            <CircleIconButton
              size={50}
              Icon={RotateCcw}
              iconColor="#fff"
              colors={{ start: "#66e3ff", mid: "#2aa7ff", end: "#0a6cff" }}
              aria-label="Clear Bets"
              onClick={() => dispatch(clearBets())}
            />
          </div>
          {/* ── Left: Balance & Total Bet ──────────────────────────────────── */}
          <div className="grid grid-cols-2 w-full  gap-2  order-2 md:order-1">
            <RulesBtn
              size="md"
              label={`BDT: ${balance.toLocaleString()}`}
              colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
            />
            <RulesBtn
              size="md"
              label={`TOTAL: ${totalBet.toLocaleString()}`}
              colors={{ start: "#9cff6a", mid: "#6bdc46", end: "#36b12a" }}
            />
          </div>

          {/* ── Right: Chips + Reset/Clear + Spin ─────────────────────────── */}
          <div className="grid grid-cols-2 w-full  gap-2 order-2 md:order-2">
            {/* Spin */}
            <RulesBtn
              size="lg"
              label={isSpinning ? "SPINNING…" : "SPIN"}
              colors={{ start: "#0d5c3a", mid: "#0a4c30", end: "#1fa36a" }}
              disabled={!canSpin}
              onClick={onSpinIntent}
            />

            {/* Rebet */}
            <RulesBtn
              size="lg"
              label="REBET"
              disabled={!canRebet}
              colors={{ start: "#b37a11", mid: "#a36b0e", end: "#d59012" }}
              onClick={() => dispatch(rebet())}
            />
          </div>
        </div>
      </GlassBar>
    </div>
  );
}
/* ── End Component ─────────────────────────────────────────────────────── */
