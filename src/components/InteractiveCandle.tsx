/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface InteractiveCandleProps {
  onBlowOut?: () => void;
}

export default function InteractiveCandle({ onBlowOut }: InteractiveCandleProps) {
  const [isLit, setIsLit] = useState(true);
  const [wished, setWished] = useState(false);

  const handleBlowOut = () => {
    if (!isLit) return;
    setIsLit(false);
    setWished(true);
    if (onBlowOut) {
      onBlowOut();
    }
  };

  return (
    <div id="candle-section" className="flex flex-col items-center justify-center p-6 bg-slate-900/80 border-2 border-gold-500/30 rounded-2xl max-w-sm mx-auto shadow-2xl backdrop-blur-md">
      <h3 className="font-serif text-lg text-gold-300 font-bold tracking-wide mb-2 text-center select-text">
        ژیێ نی لتە پیروز بیت هەبونامن
      </h3>
      <p className="font-['Noto_Naskh_Arabic'] text-[12px] text-white/95 text-center mb-6 leading-relaxed max-w-[260px] font-medium drop-shadow-sm">
        {isLit 
          ? "چاڤێن خۆ بگرە، هیڤیەکا جوان د دلێ خۆ دا بخوازە، و مۆمێن تەمەنێ خۆ یێ نوو پفکە." 
          : "هیڤیا تە یا گرانبها ل سەر بالێن ستێران فڕی بەرەڤ ئەسمانی... یا ڕەب هەمی دوعا و خەونێن تە ببەخشرێن و دڵێ تە هەردەم شاد و ئارام بیت."}
      </p>

      <div 
        id="interactive-cake-body"
        className="relative cursor-pointer h-52 w-48 flex flex-col items-center justify-end select-none group"
        onClick={handleBlowOut}
      >
        {/* Flames / Smoke for both candles */}
        <div className="absolute top-2 w-24 h-16 flex justify-between px-4 z-30 pointer-events-none">
          {/* Flame for Candle 2 */}
          <div className="relative flex flex-col items-center w-10">
            <AnimatePresence>
              {isLit ? (
                <motion.div
                  key="flame-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.05, 0.95, 1.02, 1],
                    y: [0, -1.5, 1, -0.5, 0]
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.2, 
                    y: -15, 
                    filter: 'blur(3px)',
                    transition: { duration: 0.4 } 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-0 flex flex-col items-center"
                >
                  <div className="absolute w-8 h-8 bg-amber-400/20 rounded-full blur-md -top-3" />
                  <div className="w-3.5 h-8 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full shadow-lg" />
                  <div className="absolute w-1.5 h-4 bg-white/90 rounded-full top-2.5" />
                </motion.div>
              ) : (
                <motion.div
                  key="smoke-2"
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: [0.6, 0.2, 0], y: -25, x: [0, 3, -3, 0], scale: 1.1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute bottom-0 w-1.5 h-10 bg-slate-400/30 rounded-full blur-sm"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Flame for Candle 6 */}
          <div className="relative flex flex-col items-center w-10">
            <AnimatePresence>
              {isLit ? (
                <motion.div
                  key="flame-6"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 0.96, 1.04, 0.98, 1],
                    y: [0, 1, -1.5, 0.5, 0]
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.2, 
                    y: -15, 
                    filter: 'blur(3px)',
                    transition: { duration: 0.4 } 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.7,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-0 flex flex-col items-center"
                >
                  <div className="absolute w-8 h-8 bg-amber-400/20 rounded-full blur-md -top-3" />
                  <div className="w-3.5 h-8 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full shadow-lg" />
                  <div className="absolute w-1.5 h-4 bg-white/90 rounded-full top-2.5" />
                </motion.div>
              ) : (
                <motion.div
                  key="smoke-6"
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: [0.6, 0.2, 0], y: -25, x: [0, -3, 3, 0], scale: 1.1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute bottom-0 w-1.5 h-10 bg-slate-400/30 rounded-full blur-sm"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Wicks for the two candles */}
        <div className="absolute top-[52px] w-24 h-4 flex justify-between px-8 z-20 pointer-events-none">
          <div className="w-0.5 h-3 bg-neutral-600 rounded-t-full" />
          <div className="w-0.5 h-3 bg-neutral-600 rounded-t-full" />
        </div>

        {/* Number Candles "2" and "6" standing on top of the cake */}
        <div className="absolute bottom-[68px] flex gap-2 z-10 select-none">
          {/* Candle 2 */}
          <div className="w-10 h-16 relative flex items-center justify-center">
            <svg viewBox="0 0 40 60" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              <defs>
                <linearGradient id="waxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#eed7a0" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <path d="M 10,20 C 10,10 30,10 30,20 C 30,30 10,38 10,48 L 32,48 L 32,52 L 8,52 L 8,46 C 8,40 22,32 24,24 C 26,18 14,14 14,20" fill="url(#waxGrad)" stroke="#eed7a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 14,16 C 14,13 26,13 26,20" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>

          {/* Candle 6 */}
          <div className="w-10 h-16 relative flex items-center justify-center">
            <svg viewBox="0 0 40 60" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              <path d="M 28,15 L 24,15 C 16,15 10,24 10,36 C 10,46 18,52 28,52 C 34,52 38,46 38,36 C 38,26 31,21 24,21 C 18,21 14,25 14,34 C 14,42 21,46 27,46 C 31,46 33,42 33,36 C 33,30 26,26 22,26" fill="url(#waxGrad)" stroke="#eed7a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 18,18 C 14,24 13,32 13,36" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Cake Container (Tiers of luxury birthday cake) */}
        <div className="relative w-44 h-[72px] flex flex-col items-center justify-end">
          
          {/* Top Layer of Cake - Rich Ivory Frosting */}
          <div className="absolute bottom-5 w-36 h-10 bg-gradient-to-b from-stone-50 via-cream-100 to-stone-200 border border-gold-400/40 rounded-t-xl shadow-md z-2 flex items-center justify-center overflow-hidden">
            {/* Gold Drips */}
            <div className="absolute top-0 left-0 right-0 h-3 flex justify-around opacity-90">
              <div className="w-2.5 h-3 bg-gold-400 rounded-b-full" />
              <div className="w-2 h-4 bg-gold-500 rounded-b-full" />
              <div className="w-3 h-2.5 bg-gold-400 rounded-b-full" />
              <div className="w-1.5 h-3.5 bg-gold-500 rounded-b-full" />
              <div className="w-2.5 h-2 bg-gold-400 rounded-b-full" />
              <div className="w-2 h-3.5 bg-gold-500 rounded-b-full" />
              <div className="w-3 h-1.5 bg-gold-400 rounded-b-full" />
              <div className="w-2 h-3 bg-gold-500 rounded-b-full" />
            </div>

            {/* Cake toppings (mini strawberries/creams) */}
            <div className="absolute top-1.5 left-0 right-0 flex justify-around px-2 z-10">
              <span className="text-[10px] text-red-500 filter drop-shadow select-none">🍓</span>
              <span className="text-[8px] text-gold-500 select-none">✿</span>
              <span className="text-[10px] text-red-500 filter drop-shadow select-none">🍓</span>
              <span className="text-[8px] text-gold-500 select-none">✿</span>
              <span className="text-[10px] text-red-500 filter drop-shadow select-none">🍓</span>
            </div>
            
            {/* Elegant luxury gold middle band */}
            <div className="w-full h-1 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600 mt-2.5" />
          </div>

          {/* Bottom Layer of Cake - Wider tier */}
          <div className="absolute bottom-1 w-40 h-8 bg-gradient-to-b from-stone-100 via-cream-200 to-stone-300 border border-gold-400/30 rounded-t-lg shadow-lg z-1 overflow-hidden">
            {/* Bottom frosting lace */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gold-400/30 flex justify-center items-center">
              <div className="text-[5px] text-gold-600/50 tracking-widest">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>
            </div>
          </div>

          {/* Gold Cake Plate / Stand */}
          <div className="w-44 h-2 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 rounded-full shadow-xl border-b border-gold-800/50 z-3" />
          <div className="w-20 h-1.5 bg-gold-700/60 rounded-full z-0" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 min-h-[24px]">
        {wished ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-gold-600 font-serif text-[13px] italic font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            دوعا و هیڤیێن تە بۆ ئەسمان و ستێران هاتنە ڕەوانەکرن
          </motion.div>
        ) : (
          <span className="text-[10px] text-cream-900/40 font-sans tracking-wide uppercase">
            کلیک بکە بۆ پفکرنێ
          </span>
        )}
      </div>
    </div>
  );
}
