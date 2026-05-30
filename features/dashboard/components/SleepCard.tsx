'use client';

import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { GlassCard } from '@/components/ui';

export function SleepCard() {
  const sleepHours = 7.4;
  const sleepQuality = 82;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (sleepQuality / 100) * circumference;

  return (
    <GlassCard className="h-full flex flex-col items-center justify-center" animated={false}>
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Moon className="w-6 h-6 text-white/40" />
        </div>
      </div>
      <h3 className="font-display font-semibold text-lg">Sleep Recovery</h3>
      <div className="font-display text-3xl font-bold mt-1">7h 24m</div>
      <p className="text-white/40 text-xs mt-2 text-center max-w-[180px]">
        Quality: {sleepQuality}% · Optimal for deep work
      </p>
    </GlassCard>
  );
}
