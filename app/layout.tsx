import SocketProvider from "@/providers/SocketProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SW999 - Bet",
  description: "Bet on your favorite games with SW999",
  openGraph: {
    title: "SW999 - Bet",
    description: "Bet on your favorite games with SW999",
    url: "https://sw999.bet",
    siteName: "SW999",
    images: [
      {
        url: "https://sw999.bet/og-image.png",
        width: 1200,
        height: 630,
        alt: "SW999 - Bet",
      },
    ],
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <StoreProvider>
          <SocketProvider>
            <div className="flex flex-col  bg-wrapper  ">{children}</div>
            <Toaster />
          </SocketProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
