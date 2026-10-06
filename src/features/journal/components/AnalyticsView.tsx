/**
 * @file AnalyticsView.tsx
 * @description Writing streaks, mood trends, total word counts, and weekly activity charts for Second Brain.
 * @module Features/Journal/Components
 */

import React from 'react';
import { Flame, BookOpen, FileText, Zap, BarChart2, Tag, Smile, TrendingUp } from 'lucide-react';
import { useJournalAnalytics } from '../analytics/useJournalAnalytics';
import { MOOD_DEFINITIONS } from '../constants/journalConstants';
import { MoodType } from '../types/journal.types';

export const AnalyticsView: React.FC = () => {
  const analytics = useJournalAnalytics();

  return (
    <div className="flex flex-col gap-6">
      {/* Top Streak & Stat Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Writing Streak Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-md flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {analytics.currentStreakDays} Days
            </span>
            <p className="text-xs text-amber-300/80 font-medium">Active Writing Streak</p>
          </div>
        </div>

        {/* Total Words Written */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {analytics.totalWordsWritten.toLocaleString()}
            </span>
            <p className="text-xs text-slate-400 font-medium">Total Words Captured</p>
          </div>
        </div>

        {/* Active Memories (Journals + Notes) */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {analytics.totalJournals + analytics.totalNotes}
            </span>
            <p className="text-xs text-slate-400 font-medium">Second Brain Memories</p>
          </div>
        </div>

        {/* Writing Hours */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {analytics.totalWritingHours}h
            </span>
            <p className="text-xs text-slate-400 font-medium">Focused Reflection Time</p>
          </div>
        </div>
      </div>

      {/* Main Analytics Row: Weekly Activity + Mood Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100">Weekly Writing Distribution</h3>
            </div>
            <span className="text-xs font-mono text-purple-300">{analytics.entriesThisWeek} entries this week</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-44 pt-4">
            {analytics.weeklyDistribution.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-400">{d.count}</span>
                <div
                  className="w-full max-w-[28px] rounded-t-xl bg-purple-600/80 hover:bg-purple-500 transition-all"
                  style={{
                    height: `${Math.max(12, (d.count / Math.max(1, ...analytics.weeklyDistribution.map((w) => w.count))) * 120)}px`,
                  }}
                />
                <span className="text-[11px] font-mono font-semibold text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Mood & Mindset Reflections</h3>
          </div>

          <div className="flex flex-col gap-3">
            {analytics.moodDistribution.map((item) => {
              const def = MOOD_DEFINITIONS[item.mood as MoodType];
              return (
                <div key={item.mood} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold" style={{ color: def?.color }}>
                      <span>{def?.emoji}</span>
                      <span>{def?.label}</span>
                    </span>
                    <span className="font-mono text-slate-400">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: def?.color || '#8B5CF6',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
