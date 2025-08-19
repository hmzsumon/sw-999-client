"use client";
import bgFooter from "@/public/images/lucky-wheel/bg_footer.png";
import Image from "next/image";
import { FaRegSquareCaretLeft, FaRegSquareCaretRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

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
  const { betAmount } = useSelector((state: any) => state.luckyWheel);

  return (
    <div className="relative z-50 ">
      <div className="absolute bottom-0  w-full h-[10vh] ">
        <Image
          src={bgFooter}
          alt="Lucky Wheel Navbar Background"
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="flex items-center justify-center  absolute bottom-0 w-full h-full px-4 -top-8 ">
        <div className="flex items-center gap-4 ">
          <div className="">
            <span className="text-4xl text-yellow-400">
              <FaRegSquareCaretLeft />
            </span>
          </div>

          {/*Start Bet Amount box */}
          <div className="  p-[4px]  rounded-lg bg-[linear-gradient(180deg,#FFE26A_0%,#FF9D00_55%,#FF4B00_100%)] [box-shadow:0_0_8px_rgba(255,184,0,.55),0_0_18px_rgba(255,89,0,.35)]">
            <div className="py-2 px-4 w-full rounded-[5px]  overflow-visible bg-[linear-gradient(180deg,#2a0153_0%,#3a016a_100%)] ring-1 ring-inset ring-yellow-100/50 [box-shadow:inset_0_0_9px_rgba(255,210,90,.65)] flex items-center">
              <span className="text-white font-extrabold tracking-widest  ">
                Bet: ৳ {formatBalance(betAmount)}
              </span>
            </div>
          </div>
          {/*End Bet Amount box */}

          <div className="">
            <span className="text-4xl text-yellow-400">
              <FaRegSquareCaretRight />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelFooter;
