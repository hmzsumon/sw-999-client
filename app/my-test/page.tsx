"use client";
import BarButton from "@/components/fruit-loops/BarButton";
import BWChip from "@/components/fruit-loops/BWChip";
import ChipBoard from "@/components/fruit-loops/ChipBoard";
import CircleIconButton from "@/components/fruit-loops/CircleIconButton";
import GlassBar from "@/components/fruit-loops/GlassBar";
import GlassFruitBadge from "@/components/fruit-loops/GlassFruitBadge";
import GlassPlateBadge from "@/components/fruit-loops/GlassPlateBadge";
import PokerChip from "@/components/fruit-loops/PokerChip";
import RulesBtn from "@/components/fruit-loops/RulesBtn";
import { Bell, Home, Wallet } from "lucide-react";
import { useState } from "react";
import { BiAlignLeft } from "react-icons/bi";
import { FaPlusCircle, FaReact } from "react-icons/fa";
import { GiWatermelon } from "react-icons/gi";

const Pill: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => (
  <span
    className={[
      "px-4 py-1 rounded-full text-white/95 font-semibold italic text-[14px]",
      "shadow-[inset_0_1px_0_rgba(255,255,255,.45)]",
      className || "",
    ].join(" ")}
  >
    {text}
  </span>
);

