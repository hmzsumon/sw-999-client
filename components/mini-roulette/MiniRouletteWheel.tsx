"use client";

import { useEffect, useRef, useState } from "react";
type CJS = any;

/* ── Euro wheel order ─────────────────────────────────────────────────── */
const EURO_WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const N = EURO_WHEEL_ORDER.length;
const STEP = 360 / N;

/* ── Assets & basic config ────────────────────────────────────────────── */
const ASSETS = {
  bg: "/images/mini-roulette/backimage.jpg",
  outer: "/images/roulette/roulette_1.png",
  ring: "/images/roulette/roulette_2.png",
  wood: "/images/roulette/roulette_3.png",
  ball: "/images/mini-roulette/ball.png",
};
const MASTER = {
  artOffsetDeg: 0, // 0 পকেট টপে না মিললে ±2–5° টিউন করুন
  topAtDeg: 0, // pointer দিক; টপ=0°
};

const REDS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);
const colorOf = (n: number) =>
  n === 0 ? "green" : REDS.has(n) ? "red" : "black";
const evenOdd = (n: number) => (n === 0 ? "-" : n % 2 === 0 ? "Even" : "Odd");

const pocketCenterDeg = (num: number) => {
  const i = EURO_WHEEL_ORDER.indexOf(num);
  return i * STEP + STEP / 2 - MASTER.artOffsetDeg; // deg cw from top
};
const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

