/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, X } from 'lucide-react';
import { MemoryItem } from '../types';

interface PolaroidCollageProps {
  memories?: MemoryItem[];
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80',
];

const ROTATIONS = [
  '-rotate-6 hover:rotate-2',
  'rotate-3 hover:-rotate-1',
  '-rotate-2 hover:rotate-4',
  'rotate-6 hover:-rotate-2',
  '-rotate-3 hover:rotate-3',
];

const DELAYS = [0.1, 0.25, 0.4, 0.55, 0.7];

interface BackgroundHeart {
  id: string;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  scale: number;
}

const BACKGROUND_HEARTS: BackgroundHeart[] = [
  { id: 'bh1', left: '8%', top: '85%', size: 16, duration: 14, delay: 0, scale: 0.9 },
  { id: 'bh2', left: '24%', top: '90%', size: 22, duration: 18, delay: 3, scale: 1.1 },
  { id: 'bh3', left: '40%', top: '80%', size: 14, duration: 15, delay: 1, scale: 0.8 },
  { id: 'bh4', left: '55%', top: '92%', size: 26, duration: 22, delay: 5, scale: 1.3 },
  { id: 'bh5', left: '74%', top: '85%', size: 12, duration: 12, delay: 2, scale: 0.75 },
  { id: 'bh6', left: '90%', top: '80%', size: 18, duration: 16, delay: 4, scale: 1.0 },
  { id: 'bh7', left: '18%', top: '95%', size: 15, duration: 19, delay: 7, scale: 0.85 },
  { id: 'bh8', left: '66%', top: '88%', size: 20, duration: 15, delay: 6, scale: 1.15 },
  { id: 'bh9', left: '82%', top: '75%', size: 13, duration: 20, delay: 1.5, scale: 0.8 },
];

export default function PolaroidCollage({ memories = [] }: PolaroidCollageProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: string;
    url: string;
    caption: string;
    description?: string;
    date?: string;
  } | null>(null);

  // Fallback if no memories exist at all
  const displayMemories = memories.length > 0 ? memories : [
    { id: '1', title: 'گەشەیا ڕۆناهیا تە', description: 'بیرەهاتنەکا گەش و جوان' },
    { id: '2', title: 'گولێن ئەڤینێ بۆ تە', description: 'پۆلا گولێن پیرۆز' },
    { id: '3', title: 'بۆ هەتا هەتایێ پێگڤە', description: 'گرێدانا هەر دوو دلان' },
    { id: '4', title: 'ئارامیا مە یا گەرم', description: 'ئێک شەمبیەکا ئارام و خۆش' },
    { id: '5', title: 'ستێرا گەشا ژیانا من', description: 'تو یى ڕۆناهیا دلێ من' }
  ];

  const polaroids = displayMemories.map((memory, index) => {
    const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const rotation = ROTATIONS[index % ROTATIONS.length];
    const delay = DELAYS[index % DELAYS.length] || 0.1;

    return {
      id: memory.id,
      url: memory.image || fallbackImage,
      caption: memory.title, // using the `title` field from memory data
      description: memory.description,
      date: memory.date,
      rotation,
      delay,
    };
  });

  return (
    <div id="polaroid-collage-section" className="max-w-4xl mx-auto px-4 py-8 relative overflow-hidden">
      {/* Subtle Floating Hearts Behind Photos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {BACKGROUND_HEARTS.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-gold-400/25 fill-gold-400/10"
            style={{
              left: heart.left,
              top: heart.top,
              width: heart.size,
              height: heart.size,
            }}
            animate={{
              y: [0, -400],
              x: [0, 15, -15, 0],
              opacity: [0, 0.6, 0.6, 0],
              scale: [heart.scale * 0.8, heart.scale * 1.2, heart.scale],
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Heart className="w-full h-full fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-1 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
          <span className="font-sans text-[10px] uppercase tracking-wider text-gold-700 font-semibold">
            دیمەنێن ئەڤینا مە
          </span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-gold-700 font-medium tracking-wide">
          بیرەهاتنێن مە د چوارچۆڤەى دا
        </h3>
        <p className="font-sans text-[11px] text-cream-900/50 uppercase tracking-widest mt-1.5 max-w-md mx-auto leading-relaxed">
          هندەک ژ وێنەیێن بیرەهاتنێن مە (کلیک بکە دا کو مەزنتر ببینی)
        </p>
      </div>

      {/* Floating Collage Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-4 relative z-10 px-2 py-4 justify-items-center items-center">
        {polaroids.map((photo) => {
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: photo.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ 
                scale: 1.05,
                y: -8,
                zIndex: 30,
                transition: { duration: 0.3 }
              }}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative bg-white p-3 pb-5 rounded-sm shadow-md hover:shadow-xl border border-gold-100/40 cursor-pointer transition-shadow duration-300 w-full max-w-[170px] ${photo.rotation}`}
              style={{
                transformOrigin: 'center center',
              }}
            >
              {/* Cute Washi Tape / Tape at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-gold-200/30 border-x border-gold-300/20 rotate-1 flex items-center justify-center backdrop-blur-[1px] select-none pointer-events-none">
                <Heart className="w-1.5 h-1.5 text-gold-500/40 fill-gold-500/10" />
              </div>

              {/* Polaroid Image */}
              <div className="aspect-square w-full overflow-hidden bg-cream-50 rounded-sm relative group">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gold-900/10 to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Polaroid Handwriting Text */}
              <div className="mt-3.5 text-center px-1">
                <p className="font-serif italic text-[12px] sm:text-[13px] text-gold-900/80 font-semibold tracking-wide truncate selection:bg-gold-100">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Large Centered Modal View */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-cream-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white p-5 pb-8 rounded-sm shadow-2xl border border-gold-200/40 max-w-sm w-full relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-cream-50 hover:bg-gold-50 border border-gold-200 text-gold-600 hover:text-gold-700 transition-colors shadow-sm cursor-pointer z-10"
                title="بگرە"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Washi Tape */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-gold-200/40 border-x border-gold-300/30 -rotate-1 flex items-center justify-center backdrop-blur-[1px] select-none pointer-events-none shadow-sm">
                <Heart className="w-2.5 h-2.5 text-gold-500/50 fill-gold-500/20" />
              </div>

              {/* Large Image Frame */}
              <div className="aspect-square w-full overflow-hidden bg-cream-50 rounded-sm shadow-inner relative mt-3">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gold-950/5 to-transparent pointer-events-none" />
              </div>

              {/* Large Caption */}
              <div className="mt-5 text-center px-2">
                <p className="font-serif italic text-lg sm:text-xl text-gold-950 font-semibold tracking-wide">
                  {selectedPhoto.caption}
                </p>
                {selectedPhoto.description && (
                  <p className="font-serif italic text-xs text-cream-900/70 mt-2 leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                )}
                {selectedPhoto.date && (
                  <p className="font-sans text-[9px] uppercase tracking-widest text-gold-600 mt-2 font-semibold">
                    {selectedPhoto.date}
                  </p>
                )}
                <p className="font-sans text-[10px] uppercase tracking-widest text-cream-900/40 mt-3 border-t border-gold-100/50 pt-2">
                  بیرەهاتنا مە یا شرین
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
