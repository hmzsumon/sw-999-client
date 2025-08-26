"use client";

/* ── Imports─────────────────────────────────────────────────────────────── */
import { useEffect, useMemo, useRef, useState } from "react";
type CJS = any;

/* ── Wheel math/config──────────────────────────────────────────────────── */
const EURO_WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]; // clockwise, top=0
const N = EURO_WHEEL_ORDER.length;
const STEP = 360 / N;
const REDS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

/* ── CONFIG (লাইভ টিউনযোগ্য)──────────────────────────────────────────── */
const CFG = {
  assets: {
    bg: "/images/mini-roulette/backimage.jpg",
    center: "/images/mini-roulette/spinner.png",
    ring: "/images/mini-roulette/roulette4.png", // inner number ring (static)
    ball: "/images/mini-roulette/ball.png",
  },

  /* ── Global align/scale ── */
  master: {
    scale: 1.0,
    artOffsetDeg: 0 /* ০ পকেট টপে না পড়লে ± ডিগ্রি */,
    topAtDeg: 0 /* pointer কোন এংগেলে? টপ = 0° */,
  },

  /* ── Center ornament (spinning) ── */
  center: {
    base: 0.56,
    scaleX: 1.0,
    scaleY: 1.0,
    rotDeg: 0,
    offsetX: 0.0,
    offsetY: 0.0,
    idleMs: 12000 /* idle এ ১ টার্ন */,
    spinTurns: 6 /* SPIN এ কত টার্ন (ভিজ্যুয়াল) */,
    spinMs: 4800,
  },

  /* ── Inner number ring (static, elliptical fit) ── */
  ring: {
    baseFitX: 0.55 /* ক্যানভাস রেডিয়াসের তুলনায় width fit */,
    baseFitY: 0.75 /* ক্যানভাস রেডিয়াসের তুলনায় height fit */,
    scaleX: 1.5,
    scaleY: 1.5,
    rotDeg: 0,
    offsetX: 0.0 /* +ডানে/−বামে (radius ratio) */,
    offsetY: -0.025 /* +উপরে/−নীচে (radius ratio) */,
  },

  /* ── Ball + track ── */
  ball: { base: 0.04, scaleX: 1.0, scaleY: 1.0 },
  track: {
    rx: 0.81 /* এলিপস rx (radius ratio) */,
    ry: 0.71 /* এলিপস ry */,
    rotDeg: 0 /* ট্র্যাক এলিপস ঘোরাতে */,
    angleOffsetDeg: 0 /* top=0 থেকে বলের নিজস্ব অফসেট */,
  },

  /* ── Ball spin timing ── */
  spin: { lapsMin: 5, lapsMax: 7, ms: 4600 },

  /* ── Debug ── */
  debug: { show: false, ringColor: "#ffd54f", trackColor: "#80deea" },
};

/* ── Helpers────────────────────────────────────────────────────────────── */
function colorOf(n: number) {
  if (n === 0) return "green";
  return REDS.has(n) ? "red" : "black";
}
function evenOdd(n: number) {
  if (n === 0) return "-";
  return n % 2 === 0 ? "Even" : "Odd";
}
function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function norm360(a: number) {
  const x = a % 360;
  return x < 0 ? x + 360 : x;
}
function pocketCenterDeg(num: number) {
  const i = EURO_WHEEL_ORDER.indexOf(num);
  return i * STEP + STEP / 2 - CFG.master.artOffsetDeg; // deg cw from top
}