const Multiplier: React.FC<{ value?: string }> = ({ value = "X 2.9" }) => (
  <span
    className="px-4 py-[6px] rounded-full text-white font-extrabold text-[14px]
               shadow-[0_6px_10px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.45)]
               bg-[linear-gradient(180deg,#b36cff_0%,#8e39f5_54%,#6a17da_100%)]"
  >
    {value}
  </span>
);
const MyTestPage = () => {
  const amounts = [10, 100, 100_000, 1_000_000];
  const [sel, setSel] = useState<number>(100);
  return (
    <div>
      <h1 className="text-2xl font-bold">My Test Page</h1>
      <p>This is a test page to verify the layout and components.</p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <RulesBtn />
        <RulesBtn size="sm" />
        <RulesBtn
          size="lg"
          onClick={() => console.log("Hello")}
          className="mx-2"
        />

        <RulesBtn
          label="Help"
          colors={{ start: "#66e3ff", mid: "#2aa7ff", end: "#0a6cff" }}
          textColor="#fff"
          ringColor="rgba(255,255,255,.5)"
        />
        {/* // সবুজ টোন + sm সাইজ */}
        <RulesBtn
          size="sm"
          label="Home"
          colors={{ start: "#9cff6a", mid: "#6bdc46", end: "#36b12a" }}
        />
        <RulesBtn
          size="md"
          label="Apple"
          colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
        />
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <CircleIconButton Icon={FaReact} size={48} iconColor="#0ff" />
        <CircleIconButton
          Icon={Bell}
          size={44}
          iconColor="#fff"
          iconStrokeWidth={2.5}
        />
        <CircleIconButton
          Icon={Home}
          size={40}
          iconColor="#fff"
          colors={{ start: "#ffd77a", mid: "#ffb83e", end: "#f39d0a" }}
        />
        <CircleIconButton
          size={52}
          icon={
            <span className="font-extrabold" style={{ fontSize: 28 }}>
              X
            </span>
          }
          colors={{ start: "#962529", mid: "#831015", end: "#be555c" }}
        />
      </div>
      {/* Start GlassFruitBadge */}
      {/* // ১) ইমোজি দিয়ে */}
      <GlassFruitBadge emoji="🥭" size={72} ariaLabel="Mango" />
      {/* // ২) ভিন্ন রঙে (Apple লাল টোন) */}
      <GlassFruitBadge
        emoji="🍎"
        size={72}
        colors={{ start: "#ffb9b9", mid: "#ff7676", end: "#e34a4a" }}
        ariaLabel="Apple"
      />
      {/* // ৩) ওয়াটারমেলন সবুজ টোনে + lucide icon */}
      <GlassFruitBadge
        icon={<BiAlignLeft />}
        iconColor="#ffffff"
        size={72}
        colors={{ start: "#b8ff86", mid: "#7deb5f", end: "#45c93b" }}
        ariaLabel="Watermelon"
      />
      {/* // ৪) ইমেজ থেকে (png/svg) */}
      <GlassFruitBadge
        src="/images/fruit/mango.png"
        size={88}
        colors={{ start: "#bdeef1", mid: "#86d4e6", end: "#5bbad3" }}
        ariaLabel="Mango from image"
      />
      <GlassPlateBadge emoji="🥭" size={76} ariaLabel="Mango plate" />
      <GlassPlateBadge
        emoji="🍎"
        size={76}
        colors={{
          start: "#ffb9b9",
          mid: "#ff7a7a",
          end: "#e04c4c",
          ring: "rgba(255,255,255,.92)",
        }}
      />
      // ওয়াটারমেলন: সবুজ টিন্ট + react-icons
      <GlassPlateBadge
        icon={<GiWatermelon />}
        iconColor="#ffffff"
        size={80}
        colors={{ start: "#c9ffad", mid: "#93ef7e", end: "#58cc4d" }}
      />
      // ইমেজ থেকে
      <GlassPlateBadge src="/images/fruit/mango.png" size={90} />
      {/* End GlassFruitBadge */}
      <div>
        {/* // Basic (ফুল-উইডথ) */}
        <BarButton label="Deposit" />

        {/* // কাস্টম রঙ/সাইজ + react-icons */}

        <BarButton
          size="lg"
          label="Deposit"
          Icon={FaPlusCircle}
          colors={{ start: "#0f3f45", mid: "#0b3138", end: "#05242a" }}
          textColor="#ffd23a"
          iconColor="#ffd23a"
        />

        <div className="flex items-center justify-center gap-4 m-4">
          <BarButton
            size="lg"
            label="Deposit"
            Icon={FaPlusCircle}
            colors={{ start: "#482700", mid: "#3B1F00", end: "#432400" }}
            textColor="#ffd23a"
            iconColor="#ffd23a"
          />
        </div>

        {/* // কাস্টম রঙ + টেইলউইন্ড ring override */}
        <BarButton
          size="md"
          label="Add Funds"
          Icon={Wallet}
          iconColor="#ffe07a"
          ringColor="rgba(0,145,100,.18)"
        />

        {/* // ফিক্সড-উইডথ (fullWidth=false) */}
        <BarButton fullWidth={false} label="Withdraw" />
      </div>
      {/* Start Chip  */}
      <div className="bg-white">
        {/* // বেসিক (ডিফল্ট লাল), short ফরম্যাটে */}
        <PokerChip amount={10} onClick={(v) => console.log("Bet", v)} />
        {/* // বিভিন্ন এমাউন্ট */}
        <div className="flex gap-3">
          <PokerChip amount={10} />
          <PokerChip amount={100} />
          <PokerChip amount={100_000} /> {/* 100k */}
          <PokerChip amount={1_000_000} /> {/* 1m */}
        </div>
        {/* // কাস্টম রঙ (সবুজ চিপ), বড় সাইজ + সিলেক্টেড */}
        <PokerChip
          size={120}
          amount={250_000}
          selected
          colors={{
            light: "#7ef07a",
            base: "#46d45a",
            dark: "#1e9e3b",
            stripe: "#ffffff",
            face: "#32b24a",
            text: "#fffce0",
          }}
        />
        {/* // র-ভ্যালু দেখাতে চান (formatter বন্ধ) */}
        <PokerChip amount={12500} format="none" prefix="$" />
        {/* // onClick থেকে amount রিসিভ হবে */}
        <PokerChip amount={1_000_000} onClick={(amt) => console.log(amt)} />
      </div>
      {/* Start Chip 2 */}
      <div>
        {/* // ডিফল্ট ব্ল্যাক-হোয়াইট, short ফরম্যাট */}
        <BWChip amount={10} onClick={(amt) => console.log("Picked", amt)} />

        {/* // স্ট্রাইপ/নচ সংখ্যা টিউন */}
        <BWChip amount={100} outerStripeCount={8} innerNotchCount={16} />

        {/* // কাস্টম রঙ + বড় সাইজ */}
        <BWChip
          size={120}
          amount={1_000_000}
          baseColor="#0f1113"
          stripeColor="#ffffff"
          faceColor="#141618"
          textColor="#ffffff"
        />

        {/* // র-ভ্যালু দেখাতে (formatter off) + prefix */}
        <BWChip amount={12500} format="none" prefix="$" />

        {/* // শুধু কাস্টম লেবেল */}
        <BWChip label="ALL IN" onClick={() => console.log()} />
      </div>
      {/* 4 color chips   */}
      <div>
        <div className="grid grid-cols-2 gap-10 place-items-center">
          {/* Black */}
          <BWChip
            size={140}
            amount={10}
            baseColor="#191919"
            faceColor="#111827"
            stripeColor="#ffffff"
            textColor="#ffffff"
            onClick={(amt) => console.log("Black:", amt)}
          />

          {/* Blue */}
          <BWChip
            size={140}
            amount={100}
            baseColor="#2563EB"
            faceColor="#1D4ED8"
            stripeColor="#ffffff"
            textColor="#ffffff"
            onClick={(amt) => console.log("Blue:", amt)}
          />

          {/* Red */}
          <BWChip
            size={140}
            amount={100_000} // => 100k (short format)
            baseColor="#EF4444"
            faceColor="#DC2626"
            stripeColor="#ffffff"
            textColor="#ffffff"
            onClick={(amt) => console.log("Red:", amt)}
          />

          {/* Green */}
          <BWChip
            size={60}
            amount={1_000_000} // => 1m
            baseColor="#22C55E"
            faceColor="#16A34A"
            stripeColor="#ffffff"
            textColor="#ffffff"
            onClick={(amt) => console.log("Green:", amt)}
          />
        </div>
      </div>
      {/* Glass Barr demo */}
      {/* // 1) ডিফল্ট লুক, আপনার আগের লেআউটের মতো: */}
      <ChipBoard
        leftChips={[
          {
            size: 60,
            amount: 10,
            baseColor: "#191919",
            faceColor: "#111827",
            stripeColor: "#fff",
            textColor: "#fff",
          },
          {
            size: 60,
            amount: 100,
            baseColor: "#2563EB",
            faceColor: "#1D4ED8",
            stripeColor: "#fff",
            textColor: "#fff",
          },
          {
            size: 60,
            amount: 100_000,
            baseColor: "#EF4444",
            faceColor: "#DC2626",
            stripeColor: "#fff",
            textColor: "#fff",
          },
          {
            size: 60,
            amount: 1_000_000,
            baseColor: "#22C55E",
            faceColor: "#16A34A",
            stripeColor: "#fff",
            textColor: "#fff",
          },
        ]}
        rightChips={[
          {
            size: 50,
            amount: 100_000,
            baseColor: "#EF4444",
            faceColor: "#DC2626",
            stripeColor: "#fff",
            textColor: "#fff",
          },
          {
            size: 50,
            amount: 100_000,
            baseColor: "#EF4444",
            faceColor: "#DC2626",
            stripeColor: "#fff",
            textColor: "#fff",
          },
          {
            size: 50,
            amount: 100_000,
            baseColor: "#EF4444",
            faceColor: "#DC2626",
            stripeColor: "#fff",
            textColor: "#fff",
          },
          {
            size: 50,
            amount: 100_000,
            baseColor: "#EF4444",
            faceColor: "#DC2626",
            stripeColor: "#fff",
            textColor: "#fff",
          },
        ]}
      />
      {/* // 2) কাস্টম সাইজ/রেডিয়াস/গ্রেডিয়েন্ট + bottomBeam বন্ধ: */}
      <ChipBoard
        bar={{
          height: 92,
          radius: 16,
          gradient: {
            start: "#083742",
            mid1: "#062f39",
            mid2: "#082a33",
            end: "#07232c",
          },
          ringColor: "rgba(255,255,255,.14)",
          bottomBeam: false,
        }}
        leftChips={[
          { size: 56, amount: 10 },
          { size: 56, amount: 100 },
        ]}
        rightChips={[{ size: 56, amount: 1_000_000 }]}
      />
      {/* // 3) শুধু GlassBar ব্যবহার করে যেকোনো কনটেন্ট: */}
      <GlassBar
        height={80}
        radius={18}
        gradient={{
          start: "#801213",
          mid1: "#a53239",
          mid2: "#bc545d",
          mid3: "#bc545d",
          end: "#bc545d",
        }}
        ringColor="rgba(255,255,255,.18)"
        bottomBeam={{
          color: "#ffd6de",
          height: 3,
          offset: 8,
          opacity: 0.7,
          blur: 0.5,
        }}
        paddingX={12}
        contentClassName="flex items-center justify-between w-full"
      >
        <div className="flex w-full items-center justify-between ">
          <span className="text-white/90 font-semibold pl-2">
            Balance: $420.00
          </span>
          <button className="px-4 py-2 bg-black/30 rounded text-white">
            Top Up
          </button>
          <div className="mr-20">
            {" "}
            <RulesBtn
              label="Help"
              colors={{ start: "#66e3ff", mid: "#2aa7ff", end: "#0a6cff" }}
              textColor="#fff"
              ringColor="rgba(255,255,255,.5)"
            />
          </div>
        </div>
      </GlassBar>
      <GlassBar
        height={96}
        radius={18}
        gradient={{
          start: "#801213",
          mid1: "#a53239",
          mid2: "#bc545d",
          mid3: "#bc545d",
          end: "#bc545d",
        }}
        ringColor="rgba(255,255,255,.18)"
        bottomBeam={{
          color: "#ffd6de",
          height: 3,
          offset: 8,
          opacity: 0.7,
          blur: 0.5,
        }}
        paddingX={12}
        contentClassName="flex items-center justify-between w-full"
      >
        {/* আপনার কনটেন্ট */}
        <div className="flex items-center gap-8">
          <BWChip size={54} amount={10} />
          <BWChip size={54} amount={100} />
        </div>
        <div className="text-white/90 font-semibold pr-2">Balance: $420.00</div>
      </GlassBar>
      <div>
        {/* // সিম্পল: সিলেক্টেড হলে scale + pulse */}
        <BWChip
          amount={100}
          selected
          onClick={(v) => console.log(v)}
          size={80}
        />
        {/* // breathe টাইপ অ্যানিমেশন + কাস্টম স্কেল + ভিন্ন glow */}
        <BWChip
          amount={100000}
          selected
          animate="breathe"
          selectedScale={1.08}
          glowColor="rgba(247,74,20,.55)" // blue glow
        />
        <div className="flex gap-4">
          {amounts.map((a) => (
            <BWChip
              key={a}
              amount={a}
              selected={sel === a}
              onClick={() => setSel(a)}
              animate="pulse"
              size={80}
              glowColor="rgba(247,74,20,.55)"
            />
          ))}
        </div>
      </div>
      {/* glass bars colors */}
      <div className="my-10">
        <div className="space-y-6 w-full max-w-[340px]">
          {/* Watermelon */}
          <GlassBar
            height={140}
            radius={18}
            gradient={{
              start: "#b7ff7a",
              mid1: "#9cf75b",
              mid2: "#73e03e",
              mid3: "#56cc31",
              end: "#3fb527",
            }}
            ringColor="rgba(255,255,255,.22)"
            bottomBeam={{
              color: "#eaffb3",
              height: 3,
              offset: 12,
              opacity: 0.8,
              blur: 0.5,
            }}
            paddingX={12}
            contentClassName="flex flex-col items-center justify-center gap-3"
          >
            <Pill
              text="Watermelon"
              className="bg-[linear-gradient(180deg,#d6ffa8_0%,#b8fb6e_50%,#8be241_100%)] text-[#2a5d0e]"
            />
            <Multiplier />
          </GlassBar>

          {/* Apple */}
          <GlassBar
            height={140}
            radius={18}
            gradient={{
              start: "#ff8a8f",
              mid1: "#ff5b63",
              mid2: "#e53842",
              mid3: "#c91f2e",
              end: "#a7131f",
            }}
            ringColor="rgba(255,255,255,.22)"
            bottomBeam={{
              color: "#ffd2d6",
              height: 3,
              offset: 12,
              opacity: 0.75,
              blur: 0.5,
            }}
            paddingX={12}
            contentClassName="flex flex-col items-center justify-center gap-3"
          >
            <Pill
              text="Apple"
              className="bg-[linear-gradient(180deg,#ffb2b7_0%,#ff6b72_50%,#d62b36_100%)] text-[#5e0a0f]"
            />
            <Multiplier />
          </GlassBar>

          {/* Mango */}
          <GlassBar
            height={140}
            radius={18}
            gradient={{
              start: "#FFE09A",
              mid1: "#FFD067",
              mid2: "#FFB33B",
              mid3: "#FFA224",
              end: "#FF8D15",
            }}
            ringColor="rgba(255,255,255,.22)"
            bottomBeam={{
              color: "#fff0b3",
              height: 3,
              offset: 12,
              opacity: 0.8,
              blur: 0.5,
            }}
            paddingX={12}
            contentClassName="flex flex-col items-center justify-center gap-3"
          >
            <Pill
              text="Mango"
              className="bg-[linear-gradient(180deg,#ffe7a8_0%,#ffd068_50%,#ffb23b_100%)] text-[#714b02]"
            />
            <Multiplier />
          </GlassBar>
        </div>
      </div>
    </div>
  );
};

export default MyTestPage;
