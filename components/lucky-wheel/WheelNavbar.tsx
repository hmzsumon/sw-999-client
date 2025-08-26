"use client";
import bgNav from "@/public/images/lucky-wheel/bg_navbar.png";
import HomeBtn from "@/public/images/lucky-wheel/home.png";
import Lobby from "@/public/images/lucky-wheel/lobby.png";
import OffBtn from "@/public/images/lucky-wheel/soundOffBtn.png";
import OnBtn from "@/public/images/lucky-wheel/soundOnBtn.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export const formatBalance = (amount: number): string => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2).replace(/\.0$/, "") + "M";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(2).replace(/\.0$/, "") + "K";
  }
  return amount.toString();
};

const WheelNavbar = () => {
  const balance = 10.25;
  const betAmount = 100;
  const free_spins = 0;

  const { user } = useSelector((state: any) => state.auth);

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

  // 🔊 Background music setup
  useEffect(() => {
    audioRef.current = new Audio("/sounds/lucky-wheel/bg.webm");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    audioRef.current.play().catch((err) => {
      console.warn("Autoplay failed:", err);
    });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <div className="relative z-50 ">
      <Image
        src={bgNav}
        alt="Lucky Wheel Navbar Background"
        className="w-full h-full object-cover"
        priority
      />

      {/* Bet Amount */}
      <div className="absolute left-[17%] md:left-[18%] sm:top-[25%] md:top-[30%] top-0 lg:left-[18%] lg:top-[30%] text-center">
        <span className="text-yellow-400 text-[.75rem] sm:text-xl lg:text-4xl font-bold">
          {free_spins}
        </span>
      </div>
      {/* Bet Amount */}
      <div className="absolute left-[23.5%] top-0 md:left-[23.5%] md:top-[20%]  lg:left-[25%] lg:top-[28%] text-center">
        <span className="text-yellow-400 text-[.75rem] lg:text-4xl font-bold">
          {betAmount}
        </span>
      </div>

      {/*Balance */}
      <div className="absolute left-[42%] top-0 md:left-[42.5%] md:top-[20%] lg:left-[45%] lg:top-[28%] text-center">
        <span className="text-yellow-400 text-[.75rem] lg:text-4xl font-bold">
          {formatBalance(user?.m_balance ?? 0)}
        </span>
      </div>

      {/* 🔊 Sound Toggle Button */}
      <div className="absolute top-0 right-[25%] flex flex-col items-center justify-center h-full z-20">
        <Image
          src={isSoundOn ? OnBtn : OffBtn}
          alt={isSoundOn ? "Sound On" : "Sound Off"}
          onClick={handleSoundToggle}
          className={`cursor-pointer w-5 h-5 lg:w-20 lg:h-20 transition-transform ${
            animate ? "animate-heartbeat" : ""
          }`}
        />
      </div>

      <div className="absolute top-0 right-[33%] flex flex-col items-center justify-center h-full z-20">
        <Link href="/dashboard">
          <Image
            src={HomeBtn}
            alt="Home Button"
            className="cursor-pointer w-5 h-5 lg:w-20 lg:h-20 transition-transform"
          />
        </Link>
      </div>

      {/* 🔊 Sound Toggle Button */}
      <div className="absolute top-0 right-[10%] flex flex-col items-center justify-center h-full z-20">
        <Link href="/lucky-wheel">
          <Image
            src={Lobby}
            alt="Lobby Img"
            className={`cursor-pointer w-12 h-5 lg:w-full lg:h-20 transition-transform `}
          />
        </Link>
      </div>
    </div>
  );
};

export default WheelNavbar;
