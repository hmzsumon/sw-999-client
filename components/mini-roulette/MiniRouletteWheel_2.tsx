"use client";

/* ── Imports─────────────────────────────────────────────────────────────── */
import { useEffect, useMemo, useRef, useState } from "react";
type CJS = any;

/* ── Wheel math/config──────────────────────────────────────────────────── */
const EURO_WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const N = EURO_WHEEL_ORDER.length;
const STEP = 360 / N;
const REDS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

/* ── CONFIG (সব ভ্যালু এক জায়গায়)──────────────────────────────────────── */
const CFG = {
  assets: {
    bg: "/images/mini-roulette/backimage.jpg",
    outer: "/images/roulette/roulette_1.png" /* outer rim */,
    ring: "/images/roulette/roulette_2.png" /* number ring */,
    wood: "/images/roulette/roulette_3.png" /* inner wood */,
    ball: "/images/mini-roulette/ball.png",
  },

  /* ── Global ── */
  master: {
    scale: 1.0,
    artOffsetDeg: 0 /* ০ পকেট pointer-এ না মিললে ± টিউন */,
    topAtDeg: 0 /* pointer কোন দিকে? top = 0° */,
  },

  /* ── Layers ── */
  outer: {
    baseFitX: 0.97,
    baseFitY: 0.97,
    scaleX: 1.0,
    scaleY: 1.0,
    rotDeg: 0,
    offsetX: 0,
    offsetY: 0,
  },
  ring: {
    baseFitX: 0.76,
    baseFitY: 0.76,
    scaleX: 1.0,
    scaleY: 1.0,
    rotDeg: 0,
    offsetX: 0,
    offsetY: 0,
  },
  wood: {
    baseFitX: 0.5,
    baseFitY: 0.5,
    scaleX: 1.0,
    scaleY: 1.0,
    rotDeg: 0,
    offsetX: 0,
    offsetY: 0,
  },

  /* ── Ball size ── */
  ball: { base: 0.04, scaleX: 1.0, scaleY: 1.0 },

  /* ── Track (inner ellipse; বল সবসময় এখানেই) ── */
  track: {
    innerRx: 0.58 /* horizontal radius (R ratio) */,
    innerRy: 0.535 /* vertical radius (R ratio)   */,
    rotDeg: 0,
    angleOffsetDeg: 0 /* angular offset */,
  },

  /* ── Behaviour ── */
  ballMode: { staticAtZero: true } /* ← বল ০ তে স্থির */,

  /* ── Debug ── */
  debug: { show: false, innerColor: "#ffd54f" },
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
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
function pocketCenterDeg(num: number) {
  const i = EURO_WHEEL_ORDER.indexOf(num);
  return i * STEP + STEP / 2 - CFG.master.artOffsetDeg;
}

/* ── Component──────────────────────────────────────────────────────────── */
export default function MiniRouletteWheel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);

  const [cjs, setCjs] = useState<CJS | null>(null);
  const [ready, setReady] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{
    num: number;
    color: string;
    eo: string;
  } | null>(null);

  const [hudOpen, setHudOpen] = useState(true);
  const [hudTick, setHudTick] = useState(0); // HUD রিফ্রেশ কাউন্টার

  useEffect(() => {
    import("createjs-module").then((m) =>
      setCjs((m as any).default || (m as any))
    );
  }, []);

  useEffect(() => {
    if (!cjs || !canvasRef.current || ready) return;
    setReady(true);

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

    Promise.all([
      loadImage(CFG.assets.outer),
      loadImage(CFG.assets.wood),
      loadImage(CFG.assets.ring),
      loadImage(CFG.assets.ball),
    ])
      .then(([outerImg, woodImg, ringImg, ballImg]) => {
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

        const outerBmp = new cjs.Bitmap(outerImg);
        const woodBmp = new cjs.Bitmap(woodImg);
        const ringBmp = new cjs.Bitmap(ringImg);
        const ballBmp = new cjs.Bitmap(ballImg);

        for (const [bmp, img] of [
          [outerBmp, outerImg],
          [woodBmp, woodImg],
          [ringBmp, ringImg],
          [ballBmp, ballImg],
        ] as const) {
          bmp.regX = (img.naturalWidth || img.width) / 2;
          bmp.regY = (img.naturalHeight || img.height) / 2;
        }

        /* ── Apply transforms ── */
        function applyLayer(bmp: any, img: HTMLImageElement, L: any) {
          const b = baseScale(img) * CFG.master.scale;
          bmp.x = cx + R * L.offsetX;
          bmp.y = cy + R * L.offsetY;
          bmp.scaleX = b * L.baseFitX * (L.scaleX ?? 1);
          bmp.scaleY = b * L.baseFitY * (L.scaleY ?? 1);
          bmp.rotation = L.rotDeg ?? 0;
        }
        function applyBallSize() {
          const b = baseScale(ballImg) * CFG.master.scale;
          ballBmp.scaleX = b * CFG.ball.base * CFG.ball.scaleX;
          ballBmp.scaleY = b * CFG.ball.base * CFG.ball.scaleY;
        }
        function placeBallAtAngleInner(angleDeg: number) {
          const rad =
            ((angleDeg + CFG.track.angleOffsetDeg + CFG.master.topAtDeg - 90) *
              Math.PI) /
            180;
          const phi = (CFG.track.rotDeg * Math.PI) / 180;
          const rx = R * CFG.track.innerRx,
            ry = R * CFG.track.innerRy;
          const x = rx * Math.cos(rad),
            y = ry * Math.sin(rad);
          const xr = x * Math.cos(phi) - y * Math.sin(phi);
          const yr = x * Math.sin(phi) + y * Math.cos(phi);
          ballBmp.x = cx + R * CFG.ring.offsetX + xr;
          ballBmp.y = cy + R * CFG.ring.offsetY + yr;
        }
        (stage as any).__placeBallAtAngleInner = placeBallAtAngleInner;

        function refresh(angleDeg: number) {
          applyLayer(woodBmp, woodImg, CFG.wood);
          applyLayer(ringBmp, ringImg, CFG.ring);
          applyLayer(outerBmp, outerImg, CFG.outer);
          applyBallSize();
          placeBallAtAngleInner(angleDeg);
          stage.update();
        }
        (stage as any).__refresh = refresh;

        stage.addChild(woodBmp, ringBmp, outerBmp, ballBmp);

        // ── Initial: বল ০ পকেটের টপে
        const a0 = pocketCenterDeg(0);
        refresh(a0);

        /* ── KEYBOARD LIVE-TUNE ─────────────────────────────────────────── */
        const onKey = (e: KeyboardEvent) => {
          let changed = false;
          const dDeg = e.shiftKey ? 1.0 : 0.5;
          const dFit = e.shiftKey ? 0.01 : 0.005;
          const dOff = e.shiftKey ? 0.01 : 0.002;

          switch (e.key) {
            case "[":
              CFG.master.artOffsetDeg -= dDeg;
              changed = true;
              break;
            case "]":
              CFG.master.artOffsetDeg += dDeg;
              changed = true;
              break;

            case "-":
              CFG.track.innerRx = Math.max(0.4, CFG.track.innerRx - dFit);
              changed = true;
              break;
            case "=":
              CFG.track.innerRx = Math.min(1.2, CFG.track.innerRx + dFit);
              changed = true;
              break;

            case ";":
              CFG.track.innerRy = Math.max(0.4, CFG.track.innerRy - dFit);
              changed = true;
              break;
            case "'":
              CFG.track.innerRy = Math.min(1.2, CFG.track.innerRy + dFit);
              changed = true;
              break;

            case ",":
              CFG.track.rotDeg -= dDeg;
              changed = true;
              break;
            case ".":
              CFG.track.rotDeg += dDeg;
              changed = true;
              break;

            case "ArrowLeft":
              CFG.ring.offsetX -= dOff;
              changed = true;
              break;
            case "ArrowRight":
              CFG.ring.offsetX += dOff;
              changed = true;
              break;
            case "ArrowUp":
              CFG.ring.offsetY -= dOff;
              changed = true;
              break;
            case "ArrowDown":
              CFG.ring.offsetY += dOff;
              changed = true;
              break;

            case "r":
            case "R":
              CFG.master.artOffsetDeg = 0;
              CFG.ring.baseFitX = 0.76;
              CFG.ring.baseFitY = 0.76;
              CFG.ring.offsetX = 0;
              CFG.ring.offsetY = 0;
              CFG.ring.rotDeg = 0;
              CFG.track.innerRx = 0.58;
              CFG.track.innerRy = 0.535;
              CFG.track.rotDeg = 0;
              CFG.track.angleOffsetDeg = 0;
              changed = true;
              break;

            case "?": // some keyboards report Shift+/ as '?', but we'll just toggle on Shift+/
              break;
          }
          if (e.key === "/" && e.shiftKey) {
            setHudOpen((v) => !v);
          }

          if (changed) {
            (stage as any).__refresh(pocketCenterDeg(0)); // সবসময় ০ তে রিফ্রেশ
            setHudTick((t) => t + 1);
          }
        };
        window.addEventListener("keydown", onKey);

        /* ── Cleanup ── */
        return () => {
          window.removeEventListener("resize", resize);
          window.removeEventListener("keydown", onKey);
          cjs.Ticker.off("tick", stage);
          stage.removeAllChildren();
          stageRef.current = null;
        };
      })
      .catch((err) => console.error("Image load failed:", err));
  }, [cjs, ready]);

  /* ── Spin: result only (বল নড়ে না) ─────────────────────────────────── */
  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const winIdx = Math.floor(Math.random() * N);
    const winNum = EURO_WHEEL_ORDER[winIdx];
    setResult({ num: winNum, color: colorOf(winNum), eo: evenOdd(winNum) });
    setIsSpinning(false);
  };

  /* ── Table ── */
  const tableCols = useMemo(() => {
    const col1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
      col2 = col1.map((n) => n + 1),
      col3 = col1.map((n) => n + 2);
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
        {/* Wheel */}
        <div className="w-full">
          <div className="relative w-full aspect-square rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 h-6 w-2 rounded-b-lg bg-yellow-400 shadow" />
            <canvas
              ref={canvasRef}
              className="block w-full h-full rounded-2xl"
            />

            {/* HUD (toggle: Shift + /) */}
            {hudOpen && (
              <div className="absolute left-2 bottom-2 text-[11px] leading-tight bg-black/60 rounded-md p-2 pointer-events-none">
                <div className="opacity-80 mb-1">
                  Live tune (Shift = big step)
                </div>
                <div>
                  Art Offset: [ / ] → {CFG.master.artOffsetDeg.toFixed(2)}°
                </div>
                <div>
                  Inner rx: - / = → {CFG.track.innerRx.toFixed(3)} | ry: ; / ' →{" "}
                  {CFG.track.innerRy.toFixed(3)}
                </div>
                <div>Track rot: , / . → {CFG.track.rotDeg.toFixed(2)}°</div>
                <div>
                  Ring offset: ← → / ↑ ↓ → ({CFG.ring.offsetX.toFixed(3)},{" "}
                  {CFG.ring.offsetY.toFixed(3)})
                </div>
                <div>Reset: R • HUD: Shift+/ (?)</div>
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

        {/* Table */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
