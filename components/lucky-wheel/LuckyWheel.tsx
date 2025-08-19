"use client";

import { useLuckyWheelContext } from "@/context/luckyWheelContext";
import { Bitmap, Stage, Text, Ticker } from "@createjs/easeljs";
import { Ease, Tween } from "@createjs/tweenjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import WinModal from "./WinModal";

// ---------- Types to avoid TS2749 ('Stage' used as a type) ----------
type StageInstance = InstanceType<typeof Stage>;

// ---------- Wheel data ----------
const rewards2 = [
  { label: "Prize 1", value: 0 },
  { label: "Prize 2", value: 1 },
  { label: "Prize 3", value: 2 },
  { label: "Prize 4", value: 5 },
  { label: "Prize 5", value: 10 },
  { label: "Prize 6", value: 2 },
  { label: "Prize 7", value: 0 },
  { label: "Prize 8", value: 100 },
  { label: "Prize 9", value: 1 },
  { label: "Prize 10", value: 0 },
  { label: "Prize 11", value: 500 },
  { label: "Prize 12", value: 3 },
];

const getResponsiveProps = () => {
  if (typeof window === "undefined") return { scale: 0.25, yOffset: 100 };
  return window.innerWidth < 768
    ? { scale: 0.23, yOffset: 100 }
    : { scale: 0.25, yOffset: 100 };
};

// ---------- Probability weights ----------
function getWeight(value: number): number {
  switch (value) {
    case 500:
      return 1;
    case 100:
      return 2;
    case 10:
      return 6;
    case 5:
      return 12;
    case 3:
      return 14;
    case 2:
      return 16;
    case 1:
      return 18;
    case 0:
      return 8;
    default:
      return 6;
  }
}
function pickWeightedIndex(values: number[]): number {
  const weights = values.map(getWeight);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r < 0) return i;
  }
  return values.length - 1;
}

type RootState = {
  luckyWheel: { betAmount: number };
};

