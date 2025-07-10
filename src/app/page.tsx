"use client";

import React, { useState } from "react";
import GlassRingScene from "@/components/ui/GlassRingScene";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const [, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  function handlePointerMove(e: React.PointerEvent) {
    setPointerPos({ x: e.clientX, y: e.clientY });
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (touch) {
      setPointerPos({ x: touch.clientX, y: touch.clientY });
    }
  }

  function handlePointerLeave() {
    setPointerPos(null);
  }

  function handleTouchEnd() {
    setPointerPos(null);
  }

  return (
  <main className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center px-6 py-20">
    <div
      className="w-full flex items-center justify-center opacity-100"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Overlayed heading */}
      <h1
        className="
          absolute top-1/2 left-1/2 z-10
          -translate-x-1/2 -translate-y-1/2
          text-7xl font-extrabold text-center pointer-events-none
          text-white
          drop-shadow-[0_0_8px_#00fff7]
          [text-shadow:_0_0_8px_#ff00e7,_0_0_12px_#00fff7,_0_0_2px_#fff]
        "
      >
        Welcome to 404 Playground
      </h1>
      {/* Interactive scene */}
      <GlassRingScene />
    </div>
    <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-3 gap-6 p-6">
        <Link href="/troll-battle-simulator" className="group">
          <Card className="group bg-[#0a1931]/80 border-4 border-[#00fff7]/20 shadow-lg hover:border-[#00fff7]/60 transition-all cursor-pointer">
            <CardHeader>
              <CardTitle
                className="
                  text-white
                  transition-all
                  group-hover:text-[#00fff7]/120
                "
              >
                ⚔️ Troll Battle Simulator
              </CardTitle>
              <CardDescription>Face off against quirky AI powered trolls of various kinds!</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Card className="group bg-[#0a1931]/80 border-4 border-[#00fff7]/20 shadow-lg hover:border-[#00fff7]/60 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle
              className="
                text-white
                transition-all
                group-hover:text-[#00fff7]/120
              "
            >
              Work in Progress
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
        <Card className="group bg-[#0a1931]/80 border-4 border-[#00fff7]/20 shadow-lg hover:border-[#00fff7]/60 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle
              className="
                text-white
                transition-all
                group-hover:text-[#00fff7]/120
              "
            >
              Work in Progress
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
        <Card className="group bg-[#0a1931]/80 border-4 border-[#00fff7]/20 shadow-lg hover:border-[#00fff7]/60 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle
              className="
                text-white
                transition-all
                group-hover:text-[#00fff7]/120
              "
            >
              Work in Progress
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
        <Card className="group bg-[#0a1931]/80 border-4 border-[#00fff7]/20 shadow-lg hover:border-[#00fff7]/60 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle
              className="
                text-white
                transition-all
                group-hover:text-[#00fff7]/120
              "
            >
              Work in Progress
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
        <Card className="group bg-[#0a1931]/80 border-4 border-[#00fff7]/20 shadow-lg hover:border-[#00fff7]/60 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle
              className="
                text-white
                transition-all
                group-hover:text-[#00fff7]/120
              "
            >
              Work in Progress
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
        {/* Add more tiles here as you go */}
      </div>
  </main>
);
}
