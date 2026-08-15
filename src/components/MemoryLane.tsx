/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryLaneProps {
  memories: MemoryItem[];
}

export default function MemoryLane({ memories }: MemoryLaneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  if (!memories || memories.length === 0) return null;

  const current = memories[currentIndex];

  return (
    <div id="memory-lane-carousel" className="max-w-xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl text-gold-700 font-medium tracking-wide">
          بیرەهاتنێن مە یێن جوان
        </h3>
        <p className="font-sans text-[11px] text-cream-900/50 uppercase tracking-widest mt-1">
          کۆمکرنا پێنگاڤێن شرin د گەشتا ژیانا مە دا
        </p>
      </div>

      <div className="relative bg-white border border-gold-300/20 rounded-2xl shadow-md p-6 sm:p-8 min-h-[300px] flex flex-col justify-between overflow-hidden">
        {/* Elegant top gold decoration line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-400" />
        
        {/* Gold leaf decoration top right corner */}
        <div className="absolute top-3 right-4 text-gold-400/20 pointer-events-none">
          <Sparkles className="w-8 h-8" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-center items-center text-center py-4"
          >
            {/* Memory Icon / Emoji */}
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center text-3xl shadow-inner border border-gold-200/30 mb-4 select-none">
              {current.emoji || '💖'}
            </div>

            {/* Date Tag */}
            {current.date && (
              <span className="font-sans text-[10px] tracking-widest uppercase text-gold-500 font-semibold mb-2 block">
                {current.date}
              </span>
            )}

            {/* Memory Title */}
            <h4 className="font-serif text-xl font-medium text-cream-900 mb-3 tracking-wide">
              {current.title}
            </h4>

            {/* Memory Description */}
            <p className="font-serif italic text-sm text-cream-900/70 leading-relaxed max-w-sm">
              "{current.description}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-gold-100/40 pt-4 mt-4">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-gold-200/40 text-gold-600 hover:bg-gold-50 active:scale-95 transition-all"
            aria-label="بیرەهاتنا بەری نۆکە"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-sans text-[11px] text-cream-900/40 tracking-wider">
            {currentIndex + 1} ژ {memories.length}
          </span>

          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-gold-200/40 text-gold-600 hover:bg-gold-50 active:scale-95 transition-all"
            aria-label="بیرەهاتنا بهێت"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
