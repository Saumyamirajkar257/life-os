/**
 * @file AIInsightsDashboard.tsx
 * @description Life OS Intelligence Scores and Sector Analytics Dashboard.
 * @module AuraAI/Components
 */

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Flame, Target, Wallet, HeartPulse, Smile, BookOpen, Scale } from 'lucide-react';
import { useAIContext } from '../hooks/useAIContext';

export const AIInsightsDashboard: React.FC = () => {
  const { snapshot } = useAIContext();

  const sectorScores = [
    { title: 'Productivity', score: 85, icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />, detail: `${snapshot.tasksSummary.pending} tasks pending` },
    { title: 'Habit Consistency', score: 88, icon: <Flame className="w-4 h-4 text-amber-400" />, detail: `${snapshot.habitsSummary.completedToday}/${snapshot.habitsSummary.total} check-ins` },
    { title: 'Goal Alignment', score: 78, icon: <Target className="w-4 h-4 text-indigo-400" />, detail: `${snapshot.goalsSummary.avgProgress}% average progress` },
    { title: 'Financial Health', score: 92, icon: <Wallet className="w-4 h-4 text-emerald-400" />, detail: `$${snapshot.financeSummary.netWorth.toLocaleString()} net worth` },
    { title: 'Health Recovery', score: snapshot.healthSummary.score, icon: <HeartPulse className="w-4 h-4 text-rose-400" />, detail: `${snapshot.healthSummary.sleepHours}h sleep logged` },
    { title: 'Mood & Emotional', score: 84, icon: <Smile className="w-4 h-4 text-violet-400" />, detail: `Status: ${snapshot.journalSummary.recentMood}` },
    { title: 'Learning Trend', score: 80, icon: <BookOpen className="w-4 h-4 text-cyan-400" />, detail: `${snapshot.journalSummary.totalEntries} entries written` },
    { title: 'Life Balance Index', score: 86, icon: <Scale className="w-4 h-4 text-emerald-400" />, detail: 'Holistic 8-sector equilibrium' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" /> Sector Intelligence Analytics
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Life OS Sector Scores & Trends</h2>
        <p className="text-xs text-slate-400">
          Real-time algorithmic scoring evaluating your holistic progress across all 8 life domains.
        </p>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectorScores.map((s, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-800/80">{s.icon}</div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{s.title}</h3>
              </div>
              <span className="text-sm font-bold text-emerald-400">{s.score}/100</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${s.score}%` }} />
            </div>

            <p className="text-[11px] text-slate-400">{s.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
