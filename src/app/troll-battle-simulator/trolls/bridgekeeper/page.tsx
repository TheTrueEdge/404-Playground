'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Uncial_Antiqua } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const uncial = Uncial_Antiqua({ subsets: ['latin'], weight: '400' });

export default function BridgekeeperBattle() {
  const router = useRouter();

  const initialMessages = [
    '🧌 Bridgekeeper: STOP! Who would cross the Bridge of Death must answer me these questions three, ere the other side he see.',
    '🧌 Bridgekeeper: What is your name?'
  ];

  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [input, setInput] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const MAX_TURNS = 10;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkGameOver = (reply: string) => {
    const lower = reply.toLowerCase();
    if (
      lower.includes('gorge') ||
      lower.includes('cast into the gorge') ||
      lower.includes('you have failed')
    ) {
      setIsLost(true);
      setIsGameOver(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isGameOver) return;

    const newMessages = [...messages, `🧍 You: ${input}`];
    setMessages(newMessages);
    setInput('');
    setTurnCount(turnCount + 1);
    setIsLoading(true);

    try {
      const res = await fetch('/api/trolls/bridgekeeper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const reply = typeof data.message === 'string' ? data.message.trim() : '...';

      setMessages((prev) => [...prev, `🧌 Bridgekeeper: ${reply}`]);
      checkGameOver(reply);
    } catch {
      setMessages((prev) => [...prev, '❌ Troll is silent... Something went wrong.']);
    } finally {
      setIsLoading(false);
      if (turnCount + 1 >= MAX_TURNS && !isGameOver) {
        setIsGameOver(true);
        setIsLost(true);
        setMessages((prev) => [...prev, '🪦 You have failed the challenge. The troll casts you into the gorge!']);
      }
    }
  };

  const handleRetry = () => {
    setMessages(initialMessages);
    setInput('');
    setTurnCount(0);
    setIsGameOver(false);
    setIsLost(false);
  };

  const handleReturnHome = () => {
    router.push('/troll-battle-simulator');
  };

  const MenuButton = () => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setShowMobileMenu(!showMobileMenu)}
      className="md:hidden fixed bottom-4 right-4 z-50 bg-[#3e2f0c] text-white px-4 py-2 rounded-full shadow-lg"
    >
      ☰ Menu
    </motion.button>
  );

  const MobileMenu = () => (
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-md z-50 overflow-hidden"
        >
          <button className="block w-full px-4 py-2 hover:bg-yellow-100 text-left" onClick={() => alert('💡 Hint: He is *very* particular about names and quests!')}>
            💡 Hint
          </button>
          <button className="block w-full px-4 py-2 hover:bg-green-100 text-left" onClick={handleRetry}>
            🔄 Restart
          </button>
          <button className="block w-full px-4 py-2 hover:bg-red-100 text-left" onClick={handleReturnHome}>
            🏠 Exit
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <main
      className={`${uncial.className} flex flex-col md:flex-row h-screen overflow-hidden transition-colors
        bg-[#7e8b7b] text-[#3e2f0c]`}
    >
      <MenuButton />
      <MobileMenu />

      <div
        className="w-full md:w-1/3 max-w-full min-w-[400px] p-1
          bg-[#6d6f50] flex flex-col items-center justify-center h-full relative"
      >
        {/* Desktop HUD */}
        <div className="absolute bottom-10 center z-10 hidden md:flex gap-2">
          <button
            onClick={handleReturnHome}
            className="w-32 px-4 py-2 bg-yellow-600 text-[#3e2f0c] rounded font-bold hover:bg-yellow-500 transition"
          >
            🏠 Exit
          </button>
          <button
            onClick={() => alert('💡 Hint: He is *very* particular about names and quests!')}
            className="w-32 px-4 py-2 bg-yellow-600 text-[#3e2f0c] rounded font-bold hover:bg-yellow-500 transition"
          >
            💡 Hint
          </button>
          <button
            onClick={handleRetry}
            className="w-32 px-4 py-2 bg-yellow-600 text-[#3e2f0c] rounded font-bold hover:bg-yellow-500 transition"
          >
            🔄 Restart
          </button>
        </div>

        <div
          className="relative w-full h-full max-w-xl p-6 pt-14 text-center
            bg-[url('/scroll-bg.png')] bg-no-repeat bg-contain bg-center flex flex-col"
          style={{ backgroundSize: '100% 100%' }}
        >
          <h1 className="font-bold mb-4 drop-shadow-md text-red-900 select-none whitespace-nowrap text-center text-2xl md:text-3xl">
            Bridgekeeper Battle
          </h1>

          <div
            className={`flex-grow overflow-y-auto border border-yellow-700 bg-[#fff8dccc] p-6 rounded-lg shadow
              space-y-3 text-left ${isLost ? 'opacity-50 pointer-events-none select-none' : ''}`}
          >
            {messages.map((msg, idx) => (
              <p key={idx} className="whitespace-pre-wrap">{msg}</p>
            ))}
            <div ref={scrollRef} />
          </div>

          <div className="flex gap-2 mt-4">
            <input
              className="flex-1 p-3 rounded bg-[#f7f0d9] border border-yellow-700 text-[#3e2f0c]
                placeholder:text-[#a68f36] focus:outline-none focus:ring-2 focus:ring-yellow-600"
              type="text"
              placeholder={isGameOver ? 'Game over...' : 'Answer the question...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isGameOver}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button
              className="px-6 py-3 bg-yellow-600 text-[#3e2f0c] rounded font-bold hover:bg-yellow-500
                disabled:opacity-50 transition cursor-pointer select-none"
              onClick={handleSend}
              disabled={isLoading || isGameOver}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>

          {isLost && (
            <div className="mt-4 text-center text-red-700 font-black text-2xl tracking-wide select-none">
              ⚠️ You Lose! You were flung into the Gorge of Eternal Peril! ⚠️
            </div>
          )}

          {isLost && (
            <div className="mt-4 flex gap-4 justify-center">
              <button
                className="px-6 py-3 bg-green-700 rounded hover:bg-green-600 transition font-semibold text-white"
                onClick={handleRetry}
              >
                Retry
              </button>
              <button
                className="px-6 py-3 bg-red-700 rounded hover:bg-red-600 transition font-semibold text-white"
                onClick={handleReturnHome}
              >
                Return Home
              </button>
            </div>
          )}

          <p className="mt-4 text-sm opacity-70 select-none">
            Turns used: {turnCount}/{MAX_TURNS}
          </p>
        </div>
      </div>

      {/* Right side: Gorge image (desktop only) */}
      <div className="hidden md:block flex-1 relative min-h-screen overflow-hidden">
        <img
          src="/gorge.png"
          alt="Gorge of Eternal Peril"
          className="w-full h-auto object-contain md:h-full md:object-cover md:object-left brightness-[0.8] scale-x-[-1]"
          style={{ objectPosition: '30% 25%' }}
        />
      </div>
    </main>
  );
}
