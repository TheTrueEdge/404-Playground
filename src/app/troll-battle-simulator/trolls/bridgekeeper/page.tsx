'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Uncial_Antiqua } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { HintModal } from '../../components/HintModal';
import { EndBattlePopup } from '../../components/EndBattlePopup';
import { ExitConfirmModal } from '../../components/ExitConfirmModal';
import { IntroPopup } from '../../components/IntroPopup';


const uncial = Uncial_Antiqua({ subsets: ['latin'], weight: '400' });

export default function BridgekeeperBattle() {
  const router = useRouter();

  const [introComplete, setIntroComplete] = useState(false);

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

  const [finalTrollMessage, setFinalTrollMessage] = useState<string>('');
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  const [didWin, setDidWin] = useState<boolean | null>(null);

  const [hintResetKey, setHintResetKey] = useState(0);



  const MAX_TURNS = 10;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState<number>(0);

  useEffect(() => {
    if (introComplete && scrollContainerRef.current) {
      // Update scrollWidth when intro completes to get correct width for font size
      setScrollWidth(scrollContainerRef.current.offsetWidth);
    }
  }, [introComplete]);


  useEffect(() => {
    if (!scrollContainerRef.current) return;
  
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setScrollWidth(entry.contentRect.width);
        }
      });
  
      observer.observe(scrollContainerRef.current);
  
      return () => observer.disconnect();
    }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      let reply = typeof data.message === 'string' ? data.message.trim() : '...';

      let didWinLocal = false;
      let didLoseLocal = false;

      if (reply.includes('WIN')) {
        didWinLocal = true;
        reply = reply.replace('WIN', '').trim();
      } else if (reply.includes('LOSE')) {
        didLoseLocal = true;
        reply = reply.replace('LOSE', '').trim();
      }

      setMessages((prev) => [...prev, `🧌 Bridgekeeper: ${reply}`]);

      if (didWinLocal || didLoseLocal) {
        setIsGameOver(true);
        setIsLost(didLoseLocal);
        setFinalTrollMessage(reply);
        setDidWin(didWinLocal);
        setShowVictoryPopup(true);
      }
    } catch {
      setMessages((prev) => [...prev, '❌ Troll is silent... Something went wrong.']);
    } finally {
      setIsLoading(false);
      if (turnCount + 1 >= MAX_TURNS && !isGameOver) {
        setIsGameOver(true);
        setIsLost(true);
        setFinalTrollMessage('🪦 You have failed the challenge. The troll casts you into the gorge!');
        setDidWin(false);
        setShowVictoryPopup(true);
      }
    }
  };



  const handleRetry = () => {
    setMessages(initialMessages);
    setInput('');
    setTurnCount(0);
    setIsLoading(false);
    setIsGameOver(false);
    setIsLost(false);
    setFinalTrollMessage('');
    setShowVictoryPopup(false);
    setDidWin(null);
    setHintResetKey((prev) => prev + 1);
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
      {!introComplete && (
        <>
          <IntroPopup
            title="⚔️ Bridgekeeper Battle"
            description="Test your wits against the Bridgekeeper from Monty Python and the Holy Grail. Answer his questions correctly to cross the bridge!"
            emoji="🧌"
            onStart={() => setIntroComplete(true)}
            titleClassName={`${uncial.className} whitespace-nowrap text-4xl font-bold mb-0 mt-0 text-red-900 select-none drop-shadow-md text-center leading-tight`}
            descriptionClassName={`${uncial.className} mb-3 font-bold italic text-gray-600 dark:text-gray-300 select-none drop-shadow-sm text-center`}
          />
          <div className="hidden md:block flex-1 relative min-h-screen overflow-hidden">
            <img
              src="/gorge.png"
              alt="Gorge of Eternal Peril"
              className="w-full h-auto object-contain md:h-full md:object-cover md:object-left brightness-[0.8] scale-x-[-1]"
              style={{ objectPosition: '30% 25%' }}
            />
          </div>
        </>
      )}

      {introComplete && (
        <>
          <MenuButton />
          <MobileMenu />
          <div
            className="w-full max-w-xl md:max-w-xl p-1 pt-0 bg-[#6d6f50] flex flex-col items-center justify-center h-full relative"
          >
            <div
              className="relative w-full h-full max-w-xl p-9 pt-8 text-center
                bg-[url('/scroll-bg.png')] bg-no-repeat bg-contain bg-center flex flex-col"
              style={{ backgroundSize: '100% 100%' }}
              ref={scrollContainerRef}
            >
              {/* Title and Subtitle */}
              <h1
                className="mb-0 mt-0 font-bold text-red-900 select-none drop-shadow-md text-center leading-tight"
                style={{
                  fontSize: `${Math.max(18, Math.min(scrollWidth / 12, 36))}px`, // scale between 18px–36px
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                ⚔️ Bridgekeeper Battle
              </h1>
              <h2 
                className="mb-3 font-bold italic text-gray-600 dark:text-gray-300 select-none drop-shadow-sm text-center"
                style={{
                  fontSize: `${Math.max(6, Math.min(scrollWidth / 24, 16))}px`, // scale between 18px–36px
                  whiteSpace: 'nowrap',
                }}
              >
                From Monty Python and the Holy Grail
              </h2>

              {/* Messages Container */}
              <div
                className={`flex-1 overflow-y-auto border border-yellow-700 bg-[#fff8dccc] p-6 rounded-lg shadow
                  space-y-3 text-left ${isLost ? 'opacity-50 pointer-events-none select-none' : ''}`}
              >
                {messages.map((msg, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">{msg}</p>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* User Input and Send Button */}
              <div className="flex gap-2 mt-3">
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

              {/* Desktop Menu Buttons */}
              <div className="hidden md:flex justify-center gap-2 mt-10">
                <ExitConfirmModal
                  onConfirm={handleReturnHome}
                  triggerText="🏠 Home"
                  className="w-32 h-9 px-4 flex items-center justify-center gap-1
                    bg-[#5c4a1a] hover:bg-[#766338] text-[#dcd6b8]
                    rounded text-sm font-semibold whitespace-nowrap truncate
                    transition-colors shadow-sm"
                  contentClassName="bg-[#fef9e7] border border-[#5c4a1a] text-[#3e2f0c] rounded-xl p-6 shadow-xl font-serif"
                  confirmButtonClassName="bg-red-700 hover:bg-red-800 text-white"
                  cancelButtonClassName="bg-gray-300 hover:bg-gray-400 text-black"
                />
                <HintModal
                  key={hintResetKey}
                  hints={[
                    "You may want to watch the movie for inspiration! or at least the bridgekeeper scene!",
                    "Give him reasonable answers for the first two questions.",
                    "If you are struggling with the third question, you may need to ask him a clarifying question..."
                  ]}
                  title="Bridgekeeper's Hints"
                  triggerText="💡 Hint"
                  className="w-32 h-9 px-4 flex items-center justify-center gap-1
                bg-[#5c4a1a] hover:bg-[#766338] text-[#dcd6b8]
                  rounded text-sm font-semibold whitespace-nowrap truncate
                  transition-colors shadow-sm"
                  contentClassName="bg-[#fef9e7] border border-[#5c4a1a] text-[#3e2f0c] rounded-xl p-6 shadow-xl font-serif"
                  hintButtonClassName="w-32 h-9 px-21 flex items-center justify-center gap-1 bg-[#5c4a1a] hover:bg-[#766338] text-[#dcd6b8] rounded text-sm font-semibold transition-colors duration-200 shadow-sm"
                  hintBoxClassName="mt-2 p-3 rounded-lg bg-[#fff8dc] text-[#3e2f0c] border border-[#e0c97f] font-medium"
                />
                <button
                  onClick={handleRetry}
                  className="
                    w-32 h-9 px-4 flex items-center justify-center gap-1
                  bg-[#5c4a1a] hover:bg-[#766338] text-[#dcd6b8]
                    rounded text-sm font-semibold whitespace-nowrap truncate
                    transition-colors duration-200 shadow-sm
                  "
                >
                  🔄 Restart
                </button>
              </div>

              {showVictoryPopup && (
                <EndBattlePopup
                  open={showVictoryPopup}
                  didWin={didWin}
                  message={finalTrollMessage}
                  onClose={() => setShowVictoryPopup(false)}
                  onRetry={handleRetry}
                  onReturnHome={handleReturnHome}
                  onNextBattle={handleReturnHome} // optional
                  retryButtonClass="bg-yellow-800 hover:bg-yellow-700 text-white px-6 py-3 rounded font-bold shadow"
                  nextButtonClass="bg-purple-800 hover:bg-purple-700 text-white px-6 py-3 rounded font-bold shadow"
                  returnButtonClass="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded font-semibold"
                />
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
        </>
      )}
    </main>
  );
}
