"use client";
import BgImg from "@/public/images/lucky-wheel/bg_01.png";
import HotGirl from "@/public/images/lucky-wheel/hot_girl_01.png";
import TextImg from "@/public/images/lucky-wheel/image_03.png";
import StartBtn from "@/public/images/lucky-wheel/startBtn.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LuckyWheelPage = () => {
  const [isStart, setIsStart] = useState(false);
  return (
    <div className="relative ">
      <Image src={BgImg} alt="Lucky Wheel Background" objectFit="cover" />
      <div className="absolute inset-0 -top-6 -left-2 ">
        <Image src={TextImg} alt="Lucky Wheel Text" className="" />
      </div>

      {/* 🎯 Start Button */}
      <div className="absolute right-[20%] top-[15%] lg:right-[45%] flex flex-col items-center justify-center h-full z-20">
        <Link href="/lucky-wheel/game">
          <Image
            src={StartBtn}
            alt="Start Button"
            className="object-content cursor-pointer w-[60%] lg:w-full animate-heartbeat"
            onClick={() => setIsStart(true)}
          />
        </Link>
      </div>

      {/* 💃 Hot Girl */}
      <div className="absolute right-[0%] top-[38%] lg:right-[5%] w-[35%] h-full z-20">
        <Image
          src={HotGirl}
          alt="Hot Girl"
          className="object-contain w-full lg:w-[110%]"
        />
      </div>
    </div>
  );
};

export default LuckyWheelPage;
