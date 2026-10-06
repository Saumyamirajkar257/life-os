/**
 * @file TodayFocusWidget.tsx
 * @description Greeting card featuring Today's Focus, AI Recommendation, and daily progress indicators.
 * @module Features/Analytics/Widgets
 */

import React from 'react';
import { Sparkles, Compass, CheckCircle2, Target, Calendar, ShieldCheck } from 'lucide-react';
import { useTaskStore } from '@/features/tasks/stores/useTaskStore';
import { useHabitStore } from '@/features/habits/stores/useHabitStore';

export const TodayFocusWidget: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks) || [];
  const habits = useHabitStore((state) => state.habits) || [];

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const habitsCompleted = habits.filter((h) => (h as any).isCompletedToday || (h as any).completedToday).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {/* 1. Good Morning & Today's Focus */}
      <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Executive Daily Focus
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1">Good Morning, Alex</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Today's top priority is concluding the <strong className="text-emerald-400">Milestone 20 Analytics Engine</strong> and conducting your weekly financial check-in.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">{completedTasks}/{tasks.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tasks Done</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">{habitsCompleted}/{habits.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Habits Done</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">85%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Focus Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Intelligence Recommendation Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-900/30 rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Recommendation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">Real-Time</span>
          </div>

          <h3 className="text-sm font-bold text-white mb-2">Schedule 90-Min Deep Work Block</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your energy and focus indicators peak between 14:00 and 16:00. Clear low-priority notifications and execute complex tasks during this window.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-indigo-900/30 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Recommended Time: 14:00 - 15:30
          </span>
        </div>
      </div>
    </div>
  );
};
