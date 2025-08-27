/* ── Page: Withdraw ─────────────────────────────────────────────────────── */
"use client";
import TurnoverNotice from "@/components/withdraw/TurnoverNotice";
import WithdrawForm from "@/components/withdraw/WithdrawForm";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import RecallBalanceBtn from "@/components/withdraw/RecallBalanceBtn";
import { BoundWallet } from "@/components/withdraw/WalletCard";
import WalletCarousel from "@/components/withdraw/WalletCarousel";
import WalletTabs, { WalletProvider } from "@/components/withdraw/WalletTabs";
import { useGetUserPaymentMethodsQuery } from "@/redux/features/auth/authApi";
import { useCreateWithdrawRequestMutation } from "@/redux/features/withdraw/withdrawApi";
import { useRouter } from "next/navigation";

/* ── Helpers ────────────────────────────────────────────────────────────── */
const formatBDT = (n: number) =>
  `৳ ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

/* ── Component ─────────────────────────────────────────────────────────── */
export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth) || { user: null };

  const { data, isLoading } = useGetUserPaymentMethodsQuery(undefined);
  const apiList: Array<{
    _id: string;
    method: WalletProvider;
    name?: string;
    accountNumber?: string;
    number?: string;
    wallet?: string;
    createdAt?: string;
    isDefault?: boolean;
  }> = data?.userPaymentMethods ?? [];

  const getAccount = (pm: any) =>
    pm.accountNumber || pm.number || pm.wallet || "";

  const wallets: BoundWallet[] = apiList.map((pm) => ({
    id: pm._id,
    provider: pm.method,
    accountNumber: getAccount(pm),
    holderName: pm.name,
    last4: getAccount(pm).slice(-4) || "****",
    createdAt: (pm.createdAt ?? new Date().toISOString()).slice(0, 10),
    isDefault: pm.isDefault,
  }));

  const [provider, setProvider] = useState<WalletProvider>("bkash");

  // filter wallets for active tab
  const providerWallets = useMemo(
    () => wallets.filter((w) => w.provider === provider),
    [wallets, provider]
  );

  // selection state: if exactly one wallet => autoselect; else keep last selection per tab
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (providerWallets.length === 1) setSelectedId(providerWallets[0].id);
    else if (
      providerWallets.length > 1 &&
      !providerWallets.some((w) => w.id === selectedId)
    ) {
      setSelectedId(providerWallets[0].id);
    } else if (providerWallets.length === 0) {
      setSelectedId(null);
    }
  }, [providerWallets, selectedId]);

  // tab counts badge
  const counts = useMemo(() => {
    return {
      bkash: wallets.filter((w) => w.provider === "bkash").length,
      nagad: wallets.filter((w) => w.provider === "nagad").length,
    } as Partial<Record<WalletProvider, number>>;
  }, [wallets]);

  const mainBalance = Number(user?.m_balance ?? 0);
  const available = Number(user?.available_amount ?? mainBalance);
  const remainingTurnover = Number(user?.bet_volume ?? 0);

  const [
    createWithdrawRequest,
    { isLoading: isSubmitting, error: createError, isSuccess, isError },
  ] = useCreateWithdrawRequestMutation();

  const handleRecall = () => {
    // TODO: call recall API
    console.log("recall balance");
  };

  const selectedWallet =
    providerWallets.find((w) => w.id === selectedId) || null;

  const handleSubmit = async (amt: number, pass: string) => {
    if (!selectedWallet) {
      toast.error("Select an E-wallet");
      return;
    }
    const payload = {
      amount: amt,
      method: {
        name: selectedWallet.provider,
        accountNumber: selectedWallet.accountNumber,
      },
      pass,
    };

    console.log("withdraw payload:", payload);

    await createWithdrawRequest(payload).unwrap();
  };

  /* ────────── useEffect for deposit ────────── */

  useEffect(() => {
    if (isError) {
      toast.error((createError as fetchBaseQueryError).data?.error);
    }
    if (isSuccess) {
      toast.success("Deposit created successfully!");
      router.push("/dashboard");
    }
  }, [isError, isSuccess, createError]);

  return (
    <div className="min-h-screen bg-[#01241D] text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0f4d3f] px-4 py-3 text-yellow-300">
        <Link
          href="/dashboard"
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
        {/* Tabs */}
        <WalletTabs value={provider} onChange={setProvider} counts={counts} />

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

        {/* Cards / Slider */}
        <div className="mt-3">
          {isLoading ? (
            <div className="h-28 animate-pulse rounded-xl bg-white/10" />
          ) : providerWallets.length ? (
            <WalletCarousel
              items={providerWallets}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00493B] bg-[#031A15] p-8 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                className="mb-3 fill-white opacity-60"
              >
                <path d="M21 7H7V5c0-1.1.9-2 2-2h12v4zM3 7h2v12h14c1.1 0 2-.9 2-2v-7H7c-1.1 0-2 .9-2 2v5H3V7z" />
              </svg>
              <p className="text-white/70">Empty E-Wallet</p>
              <Link
                href="/withdraw/bind-wallet"
                className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-500"
              >
                Bind E-wallet
              </Link>
            </div>
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

        {/* Form (disabled if turnover remaining OR no wallet selected) */}
        <WithdrawForm
          available={available}
          disabled={remainingTurnover > 0 || !selectedWallet || isSubmitting}
          onSubmit={handleSubmit}
        />

        {/* Bind banner (optional) */}
        <div className="mt-4 overflow-hidden rounded-xl border border-[#00493B]">
          <div className="relative">
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
        </div>
      </div>
    </div>
  );
}