/* ── Component──────────────────────────────────────────────────────────── */
export default function MiniRouletteWheel() {
  /* ── Refs & State ── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);

  const ringRef = useRef<any>(null);
  const centerRef = useRef<any>(null);
  const ballRef = useRef<any>(null);

  const ballIdleObjRef = useRef<{ a: number } | null>(null);
  const startIdleRef = useRef<null | (() => void)>(null);
  const markersRef = useRef<any>(null);

  const [cjs, setCjs] = useState<CJS | null>(null);
  const [inited, setInited] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{
    num: number;
    color: string;
    eo: string;
  } | null>(null);

  /* small HUD to show current values */
  const [hudOpen, setHudOpen] = useState(true);
  const [hudTick, setHudTick] = useState(0); // force re-render after key tweaks

  /* ── Dynamic import (avoid SSR)───────────────────────────────────────── */
  useEffect(() => {
    import("createjs-module").then((m) =>
      setCjs((m as any).default || (m as any))
    );
  }, []);

  /* ── Init Stage & Images──────────────────────────────────────────────── */
  useEffect(() => {
    if (!cjs || !canvasRef.current || inited) return;
    setInited(true);

    const { assets } = CFG;
    const canvas = canvasRef.current;
    const stage = new cjs.Stage(canvas);
    stageRef.current = stage;

    /* ── Resize (Hi-DPI)────────────────────────────────────────────────── */
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      stage.scaleX = stage.scaleY = dpr;
      stage.update();
    };
    cjs.Ticker.framerate = 60;
    cjs.Ticker.on("tick", stage);
    window.addEventListener("resize", resize);
    resize();

    /* ── Load images────────────────────────────────────────────────────── */
    Promise.all([
      loadImage(assets.ring),
      loadImage(assets.center),
      loadImage(assets.ball),
    ])
      .then(([ringImg, centerImg, ballImg]) => {
        /* dims & bases in closure (used by helpers) */
        const W = canvas.width / dpr,
          H = canvas.height / dpr;
        const box = Math.min(W, H * 0.9);
        const cx = W / 2,
          cy = H / 2;
        const R = box / 2;

        const baseScale = (img: HTMLImageElement) =>
          box /
          Math.max(
            img.naturalWidth || img.width,
            img.naturalHeight || img.height
          );

        /* ── Bitmaps────────────────────────────────────────────────────── */
        const ringBmp = new cjs.Bitmap(ringImg);
        const ctrBmp = new cjs.Bitmap(centerImg);
        const ballBmp = new cjs.Bitmap(ballImg);
        ringRef.current = ringBmp;
        centerRef.current = ctrBmp;
        ballRef.current = ballBmp;

        /* reg */
        ringBmp.regX = (ringImg.naturalWidth || ringImg.width) / 2;
        ringBmp.regY = (ringImg.naturalHeight || ringImg.height) / 2;
        ctrBmp.regX = (centerImg.naturalWidth || centerImg.width) / 2;
        ctrBmp.regY = (centerImg.naturalHeight || centerImg.height) / 2;
        ballBmp.regX = (ballImg.naturalWidth || ballImg.width) / 2;
        ballBmp.regY = (ballImg.naturalHeight || ballImg.height) / 2;

        /* ── Helpers: transforms & geometry ───────────────────────────── */
        function applyRingTransform() {
          /* scale depends on master.scale too */
          const rb = baseScale(ringImg) * CFG.master.scale;
          ringBmp.x = cx + R * CFG.ring.offsetX;
          ringBmp.y = cy + R * CFG.ring.offsetY;
          ringBmp.scaleX = rb * CFG.ring.baseFitX * CFG.ring.scaleX;
          ringBmp.scaleY = rb * CFG.ring.baseFitY * CFG.ring.scaleY;
          ringBmp.rotation = CFG.ring.rotDeg;
        }
        function applyCenterTransform() {
          const cb = baseScale(centerImg) * CFG.master.scale;
          ctrBmp.x = cx + R * CFG.center.offsetX;
          ctrBmp.y = cy + R * CFG.center.offsetY;
          ctrBmp.scaleX = cb * CFG.center.base * CFG.center.scaleX;
          ctrBmp.scaleY = cb * CFG.center.base * CFG.center.scaleY;
          ctrBmp.rotation = CFG.center.rotDeg;
        }
        function applyBallTransform() {
          const bb = baseScale(ballImg) * CFG.master.scale;
          ballBmp.scaleX = bb * CFG.ball.base * CFG.ball.scaleX;
          ballBmp.scaleY = bb * CFG.ball.base * CFG.ball.scaleY;
        }

        /* ── place ball on rotated ellipse (track) ────────────────────── */
        function placeBallAtAngle(angleDeg: number) {
          const rad =
            ((angleDeg + CFG.track.angleOffsetDeg + CFG.master.topAtDeg - 90) *
              Math.PI) /
            180;
          const rx = R * CFG.track.rx,
            ry = R * CFG.track.ry;
          const phi = (CFG.track.rotDeg * Math.PI) / 180;
          const x = rx * Math.cos(rad),
            y = ry * Math.sin(rad);
          const xr = x * Math.cos(phi) - y * Math.sin(phi);
          const yr = x * Math.sin(phi) + y * Math.cos(phi);
          ballBmp.x = cx + R * CFG.ring.offsetX + xr;
          ballBmp.y = cy + R * CFG.ring.offsetY + yr;
        }
        (stage as any).__placeBallAtAngle = placeBallAtAngle;

        /* ── pure geometry XY (for markers) ───────────────────────────── */
        function xyOnTrack(angleDeg: number) {
          const rad =
            ((angleDeg + CFG.track.angleOffsetDeg + CFG.master.topAtDeg - 90) *
              Math.PI) /
            180;
          const rx = R * CFG.track.rx,
            ry = R * CFG.track.ry;
          const phi = (CFG.track.rotDeg * Math.PI) / 180;
          const x = rx * Math.cos(rad),
            y = ry * Math.sin(rad);
          const xr = x * Math.cos(phi) - y * Math.sin(phi);
          const yr = x * Math.sin(phi) + y * Math.cos(phi);
          return {
            x: cx + R * CFG.ring.offsetX + xr,
            y: cy + R * CFG.ring.offsetY + yr,
          };
        }

        /* ── debug markers ────────────────────────────────────────────── */
        function drawPocketMarkers() {
          const cont = new cjs.Container();
          for (const num of EURO_WHEEL_ORDER) {
            const a = pocketCenterDeg(num);
            const p = xyOnTrack(a);
            const dot = new cjs.Shape();
            const col =
              num === 0 ? "#1abc9c" : REDS.has(num) ? "#e53935" : "#111827";
            dot.graphics.beginFill(col).drawCircle(0, 0, 2.2).endFill();
            dot.x = p.x;
            dot.y = p.y;
            cont.addChild(dot);
          }
          return cont;
        }

        /* ── rebuild markers based on CFG.debug.show ──────────────────── */
        function rebuildMarkers() {
          if (markersRef.current) {
            stage.removeChild(markersRef.current);
            markersRef.current = null;
          }
          if (CFG.debug.show) {
            const m = drawPocketMarkers();
            markersRef.current = m;
            stage.addChild(m);
          }
        }

        /* ── Refresh visuals after any CFG tweak ──────────────────────── */
        function refresh(currentAngleDeg: number) {
          applyRingTransform();
          applyCenterTransform();
          applyBallTransform();
          placeBallAtAngle(currentAngleDeg);
          rebuildMarkers();
          stage.update();
        }
        (stage as any).__refresh = refresh;

        /* ── add to stage (order) ─────────────────────────────────────── */
        stage.addChild(ringBmp, ctrBmp, ballBmp);

        /* ── Initial: ball sits exactly at number 0 pocket ────────────── */
        const a0 = pocketCenterDeg(0);
        applyRingTransform();
        applyCenterTransform();
        applyBallTransform();
        rebuildMarkers();
        (stage as any).__placeBallAtAngle(a0);

        /* ── Idle: center + ball rotate together ──────────────────────── */
        const ballIdleObj = { a: a0 };
        ballIdleObjRef.current = ballIdleObj;

        const startIdle = () => {
          // center idle
          cjs.Tween.removeTweens(centerRef.current);
          cjs.Tween.get(centerRef.current, { loop: true }).to(
            { rotation: centerRef.current.rotation + 360 },
            CFG.center.idleMs,
            cjs.Ease.linear
          );

          // ball idle (same period)
          cjs.Tween.removeTweens(ballIdleObj);
          cjs.Tween.get(ballIdleObj, { loop: true })
            .to({ a: ballIdleObj.a + 360 }, CFG.center.idleMs, cjs.Ease.linear)
            .addEventListener("change", () =>
              (stage as any).__placeBallAtAngle(ballIdleObj.a)
            );
        };
        startIdleRef.current = startIdle;
        startIdle();

        stage.update();

        /* ── Keyboard live-tuning ─────────────────────────────────────── */
        const onKey = (e: KeyboardEvent) => {
          const key = e.key;
          let changed = false;

          /* steps */
          const dDegSmall = e.shiftKey ? 1.0 : 0.5; // degrees
          const dFitSmall = e.shiftKey ? 0.01 : 0.005; // scale/fit
          const dOffSmall = e.shiftKey ? 0.01 : 0.002; // offset

          /* ── mappings ──────────────────────────────────────────────── */
          switch (key) {
            case "[":
              CFG.master.artOffsetDeg -= dDegSmall;
              changed = true;
              break; // ০ পকেট অ্যালাইন −
            case "]":
              CFG.master.artOffsetDeg += dDegSmall;
              changed = true;
              break; // ০ পকেট অ্যালাইন +

            case "-":
              CFG.track.rx = Math.max(0.4, CFG.track.rx - dFitSmall);
              changed = true;
              break; // ট্র্যাক ভিতরে
            case "=":
              CFG.track.rx = Math.min(1.2, CFG.track.rx + dFitSmall);
              changed = true;
              break; // ট্র্যাক বাইরে

            case ";":
              CFG.track.ry = Math.max(0.4, CFG.track.ry - dFitSmall);
              changed = true;
              break; // ট্র্যাক উলম্ব −
            case "'":
              CFG.track.ry = Math.min(1.2, CFG.track.ry + dFitSmall);
              changed = true;
              break; // ট্র্যাক উলম্ব +

            case ",":
              CFG.track.rotDeg -= dDegSmall;
              changed = true;
              break; // এলিপস ঘোরানো −
            case ".":
              CFG.track.rotDeg += dDegSmall;
              changed = true;
              break; // এলিপস ঘোরানো +

            case "ArrowLeft":
              CFG.ring.offsetX -= dOffSmall;
              changed = true;
              break;
            case "ArrowRight":
              CFG.ring.offsetX += dOffSmall;
              changed = true;
              break;
            case "ArrowUp":
              CFG.ring.offsetY -= dOffSmall;
              changed = true;
              break;
            case "ArrowDown":
              CFG.ring.offsetY += dOffSmall;
              changed = true;
              break;

            case "1":
              CFG.ring.baseFitX = Math.max(0.3, CFG.ring.baseFitX - dFitSmall);
              changed = true;
              break;
            case "2":
              CFG.ring.baseFitX = Math.min(1.3, CFG.ring.baseFitX + dFitSmall);
              changed = true;
              break;
            case "3":
              CFG.ring.baseFitY = Math.max(0.3, CFG.ring.baseFitY - dFitSmall);
              changed = true;
              break;
            case "4":
              CFG.ring.baseFitY = Math.min(1.3, CFG.ring.baseFitY + dFitSmall);
              changed = true;
              break;

            case "m":
            case "M":
              CFG.debug.show = !CFG.debug.show;
              changed = true;
              break; // মার্কার টগল
            case "/":
              if (e.shiftKey) {
                setHudOpen((v) => !v);
              }
              break; // '?' -> help HUD toggle

            /* দ্রুত চেক: নির্দিষ্ট পকেটে জাম্প */
            case "0":
              jumpToPocket(0);
              break;
            case "9":
              jumpToNextPocket(-1);
              break; // prev
            case "8":
              jumpToNextPocket(+1);
              break; // next

            /* reset (R) */
            case "r":
            case "R":
              CFG.master.artOffsetDeg = 0;
              CFG.track.rx = 0.81;
              CFG.track.ry = 0.71;
              CFG.track.rotDeg = 0;
              CFG.track.angleOffsetDeg = 0;
              CFG.ring.baseFitX = 0.55;
              CFG.ring.baseFitY = 0.75;
              CFG.ring.offsetX = 0.0;
              CFG.ring.offsetY = -0.025;
              CFG.ring.scaleX = 1.5;
              CFG.ring.scaleY = 1.5;
              CFG.ring.rotDeg = 0;
              changed = true;
              break;
          }

          /* apply changes */
          if (changed) {
            const curA = ballIdleObjRef.current
              ? ballIdleObjRef.current.a
              : pocketCenterDeg(0);
            (stage as any).__refresh(curA);
            setHudTick((t) => t + 1);
          }
        };
        window.addEventListener("keydown", onKey);

        /* helpers used by keys */
        function jumpToPocket(num: number) {
          // idle চলুক, কিন্তু এংগেলকে নতুন পকেটে স্ন্যাপ করো
          if (!ballIdleObjRef.current) return;
          const a = pocketCenterDeg(num);
          ballIdleObjRef.current.a = a;
          (stage as any).__refresh(a);
          setHudTick((t) => t + 1);
        }
        function jumpToNextPocket(dir: number) {
          if (!ballIdleObjRef.current) return;
          // কাছের পকেট ইনডেক্স খুঁজে পরের/আগেরটায় যাওয়া
          const curA = norm360(ballIdleObjRef.current.a);
          let idx = 0,
            bestDiff = 9999;
          for (let i = 0; i < N; i++) {
            const a = norm360(i * STEP + STEP / 2 - CFG.master.artOffsetDeg);
            const d = Math.min(norm360(a - curA), norm360(curA - a));
            if (d < bestDiff) {
              bestDiff = d;
              idx = i;
            }
          }
          idx = (idx + (dir > 0 ? 1 : -1) + N) % N;
          jumpToPocket(EURO_WHEEL_ORDER[idx]);
        }

        /* ── Cleanup of listeners ── */
        return () => {
          window.removeEventListener("resize", resize);
          window.removeEventListener("keydown", onKey);
          cjs.Ticker.off("tick", stage);
          stage.removeAllChildren();
          ringRef.current = centerRef.current = ballRef.current = null;
          ballIdleObjRef.current = null;
          startIdleRef.current = null;
          markersRef.current = null;
          stageRef.current = null;
        };
      })
      .catch((err) => console.error("Image load failed:", err));
  }, [cjs, inited]);

  /* ── Spin: idle → stop → spin → result → idle ───────────────────────── */
  const spin = () => {
    if (
      !cjs ||
      !ballRef.current ||
      !stageRef.current ||
      !centerRef.current ||
      isSpinning
    )
      return;
    setIsSpinning(true);
    setResult(null);

    // stop idles
    const idleObj = ballIdleObjRef.current;
    if (idleObj) cjs.Tween.removeTweens(idleObj);
    cjs.Tween.removeTweens(centerRef.current);

    /* pick winner */
    const winIdx = Math.floor(Math.random() * N);
    const winNum = EURO_WHEEL_ORDER[winIdx];

    /* center spin (visual) */
    cjs.Tween.get(centerRef.current).to(
      { rotation: centerRef.current.rotation + 360 * CFG.center.spinTurns },
      CFG.center.spinMs,
      cjs.Ease.quartOut
    );

    /* ball spin laps → pocket */
    const placeBall = (stageRef.current as any).__placeBallAtAngle as (
      a: number
    ) => void;
    const pocketA = pocketCenterDeg(winNum);
    const startA = idleObj ? idleObj.a : pocketCenterDeg(0);
    const laps =
      CFG.spin.lapsMin +
      Math.floor(Math.random() * (CFG.spin.lapsMax - CFG.spin.lapsMin + 1));
    const deltaToPocket = pocketA - norm360(startA);
    const finalA = startA + -360 * (laps + 1) + deltaToPocket;

    const ballObj = { a: startA };
    cjs.Tween.get(ballObj)
      .to({ a: finalA }, CFG.spin.ms, cjs.Ease.quartOut)
      .addEventListener("change", () => {
        placeBall(ballObj.a);
        if (idleObj) idleObj.a = ballObj.a;
      })
      .call(() => {
        setResult({ num: winNum, color: colorOf(winNum), eo: evenOdd(winNum) });
        setIsSpinning(false);
        // resume idle from new pos
        if (startIdleRef.current) startIdleRef.current();
      });
  };

  /* ── Table (UI)───────────────────────────────────────────────────────── */
  const tableCols = useMemo(() => {
    const col1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
    const col2 = col1.map((n) => n + 1);
    const col3 = col1.map((n) => n + 2);
    return [col3, col2, col1];
  }, []);

  /* ── UI ── */
  return (
    <div
      className="min-h-[100dvh] w-full text-white"
      style={{
        backgroundImage: `url(${CFG.assets.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-6xl p-4 grid gap-6 md:grid-cols-2 items-start">
        {/* ── Wheel ─────────────────────────────────────────────────────── */}
        <div className="w-full">
          <div className="relative w-full aspect-square rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
            {/* pointer notch */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 h-6 w-2 rounded-b-lg bg-yellow-400 shadow" />
            <canvas
              ref={canvasRef}
              className="block w-full h-full rounded-2xl"
            />
            {/* HUD overlay (toggle with '?') */}
            {hudOpen && (
              <div className="absolute left-2 bottom-2 text-[11px] leading-tight bg-black/60 rounded-md p-2 pointer-events-none">
                <div className="opacity-80 mb-1">
                  Live tune (Shift = big step):
                </div>
                <div>
                  Art Offset: [ / ] = {CFG.master.artOffsetDeg.toFixed(2)}°
                </div>
                <div>
                  Track rx: - / = → {CFG.track.rx.toFixed(3)} | ry: ; / ' →{" "}
                  {CFG.track.ry.toFixed(3)}
                </div>
                <div>Track rot: , / . → {CFG.track.rotDeg.toFixed(2)}°</div>
                <div>
                  Ring offset: ← → / ↑ ↓ → ({CFG.ring.offsetX.toFixed(3)},{" "}
                  {CFG.ring.offsetY.toFixed(3)})
                </div>
                <div>
                  Ring fit: 1/2 X → {CFG.ring.baseFitX.toFixed(3)} • 3/4 Y →{" "}
                  {CFG.ring.baseFitY.toFixed(3)}
                </div>
                <div>
                  Markers: M | Jump: 0 / 8(next) / 9(prev) | Reset: R | Help: ?
                </div>
                <div className="opacity-50 mt-1">tick {hudTick}</div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={spin}
              disabled={isSpinning}
              className={`px-5 py-2 rounded-xl font-bold ${
                isSpinning
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {isSpinning ? "Spinning..." : "SPIN"}
            </button>

            {result && (
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                <span className="px-2 py-1 rounded bg-white/10">
                  <b>Number:</b> {result.num}
                </span>
                <span className="px-2 py-1 rounded bg-white/10">
                  <b>Even/Odd:</b> {result.eo}
                </span>
                <span className="px-2 py-1 rounded bg-white/10">
                  <b>Color:</b>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 rounded ${
                      colorOf(result.num) === "red"
                        ? "bg-red-600"
                        : colorOf(result.num) === "black"
                        ? "bg-zinc-800"
                        : "bg-green-600"
                    }`}
                  >
                    {colorOf(result.num).toUpperCase()}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="w-full">
          <div className="rounded-2xl p-3 bg-black/50 border border-white/10 shadow-xl">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <div className="row-span-2 flex items-center justify-center">
                <div
                  className={`w-full aspect-[1/2] rounded-lg flex items-center justify-center font-extrabold text-xl ${
                    result?.num === 0 ? "ring-4 ring-yellow-400" : ""
                  }`}
                  style={{ background: "#0a8f3a" }}
                >
                  0
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {tableCols.map((col, cIdx) => (
                  <div key={cIdx} className="grid grid-rows-12 gap-1">
                    {col.map((n) => {
                      const colr = colorOf(n);
                      const active = result?.num === n;
                      const bg = colr === "red" ? "bg-red-600" : "bg-zinc-800";
                      return (
                        <div
                          key={n}
                          className={`rounded-lg flex items-center justify-center font-bold h-10 ${bg} ${
                            active ? "ring-4 ring-yellow-400 scale-[1.03]" : ""
                          } transition`}
                        >
                          {n}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 text-xs opacity-80 space-y-1">
              <div>
                Master: <code>CFG.master.scale</code>,{" "}
                <code>CFG.master.artOffsetDeg</code>,{" "}
                <code>CFG.master.topAtDeg</code>
              </div>
              <div>
                Ring:{" "}
                <code>
                  CFG.ring.baseFitX/baseFitY/scaleX/scaleY/rotDeg/offsetX/offsetY
                </code>
              </div>
              <div>
                Center:{" "}
                <code>
                  CFG.center.base/scaleX/scaleY/rotDeg/offsetX/offsetY/idleMs/spinTurns/spinMs
                </code>
              </div>
              <div>
                Ball: <code>CFG.ball.base/scaleX/scaleY</code> • Track:{" "}
                <code>CFG.track.rx/ry/rotDeg/angleOffsetDeg</code>
              </div>
              <div>
                Spin: <code>CFG.spin.lapsMin/lapsMax/ms</code> • Debug:{" "}
                <code>CFG.debug.show</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
