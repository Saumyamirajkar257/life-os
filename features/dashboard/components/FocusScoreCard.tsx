'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { useAIStore } from '@/store/useAIStore';

export function FocusScoreCard() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { lifeScore } = useAIStore();
  const score = lifeScore.score;

  useEffect(() => {
    if (!mounted) return;
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setCount(score);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [mounted, score]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (!mounted) {
    return (
      <GlassCard className="h-full flex flex-col items-center justify-center" animated={false}>
        <div className="h-[120px] flex items-center justify-center text-white/30 text-xs font-mono">
          Loading metrics...
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="h-full flex flex-col items-center justify-center" animated={false}>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold text-white">{count}</span>
          <span className="text-white/40 text-xs">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Target className="w-4 h-4 text-white/40" />
        <p className="text-white/50 text-sm">Life Index Score</p>
      </div>
    </GlassCard>
  );
}
