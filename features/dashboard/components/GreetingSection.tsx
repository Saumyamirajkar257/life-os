'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp } from '@/animations';
import { useAppStore } from '@/store/useAppStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { Flame, Zap, Target, TrendingUp } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Good Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const MOTIVATIONAL_QUOTES = [
  "Discipline is the bridge between goals and accomplishment.",
  "Small daily improvements lead to stunning results.",
  "Your future self will thank you for the work you do today.",
  "Focus on progress, not perfection.",
  "The compound effect of daily habits is unstoppable.",
  "Consistency beats intensity every single time.",
  "Build systems, not just goals."
];

export function GreetingSection() {
  const [mounted, setMounted] = useState(false);
  const { userName, userPfp } = useAppStore();
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const activeTasksCount = tasks.filter((t) => !t.completed).length;
  const completedToday = tasks.filter(t => t.completed && t.dueDate === todayStr).length;
  const habitsCompleted = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const topStreak = habits.reduce((max, h) => h.currentStreak > max ? h.currentStreak : max, 0);
  
  const dailyQuote = useMemo(() => {
    const dayIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[dayIndex];
  }, []);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex items-start gap-5 w-full"
    >
      {/* User PFP in greeting */}
      {mounted && userPfp && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
          className="relative shrink-0 hidden md:block"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-md opacity-60" />
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/15 shadow-lg">
            <img src={userPfp} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          {getGreeting()},{' '}
          <span className="shimmer-text">
            {mounted ? userName : 'Commander'}.
          </span>
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-white/40 text-base font-light">
            {getFormattedDate()} · {mounted ? activeTasksCount : '...'} task{activeTasksCount === 1 ? '' : 's'} remaining.
          </p>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-wider font-mono text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Systems Online · All Modules Synced
          </div>
        </div>

        {/* Quick stat badges */}
        {mounted && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-2 mt-1"
          >
            {topStreak > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Flame className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-bold font-mono">{topStreak}d streak</span>
              </div>
            )}
            {completedToday > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Target className="w-3 h-3" />
                <span className="text-[10px] font-bold font-mono">{completedToday} done today</span>
              </div>
            )}
            {habitsCompleted > 0 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Zap className="w-3 h-3" />
                <span className="text-[10px] font-bold font-mono">{habitsCompleted}/{habits.length} habits</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Motivational quote */}
        <div className="relative h-6 mt-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={dailyQuote}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 text-[11px] text-white/20 italic font-light max-w-lg"
            >
              "{dailyQuote}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
