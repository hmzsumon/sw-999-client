// app/(fruit-loops)/layout.tsx
"use client";

import { Sound } from "@/components/fruit-loops/soundManager";
/* ── Imports ───────────────────────────────────────────────────────────── */
import useSilenceBGWhenHidden from "@/components/fruit-loops/useSilenceBGWhenHidden";
import PreloadGate, { AssetInput } from "@/components/game-ui/PreloadGate";

import Logo from "@/public/logo/logo.png";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";
import Image from "next/image";
import React, { useMemo } from "react";

/* ── Layout ───────────────────────────────────────────────────────────── */
export default function FruitLoopsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isLoading: authLoading } = useLoadUserQuery();

  // ✅ এখানে কল করলেই ব্যাকগ্রাউন্ডে/অন্য ট্যাবে/মিনিমাইজে BG সাউন্ড থেমে যাবে
  useSilenceBGWhenHidden();

  const assets = useMemo<AssetInput[]>(
    () => [
      "/images/fruit-loops/wheel_1.png",
      "/images/fruit-loops/arrow.png",
      "/images/fruit-loops/title_5.png",
      "/images/fruit-loops/bg_2.webp",
      { src: "/sounds/bg_sound_1.mp3", kind: "audio", critical: false },
      { src: "/sounds/spiner_sound_1.mp3", kind: "audio", critical: true },
    ],
    []
  );

  // ✅ এই লেআউট আনমাউন্ট হলে সব সাউন্ড/অন্তত BG থামাও
  React.useEffect(() => {
    return () => {
      Sound.stopAll(); // চাইলে শুধু Sound.stopBG();
    };
  }, []);

  return (
    <PreloadGate
      assets={assets}
      minDurationMs={1000}
      smooth
      waitFor={!authLoading}
      logo={
        <div className="text-xl font-extrabold tracking-widest">
          <Image
            src={Logo}
            alt="Logo"
            width={80}
            height={80}
            priority
            className="inline-block mr-2"
          />
        </div>
      }
    >
      <div className="flex flex-col h-full ">
        <div className="w-full relative h-screen bg-[url('/images/fruit-loops/bg_2.webp')] bg-cover bg-center bg-no-repeat px-2">
          {children}
        </div>
      </div>
    </PreloadGate>
  );
}
