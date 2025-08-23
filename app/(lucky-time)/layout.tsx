"use client";

import FullscreenLoader from "@/components/game-ui/FullscreenLoader";
import WinPop from "@/components/lucky-time/WinPop";
import Logo from "@/public/logo/logo.png";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";
import Image from "next/image";
import React, { useMemo, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const LuckyTimeLayout = ({ children }: Readonly<Props>) => {
  // Auth loading status
  const { isLoading: authLoading } = useLoadUserQuery();

  // Track when assets finished preloading
  const [assetsReady, setAssetsReady] = useState(false);

  // List the assets you want to preload
  const assets = useMemo(
    () => [
      "/images/lucky-time/bg.png",
      "/images/lucky-time/lucky-time-wheel.png",
      "/images/lucky-time/frame.png",
      "/images/lucky-time/pin.png",
      "/images/lucky-time/lucky-time-middle.png",
    ],
    []
  );

  // Show loader while auth is loading OR assets not ready
  const showLoader = authLoading || !assetsReady;

  return (
    <div className="flex flex-col h-full">
      {/* Fullscreen overlay loader */}
      <FullscreenLoader
        show={showLoader}
        assets={!assetsReady ? assets : []}
        minDurationMs={1200}
        onDone={() => setAssetsReady(true)}
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
        zIndex={9999}
        smooth
      />

      {/* Main content (will be covered by the overlay while loading) */}
      <div className="w-full relative min-h-screen bg-[url('/images/lucky-time/bg.png')] bg-cover bg-center bg-no-repeat px-2">
        {children}
        <WinPop />
      </div>
    </div>
  );
};

export default LuckyTimeLayout;
