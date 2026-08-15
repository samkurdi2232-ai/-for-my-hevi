/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface ReasonsListProps {
  reasons: string[];
  senderName?: string;
  key?: string | number;
}

export default function ReasonsList({ reasons, senderName = 'ئەڤینا تە' }: ReasonsListProps) {
  const [openedIndices, setOpenedIndices] = useState<number[]>([]);

  const toggleReason = (index: number) => {
    if (openedIndices.includes(index)) {
      setOpenedIndices(openedIndices.filter(i => i !== index));
    } else {
      setOpenedIndices([...openedIndices, index]);
    }
  };

  return (
    <div id="reasons-section" className="space-y-6">
      <div className="text-center max-w-lg mx-auto">
        <h3 className="font-serif text-2xl sm:text-3xl text-gold-400 font-medium tracking-wide">
          ٥ نامەیێن کورت یێن ئەڤینیێ (بۆچی حەژ تە دکەم)
        </h3>
        <p className="font-sans text-[11px] text-amber-200/60 mt-1.5 uppercase tracking-widest">
          کلیک بکە سەر مۆرا مۆمێ دا کو نامەیەکا من یا پڕ ژ ئەڤین بۆ تە ڤەببیت
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-4">
        {reasons.slice(0, 5).map((reason, index) => {
          const isOpen = openedIndices.includes(index);

          return (
            <div
              key={index}
              className="relative h-56 cursor-pointer perspective"
              onClick={() => toggleReason(index)}
              id={`reason-card-${index}`}
            >
              <motion.div
                animate={{ rotateY: isOpen ? 180 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="w-full h-full duration-500 transform-style-3d relative"
              >
                {/* CARD FRONT: Closed luxury envelope with wax seal */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border-2 border-gold-500/40 shadow-xl shadow-black/40 flex flex-col justify-between p-4 overflow-hidden">
                  {/* Decorative envelope fold lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="0" x2="50%" y2="48%" stroke="#eed7a0" strokeWidth="1.5" />
                      <line x1="100%" y1="0" x2="50%" y2="48%" stroke="#eed7a0" strokeWidth="1.5" />
                      <line x1="0" y1="100%" x2="50%" y2="48%" stroke="#eed7a0" strokeWidth="1" />
                      <line x1="100%" y1="100%" x2="50%" y2="48%" stroke="#eed7a0" strokeWidth="1" />
                    </svg>
                  </div>

                  <span className="font-serif text-xs font-semibold text-gold-300 self-start z-10 relative">
                    کارتا ژمارە {index + 1}
                  </span>

                  {/* Wax Seal Button (3D Wax Seal Effect) */}
                  <div className="flex justify-center items-center z-10 my-auto">
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 flex items-center justify-center shadow-lg border-b-4 border-gold-800/80 hover:scale-105 active:scale-95 transition-transform">
                      {/* Heart embossed on the seal */}
                      <Heart className="w-6 h-6 text-slate-950 fill-slate-950/20" />
                      <div className="absolute -inset-1.5 rounded-full border border-gold-300/30 opacity-60 animate-pulse" />
                    </div>
                  </div>

                  {/* Clean footer spacer to prevent clutter */}
                  <div className="h-2 z-10" />
                </div>

                {/* CARD BACK: Opened message inside a golden frame */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-b from-stone-50 via-cream-50 to-stone-100 border-[6px] border-double border-gold-400/40 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gold-200/40 pb-2">
                    <span className="font-serif text-xs font-semibold text-gold-700">
                      کارتا ژمارە {index + 1}
                    </span>
                    <Heart className="w-3.5 h-3.5 text-gold-600 fill-gold-600/10" />
                  </div>

                  <p className="font-serif italic text-sm sm:text-base text-stone-900 font-bold leading-relaxed text-center my-auto px-2 select-text">
                    "{reason}"
                  </p>

                  {/* Elegant bottom separator instead of cluttered labels */}
                  <div className="flex justify-center items-center pt-2 border-t border-gold-200/30">
                    <span className="text-[8px] tracking-widest text-gold-600/40">✦ ✦ ✦</span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
