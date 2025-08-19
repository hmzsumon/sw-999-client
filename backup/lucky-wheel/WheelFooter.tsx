"use client";
import bgFooter from "@/public/images/lucky-wheel/bg_footer.png";
import Image from "next/image";

const formatBalance = (amount: number): string => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2).replace(/\.0$/, "") + "M";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(2).replace(/\.0$/, "") + "K";
  }
  return amount.toString();
};

const WheelFooter = () => {
  return (
    <div className="relative z-50 ">
      <div className="absolute bottom-0  w-full h-[7vh] ">
        <Image
          src={bgFooter}
          alt="Lucky Wheel Navbar Background"
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="flex items-center justify-center  absolute bottom-0 w-full h-full px-4 -top-6 ">
        <div className="flex items-center ">
          <div className="">
            <span className="text-5xl text-yellow-400">-</span>
          </div>

          {/* Bet Amount */}

          <div className="">
            <span className="text-4xl text-yellow-400">+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelFooter;
