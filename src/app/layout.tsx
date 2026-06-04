import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Porsche 911 GT3 RS — Unleashed Performance Experience",
  description: "An interactive, cinematic scrollytelling journey detailing the active aerodynamics, 518 hp naturally aspirated flat-six, race-spec cockpit, and track-engineered heritage of the Porsche 911 GT3 RS.",
  keywords: ["Porsche", "911 GT3 RS", "Supercar", "Track car", "Scrollytelling", "Interactive automotive experience", "German engineering"],
  authors: [{ name: "Porsche Experience Director" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-[#050505] text-white w-full relative">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
