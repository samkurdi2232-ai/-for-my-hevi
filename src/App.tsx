/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Calendar,
  Gift,
  RefreshCw
} from 'lucide-react';

import { LoveCardConfig } from './types';
import { AmbientSynth } from './utils/audioSynth';
import { saveAudioToDB, getAudioFromDB, deleteAudioFromDB } from './lib/audioDb';
import SparkleCanvas from './components/SparkleCanvas';
import InteractiveCandle from './components/InteractiveCandle';
import BirthdayCountdown from './components/BirthdayCountdown';
import ReasonsList from './components/ReasonsList';

/// Default initial romantic card configuration
const DEFAULT_CONFIG: LoveCardConfig = {
  recipientName: 'هێڤی',
  senderName: 'ئەڤینا تە',
  birthdayDate: '2000-08-25',
  letterTitle: 'بۆ هێڤیا من ya جوان...',
  letterBody: `ژ وێ گاڤا تە پێ ل سەر جیهانا من داناى، هێڤى، تە ژیانا من یا تژى کرى ژ ڕوۆناهى و ئارامیێ. کەنیا تە دەنگێ هەرى خۆشتڤى یە ل دەف من، دلسۆزیا تە پەناگەها منە، و هەبوونا تە هەردەم نیشا من ددەت کا ژیان چەند یا جوانە.

٢٥ێ تەباخێ تایبەتترین ڕۆژا سالێ یە ل دەف من، چونکى ئەو ڕۆژەیە یا کو جیهان پێ هاتیە خەلاتکرن ب ڕۆناهیا تە یا جوان. پیرۆزباهیێ ل ٢٦ سالییا تەمەنێ تە یێ تژى ئەڤین و نەرمى دکەم.

هیڤیدارم ئەڤ سالە بۆ تە یا تژى بت ژ کەیف و خۆشى و دلسۆزى، هەروەکو چەوا تە ئەڤ هەمیە ئیناینە د ژیانا من دا. ئەس گەلەک یێ سوپاسدارم کو ئەس یێ ل ڕەخ تە دڕێژیا ڤێ جادەیا جوان یا ژیانێ دا دچم.

ڕۆژبوونا تە پیرۆز بت، ئەڤینا من.`,
  musicType: 'youtube',
  classicalTrack: 'https://ia802606.us.archive.org/24/items/DebussyClairDeLune/Debussy%20-%20Clair%20de%20Lune.mp3',
  reasons: [
    'کەنیا تە یا نازک و پڕ دلسۆزی کو جیهانا من یا تارى ڕوون دکەت.',
    'دەستێن تە یێن تژی گەرمی کو ئارامییێ ددەنە هەمی ژیانا من.',
    'چاڤێن تە یێن پڕ ستێر کو ڕێکا من بەرەڤ پاشەڕۆژەکا جوان دیار دکەن.',
    'دڵێ تە یێ پڕ ئەڤین کو گەرمترین و پاکترین پەناگەهە بۆ من.',
    'تەنێ ژبەر کو تو بخۆ \'هێڤی\' یی، جوانترین و گرانبهاترین دیاریا خودێ بۆ ژیانا من.'
  ],
  memories: []
};

