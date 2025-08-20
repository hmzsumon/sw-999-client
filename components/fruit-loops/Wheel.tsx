"use client";
import {
  setFruitLoopsResults,
  setWinKey,
  stopSpinning,
} from "@/redux/features/fruit-loops/fruitLoopsSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

type Segment = { angle: number; result: string };
type RootState = any;

// ── Config: সেগমেন্ট/কোণ/পয়েন্টার/ক্যালিব্রেশন ───────────────────────────────
const SEGMENTS: Segment[] = [
  { angle: 0, result: "Apple" },
  { angle: 60, result: "Watermelon" },
  { angle: 120, result: "Mango" },
  { angle: 180, result: "Apple" },
  { angle: 240, result: "Watermelon" },
  { angle: 300, result: "Mango" },
];
const STEP = 360 / SEGMENTS.length; // 60°
const POINTER_ANGLE = 0; // পিন টপে পয়েন্ট করছে
const ASSET_OFFSET = -60; // আর্টওয়ার্ক অনুযায়ী ক্যালিব্রেশন
const EPS = 0.001; // ডিভাইডারের উপর থামা এড়াতে ক্ষুদ্র জিটার

// ── Wobble tuning (শেষে হালকা ডানে–বামে দোল) ───────────────────────────────
const WOBBLE_1 = 12; // প্রথম ওভারশুট (ডান)
const WOBBLE_2 = 8; // ফিরে আসা (বাম)
const WOBBLE_3 = 5; // ছোট ওভারশুট (ডান)
const WOBBLE_4 = 3; // ছোট ফিরে (বাম)
const WOBBLE_STEP = 250; // ms—প্রতি ছোট টুইন

// মেইন স্পিন টাইম রেঞ্জ (8–13s)-> Math.random()*5000 + 8000
const MIN_SPIN_MS = 8000;
const EXTRA_SPIN_MS = 5000;
const EXTRA_ROUNDS = 10; // 10 রাউন্ড

const norm360 = (v: number) => ((v % 360) + 360) % 360;

