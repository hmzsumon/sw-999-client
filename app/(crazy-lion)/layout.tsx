"use client";
import FullscreenLoader from "@/components/game-ui/FullscreenLoader";
import Logo from "@/public/logo/logo.png";
import { useLoadUserQuery } from "@/redux/features/auth/authApi";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const CrazyLionLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // Auth loading status
  const { isLoading: authLoading } = useLoadUserQuery();
  // Track when assets finished preloading
  const [assetsReady, setAssetsReady] = useState(false);

  // List the assets you want to preload
  const assets = useMemo(
    () => [
      "/images/crazy-lion/wheel1.png",
      "/images/crazy-lion/frame_3.png",
      "/images/crazy-lion/pin.png",
      "/images/crazy-lion/middle_wheel.png",
    ],
    []
  );
  // Show loader while auth is loading OR assets not ready
  const showLoader = authLoading || !assetsReady;
  return (
    <div>
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
      <div className="flex flex-col h-full ">
        <div className="w-full relative h-screen bg-[url('/images/crazy-lion/bg_1.png')] bg-cover bg-center bg-no-repeat px-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CrazyLionLayout;
