import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 40;
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
  const size = Math.random() * 5 + 1.5;
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  const duration = Math.random() * 10 + 8;
  const delay = Math.random() * 4;
  return { id: i, size, initialX, initialY, duration, delay };
});

function SparkleEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.initialX}vw`, y: `${p.initialY}vh` }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            x: [`${p.initialX}vw`, `${p.initialX + 25}vw`],
            y: [`${p.initialY}vh`, `${p.initialY - 30}vh`],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          className="absolute rounded-full bg-red-400 shadow-[0_0_12px_3px_rgba(245,158,11,0.9)] blur-[0.5px]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

const quotes = [
  "Promise of Quality in Every Part.",
  "Direct from Certified OEM Manufacturers.",
  "100% Genuine, Zero Compromise.",
  "Premium Engine Oils & Accessories.",
  "Performance Upgrades for Your Ride."
];

export default function PageLoader({ onFinish, skip, dataReady }) {
  const [isVisible, setIsVisible] = useState(true);
  const [started, setStarted] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!started || skip) return;

    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 2000);

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setIsVisible(false);
      if (onFinish) onFinish();
    };

    // Give at least 1.8s for opening luxury branding presentation
    const minTimer = setTimeout(dismiss, 1800);

    return () => {
      clearInterval(quoteTimer);
      if (minTimer) clearTimeout(minTimer);
    };
  }, [started, skip, onFinish]);

  if (skip) return null;

  const handleTap = () => {
    setIsVisible(false);
    if (onFinish) onFinish();
  };

  return (
    <AnimatePresence>
      {isVisible && started && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          exit={{ opacity: 0, scale: 1.3, filter: "blur(15px)", transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[500] flex items-center justify-center cursor-pointer bg-gradient-to-br from-[#7f1d1d] via-[#171717] to-[#020617] overflow-hidden"
          onClick={handleTap}
        >
          {/* Glowing Amber Aura */}
          <div className="absolute inset-0 opacity-30 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ef4444] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#dc2626] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          </div>

          <SparkleEffect />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
            {/* Katariya Auto Parts Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.03, 1], y: [0, -6, 0] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className="w-56 h-56 md:w-80 md:h-80 flex items-center justify-center drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]"
              >
                <div className="relative w-48 h-48 md:w-72 md:h-72 flex items-center justify-center p-4 bg-white rounded-full border-4 border-red-400 shadow-2xl">
                  <img src="/logo.png" alt="Katariya Auto Parts Logo" className="w-full h-full object-contain relative z-10" />
                </div>
              </motion.div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl md:text-5xl font-cinzel font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-100 mb-2 drop-shadow-md"
            >
              katariya auto parts
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs md:text-sm font-bold tracking-widest text-[#dc2626] uppercase mb-4"
            >
              GENUINE SPARE PARTS
            </motion.p>

            {/* Cycling Quotes */}
            <div className="h-6 mb-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-200/90 text-sm md:text-base italic font-medium tracking-wide"
                >
                  "{quotes[quoteIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-48 md:w-64 mb-8"
            >
              <div className="h-1.5 w-full bg-neutral-900/60 rounded-full overflow-hidden relative border border-red-500/30">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: dataReady ? "100%" : "85%" }}
                  transition={dataReady 
                    ? { duration: 0.5, ease: "easeOut" }
                    : { duration: 4, ease: "easeOut" }
                  }
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-300 via-red-500 to-red-400 shadow-[0_0_12px_rgba(245,158,11,0.9)]"
                />
              </div>
            </motion.div>

            {/* Skip Button */}
            <motion.button 
              className="px-6 py-2 bg-[#171717]/90 border border-red-400/40 rounded-full text-red-200 font-bold tracking-wider uppercase text-xs shadow-lg flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"
              onClick={(e) => {
                e.stopPropagation();
                handleTap();
              }}
            >
              Enter Store ⏩
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