export default function App() {
  const [config, setConfig] = useState<LoveCardConfig>(() => {
    const saved = localStorage.getItem('romantic_card_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure reasons array is parsed and valid to keep layout robust
        if (parsed && Array.isArray(parsed.reasons) && parsed.reasons.length === 5) {
          return parsed;
        }
        return DEFAULT_CONFIG;
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [canvasIntensity, setCanvasIntensity] = useState<'soft' | 'rich' | 'celebration'>('soft');
  
  // Custom uploaded music states
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);

  // Audio Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<AmbientSynth | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const [isYtReady, setIsYtReady] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('romantic_card_config', JSON.stringify(config));
  }, [config]);

  // Load custom audio from IndexedDB on mount
  useEffect(() => {
    getAudioFromDB().then((file) => {
      if (file) {
        const url = URL.createObjectURL(file);
        setCustomAudioUrl(url);
        setCustomAudioName(file.name);
        
        // Update config to play custom music
        setConfig(prev => ({
          ...prev,
          musicType: 'custom'
        }));
      }
    }).catch(err => {
      console.warn('Failed to load custom audio from IndexedDB', err);
    });
  }, []);

  // Handle custom audio file upload with IndexedDB persistence
  const handleCustomAudioUpload = async (file: File) => {
    try {
      await saveAudioToDB(file);
      if (customAudioUrl) {
        URL.revokeObjectURL(customAudioUrl);
      }
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomAudioName(file.name);
      
      // Stop synth if it was running
      if (synthRef.current) {
        synthRef.current.stop();
      }
      
      // Update config to play custom music
      setConfig(prev => ({
        ...prev,
        musicType: 'custom'
      }));

      // Re-create Audio instance or point it to the custom uploader url
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.volume = volume;

      // Auto play if already playing or if opened
      if (isPlayingMusic || isOpened) {
        audioRef.current.play().catch(err => {
          console.warn('Audio play blocked or failed', err);
        });
        setIsPlayingMusic(true);
      }
    } catch (err) {
      console.error('Failed to save custom audio to IndexedDB', err);
    }
  };

  // Load YouTube Player API on mount
  useEffect(() => {
    // 1. Check if YT script is already appended
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    // 2. Set up the global callback
    (window as any).onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new (window as any).YT.Player('youtube-audio-player', {
        height: '0',
        width: '0',
        videoId: 'JHdOFrtFaZA',
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: 'JHdOFrtFaZA',
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume * 100);
            setIsYtReady(true);
            if (isPlayingMusic && config.musicType === 'youtube') {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // Re-play if ended
            if (event.data === 0) { // ENDED state
              event.target.playVideo();
            }
          }
        }
      });
    };

    // If YT object already exists, manually trigger the initialization
    if ((window as any).YT && (window as any).YT.Player) {
      (window as any).onYouTubeIframeAPIReady();
    }
  }, []);

  // Handle play state sync across all music types on config change or play trigger
  useEffect(() => {
    // Stop all audio players first to prevent overlaying sounds
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthRef.current) {
      synthRef.current.stop();
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
      ytPlayerRef.current.pauseVideo();
    }

    if (isPlayingMusic) {
      if (config.musicType === 'synth') {
        if (!synthRef.current) {
          synthRef.current = new AmbientSynth();
        }
        synthRef.current.start();
      } else if (config.musicType === 'youtube') {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
          ytPlayerRef.current.playVideo();
        }
      } else if (config.musicType === 'classical' || config.musicType === 'custom') {
        const src = config.musicType === 'custom' ? customAudioUrl : config.classicalTrack;
        if (src) {
          if (!audioRef.current) {
            audioRef.current = new Audio(src);
            audioRef.current.loop = true;
          } else {
            audioRef.current.src = src;
          }
          audioRef.current.volume = volume;
          audioRef.current.play().catch(err => {
            console.warn('Audio play blocked or failed', err);
          });
        }
      }
    }
  }, [config.musicType, isPlayingMusic, customAudioUrl, config.classicalTrack]);

  // Sync audio volumes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  const startMusic = () => {
    if (config.musicType === 'silent') return;

    if (config.musicType === 'synth') {
      if (!synthRef.current) {
        synthRef.current = new AmbientSynth();
      }
      synthRef.current.start();
    } else if (config.musicType === 'youtube') {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        ytPlayerRef.current.playVideo();
      }
    } else if ((config.musicType === 'classical' || config.musicType === 'custom')) {
      const src = config.musicType === 'custom' ? customAudioUrl : config.classicalTrack;
      if (src) {
        if (!audioRef.current) {
          audioRef.current = new Audio(src);
          audioRef.current.loop = true;
          audioRef.current.volume = volume;
        }
        audioRef.current.play().catch(err => {
          console.warn('Audio play blocked or failed, waiting for user interaction', err);
        });
      }
    }
    setIsPlayingMusic(true);
  };

  const stopMusic = () => {
    if (synthRef.current) {
      synthRef.current.stop();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
      ytPlayerRef.current.pauseVideo();
    }
    setIsPlayingMusic(false);
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  const handleOpenCard = () => {
    setIsOpened(true);
    // Start background music seamlessly on button click (guarantees browser audio context unlocks)
    startMusic();
    // Launch gold fireworks and hearts!
    setCanvasIntensity('rich');
    setTimeout(() => {
      setCanvasIntensity('soft');
    }, 4000);
  };

  const handleBlowCandle = () => {
    // Increase sparkle intensity dynamically upon blowing candle
    setCanvasIntensity('celebration');
    setTimeout(() => {
      setCanvasIntensity('rich');
    }, 5000);
  };

  const handleResetConfig = () => {
    if (window.confirm('تو پشتڕاستى کو دخوازی هەمی ڕێکخستنان ڤەگێڕى بۆ یێن دەستپێکێ؟')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.removeItem('romantic_card_config');
    }
  };

  return (
    <div id="romantic-card-root" className="min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden relative selection:bg-gold-500/30 selection:text-gold-200">
      
      {/* Background Subtle Gradient Glow (Luxury Starry Velvet Theme) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(30,27,75,0.45)_0%,rgba(15,23,42,1)_100%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.12)_0%,rgba(15,23,42,0)_70%)] pointer-events-none z-0" />

      {/* Twinkling background gold stars pattern */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0 animate-[pulse_6s_infinite_alternate]" />

      {/* Floating Sparkles Canvas */}
      <SparkleCanvas active={isOpened} intensity={canvasIntensity} />

      {/* Audio Control Bar (Only visible when card is opened and music isn't silent) */}
      <AnimatePresence>
        {isOpened && config.musicType !== 'silent' && (
          <motion.div
            id="audio-controls-topbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 z-40 bg-slate-900/80 backdrop-blur-md border border-gold-500/30 rounded-full py-2 px-4 flex items-center gap-3 shadow-lg max-w-sm select-none"
          >
            <button
              onClick={toggleMusic}
              className="p-1.5 rounded-full bg-gold-950 border border-gold-500 text-gold-300 hover:bg-gold-900 transition-all active:scale-90 cursor-pointer flex-shrink-0"
              title={isPlayingMusic ? 'موزیکێ ڕاوەستینە' : 'موزیکێ لێبدە'}
            >
              {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="flex flex-col flex-1 min-w-[80px] overflow-hidden">
              <span className="font-serif text-[10px] italic text-gold-300 font-semibold tracking-wide truncate">
                {config.musicType === 'youtube' 
                  ? 'پەیمان — ئەڤین و جوانی (سترانا یوتیوبێ)' 
                  : config.musicType === 'custom' 
                    ? (customAudioName || 'سترانا تە یا بارکری') 
                    : config.musicType === 'synth' 
                      ? 'ئامێرێ سینتەسایزەرێ' 
                      : 'دیبۆسی — Clair de Lune'}
              </span>
              <span className="font-sans text-[8px] text-slate-300/60 uppercase tracking-widest mt-0.5">
                {isPlayingMusic ? 'یا دهێتە لێدان' : 'یا ڕاوەستایى'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-l border-gold-500/20 pl-2.5 flex-shrink-0">
              {/* Discrete Custom Music File Uploader */}
              <label 
                className="cursor-pointer text-gold-400 hover:text-gold-300 p-1 rounded-full hover:bg-slate-800 transition-colors" 
                title="بارکرنا سترانا تایبەت کو دێ مینیته د کارتی دا"
              >
                <Music className="w-3.5 h-3.5" />
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCustomAudioUpload(file);
                  }} 
                />
              </label>

              {/* Reset to YouTube button (only visible when custom song is active) */}
              {config.musicType === 'custom' && (
                <button
                  onClick={async () => {
                    if (window.confirm('تو دخوازی بزڤڕی بۆ سترانا یوتیوبێ یا دەستپێکێ؟')) {
                      await deleteAudioFromDB();
                      setCustomAudioUrl(null);
                      setCustomAudioName(null);
                      setConfig(prev => ({ ...prev, musicType: 'youtube' }));
                    }
                  }}
                  className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-slate-800 transition-colors"
                  title="ڤەگەڕیان بۆ سترانا یوتیوبێ یا دەستپێکێ"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={() => setVolume(volume === 0 ? 0.4 : 0)}
                className="text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
              >
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-14 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                aria-label="پلەیا دەنگی"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center items-center py-8">
        
        {/* CONTAINER SWITCH (CLOSED VS OPEN) */}
        <main className="w-full max-w-6xl px-4 flex-1 flex items-center justify-center my-6">
          <AnimatePresence mode="wait">
            {!isOpened ? (
              /* SCREEN 1: CLOSED ENVELOPE / INTRO COUNTDOWN */
              <motion.div
                key="closed-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.6, ease: "easeInOut" } }}
                className="w-full flex flex-col items-center gap-10"
              >
                {/* Vintage Letter Envelope Mockup */}
                <div id="envelope-envelope" className="relative w-80 sm:w-[380px] h-56 sm:h-[260px] bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border-2 border-gold-500/40 rounded-2xl shadow-2xl flex flex-col justify-between p-6 overflow-hidden">
                  
                  {/* Diagonal folds background */}
                  <div className="absolute inset-0 pointer-events-none opacity-25">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 0,0 L 190,130 L 380,0" fill="none" stroke="#eed7a0" strokeWidth="1.5" />
                      <path d="M 0,260 L 190,130 L 380,260" fill="none" stroke="#eed7a0" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* Empty space to keep elegant structure */}
                  <div className="h-6" />

                  {/* Embossed Wax Seal Button (Glowing Button) */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                      onClick={handleOpenCard}
                      className="group relative w-20 h-20 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-700 border-2 border-gold-200 shadow-2xl flex flex-col items-center justify-center transform active:scale-95 hover:scale-105 transition-all select-none animate-glow cursor-pointer"
                      title="مۆرا مۆمێ بشکێنە و کارتێ ڤەکە"
                    >
                      {/* Heart seal design */}
                      <Heart className="w-7 h-7 text-slate-950 fill-slate-950/20 group-hover:scale-110 duration-300" />
                      <span className="font-sans text-[7px] font-bold text-slate-950 tracking-widest uppercase mt-1">
                        کارتێ ڤەکە
                      </span>
                    </button>
                  </div>

                  {/* Empty footer space to maintain proportions */}
                  <div className="h-6" />
                </div>

                {/* Live Birthday Countdown widget */}
                <div className="w-full">
                  <BirthdayCountdown 
                    birthdayDate={config.birthdayDate} 
                    recipientName={config.recipientName} 
                    onCelebrationStart={() => setCanvasIntensity('rich')}
                  />
                </div>
              </motion.div>
            ) : (
              /* SCREEN 2: OPENED INTERACTIVE CARD DASHBOARD */
              <motion.div
                key="opened-screen"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full space-y-16"
              >
                {/* 1. Main Golden Frame Love Letter (Stably animated to prevent text shivering during zoom/reading) */}
                <motion.section 
                  id="heartfelt-letter-panel" 
                  className="max-w-3xl mx-auto px-4"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Elegant custom easeOut Cubic curve
                >
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 6, 
                      ease: "easeInOut" 
                    }}
                    className="relative bg-gradient-to-b from-stone-50 via-cream-100 to-stone-100 border-[12px] border-double border-gold-400/60 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/40 overflow-hidden gold-glow-pulse"
                  >
                    
                    {/* Corner golden decorations */}
                    <div className="absolute top-4 left-4 text-gold-500/40 select-none text-xl">✦</div>
                    <div className="absolute top-4 right-4 text-gold-500/40 select-none text-xl">✦</div>
                    <div className="absolute bottom-4 left-4 text-gold-500/40 select-none text-xl">✦</div>
                    <div className="absolute bottom-4 right-4 text-gold-500/40 select-none text-xl">✦</div>

                    <div className="text-center mb-8">
                      <Heart className="w-8 h-8 text-gold-500 fill-gold-500/10 mx-auto mb-3" />
                      <h2 className="font-['Noto_Naskh_Arabic'] text-2xl sm:text-3xl font-bold text-gold-800 tracking-wide">
                        {config.letterTitle}
                      </h2>
                      <div className="w-16 h-0.5 bg-gold-400/30 mx-auto mt-3" />
                    </div>

                    {/* Pre-formatted letter body with beautiful calligraphic Amiri font */}
                    <div className="font-['Amiri'] text-lg sm:text-xl text-stone-950 font-medium text-center leading-[2.2] whitespace-pre-wrap max-w-xl mx-auto py-4 px-2 select-text drop-shadow-sm">
                      {config.letterBody}
                    </div>
                  </motion.div>
                </motion.section>

                {/* 2. Interactive Wish Candle */}
                <section id="virtual-candle-section" className="max-w-md mx-auto">
                  <InteractiveCandle onBlowOut={handleBlowCandle} />
                </section>

                {/* 3. Reasons I Love You flipgrid */}
                <section id="reasons-flipgrid-section" className="w-full">
                  <ReasonsList key={config.reasons.join('|')} reasons={config.reasons} senderName={config.senderName} />
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Hidden YouTube audio player for premium high-fidelity background music */}
        <div id="youtube-audio-player" className="hidden pointer-events-none absolute w-0 h-0 opacity-0" />

        {/* FOOTER */}
        <footer className="text-center px-4 max-w-xl mx-auto mt-6 select-none">
          <p className="font-sans text-[9px] uppercase tracking-widest text-slate-400/60">
            ب ئەڤینیەکا کویر هاتیە چێکرن &bull; ڕۆژبوونا تە پیرۆز بت
          </p>
        </footer>
      </div>
    </div>
  );
}
