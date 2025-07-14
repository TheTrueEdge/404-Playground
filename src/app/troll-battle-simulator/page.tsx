'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TrollBattleHome() {
  const router = useRouter();

  return (
    <main
      className="
        relative min-h-screen flex flex-col items-center justify-start
        text-white px-6 pt-28
        bg-gradient-to-br from-[#0b1a0f] via-[#123622] to-[#04110a]
        overflow-hidden
      "
    >
      {/* Animated pulsing gradient background */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-gradient-to-tr from-green-900 via-green-700 to-green-900
          opacity-30
          animate-[pulse_8s_ease-in-out_infinite]
          pointer-events-none
          -z-10
        "
        style={{ backgroundSize: '400% 400%' }}
      />

      {/* Back button fixed top-left */}
      <button
        className="
          absolute top-6 left-6 bg-black bg-opacity-50
          hover:bg-opacity-70
          text-white px-3 py-1 rounded shadow-md
          transition
          z-20
          cursor-pointer
        "
        onClick={() => router.push('/')}
        aria-label="Back to 404 Homepage"
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-6xl font-extrabold mb-8 flex items-center gap-4 drop-shadow-lg">
        ⚔️ Troll Battle Simulator
      </h1>

      {/* Mysterious intro text */}
      <p className="max-w-lg text-center text-lg leading-relaxed mb-12 opacity-90 drop-shadow-md">
        Somewhere between logic and madness lies a challenge.  
        Will you outwit the guardians of cryptic riddles and sly provocations?  
        Step forward if you dare.
      </p>

      {/* Start battle button */}
      <button
        className="
          bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-lg shadow-xl
          hover:bg-yellow-300 transition
          text-xl drop-shadow-md
          cursor-pointer
        "
        onClick={() => router.push('/troll-battle-simulator/trolls/bridgekeeper')}
        aria-label="Start the troll battle"
      >
        ⚔️ Battle
      </button>

      <footer className="mt-auto pt-16 text-yellow-300 text-sm opacity-70 drop-shadow-sm">
        Part of the 404 Playground experiments
      </footer>
    </main>
  );
}