const Wheel = () => {
  const dispatch = useDispatch();
  const { isSpinning } = useSelector((state: RootState) => state.fruitLoops);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<any>(null);
  const wheelRef = useRef<any>(null); // createjs.Bitmap
  const createjsRef = useRef<any>(null); // dynamic import module

  const [result, setResult] = useState<string | null>(null);

  // ── Stage + Wheel setup (CreateJS) ─────────────────────────────────────────
  useEffect(() => {
    let cleanupTicker: (() => void) | null = null;
    let destroyed = false;

    const init = async () => {
      // dynamic import — শুধুমাত্র ব্রাউজারে লোড হবে
      const mod: any = await import("createjs-module");
      const createjs = mod?.default ?? mod;
      createjsRef.current = createjs;

      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const stage = new createjs.Stage(canvas);
      stageRef.current = stage;

      const img = new Image();
      img.src = "/images/fruit-loops/wheel_1.png";
      img.onload = () => {
        if (destroyed) return;

        const bmp = new createjs.Bitmap(img);

        // pivot center
        bmp.regX = img.width / 2;
        bmp.regY = img.height / 2;

        // scale to fit canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        bmp.scaleX = scale;
        bmp.scaleY = scale;

        // center of canvas
        bmp.x = canvas.width / 2;
        bmp.y = canvas.height / 2;

        // initial rotation
        bmp.rotation = 0;

        wheelRef.current = bmp;
        stage.addChild(bmp);
        stage.update();
      };

      // Ticker (60fps)
      createjs.Ticker.framerate = 60;
      const tick = () => stage.update();
      createjs.Ticker.addEventListener("tick", tick);

      cleanupTicker = () => {
        createjs.Ticker.removeEventListener("tick", tick);
      };
    };

    init();

    return () => {
      destroyed = true;
      if (cleanupTicker) cleanupTicker();
      if (stageRef.current) {
        stageRef.current.removeAllChildren();
        stageRef.current.update();
      }
      stageRef.current = null;
      wheelRef.current = null;
    };
  }, []);

  // ── Spin trigger (Redux isSpinning) ────────────────────────────────────────
  useEffect(() => {
    if (!isSpinning) return;
    if (!wheelRef.current || !createjsRef.current) return; // ইমেজ/লাইব্রেরি লোড না হওয়া পর্যন্ত অপেক্ষা

    const createjs = createjsRef.current;
    setResult(null);

    const spinTime = Math.floor(Math.random() * EXTRA_SPIN_MS) + MIN_SPIN_MS; // 8–13s
    const pick = SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];

    // বর্তমান রোটেশন সরাসরি Bitmap থেকে নিন
    const currentRotation = norm360(wheelRef.current.rotation);

    // সেগমেন্টের সেন্টার অ্যাঙ্গেল (অফসেটসহ)
    // pick.angle + ASSET_OFFSET: আপনার আর্টকে pointer এর সাথে ক্যালিব্রেট করা
    const target = norm360(pick.angle + ASSET_OFFSET);

    // pointer উপরের দিকে => final % 360 === POINTER_ANGLE - target
    const neededRaw = norm360(POINTER_ANGLE - target - currentRotation);
    const needed = neededRaw === 0 ? EPS : neededRaw;

    const total = wheelRef.current.rotation + EXTRA_ROUNDS * 360 + needed;

    // প্রধান স্পিন + শেষে হালকা wobble
    createjs.Tween.get(wheelRef.current, { override: true })
      .to({ rotation: total }, spinTime, createjs.Ease.quadOut) // মূল স্পিন
      .to({ rotation: total + WOBBLE_1 }, WOBBLE_STEP, createjs.Ease.quadOut) // ডানে
      .to({ rotation: total - WOBBLE_2 }, WOBBLE_STEP, createjs.Ease.quadInOut) // বামে
      .to({ rotation: total + WOBBLE_3 }, WOBBLE_STEP, createjs.Ease.quadInOut) // ছোট ডানে
      .to({ rotation: total - WOBBLE_4 }, WOBBLE_STEP, createjs.Ease.quadInOut) // ছোট বামে
      .to({ rotation: total }, WOBBLE_STEP, createjs.Ease.quadOut) // স্যাটেল
      .call(() => {
        // রেজাল্ট ফায়ার
        dispatch(setWinKey(uuidv4()));
        setResult(`You got: ${pick.result}`);
        dispatch(setFruitLoopsResults([pick.result]));

        // রোটেশন নরমালাইজ
        if (wheelRef.current) {
          wheelRef.current.rotation = norm360(wheelRef.current.rotation);
        }
        dispatch(stopSpinning());
      });
  }, [isSpinning, dispatch]);

  return (
    <div className="flex flex-col items-center w-full mx-auto justify-center ">
      <div className="relative w-64 h-64">
        {/* Title (static) — আপনার ক্লাস/পজিশন অপরিবর্তিত */}
        <div className="absolute z-40 top-0">
          <img
            src="/images/fruit-loops/title_5.png"
            alt="Spinning Wheel"
            className="w-full h-full rotate-[360deg] pointer-events-none"
          />
        </div>

        {/* Wheel (CreateJS Canvas) — আপনার লেআউট ক্লাস অপরিবর্তিত */}
        <div className="absolute -top-[30%]">
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className="w-full h-full"
          />
        </div>

        {/* Pointer (static) — আপনার পজিশন অপরিবর্তিত */}
        <img
          src="/images/fruit-loops/arrow.png"
          alt="arrow"
          className="absolute top-[13%] left-[43%] w-10"
        />
      </div>

      {/* Optional: ডিবাগ */}
      {/* <p className="mt-2 text-sm text-white/80">{result ?? " "}</p> */}
    </div>
  );
};

export default Wheel;
