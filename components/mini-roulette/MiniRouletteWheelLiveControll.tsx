"use client";

/* ── Imports─────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
type CJS = any;

/* ── Wheel math/config──────────────────────────────────────────────────── */
const EURO_WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const N = EURO_WHEEL_ORDER.length;
const STEP = 360 / N;

/* ── Initial CFG (ইমেজ পথ + ডিফল্ট ভ্যালু)────────────────────────────── */
const CFG = {
  assets: {
    bg: "/images/mini-roulette/backimage.jpg",
    outer: "/images/roulette/roulette_1.png",
    ring: "/images/roulette/roulette_2.png",
    wood: "/images/roulette/roulette_3.png",
    ball: "/images/mini-roulette/ball.png",
  },
  master: { scale: 1.0, artOffsetDeg: 0, topAtDeg: 0 },
  outer: { baseFitX: 0.97, baseFitY: 0.97, rotDeg: 0, offsetX: 0, offsetY: 0 },
  ring: { baseFitX: 0.76, baseFitY: 0.76, rotDeg: 0, offsetX: 0, offsetY: 0 },
  wood: { baseFitX: 0.5, baseFitY: 0.5, rotDeg: 0, offsetX: 0, offsetY: 0 },
  ball: { sizeBase: 0.04 }, // bitmap size scale (U/J)
  track: { rx: 0.58, ry: 0.535, rotDeg: 0, angleOffsetDeg: 0 }, // orbit
};

/* ── Utils──────────────────────────────────────────────────────────────── */
const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

const norm360 = (a: number) => {
  const x = a % 360;
  return x < 0 ? x + 360 : x;
};
const pocketCenterDeg = (num: number) => {
  const i = EURO_WHEEL_ORDER.indexOf(num);
  return i * STEP + STEP / 2 - CFG.master.artOffsetDeg;
};

