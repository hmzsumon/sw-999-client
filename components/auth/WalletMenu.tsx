"use client";

import Link from "next/link";
import React from "react";

const BtnBase: React.CSSProperties = {
  background: "linear-gradient(180deg,#0b4b43 0%, #083d38 60%, #073331 100%)",
  border: "1px solid rgba(0,0,0,.35)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.45), 0 4px 8px rgba(0,0,0,.35)",
};

function DepositIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 10.5C6 7.46 8.46 5 11.5 5h1c3.04 0 5.5 2.46 5.5 5.5V14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-3.5Z"
        fill="#ffc403"
      />
      <rect x="3" y="9" width="18" height="10" rx="3" fill="#ffc403" />
      <rect x="7.5" y="11.2" width="9" height="1.8" rx="0.9" fill="#063b36" />
      <rect x="11.1" y="8" width="1.8" height="9" rx="0.9" fill="#063b36" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="7" width="20" height="12" rx="3" fill="#ffc403" />
      <rect x="2" y="9" width="20" height="2.2" fill="#063b36" opacity=".35" />
      <rect x="5.5" y="5" width="9" height="4" rx="1.5" fill="#ffc403" />
      <circle cx="17.5" cy="13" r="3.25" fill="#063b36" />
      <circle cx="17.5" cy="13" r="2.2" fill="#ffc403" />
      <path
        d="M17.5 11.6v2.8M16.1 13h2.8"
        stroke="#063b36"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function WalletMenu() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center gap-4 mt-4">
        <Link href="/deposit" className="w-full">
          <button className=" balance-info w-full rounded-lg flex items-center justify-center gap-2 text-[#ffc403] p-2 font-bold">
            <DepositIcon />
            <span className="text-[17px]">Deposit</span>
          </button>
        </Link>
        <Link href="/withdraw" className="w-full">
          <button className=" balance-info w-full rounded-lg flex items-center justify-center gap-2 text-[#ffc403] p-2 font-bold">
            <WithdrawIcon />
            <span className="text-[17px]">Withdraw</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
