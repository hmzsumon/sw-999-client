"use client";
import { useLuckyWheelContext } from "@/context/luckyWheelContext";
import BgBetAmount from "@/public/images/lucky-wheel/bg_betAmount.png";
import bgFooter from "@/public/images/lucky-wheel/bg_footer.png";
import Image from "next/image";
import { useRef, useState } from "react";

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
  const balance = 10.25;
  const betAmount = 100;
  const free_spins = 0;

  const { user, updateBalance } = useLuckyWheelContext();
  console.log("User:", user);

  const [animate, setAnimate] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSoundToggle = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1500);

    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.warn("Play failed:", err);
        });
      }
    }
    setIsSoundOn((prev) => !prev);
  };

  return (
    <div className="relative z-50 ">
      <div className="absolute bottom-0  w-full h-[5vh] ">
        <Image
          src={bgFooter}
          alt="Lucky Wheel Navbar Background"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="absolute -bottom-1 left-[25%] md:left-[18%] sm:top-[25%] md:top-[30%]  lg:left-[18%] lg:top-[30%] text-center">
        <span className="text-5xl text-yellow-400">-</span>
      </div>

      {/* Bet Amount */}
      <div className="absolute -bottom-[1%] left-[33%] md:left-[18%] sm:top-[25%] md:top-[30%]  lg:left-[18%] lg:top-[30%] text-center">
        <Image
          src={BgBetAmount}
          alt="Bet Amount Background"
          className="w-[58%] h-full object-cover"
        />
      </div>

      <div className="absolute -bottom-[.12rem] left-[65%] md:left-[18%] sm:top-[25%] md:top-[30%]  lg:left-[18%] lg:top-[30%] text-center">
        <span className="text-4xl text-yellow-400">+</span>
      </div>
    </div>
  );
};

export default WheelFooter;
