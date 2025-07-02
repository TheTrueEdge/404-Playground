"use client";

import React, { useState } from "react";
import GlassRingScene from "@/ui/GlassRingScene";

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
      className="absolute inset-0 z-0 flex items-center justify-center opacity-100"
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
    {/* Your other content */}
  </main>
);
}
