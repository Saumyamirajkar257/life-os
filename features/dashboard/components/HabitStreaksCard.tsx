'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { useHabitsStore } from '@/store/useHabitsStore';

export function HabitStreaksCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { habits } = useHabitsStore();

  const pastSevenDays = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      list.push({
        dateStr: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      });
    }
    return list;
  }, []);

  if (!mounted) {
    return (
      <GlassCard
        icon={<Flame className="w-5 h-5" />}
        header="Habit Streaks"
        className="h-full"
        animated={false}
      >
        <div className="h-[200px] flex items-center justify-center text-white/30 text-xs font-mono">
          Synching streaks...
        </div>
      </GlassCard>
    );
  }

  // Display top 3 habits
  const topHabits = habits.slice(0, 3);

  return (
    <GlassCard
      icon={<Flame className="w-5 h-5" />}
      header="Habit Streaks"
      className="h-full"
      animated={false}
    >
      <div className="space-y-4">
        {topHabits.map((habit, i) => (
          <div key={habit.id} className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-sm font-medium">{habit.title}</span>
              <span className="text-white/40 text-xs font-mono">{habit.currentStreak} days</span>
            </div>
            <div className="flex gap-1.5">
              {pastSevenDays.map((day, j) => {
                const isActive = habit.completedDates.includes(day.dateStr);
                return (
                  <div key={j} className="flex flex-col items-center gap-1 flex-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.1 + j * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`w-full h-8 rounded-sm origin-bottom ${
                        isActive
                          ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                          : 'bg-white/10'
                      }`}
                    />
                    <span className="text-[10px] text-white/30">{day.dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {topHabits.length === 0 && (
          <div className="text-center py-6 text-white/30 text-xs font-mono">
            No routines tracked yet.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
