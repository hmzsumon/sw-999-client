"use client";

import { useGetUserPaymentMethodsQuery } from "@/redux/features/auth/authApi";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

type WalletProvider = "bkash" | "nagad";

type ApiPaymentMethod = {
  _id: string;
  method: WalletProvider; // 'bkash' | 'nagad'
  name?: string;
  accountNumber?: string; // <- যদি আলাদা key হয় (e.g. number, wallet) নিচের extractor দেখো
  number?: string;
  wallet?: string;
  createdAt?: string;
  isDefault?: boolean;
};

type BoundWallet = {
  id: string;
  provider: WalletProvider;
  last4: string;
  createdAt: string;
  isDefault?: boolean;
};

const mask = (s: string, visible = 4) =>
  `${"•".repeat(Math.max(0, s.length - visible))}${s.slice(-visible)}`;

const formatBDT = (n: number) =>
  `৳ ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h3 className="text-sm font-semibold text-white/90">{children}</h3>;

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="mb-1 block text-sm text-white/80">{children}</label>
);

/* -------------------------- Tabs --------------------------- */
const WalletTabs: React.FC<{
  value: WalletProvider;
  onChange: (v: WalletProvider) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-4 border-b border-[#00493B]">
    {(["bkash", "nagad"] as WalletProvider[]).map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => onChange(p)}
        className={`relative -mb-px flex items-center gap-2 rounded-t-md px-3 py-2
          ${
            value === p
              ? "border-b-2 border-yellow-400 bg-[#012E25]"
              : "opacity-80 hover:opacity-100"
          }
        `}
      >
        <Image
          src={
            p === "bkash"
              ? "/images/deposit/bkash.png"
              : "/images/deposit/nagad.png"
          }
          alt={p}
          width={26}
          height={26}
          className="rounded bg-white"
        />
        <span className="text-sm">{p === "bkash" ? "bKash" : "Nagad"}</span>
      </button>
    ))}
  </div>
);

/* ---------------------- Wallet card(s) --------------------- */
const WalletCard: React.FC<{ w: BoundWallet }> = ({ w }) => (
  <div
    className="relative overflow-hidden rounded-xl p-4 text-slate-900"
    style={{
      background: "linear-gradient(135deg,#94f7e1 0%,#5ed0ff 50%,#5bc3ff 100%)",
    }}
  >
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-white/90 font-bold">
        {w.provider === "bkash" ? "Bk" : "Ng"}
      </div>
      <div className="font-semibold">
        {w.provider === "bkash" ? "BKash" : "Nagad"}
      </div>
    </div>
    <div className="mt-4 font-mono text-lg tracking-widest">
      {mask(`********${w.last4}`, 4)}
    </div>
    <div className="mt-2 text-xs opacity-80">{w.createdAt}</div>
  </div>
);

const EmptyWalletCard: React.FC = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00493B] bg-[#031A15] p-8 text-center">
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      className="mb-3 opacity-60 fill-white"
    >
      <path d="M21 7H7V5c0-1.1.9-2 2-2h12v4zM3 7h2v12h14c1.1 0 2-.9 2-2v-7H7c-1.1 0-2 .9-2 2v5H3V7z" />
    </svg>
    <p className="text-white/70">Empty E-Wallet</p>
  </div>
);

/* ------------------ Bind wallet banner -------------------- */
const BindWalletBanner: React.FC = () => (
  <Link href="/withdraw/bind-wallet" className="block">
    <div className="relative overflow-hidden rounded-xl border border-[#00493B]">
      <Image
        src="/images/bind_wallet.jpg"
        alt="Bind E-wallet"
        width={1200}
        height={400}
        className="h-28 w-full object-cover opacity-95"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <span className="rounded bg-black/60 px-3 py-1 text-sm text-white">
          Bind E-wallet
        </span>
      </div>
    </div>
  </Link>
);

/* ------------------ Recall Balance button ----------------- */
const RecallBalanceBtn: React.FC<{
  loading?: boolean;
  onClick: () => void;
}> = ({ loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-full border border-[#00493B] bg-[#031A15] px-4 py-2 text-sm hover:bg-[#073328]"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className={`fill-white ${loading ? "animate-spin" : ""}`}
    >
      <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 1.38-.56 2.63-1.46 3.54l1.42 1.42A6.96 6.96 0 0 0 19 13c0-3.87-3.13-7-7-7zM6.46 8.46 5.04 7.04A6.96 6.96 0 0 0 5 13c0 3.87 3.13 7 7 7v3l4-4-4-4v3c-2.76 0-5-2.24-5-5 0-1.38.56-2.63 1.46-3.54z" />
    </svg>
    Recall Balance
  </button>
);

/* -------------------- Turnover notice --------------------- */
const TurnoverNotice: React.FC<{ remaining: number; onOk: () => void }> = ({
  remaining,
  onOk,
}) => {
  if (remaining <= 0) return null;
  return (
    <div className="mt-6 rounded-xl border border-[#00493B] bg-[#031A15] p-4">
      <p className="text-center text-yellow-300">
        Withdrawal turnover requirements
      </p>
      <p className="mt-1 text-center text-red-400">
        Please complete the required turnover for withdrawal.
      </p>
      <div className="mt-3 overflow-hidden rounded border border-[#00493B]">
        <div className="grid grid-cols-2 bg-[#08251F] text-sm">
          <div className="border-r border-[#00493B] px-3 py-2">Game type</div>
          <div className="px-3 py-2">Remaining turnover</div>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <div className="border-r border-[#00493B] px-3 py-2">General</div>
          <div className="px-3 py-2 text-red-400">{remaining.toFixed(2)}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onOk}
        className="mt-4 w-full rounded-lg bg-red-600 py-3 font-medium hover:bg-red-700"
      >
        OK
      </button>
    </div>
  );
};

/* ----------------------- Withdraw form -------------------- */
const WithdrawForm: React.FC<{
  min?: number;
  max?: number;
  available: number;
  isDisabled?: boolean;
  onSubmit: (amount: number, txPass: string) => void;
}> = ({ min = 100, max = 25000, available, onSubmit, isDisabled }) => {
  const [amount, setAmount] = useState<string>("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);

  const n = Number(amount || 0);
  const amountErr = !amount
    ? "Enter amount"
    : n < min || n > max
    ? `Amount must be ${min} ~ ${max}`
    : n > available
    ? "Insufficient balance"
    : "";

  const isValid = useMemo(
    () => !amountErr && pass.length >= 6,
    [amountErr, pass]
  );

  return (
    <div className="mt-6 rounded-xl border border-[#00493B] bg-[#031A15] p-4">
      <SectionTitle>Withdrawal Amount:</SectionTitle>

      <div className="mt-3">
        <FieldLabel>
          Amount{" "}
          <span className="opacity-70">
            {min} ~ {max.toLocaleString()}
          </span>
        </FieldLabel>
        <input
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 7))
          }
          inputMode="numeric"
          placeholder="0"
          className="w-full rounded-lg border border-[#00493B] bg-[#01241D] px-3 py-2 outline-none focus:ring-2 focus:ring-[#1c6b5a]"
        />
        {amountErr && <p className="mt-1 text-xs text-red-400">{amountErr}</p>}
      </div>

      <div className="mt-3">
        <FieldLabel>Transaction Password</FieldLabel>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Transaction Password"
            className="w-full rounded-lg border border-[#00493B] bg-[#01241D] px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#1c6b5a]"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
            aria-label="Toggle password"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-white/80"
            >
              {show ? (
                <path d="M12 4.5C4.73 4.5 1 12 1 12s3.73 7.5 11 7.5S23 12 23 12 19.27 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
              ) : (
                <path d="M12 6c3.86 0 7.16 2.23 8.82 5.5-.46.92-1.08 1.76-1.82 2.5l1.41 1.41C22.09 13.88 23 12 23 12S19.27 4.5 12 4.5c-1.08 0-2.1.14-3.06.41l1.64 1.64C11.08 6.18 11.53 6 12 6zM2.1 2.1L.69 3.51 4.2 7.02C2.69 8.12 1.5 9.46 1 10.5c0 0 3.73 7.5 11 7.5 1.56 0 3.03-.28 4.37-.79l2.62 2.62 1.41-1.41L2.1 2.1z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={!isValid || isDisabled}
        onClick={() => onSubmit(Number(amount), pass)}
        className="mt-4 w-full rounded-lg bg-white/20 py-3 font-medium text-white transition
                   enabled:bg-emerald-600 enabled:hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
};

/* --------------- Withdraw page with API wiring --------------- */
const WithdrawPage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth) || { user: null };

  const { data, isLoading } = useGetUserPaymentMethodsQuery(undefined);
  const apiList: ApiPaymentMethod[] = data?.userPaymentMethods ?? [];

  // account number extractor (তোমার API ফিল্ড আলাদা হলে এখানে যোগ করো)
  const getAccount = (pm: ApiPaymentMethod) =>
    pm.accountNumber || pm.number || pm.wallet || "";

  const wallets: BoundWallet[] = apiList.map((pm) => ({
    id: pm._id,
    provider: pm.method,
    last4: getAccount(pm).slice(-4) || "****",
    createdAt: (pm.createdAt ?? new Date().toISOString()).slice(0, 10),
    isDefault: pm.isDefault,
  }));

  const [provider, setProvider] = useState<WalletProvider>("bkash");
  const providerWallets = wallets.filter((w) => w.provider === provider);

  const mainBalance = Number(user?.m_balance ?? 0);
  const available = Number(user?.available_amount ?? mainBalance);
  const remainingTurnover = Number(user?.bet_volume ?? 0);

  const handleRecall = () => {
    // TODO: API call
    console.log("recall balance");
  };

  const handleSubmit = (amt: number, pass: string) => {
    // TODO: withdraw API
    console.log({ amt, pass, provider });
  };

  return (
    <div className="min-h-screen bg-[#01241D] text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0f4d3f] px-4 py-3 text-yellow-300">
        <Link
          href="/wallet"
          className="rounded p-1 hover:bg-black/10"
          aria-label="Back"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">Withdrawal</h1>
      </div>

      <div className="mx-auto w-full max-w-md px-4 py-5">
        <WalletTabs value={provider} onChange={setProvider} />

        {/* Bound wallets header */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm">
            {providerWallets.length > 0
              ? `Registered E-wallet (${providerWallets.length}/5)`
              : "Registered E-wallet (0/5)"}
          </p>

          <Link
            href="/withdraw/bind-wallet"
            className="rounded-full bg-red-600 p-2 hover:bg-red-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-white"
            >
              <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-3">
          {isLoading ? (
            <div className="h-24 animate-pulse rounded-xl bg-white/10" />
          ) : providerWallets.length ? (
            <div className="space-y-3">
              {providerWallets.map((w) => (
                <WalletCard key={w.id} w={w} />
              ))}
            </div>
          ) : (
            <>
              <EmptyWalletCard />
            </>
          )}
        </div>

        {/* Info + recall */}
        <div className="mt-5 rounded-xl border border-[#00493B] bg-[#031A15] p-4 text-sm">
          <div className="grid gap-1 text-white/80">
            <div>
              Withdrawal time: <span className="opacity-80">24 hours</span>
            </div>
            <div className="opacity-80">Tips: উত্তোলনের সময়সীমা: ২৪ ঘন্টা</div>
            <div className="mt-2">
              Daily withdrawal 99 (Times), Remaining withdrawal 99 (Times)
            </div>
            <div>Main Wallet: {formatBDT(mainBalance)}</div>
            <div>Available Amount: {formatBDT(available)}</div>
          </div>
          <div className="mt-3">
            <RecallBalanceBtn onClick={handleRecall} />
          </div>
        </div>

        {/* Turnover (optional) */}
        <TurnoverNotice
          remaining={remainingTurnover}
          onOk={() => console.log("ok")}
        />

        {/* Form */}
        <WithdrawForm
          available={available}
          onSubmit={handleSubmit}
          isDisabled={remainingTurnover > 0 ? true : false}
        />
      </div>
    </div>
  );
};

export default WithdrawPage;