/* ── Component──────────────────────────────────────────────────────────── */
export default function RouletteLiveControlsAll() {
  /* ── Stage refs ── */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const [cjs, setCjs] = useState<CJS | null>(null);

  /* ── Bitmaps ── */
  const bmp = useRef<{ outer?: any; ring?: any; wood?: any; ball?: any }>({});

  /* ── Geometry cache (for redraw) ── */
  const geo = useRef({ cx: 0, cy: 0, R: 0, box: 0, dpr: 1 });

  /* ── Active target & HUD ── */
  type Target = "outer" | "ring" | "wood" | "ball";
  const [active, setActive] = useState<Target>("ball");
  const [hudOpen, setHudOpen] = useState(true);
  const [hudTick, setHudTick] = useState(0);

  /* ── Layer states (live) ── */
  const layersRef = useRef({
    outer: {
      baseFitX: CFG.outer.baseFitX,
      baseFitY: CFG.outer.baseFitY,
      rotDeg: CFG.outer.rotDeg,
      offsetX: CFG.outer.offsetX,
      offsetY: CFG.outer.offsetY,
      nudgeXpx: 0,
      nudgeYpx: 0,
    },
    ring: {
      baseFitX: CFG.ring.baseFitX,
      baseFitY: CFG.ring.baseFitY,
      rotDeg: CFG.ring.rotDeg,
      offsetX: CFG.ring.offsetX,
      offsetY: CFG.ring.offsetY,
      nudgeXpx: 0,
      nudgeYpx: 0,
    },
    wood: {
      baseFitX: CFG.wood.baseFitX,
      baseFitY: CFG.wood.baseFitY,
      rotDeg: CFG.wood.rotDeg,
      offsetX: CFG.wood.offsetX,
      offsetY: CFG.wood.offsetY,
      nudgeXpx: 0,
      nudgeYpx: 0,
    },
  });

  /* ── Ball state (live) ── */
  const ballRef = useRef({
    angleDeg: pocketCenterDeg(0), // orbit angle (A/D)
    radiusScale: 1.0, // W/S
    rx: CFG.track.rx, // [ ]
    ry: CFG.track.ry, // ; '
    rotDeg: CFG.track.rotDeg, // , .
    nudgeXpx: 0, // ← →
    nudgeYpx: 0, // ↑ ↓
    sizeBase: CFG.ball.sizeBase, // U/J
  });

  /* ── import CreateJS ── */
  useEffect(() => {
    import("createjs-module").then((m) =>
      setCjs((m as any).default || (m as any))
    );
  }, []);

  /* ── init stage ── */
  useEffect(() => {
    if (!cjs || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const stage = new cjs.Stage(canvas);
    stageRef.current = stage;

    /* ── Resize (Hi-DPI)────────────────────────────────────────────────── */
    const dpr = (geo.current.dpr = window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      stage.scaleX = stage.scaleY = dpr;

      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const box = (geo.current.box = Math.min(W, H * 0.9));
      geo.current.R = box / 2;
      geo.current.cx = W / 2;
      geo.current.cy = H / 2;

      redraw(); // after resize
    };
    cjs.Ticker.framerate = 60;
    cjs.Ticker.on("tick", stage);
    window.addEventListener("resize", resize);

    /* ── Load assets ── */
    Promise.all([
      loadImage(CFG.assets.outer),
      loadImage(CFG.assets.wood),
      loadImage(CFG.assets.ring),
      loadImage(CFG.assets.ball),
    ])
      .then(([outerImg, woodImg, ringImg, ballImg]) => {
        const outer = (bmp.current.outer = new cjs.Bitmap(outerImg));
        const wood = (bmp.current.wood = new cjs.Bitmap(woodImg));
        const ring = (bmp.current.ring = new cjs.Bitmap(ringImg));
        const ball = (bmp.current.ball = new cjs.Bitmap(ballImg));

        // centers
        for (const [b, i] of [
          [outer, outerImg],
          [wood, woodImg],
          [ring, ringImg],
          [ball, ballImg],
        ] as const) {
          b.regX = (i.naturalWidth || i.width) / 2;
          b.regY = (i.naturalHeight || i.height) / 2;
        }

        // layer order
        stage.addChild(wood, ring, outer, ball);

        // keep images ref for scaling
        (outer as any).__img = outerImg;
        (wood as any).__img = woodImg;
        (ring as any).__img = ringImg;
        (ball as any).__img = ballImg;

        // initial draw
        resize();
      })
      .catch((err) => console.error("Image load failed:", err));

    return () => {
      window.removeEventListener("resize", resize);
      cjs.Ticker.off("tick", stage);
      stage.removeAllChildren();
      stageRef.current = null;
    };
  }, [cjs]);

  /* ── Helpers to apply transforms ─────────────────────────────────────── */
  function baseScale(img: HTMLImageElement) {
    const box = geo.current.box;
    return (
      box /
      Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height)
    );
  }

  function applyLayer(name: "outer" | "ring" | "wood") {
    const b = (bmp.current as any)[name];
    if (!b) return;
    const img: HTMLImageElement = b.__img;
    const st = (layersRef.current as any)[name];
    const { cx, cy, R } = geo.current;

    const s = baseScale(img) * CFG.master.scale;
    // offset ratio + live nudge px
    const xpx = cx + R * st.offsetX + st.nudgeXpx;
    const ypx = cy + R * st.offsetY + st.nudgeYpx;

    b.x = xpx;
    b.y = ypx;
    b.scaleX = s * st.baseFitX;
    b.scaleY = s * st.baseFitY;
    b.rotation = st.rotDeg;
  }

  function applyBall() {
    const b = bmp.current.ball;
    if (!b) return;
    const img: HTMLImageElement = b.__img;
    const { cx, cy, R } = geo.current;

    // bitmap size
    const bs = baseScale(img) * CFG.master.scale;
    b.scaleX = bs * ballRef.current.sizeBase;
    b.scaleY = bs * ballRef.current.sizeBase;

    // orbit placement (relative to ring center + ring nudge)
    const ringSt = layersRef.current.ring;
    const ang =
      (ballRef.current.angleDeg +
        CFG.master.topAtDeg +
        CFG.track.angleOffsetDeg -
        90) *
      (Math.PI / 180);
    const phi = (ballRef.current.rotDeg * Math.PI) / 180;

    const rx = R * ballRef.current.rx * ballRef.current.radiusScale;
    const ry = R * ballRef.current.ry * ballRef.current.radiusScale;

    const x = rx * Math.cos(ang);
    const y = ry * Math.sin(ang);
    const xr = x * Math.cos(phi) - y * Math.sin(phi);
    const yr = x * Math.sin(phi) + y * Math.cos(phi);

    b.x =
      cx + R * ringSt.offsetX + ringSt.nudgeXpx + xr + ballRef.current.nudgeXpx;
    b.y =
      cy + R * ringSt.offsetY + ringSt.nudgeYpx + yr + ballRef.current.nudgeYpx;
  }

  function redraw() {
    const s = stageRef.current;
    if (!s) return;
    applyLayer("wood");
    applyLayer("ring");
    applyLayer("outer");
    applyBall();
    s.update();
  }

  /* ── Keyboard controls (active target ভিত্তিক) ───────────────────────── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      let changed = false;

      // steps
      const dNudge = e.shiftKey ? 4 : 1; // px
      const dRot = e.shiftKey ? 2.0 : 0.6; // deg
      const dFit = e.shiftKey ? 0.02 : 0.01; // scale (anisotropic)
      const dUni = e.shiftKey ? 0.03 : 0.015; // uniform scale
      const dAng = e.shiftKey ? 3.0 : 1.0; // ball orbit
      const dRad = e.shiftKey ? 0.03 : 0.01; // ball radius scale
      const dSize = e.shiftKey ? 0.01 : 0.005; // ball bitmap size

      // target change
      if (e.key === "Tab") {
        e.preventDefault();
        setActive((t) =>
          t === "outer"
            ? "ring"
            : t === "ring"
            ? "wood"
            : t === "wood"
            ? "ball"
            : "outer"
        );
        setHudTick((t) => t + 1);
        return;
      }
      if (e.key === "1") {
        setActive("outer");
        setHudTick((t) => t + 1);
        return;
      }
      if (e.key === "2") {
        setActive("ring");
        setHudTick((t) => t + 1);
        return;
      }
      if (e.key === "3") {
        setActive("wood");
        setHudTick((t) => t + 1);
        return;
      }
      if (e.key === "4") {
        setActive("ball");
        setHudTick((t) => t + 1);
        return;
      }

      // HUD toggle
      if (e.key === "/" && e.shiftKey) {
        setHudOpen((v) => !v);
        return;
      }

      // RESET
      if (e.key === "R" || e.key === "r") {
        layersRef.current.outer = {
          baseFitX: CFG.outer.baseFitX,
          baseFitY: CFG.outer.baseFitY,
          rotDeg: CFG.outer.rotDeg,
          offsetX: CFG.outer.offsetX,
          offsetY: CFG.outer.offsetY,
          nudgeXpx: 0,
          nudgeYpx: 0,
        };
        layersRef.current.ring = {
          baseFitX: CFG.ring.baseFitX,
          baseFitY: CFG.ring.baseFitY,
          rotDeg: CFG.ring.rotDeg,
          offsetX: CFG.ring.offsetX,
          offsetY: CFG.ring.offsetY,
          nudgeXpx: 0,
          nudgeYpx: 0,
        };
        layersRef.current.wood = {
          baseFitX: CFG.wood.baseFitX,
          baseFitY: CFG.wood.baseFitY,
          rotDeg: CFG.wood.rotDeg,
          offsetX: CFG.wood.offsetX,
          offsetY: CFG.wood.offsetY,
          nudgeXpx: 0,
          nudgeYpx: 0,
        };
        ballRef.current = {
          angleDeg: pocketCenterDeg(0),
          radiusScale: 1.0,
          rx: CFG.track.rx,
          ry: CFG.track.ry,
          rotDeg: CFG.track.rotDeg,
          nudgeXpx: 0,
          nudgeYpx: 0,
          sizeBase: CFG.ball.sizeBase,
        };
        changed = true;
      }

      // current target
      const t = active;

      // shared: arrow keys nudge (px)
      if (e.key === "ArrowLeft") {
        if (t === "ball") ballRef.current.nudgeXpx -= dNudge;
        else layersRef.current[t].nudgeXpx -= dNudge;
        changed = true;
      }
      if (e.key === "ArrowRight") {
        if (t === "ball") ballRef.current.nudgeXpx += dNudge;
        else layersRef.current[t].nudgeXpx += dNudge;
        changed = true;
      }
      if (e.key === "ArrowUp") {
        if (t === "ball") ballRef.current.nudgeYpx -= dNudge;
        else layersRef.current[t].nudgeYpx -= dNudge;
        changed = true;
      }
      if (e.key === "ArrowDown") {
        if (t === "ball") ballRef.current.nudgeYpx += dNudge;
        else layersRef.current[t].nudgeYpx += dNudge;
        changed = true;
      }

      // backspace: reset nudge of current
      if (e.key === "Backspace") {
        if (t === "ball") {
          ballRef.current.nudgeXpx = ballRef.current.nudgeYpx = 0;
        } else {
          layersRef.current[t].nudgeXpx = layersRef.current[t].nudgeYpx = 0;
        }
        changed = true;
      }

      // rotation
      if (e.key === ",") {
        if (t === "ball") ballRef.current.rotDeg -= dRot;
        else layersRef.current[t].rotDeg -= dRot;
        changed = true;
      }
      if (e.key === ".") {
        if (t === "ball") ballRef.current.rotDeg += dRot;
        else layersRef.current[t].rotDeg += dRot;
        changed = true;
      }

      // anisotropic scale (X / Y)
      if (e.key === "[") {
        if (t === "ball")
          ballRef.current.rx = Math.max(0.4, ballRef.current.rx - dFit);
        else
          layersRef.current[t].baseFitX = Math.max(
            0.3,
            layersRef.current[t].baseFitX - dFit
          );
        changed = true;
      }
      if (e.key === "]") {
        if (t === "ball")
          ballRef.current.rx = Math.min(1.2, ballRef.current.rx + dFit);
        else
          layersRef.current[t].baseFitX = Math.min(
            1.3,
            layersRef.current[t].baseFitX + dFit
          );
        changed = true;
      }
      if (e.key === ";") {
        if (t === "ball")
          ballRef.current.ry = Math.max(0.4, ballRef.current.ry - dFit);
        else
          layersRef.current[t].baseFitY = Math.max(
            0.3,
            layersRef.current[t].baseFitY - dFit
          );
        changed = true;
      }
      if (e.key === "'") {
        if (t === "ball")
          ballRef.current.ry = Math.min(1.2, ballRef.current.ry + dFit);
        else
          layersRef.current[t].baseFitY = Math.min(
            1.3,
            layersRef.current[t].baseFitY + dFit
          );
        changed = true;
      }

      // uniform scale
      if (e.key === "w" || e.key === "W") {
        if (t === "ball")
          ballRef.current.radiusScale = Math.max(
            0.5,
            ballRef.current.radiusScale - dRad
          );
        else {
          layersRef.current[t].baseFitX = Math.max(
            0.3,
            layersRef.current[t].baseFitX - dUni
          );
          layersRef.current[t].baseFitY = Math.max(
            0.3,
            layersRef.current[t].baseFitY - dUni
          );
        }
        changed = true;
      }
      if (e.key === "s" || e.key === "S") {
        if (t === "ball")
          ballRef.current.radiusScale = Math.min(
            1.5,
            ballRef.current.radiusScale + dRad
          );
        else {
          layersRef.current[t].baseFitX = Math.min(
            1.3,
            layersRef.current[t].baseFitX + dUni
          );
          layersRef.current[t].baseFitY = Math.min(
            1.3,
            layersRef.current[t].baseFitY + dUni
          );
        }
        changed = true;
      }

      // ball specials: angle + size + snap/jump
      if (t === "ball") {
        if (e.key === "a" || e.key === "A") {
          ballRef.current.angleDeg = norm360(ballRef.current.angleDeg - dAng);
          changed = true;
        }
        if (e.key === "d" || e.key === "D") {
          ballRef.current.angleDeg = norm360(ballRef.current.angleDeg + dAng);
          changed = true;
        }
        if (e.key === "U") {
          ballRef.current.sizeBase = Math.min(
            0.2,
            ballRef.current.sizeBase + dSize
          );
          changed = true;
        }
        if (e.key === "u") {
          ballRef.current.sizeBase = Math.min(
            0.2,
            ballRef.current.sizeBase + dSize
          );
          changed = true;
        }
        if (e.key === "J" || e.key === "j") {
          ballRef.current.sizeBase = Math.max(
            0.01,
            ballRef.current.sizeBase - dSize
          );
          changed = true;
        }

        if (e.key === "0") {
          ballRef.current.angleDeg = pocketCenterDeg(0);
          changed = true;
        }
        if (e.key === "8" || e.key === "9") {
          const cur = ballRef.current.angleDeg;
          let bestIdx = 0,
            best = 1e9;
          for (let i = 0; i < N; i++) {
            const a = pocketCenterDeg(EURO_WHEEL_ORDER[i]);
            const d = Math.min(norm360(a - cur), norm360(cur - a));
            if (d < best) {
              best = d;
              bestIdx = i;
            }
          }
          const step = e.key === "8" ? +1 : -1;
          const idx = (bestIdx + step + N) % N;
          ballRef.current.angleDeg = pocketCenterDeg(EURO_WHEEL_ORDER[idx]);
          changed = true;
        }
      }

      // reset current only
      if (e.key === "Z" || e.key === "z") {
        if (t === "ball") {
          ballRef.current = {
            angleDeg: pocketCenterDeg(0),
            radiusScale: 1.0,
            rx: CFG.track.rx,
            ry: CFG.track.ry,
            rotDeg: CFG.track.rotDeg,
            nudgeXpx: 0,
            nudgeYpx: 0,
            sizeBase: CFG.ball.sizeBase,
          };
        } else {
          const def = (CFG as any)[t];
          layersRef.current[t] = {
            baseFitX: def.baseFitX,
            baseFitY: def.baseFitY,
            rotDeg: def.rotDeg,
            offsetX: def.offsetX,
            offsetY: def.offsetY,
            nudgeXpx: 0,
            nudgeYpx: 0,
          };
        }
        changed = true;
      }

      if (changed) {
        redraw();
        setHudTick((t) => t + 1);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

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
      <div className="mx-auto max-w-3xl p-4">
        <div className="relative w-full aspect-square rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
          {/* pointer notch */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 h-6 w-2 rounded-b-lg bg-yellow-400 shadow" />
          <canvas ref={canvasRef} className="block w-full h-full rounded-2xl" />

          {/* HUD */}
          {hudOpen && (
            <div className="absolute left-2 bottom-2 text-[11px] leading-tight bg-black/65 rounded-md p-2 pointer-events-none">
              <div className="opacity-80 mb-1">
                Live Controls (Shift = big step)
              </div>
              <div>
                Target: <b>{active.toUpperCase()}</b> • Change: 1=outer 2=ring
                3=wood 4=ball • Tab=cycle
              </div>
              <div>← → / ↑ ↓ : Nudge (px) • Backspace reset</div>
              <div>, / . : Rotate • W / S : Uniform scale</div>
              <div>[ / ] : X-scale • ; / ' : Y-scale</div>
              <div>
                Ball only → A/D: angle • U/J: size • 0: snap0 • 8/9: next/prev
              </div>
              <div>Reset current: Z • Reset all: R • HUD: Shift+/ (?)</div>
              <div className="opacity-50 mt-1">tick {hudTick}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