export default function LuckyWheel() {
  const { user, updateBalance } = useLuckyWheelContext();

  const betAmount = useSelector((s: RootState) => s.luckyWheel.betAmount);

  // UI states

  const [isSpinning, setIsSpinning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Win states
  const [result, setResult] = useState<null | { label: string; value: number }>(
    null
  );
  const [winOpen, setWinOpen] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winMult, setWinMult] = useState<number | undefined>();
  const [winBet, setWinBet] = useState<number | undefined>();

  // Canvas & audio refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // CreateJS scene refs
  const stageRef = useRef<StageInstance | null>(null);
  const tickHandlerRef = useRef<((e?: any) => void) | null>(null);
  const pinRef = useRef<any>(null);
  const lightFrameRef = useRef<any[]>([]);
  const lightFrameIndex = useRef(0);
  const lightIntervalRef = useRef<number | null>(null);

  // Calibration
  const PIN_BASE_DIRECTION_DEG = 270; // pin.rotation=0 points left
  const FIRST_SEGMENT_CENTER_DEG = 0; // rewards2[0] centered at top
  const CALIB = FIRST_SEGMENT_CENTER_DEG - PIN_BASE_DIRECTION_DEG;

  // Autoplay bg music on first interaction (optional)
  useEffect(() => {
    const resumeAudio = () => {
      if (bgMusicRef.current && bgMusicRef.current.paused) {
        bgMusicRef.current.volume = 0.3;
        bgMusicRef.current.play().catch(() => {});
      }
    };
    window.addEventListener("click", resumeAudio, { once: true });
    return () => window.removeEventListener("click", resumeAudio);
  }, []);

  // Pause ticker/audio when tab hidden (optional safety)
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        Ticker.paused = true;
        spinSoundRef.current?.pause();
      } else {
        Ticker.paused = false;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Init / Destroy CreateJS scene (handles route leave/return robustly)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsReady(false);

    const stage = new Stage(canvas);
    stageRef.current = stage;

    const { scale, yOffset } = getResponsiveProps();

    const lightPaths = [
      "/images/lucky-wheel/lights/sheet1.png",
      "/images/lucky-wheel/lights/sheet2.png",
      "/images/lucky-wheel/lights/sheet3.png",
      "/images/lucky-wheel/lights/sheet4.png",
      "/images/lucky-wheel/lights/sheet5.png",
    ];

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    let disposed = false;

    Promise.all([
      loadImage("/images/lucky-wheel/wheel.png"),
      loadImage("/images/lucky-wheel/pin_3.png"),
      loadImage("/images/lucky-wheel/sub_wheel_2.png"),
      ...lightPaths.map(loadImage),
    ])
      .then(([wheelImage, pinImage, subImage, ...lightImages]) => {
        if (disposed) return;

        // Wheel
        const wheel = new Bitmap(wheelImage);
        wheel.regX = wheelImage.width / 2;
        wheel.regY = wheelImage.height / 2;
        wheel.x = canvas.width / 2;
        wheel.y = canvas.height / 2 - yOffset;
        wheel.scaleX = wheel.scaleY = scale;
        stage.addChild(wheel);

        // Labels
        const rewards = rewards2;
        const N = rewards.length;
        const angleStep = 360 / N;

        const centerX = wheel.x;
        const centerY = wheel.y;
        const radius = 85;

        rewards.forEach((r, i) => {
          const angleDeg = FIRST_SEGMENT_CENTER_DEG + i * angleStep;
          const rad = (angleDeg * Math.PI) / 180;
          const label = new Text(`${r.value}X`, "bold 20px Arial", "#fff");
          label.x = centerX + radius * Math.cos(rad);
          label.y = centerY + radius * Math.sin(rad);
          label.textAlign = "center";
          label.textBaseline = "middle";
          label.rotation = angleDeg;
          stage.addChild(label);
        });

        // Lights (animated frames)
        lightImages.forEach((img, i) => {
          const bmp = new Bitmap(img);
          bmp.regX = img.width / 2;
          bmp.regY = img.height / 2;
          bmp.x = centerX;
          bmp.y = centerY;
          bmp.visible = i === 0;
          bmp.scaleX = bmp.scaleY = scale;
          stage.addChildAt(bmp, 1);
          lightFrameRef.current[i] = bmp;
        });

        lightIntervalRef.current = window.setInterval(() => {
          const prev = lightFrameIndex.current;
          const next = (prev + 1) % lightImages.length;
          if (lightFrameRef.current[prev])
            lightFrameRef.current[prev].visible = false;
          if (lightFrameRef.current[next])
            lightFrameRef.current[next].visible = true;
          lightFrameIndex.current = next;
        }, 90);

        // Pin
        const pin = new Bitmap(pinImage);
        pin.regX = pinImage.width / 2;
        pin.regY = pinImage.height * 0.9;
        pin.x = centerX;
        pin.y = centerY;
        pin.scaleX = 0.25;
        pin.scaleY = 0.68;
        pin.rotation = 0;
        pinRef.current = pin;
        stage.addChild(pin);

        // Overlay (visual only; button triggers spin)
        const subWheel = new Bitmap(subImage);
        subWheel.regX = subImage.width / 2.1;
        subWheel.regY = subImage.height / 2;
        subWheel.x = centerX;
        subWheel.y = centerY;
        subWheel.scaleX = subWheel.scaleY = scale + 0.25;
        subWheel.cursor = "default";
        stage.addChild(subWheel);

        // Ticker
        Ticker.framerate = 60;
        const handleTick = () => stage.update();
        tickHandlerRef.current = handleTick;
        Ticker.on("tick", handleTick);

        setIsReady(true);
      })
      .catch((err) => {
        console.error("Failed to load wheel assets:", err);
        setIsReady(false);
      });

    // Full cleanup on unmount / route change
    return () => {
      disposed = true;

      if (tickHandlerRef.current) {
        Ticker.off("tick", tickHandlerRef.current);
        tickHandlerRef.current = null;
      }
      if (lightIntervalRef.current) {
        clearInterval(lightIntervalRef.current);
        lightIntervalRef.current = null;
      }
      try {
        spinSoundRef.current?.pause();
        if (spinSoundRef.current) spinSoundRef.current.currentTime = 0;
        bgMusicRef.current?.pause();
      } catch {}

      try {
        if (pinRef.current) Tween.removeTweens(pinRef.current);
        Tween.removeAllTweens();
      } catch {}

      try {
        stageRef.current?.removeAllChildren();
        stageRef.current?.update();
      } catch {}

      stageRef.current = null;
      pinRef.current = null;
      lightFrameRef.current = [];
      lightFrameIndex.current = 0;
      setIsReady(false);
      setIsSpinning(false);
    };
  }, []);

  // ---------- Spin logic ----------
  const spinPin = (N: number) => {
    if (!user) return alert("Please login first.");
    if (!isReady) return;
    if (isSpinning) return;

    if (betAmount <= 0) return alert("Bet must be greater than 0.");
    if (user.balance < betAmount) return alert("Insufficient balance.");

    const pin = pinRef.current;
    if (!pin) return;

    setIsSpinning(true);

    try {
      const angleStep = 360 / N;

      // Clear any prior tweens
      Tween.removeTweens(pin);
      pin.rotation = 0;

      // Weighted pick
      const targetIndex = pickWeightedIndex(rewards2.map((r) => r.value));
      const stopAngle = CALIB + targetIndex * angleStep;
      const totalRot = 360 * 10 + stopAngle;

      // Start sound
      if (spinSoundRef.current) {
        spinSoundRef.current.volume = 0.15;
        spinSoundRef.current.currentTime = 0;
        spinSoundRef.current.play().catch(() => {});
      }

      // Deduct bet when the animation starts
      updateBalance(-betAmount);

      Tween.get(pin, { override: true })
        .to({ rotation: totalRot }, 8800, Ease.cubicOut)
        .call(() => {
          const reward = rewards2[targetIndex];
          setResult(reward);

          const payout = betAmount * reward.value;
          if (payout > 0) {
            updateBalance(payout);
            setWinAmount(payout);
            setWinMult(reward.value);
            setWinBet(betAmount);
            setWinOpen(true);
          }

          if (spinSoundRef.current) {
            spinSoundRef.current.pause();
            spinSoundRef.current.currentTime = 0;
          }

          // Normalize rotation
          pin.rotation = ((pin.rotation % 360) + 360) % 360;
        })
        .call(() => setIsSpinning(false));
    } catch (e) {
      console.error(e);
      setIsSpinning(false);
    }
  };

  return (
    <div className="relative wheel-wrapper flex flex-col items-center gap-4 min-h-screen justify-center bg-black mt-0 overflow-hidden">
      {/* Sounds */}
      <audio
        ref={spinSoundRef}
        src="/sounds/lucky-wheel/roll.mp3"
        preload="auto"
      />
      <audio
        ref={bgMusicRef}
        src="/sounds/lucky-wheel/bg.mp3"
        preload="auto"
        loop
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="bg-transparent rounded z-10"
      />

      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white text-sm">Loading wheel…</p>
          </div>
        </div>
      )}

      {/* Start Spin Button */}
      <button
        className="absolute bottom-[25%] left-0 right-0 z-20 flex justify-center mt-4"
        disabled={!isReady || isSpinning}
        onClick={() => spinPin(rewards2.length)}
        aria-busy={isSpinning || !isReady}
        aria-disabled={!isReady || isSpinning}
      >
        <div
          className={`p-[4px] rounded-lg bg-[linear-gradient(180deg,#FFE26A_0%,#FF9D00_55%,#FF4B00_100%)]
            [box-shadow:0_0_8px_rgba(255,184,0,.55),0_0_18px_rgba(255,89,0,.35)]
            ${!isReady || isSpinning ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="py-2 px-4 w-full rounded-[5px] overflow-visible bg-[linear-gradient(180deg,#2a0153_0%,#3a016a_100%)] ring-1 ring-inset ring-yellow-100/50 [box-shadow:inset_0_0_9px_rgba(255,210,90,.65)] flex items-center gap-2">
            {(!isReady || isSpinning) && (
              <span className="inline-block h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            <span className="text-white font-extrabold tracking-widest">
              {!isReady ? "Loading…" : isSpinning ? "Spinning…" : "Spin Wheel"}
            </span>
          </div>
        </div>
      </button>

      {/* Win Modal */}
      <WinModal
        open={winOpen}
        amount={winAmount}
        multiplier={winMult}
        bet={winBet}
        onClose={() => setWinOpen(false)}
        autoCloseMs={2500}
      />
    </div>
  );
}
