'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Check, Trash2, Calendar, Target, Zap } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { useHabitsStore, type Habit } from '@/store/useHabitsStore';
import { GlassCard, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { HabitModal } from '@/components/habits/HabitModal';
import { Edit2 } from 'lucide-react';

export default function HabitsPage() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const { habits, toggleHabitComplete, deleteHabit } = useHabitsStore();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Last 7 days helper list to build the grid
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

  const stats = useMemo(() => {
    if (habits.length === 0) return { total: 0, completedToday: 0, rate: 0 };
    const completedToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
    return {
      total: habits.length,
      completedToday,
      rate: Math.round((completedToday / habits.length) * 100),
    };
  }, [habits, todayStr]);

  const habitsByCategory = useMemo(() => {
    const grouped: Record<string, Habit[]> = {};
    habits.forEach(h => {
      const cat = h.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(h);
    });
    return grouped;
  }, [habits]);

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Loading habit cycles...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Habits</h1>
        <p className="text-white/40 text-sm mt-1">Consistency creates character. Track your daily routines.</p>
      </div>

      {/* Habits Stat Overview banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <GlassCard className="flex items-center gap-4 p-5" glowOnHover={true}>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Total Routines</div>
            <div className="font-display text-xl font-bold text-white mt-0.5">{stats.total} Active</div>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 p-5" glowOnHover={true}>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Completed Today</div>
            <div className="font-display text-xl font-bold text-white mt-0.5">{stats.completedToday} Done</div>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 p-5" glowOnHover={true}>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Completion Rate</div>
            <div className="font-display text-xl font-bold text-white mt-0.5">{stats.rate}% Target</div>
          </div>
        </GlassCard>
      </div>

      {/* Add Habit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => { setHabitToEdit(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Establish New Habit
        </button>
      </div>

      {/* Active Habits list */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-mono tracking-wider text-white/40 uppercase border-b border-white/5 pb-2">Active Routines</h3>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4 w-full"
        >
          <AnimatePresence mode="popLayout">
            {Object.entries(habitsByCategory).map(([category, catHabits]) => (
              <div key={category} className="mb-6">
                <h4 className="text-sm font-semibold text-white/60 mb-3 ml-1">{category}</h4>
                <div className="flex flex-col gap-3">
                  {catHabits.map((habit) => {
                    const isDoneToday = habit.completedDates.includes(todayStr);
                    return (
                      <motion.div
                        layout
                        variants={fadeInUp}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={habit.id}
                        className={cn(
                          "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/10 glass-panel hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                        )}
                      >
                        {/* Custom Color Strip */}
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1", habit.color?.split(' ')[0] || "bg-indigo-500")} />
                        
                        {/* Left Info */}
                        <div className="flex items-center gap-4 pl-2">
                          <button
                            onClick={() => toggleHabitComplete(habit.id, todayStr)}
                            className={cn(
                              "w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 shrink-0",
                              isDoneToday
                                ? "bg-white border-white text-black"
                                : "border-white/20 group-hover:border-white/40 hover:scale-105"
                            )}
                          >
                            {isDoneToday && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                          <div>
                            <h4 className={cn("text-sm font-semibold transition-all flex items-center gap-2", isDoneToday && "text-white/40 line-through")}>
                              {habit.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-white/30 font-mono uppercase">
                              <Calendar className="w-3 h-3" />
                              <span>{habit.frequency}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Completion grid & Streaks */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                          {/* Visual 7 day history */}
                          <div className="flex items-center gap-1.5">
                            {pastSevenDays.map((day, dIdx) => {
                              const dateCompleted = habit.completedDates.includes(day.dateStr);
                              const isDayToday = day.dateStr === todayStr;
                              return (
                                <button
                                  key={dIdx}
                                  onClick={() => toggleHabitComplete(habit.id, day.dateStr)}
                                  className="flex flex-col items-center gap-1 group/day"
                                  title={`Toggle completion for ${day.dateStr}`}
                                >
                                  <span className="text-[8px] font-mono text-white/20 group-hover/day:text-white/40 transition-colors uppercase">
                                    {day.dayName}
                                  </span>
                                  <div
                                    className={cn(
                                      "w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-200",
                                      dateCompleted
                                        ? "bg-white/80 border-white/80 text-black"
                                        : "border-white/10 hover:border-white/30 hover:bg-white/5",
                                      isDayToday && !dateCompleted && "border-dashed border-white/30"
                                    )}
                                  >
                                    {dateCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Streak Indicator */}
                          <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl min-w-[56px]">
                            <div className="flex items-center gap-1 text-white font-bold text-sm">
                              <Flame className={cn("w-4 h-4 stroke-[2]", habit.currentStreak > 0 ? "text-orange-400 fill-orange-400/20" : "text-white/30")} />
                              <span className="font-mono">{habit.currentStreak}</span>
                            </div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-wide mt-0.5">Streak</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                            <button
                              onClick={() => { setHabitToEdit(habit); setIsModalOpen(true); }}
                              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                              title="Edit Habit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="p-2 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                              title="Delete Habit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </AnimatePresence>

          {habits.length === 0 && (
            <div className="glass-panel border border-white/10 rounded-2xl p-12 text-center text-white/30 font-mono text-sm">
              No habit routines established. Let's add one to begin!
            </div>
          )}
        </motion.div>
      </div>
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitToEdit={habitToEdit}
      />
    </motion.div>
  );
}
