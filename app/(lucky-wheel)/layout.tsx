"use client";
import Providers from "@/app/providers";
import "@/components/lucky-wheel/LuckyWheel.css";
import WheelFooter from "@/components/lucky-wheel/WheelFooter";
import WheelNavbar from "@/components/lucky-wheel/WheelNavbar";
import { usePathname } from "next/navigation";

import React from "react";
const LuckyWheelLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  console.log("LuckyWheelLayout pathname:", pathname);
  return (
    <Providers>
      <div className="bg-[#140124] h-screen ">
        <WheelNavbar />
        <div className="mt-0">{children}</div>
        {pathname === "/lucky-wheel/game" && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <WheelFooter />
          </div>
        )}
      </div>
    </Providers>
  );
};

export default LuckyWheelLayout;
