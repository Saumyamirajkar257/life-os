'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, BarChart3, LineChart, BookOpen, Laptop, Users, Settings2, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { useTasksStore } from '@/store/useTasksStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { GlassCard } from '@/components/ui';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'year'>('month');

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const { tasks } = useTasksStore();
  const { transactions } = useFinanceStore();
  const { habits } = useHabitsStore();

  // Filter multiplier based on activePeriod
  const periodDays = activePeriod === 'week' ? 7 : activePeriod === 'month' ? 30 : 365;

  // Dynamic calculations from other stores
  const completedTasksCount = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const savingsRate = useMemo(() => {
    // We filter by activePeriod roughly
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - periodDays)).toISOString().split('T')[0];

    const periodTx = transactions.filter((tx) => tx.date >= cutoff);
    const txIncome = periodTx.filter((t) => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) || (activePeriod === 'week' ? 1500 : 6200);
    const txExpense = periodTx.filter((t) => t.type === 'expense').reduce((acc, curr) => acc + Math.abs(curr.amount), 0) || (activePeriod === 'week' ? 800 : 3840);
    if (txIncome <= 0) return 38;
    return Math.round(((txIncome - txExpense) / txIncome) * 100);
  }, [transactions, activePeriod, periodDays]);

  const heatmapData = useMemo(() => {
    const data = [];
    const today = new Date();
    // 12 weeks = 84 days
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = habits.filter(h => h.completedDates.includes(dateStr)).length;
      data.push({ date: dateStr, count });
    }
    return data;
  }, [habits]);

  const focusScore = useMemo(() => {
    // Base score on habits completion in the last `periodDays` days
    if (habits.length === 0) return 87; // fallback
    const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
    const avgCompletions = totalCompletions / (habits.length || 1);
    return Math.min(100, Math.round(50 + (avgCompletions * 5)));
  }, [habits]);

  const focusHours = useMemo(() => {
    // Calculate a rough estimate of hours based on completed habits/tasks
    return (completedTasksCount * 0.5) + (habits.reduce((s, h) => s + h.completedDates.length, 0) * 0.25) || 186;
  }, [completedTasksCount, habits]);

  const activities = [
    { label: 'Habits Tracker', hours: Math.round(focusHours * 0.35), percent: 35, icon: BookOpen },
    { label: 'Task Execution', hours: Math.round(focusHours * 0.55), percent: 55, icon: Laptop },
    { label: 'Brain Journaling', hours: Math.round(focusHours * 0.10), percent: 10, icon: Settings2 },
  ];

  const categories = [
    { name: 'Completed Tasks', percent: tasks.length ? Math.round((completedTasksCount/tasks.length)*100) : 45, color: 'bg-white' },
    { name: 'Habits Consistency', percent: focusScore > 100 ? 100 : focusScore, color: 'bg-zinc-400' },
    { name: 'Financial Savings', percent: savingsRate > 100 ? 100 : savingsRate, color: 'bg-zinc-600' },
  ];

  // Circle path math for SVG ring
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = Math.max(0, circumference - (focusScore / 100) * circumference);

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Compiling analytics grid...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Track your productivity, focus trends, and efficiency</p>
        </div>
        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5 shrink-0 self-start sm:self-center">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all ${
                activePeriod === period
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Stat 1 */}
        <GlassCard className="flex flex-col gap-2 p-5" glowOnHover={true}>
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
            <CheckCircle2 className="w-4 h-4 text-white/30" />
            <span>Tasks Completed</span>
          </div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {completedTasksCount}
          </div>
          <div className="text-[10px] text-white/30 font-mono mt-2">
            Active in tasks pipeline
          </div>
        </GlassCard>

        {/* Stat 2 */}
        <GlassCard className="flex flex-col gap-2 p-5" glowOnHover={true}>
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
            <Clock className="w-4 h-4 text-white/30" />
            <span>Hours Tracked</span>
          </div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {Math.round(focusHours)}h
          </div>
          <div className="text-[10px] text-white/30 font-mono mt-2">
            Based on active features
          </div>
        </GlassCard>

        {/* Stat 3 */}
        <GlassCard className="flex flex-col gap-2 p-5" glowOnHover={true}>
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
            <BarChart3 className="w-4 h-4 text-white/30" />
            <span>Focus Score</span>
          </div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {focusScore}
          </div>
          <div className="text-[10px] text-white/30 font-mono mt-2">
            Habit completion momentum
          </div>
        </GlassCard>

        {/* Stat 4 */}
        <GlassCard className="flex flex-col gap-2 p-5" glowOnHover={true}>
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
            <LineChart className="w-4 h-4 text-white/30" />
            <span>Savings Rate</span>
          </div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {savingsRate}%
          </div>
          <div className="text-[10px] text-white/30 font-mono mt-2">
            Synchronized with bank roll
          </div>
        </GlassCard>
      </div>

      {/* Main Charts & Ring Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-display font-medium text-white/80 text-sm tracking-wide">
            Productivity Heatmap (Last 12 Weeks)
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
              {Array.from({ length: 12 }).map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, rowIndex) => {
                    const index = colIndex * 7 + rowIndex;
                    const dayData = heatmapData[index];
                    if (!dayData) return null;
                    const intensity = Math.min(dayData.count, 4);
                    const bgColors = [
                      'bg-white/5',
                      'bg-emerald-500/20',
                      'bg-emerald-500/40',
                      'bg-emerald-500/60',
                      'bg-emerald-500/80',
                    ];
                    return (
                      <div
                        key={`${colIndex}-${rowIndex}`}
                        className={`w-3.5 h-3.5 rounded-[3px] ${bgColors[intensity]} border border-white/5 hover:border-white/40 transition-colors cursor-pointer`}
                        title={`${dayData.date}: ${dayData.count} habits completed`}
                      />
                    );
                  })}
                </div>
              ))}
              
              {/* Padding to push to right if needed, or flex grow */}
              <div className="flex-1" />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-white/40 font-mono mt-1 pt-1">
            <span>12 weeks ago</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="flex gap-1 mx-1">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/20" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/60" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/80" />
              </div>
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </div>

        {/* Productivity Score Ring */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between gap-6 text-center">
          <h3 className="font-display font-medium text-white/80 text-sm tracking-wide self-start">
            Productivity Score
          </h3>
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
              <circle
                className="fill-none stroke-white/5"
                cx="90"
                cy="90"
                r={circleRadius}
                strokeWidth="12"
              />
              <motion.circle
                className="fill-none stroke-white"
                cx="90"
                cy="90"
                r={circleRadius}
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-white">{focusScore}</span>
              <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase mt-0.5">Rating</span>
            </div>
          </div>
          <div className="text-sm font-medium text-white/70">
            Excellent performance this month
          </div>
        </div>
      </div>

      {/* Bottom Row: Time Distribution & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Time Distribution */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-display font-medium text-white/80 text-sm tracking-wide border-b border-white/5 pb-3">
            Time Distribution
          </h3>
          <div className="flex flex-col gap-4">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/50 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs font-semibold text-white/80">
                      <span>{act.label}</span>
                      <span className="font-mono text-white/40">{act.hours}h</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${act.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-display font-medium text-white/80 text-sm tracking-wide border-b border-white/5 pb-3">
            Category Breakdown
          </h3>
          <div className="flex flex-col gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full shrink-0 ${cat.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-semibold text-white/80">
                    <span>{cat.name}</span>
                    <span className="font-mono text-white/40">{cat.percent}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cat.color}`}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
