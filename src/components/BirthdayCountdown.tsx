/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Gift, Calendar } from 'lucide-react';

interface BirthdayCountdownProps {
  birthdayDate: string; // "YYYY-MM-DD" or similar
  recipientName: string;
  onCelebrationStart?: () => void;
}

export default function BirthdayCountdown({ birthdayDate, recipientName, onCelebrationStart }: BirthdayCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // Parse birthday date
      const bday = new Date(birthdayDate);
      
      // We check if it is her birthday today (matching month and day)
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      const bdayMonth = bday.getMonth();
      const bdayDay = bday.getDate();

      const isToday = currentMonth === bdayMonth && currentDay === bdayDay;
      setIsBirthdayToday(isToday);

      if (isToday) {
        if (onCelebrationStart) {
          onCelebrationStart();
        }
        return;
      }

      // If her birthday isn't today, calculate target date
      // If her birthday already passed this year, set target to next year's birthday
      let targetYear = now.getFullYear();
      const currentBdayThisYear = new Date(targetYear, bdayMonth, bdayDay, 0, 0, 0);
      
      if (now > currentBdayThisYear) {
        targetYear += 1;
      }

      const targetDate = new Date(targetYear, bdayMonth, bdayDay, 0, 0, 0);
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setIsBirthdayToday(true);
        if (onCelebrationStart) {
          onCelebrationStart();
        }
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [birthdayDate, onCelebrationStart]);

  const getAgeTurning = () => {
    try {
      const bday = new Date(birthdayDate);
      if (isNaN(bday.getTime())) return null;
      
      const now = new Date();
      let targetYear = now.getFullYear();
      
      const bdayMonth = bday.getMonth();
      const bdayDay = bday.getDate();
      const currentBdayThisYear = new Date(targetYear, bdayMonth, bdayDay, 0, 0, 0);
      
      // If today is past her birthday this year, she'll turn the age next year
      if (now > currentBdayThisYear) {
        targetYear += 1;
      }
      return targetYear - bday.getFullYear();
    } catch (e) {
      return null;
    }
  };

  const getOrdinalSuffix = (num: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const age = getAgeTurning();
  const ageDisplay = age ? `${age} ` : '';

  if (isBirthdayToday) {
    const todayAge = age ? age - 1 : 26; // If it's today, she turned this age today
    return (
      <div id="countdown-celebration" className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gold-50 via-cream-50 to-gold-100/40 border border-gold-400/30 rounded-2xl shadow-md max-w-md mx-auto text-center animate-pulse">
        <div className="w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-500 mb-3">
          <Gift className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl text-gold-700 font-semibold tracking-wide">
          ڕۆژبوونا تە یا {todayAge} سالیێ پیرۆز بت، {recipientName}!
        </h3>
        <p className="font-sans text-[12px] text-cream-900/70 mt-1 max-w-[280px]">
          ئەڤڕۆ هەمی تشت ل سەر تە یە، {recipientName}. هەر چرکەیەکا ڤێ ڕۆژێ پیرۆزباهییێ ل تەمەنێ تە یێ {todayAge} سالی یێ جوان ل ڤێ جیهانێ دکەت.
        </p>
      </div>
    );
  }

  const timeBlocks = [
    { label: 'ڕۆژ', value: timeLeft.days },
    { label: 'دەمژمێر', value: timeLeft.hours },
    { label: 'دەقێقە', value: timeLeft.minutes },
    { label: 'سانیە', value: timeLeft.seconds },
  ];

  return (
    <div id="countdown-timer-widget" className="flex flex-col items-center p-6 bg-cream-50/70 border border-gold-200/40 rounded-2xl max-w-md mx-auto shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-gold-500" />
        <span className="font-serif text-sm text-gold-700 font-medium tracking-wider uppercase">
          بەرەڤ ڕۆژبوونا تە یا {ageDisplay}سالیێ
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-[320px]">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="flex flex-col items-center bg-white/60 border border-gold-200/20 rounded-xl py-3 shadow-inner"
          >
            <span className="font-serif text-2xl font-semibold text-gold-600 tracking-tight">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="font-sans text-[9px] text-cream-900/40 tracking-wider uppercase mt-1">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
