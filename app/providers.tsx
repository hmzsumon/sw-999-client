// app/providers.tsx
"use client";

import { LuckyWheelProvider } from "@/context/luckyWheelContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LuckyWheelProvider
      initialUser={{ id: "u1", name: "Guest", balance: 1000 }}
    >
      {children}
    </LuckyWheelProvider>
  );
}