/* ── Component ────────────────────────────────────────────────────────── */
export default function RouletteCssBall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const [cjs, setCjs] = useState<CJS | null>(null);

  // CSS-ball DOM refs
  const orbitScaleRef = useRef<HTMLDivElement | null>(null); // scaleY(sy)
  const orbitRotRef = useRef<HTMLDivElement | null>(null); // rotate(angle)
  const ballImgRef = useRef<HTMLImageElement | null>(null); // translateX(r)

  // geometry for CSS vars
  const geoRef = useRef({
    box: 0,
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
    sy: 1,
    invSy: 1,
    ballSize: 20,
  });

  // result UI
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{
    num: number;
    color: string;
    eo: string;
  } | null>(null);

  // keep last angle for smooth next spin
  const lastAngleRef = useRef<number>(pocketCenterDeg(0));

  /* Load CreateJS once */
  useEffect(() => {
    import("createjs-module").then((m) =>
      setCjs((m as any).default || (m as any))
    );
  }, []);

  /* Draw outer/wood/ring on canvas (ball will be DOM) */
  useEffect(() => {
    if (!cjs || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const stage = new cjs.Stage(canvas);
    stageRef.current = stage;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.parentElement!.getBoundingClientRect();
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      stage.scaleX = stage.scaleY = dpr;

      // geometry for CSS-ball
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const box = Math.min(W, H * 0.9);
      const R = box / 2;
      const rx = R * 0.58; // আপনার ট্র্যাক ফিট
      const ry = R * 0.535; // আপনার ট্র্যাক ফিট
      const sy = ry / rx;
      const invSy = 1 / sy;

      geoRef.current.box = box;
      geoRef.current.cx = W / 2;
      geoRef.current.cy = H / 2;
      geoRef.current.rx = rx;
      geoRef.current.ry = ry;
      geoRef.current.sy = sy;
      geoRef.current.invSy = invSy;
      geoRef.current.ballSize = Math.max(12, Math.round(box * 0.04)); // px

      // apply CSS vars / transforms
      applyCssBallTransforms(lastAngleRef.current);
      stage.update();
    };

    cjs.Ticker.framerate = 60;
    cjs.Ticker.on("tick", stage);
    window.addEventListener("resize", resize);

    Promise.all([
      loadImage(ASSETS.outer),
      loadImage(ASSETS.wood),
      loadImage(ASSETS.ring),
    ]).then(([outerImg, woodImg, ringImg]) => {
      const outer = new cjs.Bitmap(outerImg);
      const wood = new cjs.Bitmap(woodImg);
      const ring = new cjs.Bitmap(ringImg);
      for (const [b, i] of [
        [outer, outerImg],
        [wood, woodImg],
        [ring, ringImg],
      ] as const) {
        b.regX = (i.naturalWidth || i.width || 1) / 2;
        b.regY = (i.naturalHeight || i.height || 1) / 2;
      }
      stage.addChild(wood, ring, outer);

      const base = (img: HTMLImageElement, box: number) =>
        box /
        Math.max(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height
        );

      // first resize computes box
      resize();

      const sOuter = base(outerImg, geoRef.current.box) * 0.97;
      const sWood = base(woodImg, geoRef.current.box) * 0.5;
      const sRing = base(ringImg, geoRef.current.box) * 0.76;

      outer.x = geoRef.current.cx;
      outer.y = geoRef.current.cy;
      outer.scaleX = outer.scaleY = sOuter;
      wood.x = geoRef.current.cx;
      wood.y = geoRef.current.cy;
      wood.scaleX = wood.scaleY = sWood;
      ring.x = geoRef.current.cx;
      ring.y = geoRef.current.cy;
      ring.scaleX = ring.scaleY = sRing;

      stage.update();
    });

    return () => {
      window.removeEventListener("resize", resize);
      cjs.Ticker.off("tick", stage);
      stage.removeAllChildren();
      stageRef.current = null;
    };
  }, [cjs]);

  /* Apply CSS transforms to the DOM ball */
  function applyCssBallTransforms(angleDeg: number, radiusScale = 1) {
    const scale = orbitScaleRef.current;
    const rot = orbitRotRef.current;
    const ball = ballImgRef.current;
    if (!scale || !rot || !ball) return;

    const { rx, sy, invSy, ballSize } = geoRef.current;

    // size
    ball.style.width = `${ballSize}px`;
    ball.style.height = "auto";

    // outer scale makes ellipse; inner inverse cancels squash on the bitmap
    scale.style.transform = `translate(-50%, -50%) scaleY(${sy})`;
    // rotate so 0deg = top (−90)
    rot.style.transform = `rotate(${angleDeg + MASTER.topAtDeg - 90}deg)`;
    // translate along X by radius; inverse scaleY keeps ball round
    ball.style.transform = `translateX(${rx * radiusScale}px) scaleY(${invSy})`;
  }

  /* Spin: CSS transitions + small radius wobble */
  const onSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // pick a winner
    const winIdx = Math.floor(Math.random() * N);
    const winNum = EURO_WHEEL_ORDER[winIdx];
    const pocketA = pocketCenterDeg(winNum);
    const startA = lastAngleRef.current;
    const laps = 5 + Math.floor(Math.random() * 3);
    const finalA = startA - 360 * (laps + 1) + (pocketA - startA);

    const rot = orbitRotRef.current!;
    const ball = ballImgRef.current!;
    // total duration
    const t1 = 1400,
      t2 = 1400,
      t3 = 1800; // ~= 4.6s

    // phase 1: spin fast, radius a bit smaller
    rot.style.transition = `transform ${t1}ms cubic-bezier(.3,.8,.2,1)`;
    ball.style.transition = `transform ${t1}ms ease-out`;
    applyCssBallTransforms(startA - 360 * 3, 0.94);

    setTimeout(() => {
      // phase 2: keep spinning, radius slightly larger
      rot.style.transition = `transform ${t2}ms ease-in-out`;
      ball.style.transition = `transform ${t2}ms ease-in-out`;
      applyCssBallTransforms(startA - 360 * 5, 1.02);
    }, t1);

    setTimeout(() => {
      // phase 3: ease to final pocket angle, radius back to 1.0
      rot.style.transition = `transform ${t3}ms cubic-bezier(.1,.9,.2,1)`;
      ball.style.transition = `transform ${t3}ms ease-out`;
      applyCssBallTransforms(finalA, 1.0);
    }, t1 + t2);

    setTimeout(() => {
      lastAngleRef.current = pocketA;
      setResult({ num: winNum, color: colorOf(winNum), eo: evenOdd(winNum) });
      setIsSpinning(false);
    }, t1 + t2 + t3);
  };

  /* First mount → put ball at 0-pocket */
  useEffect(() => {
    // wait a microtask for refs
    const id = requestAnimationFrame(() => {
      applyCssBallTransforms(pocketCenterDeg(0), 1.0);
      lastAngleRef.current = pocketCenterDeg(0);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="min-h-[100dvh] w-full text-white"
      style={{
        backgroundImage: `url(${ASSETS.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto p-4" style={{ width: "min(92vw, 700px)" }}>
        {/* Wheel card */}
        <div
          className="relative w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg overflow-hidden"
          style={{ aspectRatio: "1 / 1", minHeight: 360 }}
        >
          {/* pointer notch */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 h-6 w-2 rounded-b-lg bg-yellow-400 shadow" />

          {/* Canvas (outer/wood/ring only) */}
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* CSS Ball overlay (centered) */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2"
              ref={orbitScaleRef}
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <div ref={orbitRotRef} style={{ transformOrigin: "center" }}>
                <img
                  ref={ballImgRef}
                  src={ASSETS.ball}
                  alt="ball"
                  draggable={false}
                  style={{ display: "block", transformOrigin: "center left" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls + Result */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onSpin}
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
                    result.color === "red"
                      ? "bg-red-600"
                      : result.color === "black"
                      ? "bg-zinc-800"
                      : "bg-green-600"
                  }`}
                >
                  {result.color.toUpperCase()}
                </span>
              </span>
            </div>
          )}
        </div>

        <p className="mt-2 text-xs opacity-75">
          ০ পকেট টপে ঠিক বসাতে <code>MASTER.artOffsetDeg</code> ±2–5° টিউন করুন।
        </p>
      </div>
    </div>
  );
}
