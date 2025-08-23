// components/lucky-time/HeaderStats.tsx
"use client";

import { setBalance } from "@/redux/features/lucky-time/luckyTimeSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/* ── Subcomponent ───────────────────────────────────────────────────────── */
const StatPill = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 h-10 w-full rounded-xl bg-[#3a2a18] border border-[#d7a44f]/40 shadow-inner flex items-center gap-2 px-2">
    <span className="text-md tracking-widest text-[#f7e2a7] font-extrabold shrink-0">
      {label}
    </span>
    <span className="px-2 py-0.5 w-full rounded-md bg-[#f0d37a] text-black font-extrabold text-sm shadow truncate">
      {value}
    </span>
  </div>
);

/* ── Component ──────────────────────────────────────────────────────────── */
export default function HeaderStats() {
  const dispatch = useDispatch();
  /* ── server balance ─────────────────────────────────────────────────────────────── */
  const serverBal = useSelector((s: any) => s.auth?.user?.m_balance);
  const { balance, totalBet, isSpinning } = useSelector(
    (s: any) => s.luckyTime
  );
  const { user } = useSelector((s: any) => s.auth);
  /* ── server wallet (auth slice) 
  
  /* ── Sync server balance to game balance (unless spinning or bets placed) ───────────────────── */
  useEffect(() => {
    if (typeof serverBal === "number" && !isSpinning && (totalBet ?? 0) === 0) {
      dispatch(setBalance(serverBal));
    }
  }, [serverBal, isSpinning, totalBet, dispatch]);

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-2 items-stretch">
      <div className="col-span-1 min-w-0">
        <StatPill label="💳" value={Number(balance ?? 0).toLocaleString()} />
      </div>

      <div className="col-span-1 bg-[#2d1d10] flex items-center w-full justify-center rounded-xl border border-[#d7a44f]/40 min-w-0">
        <span className="block text-sm sm:text-3xl font-extrabold tracking-widest text-[#f7e2a7]">
          LUCKY TIME
        </span>
      </div>

      <div className="col-span-1 min-w-0">
        <StatPill label="🪙" value={Number(totalBet ?? 0).toLocaleString()} />
      </div>
    </div>
  );
}
