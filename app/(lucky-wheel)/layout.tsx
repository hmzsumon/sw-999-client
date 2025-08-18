import Providers from "@/app/providers";
import "@/components/lucky-wheel/LuckyWheel.css";
import WheelFooter from "@/components/lucky-wheel/WheelFooter";
import WheelNavbar from "@/components/lucky-wheel/WheelNavbar";

import React from "react";
const LuckyWheelLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Providers>
      <div className=" ">
        <WheelNavbar />
        <div className="mt-0">{children}</div>
        <WheelFooter />
      </div>
    </Providers>
  );
};

export default LuckyWheelLayout;
