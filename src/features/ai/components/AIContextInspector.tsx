/**
 * @file AIContextInspector.tsx
 * @description Live System Context Inspector showing live data gathered from all Aura LIFE OS modules.
 * @module AuraAI/Components
 */

import React from 'react';
import { Eye, RefreshCw, Layers, CheckSquare, Flame, Calendar, Target, Wallet, HeartPulse, BookOpen, Clock } from 'lucide-react';
import { useAIContext } from '../hooks/useAIContext';
import { ContextGatherer } from '../context/contextGatherer';

export const AIContextInspector: React.FC = () => {
  const { snapshot, refreshSnapshot, autoRefresh, setAutoRefresh } = useAIContext();

  const formattedSnapshot = ContextGatherer.formatContextForPrompt(snapshot);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <Eye className="w-4 h-4" /> System Context Inspector
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Live OS Data Synthesis</h2>
          <p className="text-xs text-slate-400">
            Aura Intelligence reads non-duplicated real-time data from all active modules before processing queries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
            />
            Auto-Sync
          </label>
          <button
            id="inspector-refresh-btn"
            onClick={() => refreshSnapshot()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Refresh Live Context
          </button>
        </div>
      </div>

      {/* Grid of Sector Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tasks */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <CheckSquare className="w-4 h-4" /> Tasks Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Pending Tasks: <span className="font-semibold text-slate-100">{snapshot.tasksSummary.pending}</span></div>
            <div>Due Today: <span className="font-semibold text-slate-100">{snapshot.tasksSummary.dueToday}</span></div>
            <div>Urgent Priority: <span className="font-semibold text-slate-100">{snapshot.tasksSummary.urgent}</span></div>
          </div>
        </div>

        {/* Habits */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4" /> Habits Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Total Active: <span className="font-semibold text-slate-100">{snapshot.habitsSummary.total}</span></div>
            <div>Completed Today: <span className="font-semibold text-slate-100">{snapshot.habitsSummary.completedToday}</span></div>
            <div>Active Top Streak: <span className="font-semibold text-amber-400">{snapshot.habitsSummary.topStreaks[0]?.name || 'Workout'}</span></div>
          </div>
        </div>

        {/* Schedule */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Calendar className="w-4 h-4" /> Calendar Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Events Today: <span className="font-semibold text-slate-100">{snapshot.calendarSummary.eventsToday}</span></div>
            <div>Next Up: <span className="font-semibold text-slate-100 truncate">{snapshot.calendarSummary.nextEvent?.title || 'None'}</span></div>
          </div>
        </div>

        {/* Goals */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Target className="w-4 h-4" /> Goals Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Active Goals: <span className="font-semibold text-slate-100">{snapshot.goalsSummary.active}</span></div>
            <div>Average Progress: <span className="font-semibold text-slate-100">{snapshot.goalsSummary.avgProgress}%</span></div>
          </div>
        </div>

        {/* Finance */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Wallet className="w-4 h-4" /> Finance Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Net Worth: <span className="font-semibold text-slate-100">${snapshot.financeSummary.netWorth.toLocaleString()}</span></div>
            <div>Unpaid Bills: <span className="font-semibold text-slate-100">{snapshot.financeSummary.upcomingBillsCount}</span></div>
          </div>
        </div>

        {/* Health */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <HeartPulse className="w-4 h-4" /> Health Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Score: <span className="font-semibold text-slate-100">{snapshot.healthSummary.score}/100</span></div>
            <div>Sleep Logged: <span className="font-semibold text-slate-100">{snapshot.healthSummary.sleepHours}h</span></div>
          </div>
        </div>

        {/* Journal */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
            <BookOpen className="w-4 h-4" /> Journal Context
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Total Entries: <span className="font-semibold text-slate-100">{snapshot.journalSummary.totalEntries}</span></div>
            <div>Recent Mood: <span className="font-semibold text-violet-400">{snapshot.journalSummary.recentMood}</span></div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock className="w-4 h-4" /> Time & Working Hours
          </div>
          <div className="text-xs space-y-1 text-slate-300">
            <div>Date: <span className="font-semibold text-slate-100">{snapshot.dateStr}</span></div>
            <div>Hours: <span className="font-semibold text-slate-100">{snapshot.settingsSummary.workingHours}</span></div>
          </div>
        </div>
      </div>

      {/* Raw Prompt Inspector */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Exact LLM System Prompt Payload
        </h3>
        <p className="text-xs text-slate-400">
          This is the formatted string injected into AI queries when auto-context is enabled.
        </p>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
          {formattedSnapshot}
        </pre>
      </div>
    </div>
  );
};
