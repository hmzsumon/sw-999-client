"use client";

import { useLuckyWheelContext } from "@/context/luckyWheelContext";
import { Bitmap, Stage, Text, Ticker } from "@createjs/easeljs";
import { Ease, Tween } from "@createjs/tweenjs";
import { useEffect, useRef, useState } from "react";
import WinModal from "./WinModal";

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

/** ---- Weight rules (edit here to tune probabilities) ----
 * বড় মাল্টিপ্লায়ার = কম weight (কম probability)
 * ছোট মাল্টিপ্লায়ার = বেশি weight (বেশি probability)
 */
function getWeight(value: number): number {
  switch (value) {
    case 500:
      return 1; // খুব কম
    case 100:
      return 2; // কম
    case 10:
      return 6; // মিড
    case 5:
      return 12; // বেশি
    case 3:
      return 14; // বেশি
    case 2:
      return 16; // বেশি
    case 1:
      return 18; // সবচেয়ে বেশি
    case 0:
      return 8; // চাইলে বাড়াতে/কমাতে পারো
    default:
      return 6;
  }
}

/** Weighted random index picker */
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

export default function LuckyWheel() {
  const { user, updateBalance } = useLuckyWheelContext();
  const [result, setResult] = useState<null | { label: string; value: number }>(
    null
  );

  const [winOpen, setWinOpen] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winMult, setWinMult] = useState<number | undefined>();
  const [winBet, setWinBet] = useState<number | undefined>();

  const [bet, setBet] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  const pinRef = useRef<any>(null);
  const lightFrameRef = useRef<any[]>([]);
  const lightFrameIndex = useRef(0);
  const lightIntervalRef = useRef<number | null>(null);

  // === CALIBRATION (adjust if needed) =========================
  const PIN_BASE_DIRECTION_DEG = 270; // pin.rotation=0 → বামে হলে 270
  const FIRST_SEGMENT_CENTER_DEG = 0; // rewards2[0] উপরে হলে 0
  const CALIB = FIRST_SEGMENT_CENTER_DEG - PIN_BASE_DIRECTION_DEG;
  // ============================================================

  // autoplay bg music on first interaction
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stage = new Stage(canvas);
    const { scale, yOffset } = getResponsiveProps();

    const lightPaths = [
      "/images/lucky-wheel/lights/sheet1.png",
      "/images/lucky-wheel/lights/sheet2.png",
      "/images/lucky-wheel/lights/sheet3.png",
      "/images/lucky-wheel/lights/sheet4.png",
      "/images/lucky-wheel/lights/sheet5.png",
    ];

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
      });

    Promise.all([
      loadImage("/images/lucky-wheel/wheel.png"),
      loadImage("/images/lucky-wheel/pin_3.png"),
      loadImage("/images/lucky-wheel/sub_wheel_2.png"),
      ...lightPaths.map(loadImage),
    ]).then(([wheelImage, pinImage, subImage, ...lightImages]) => {
      // wheel
      const wheel = new Bitmap(wheelImage);
      wheel.regX = wheelImage.width / 2;
      wheel.regY = wheelImage.height / 2;
      wheel.x = canvas.width / 2;
      wheel.y = canvas.height / 2 - yOffset;
      wheel.scaleX = wheel.scaleY = scale;
      stage.addChild(wheel);

      // labels
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

      // lights
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
        lightFrameRef.current[prev].visible = false;
        lightFrameRef.current[next].visible = true;
        lightFrameIndex.current = next;
      }, 90);

      // pin
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

      // clickable overlay
      const subWheel = new Bitmap(subImage);
      subWheel.regX = subImage.width / 2.1;
      subWheel.regY = subImage.height / 2;
      subWheel.x = centerX;
      subWheel.y = centerY;
      subWheel.scaleX = subWheel.scaleY = scale + 0.25;
      subWheel.cursor = "pointer";
      subWheel.addEventListener("click", () => spinPin(N));
      stage.addChild(subWheel);

      Ticker.framerate = 60;
      Ticker.addEventListener("tick", () => stage.update());
    });

    return () => {
      Ticker.removeAllEventListeners("tick");
      if (lightIntervalRef.current) clearInterval(lightIntervalRef.current);
    };
  }, []);

  // spin logic (weighted + calibrated)
  const spinPin = (N: number) => {
    if (!user) return alert("Please login first.");
    if (isSpinning) return;

    if (bet <= 0) return alert("Bet must be greater than 0.");
    if (user.balance < bet) return alert("Insufficient balance.");

    updateBalance(-bet);
    setIsSpinning(true);

    const pin = pinRef.current;
    if (!pin) return;

    Tween.removeTweens(pin);
    pin.rotation = 0;

    const angleStep = 360 / N;

    // PICK using weights
    const targetIndex = pickWeightedIndex(rewards2.map((r) => r.value));

    // stop angle so that pin points to CENTER of targetIndex
    const stopAngle = CALIB + targetIndex * angleStep;
    const totalRot = 360 * 10 + stopAngle;

    if (spinSoundRef.current) {
      spinSoundRef.current.volume = 0.15;
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(() => {});
    }

    Tween.get(pin)
      .to({ rotation: totalRot }, 8800, Ease.cubicOut)
      .call(() => {
        const reward = rewards2[targetIndex];
        setResult(reward);
        const payout = bet * reward.value; // তুমি চাইলে শুধু প্রফিট: bet*(reward.value-1)
        if (payout > 0) {
          updateBalance(payout);
          setWinAmount(payout);
          setWinMult(reward.value);
          setWinBet(bet);
          setWinOpen(true);
        }

        if (spinSoundRef.current) {
          spinSoundRef.current.pause();
          spinSoundRef.current.currentTime = 0;
        }
        console.log(
          `🎯 Weighted stop @ index ${targetIndex} (angle ${stopAngle.toFixed(
            2
          )}°) →`,
          reward,
          " | weight =",
          getWeight(reward.value)
        );
      });
  };

  return (
    <div className="wheel-wrapper flex flex-col items-center gap-4 min-h-screen justify-center bg-black mt-0 relative overflow-hidden">
      <audio
        ref={spinSoundRef}
        src="/sounds/lucky-wheel/roll.mp3"
        preload="auto"
      />

      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="bg-transparent rounded z-10"
      />

      {result && (
        <div className="text-white text-xl mt-2">
          Result: <b>{result.label}</b> ({result.value}x)
        </div>
      )}
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
