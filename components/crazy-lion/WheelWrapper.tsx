"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircleIconButton from "../game-ui/CircleIconButton";
import ChipsBar from "./ChipsBar";

import { setBalance } from "@/redux/features/crazy-lion/crazyLionSlice";
import CrazyLionBoard from "./CrazyLionBoard";
import Wheel, { RootState } from "./Wheel";
import WinPop from "./WinPop";

const WheelWrapper = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s: any) => s.auth);

  /* ── server wallet (auth slice) ─────────────────────────────────────────────────────────────── */
  const serverBal = useSelector((s: RootState) => s.auth?.user?.m_balance);

  /* ── game state ────────────────────────────────────────────────────────────────────────────── */
  const {
    isSpinning,
    totalBet,
    balance: gameBal,
  } = useSelector((s: RootState) => s.crazyLion);

  /* ── Sync server balance to game balance (unless spinning or bets placed) ───────────────────── */
  useEffect(() => {
    if (typeof serverBal === "number" && !isSpinning && (totalBet ?? 0) === 0) {
      dispatch(setBalance(serverBal));
    }
  }, [serverBal, isSpinning, totalBet, dispatch]);

  /* ── render ──────────────────────────────────────────────────────────────────────────────── */
  const displayBal =
    typeof gameBal === "number"
      ? gameBal
      : typeof serverBal === "number"
      ? serverBal
      : 0;

  const showServerHint =
    typeof serverBal === "number" && serverBal !== displayBal;

  return (
    <div className="relative">
      {/* Close */}
      <div className="absolute top-1 right-0 z-10">
        <Link href="/dashboard">
          <CircleIconButton
            size={42}
            icon={
              <span className="font-extrabold" style={{ fontSize: 22 }}>
                X
              </span>
            }
            colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
          />
        </Link>
      </div>

      {/* Balance (optimistic) + optional server hint */}
      <div className="absolute top-1 left-0 flex items-center gap-2 text-gray-200 text-sm z-10">
        <div className="flex items-center gap-1">
          <Wallet className="text-gray-100" size={20} />
          <span className="font-semibold">
            ৳ {}
            {displayBal.toLocaleString()}
          </span>
        </div>
      </div>

      <Wheel />

      <div className="mt-4">
        <CrazyLionBoard />
      </div>

      <div className="mt-0">
        <ChipsBar />
      </div>

      <WinPop />
    </div>
  );
};

export default WheelWrapper;
