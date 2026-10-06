/**
 * @file AuraAIHome.tsx
 * @description Central Aura AI Home Dashboard synthesizing all 8 OS sectors.
 * @module AuraAI/Components
 */

import React from 'react';
import {
  Sparkles,
  Zap,
  Calendar,
  CheckCircle2,
  Flame,
  Target,
  Wallet,
  HeartPulse,
  Smile,
  ArrowRight,
  RefreshCw,
  Play,
  Activity,
  Lightbulb,
} from 'lucide-react';
import { useAIContext } from '../hooks/useAIContext';
import { useAIWorkflows } from '../hooks/useAIWorkflows';
import { QUICK_SUGGESTIONS } from '../constants';

interface AuraAIHomeProps {
  onNavigateToChat: (prompt?: string) => void;
  onNavigateToSection: (section: string) => void;
}

export const AuraAIHome: React.FC<AuraAIHomeProps> = ({ onNavigateToChat, onNavigateToSection }) => {
  const { snapshot, refreshSnapshot } = useAIContext();
  const { runWorkflow, activeRunningWorkflowId } = useAIWorkflows();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Good Morning Hero */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Aura Intelligence OS
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
              {getGreeting()}, User
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Your digital footprint is fully synchronized. Here is your holistic life summary, high-priority focus points, and active recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="refresh-context-btn"
              onClick={() => refreshSnapshot()}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" /> Refresh Context
            </button>
            <button
              id="plan-my-day-hero-btn"
              onClick={() => runWorkflow('plan_my_day')}
              disabled={activeRunningWorkflowId === 'plan_my_day'}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {activeRunningWorkflowId === 'plan_my_day' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Plan My Day
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Proactive Recommendation Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">AI Daily Synthesis & Focus Recommendation</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              You have {snapshot.tasksSummary.pending} pending tasks ({snapshot.tasksSummary.dueToday} due today) and 1 habit streak requiring attention. Reserve 09:00 - 11:30 for high-impact focus work.
            </p>
          </div>
        </div>
        <button
          id="ask-ai-recommendation-btn"
          onClick={() => onNavigateToChat("How can I optimize today's schedule for deep focus work?")}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          Ask AI <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 8-Sector Overview Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sector 1: Today's Tasks */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks & Focus</span>
            </div>
            <button
              id="goto-tasks-btn"
              onClick={() => onNavigateToSection('tasks')}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{snapshot.tasksSummary.pending} Pending</div>
            <p className="text-xs text-slate-400 mt-1">
              {snapshot.tasksSummary.dueToday} due today • {snapshot.tasksSummary.urgent} urgent priority
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Top Priority: <span className="text-slate-200 font-medium">{snapshot.tasksSummary.topTasks[0]?.title || 'None'}</span>
          </div>
        </div>

        {/* Sector 2: Habits & Streaks */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Habits & Streaks</span>
            </div>
            <button
              id="goto-habits-btn"
              onClick={() => onNavigateToSection('habits')}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">
              {snapshot.habitsSummary.completedToday} / {snapshot.habitsSummary.total} Completed
            </div>
            <p className="text-xs text-slate-400 mt-1">Daily goal progress check-ins</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Top Streak: <span className="text-amber-400 font-medium">{snapshot.habitsSummary.topStreaks[0]?.name || 'Workout'} ({snapshot.habitsSummary.topStreaks[0]?.streak || 14} days)</span>
          </div>
        </div>

        {/* Sector 3: Calendar & Schedule */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schedule</span>
            </div>
            <button
              id="goto-calendar-btn"
              onClick={() => onNavigateToSection('calendar')}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{snapshot.calendarSummary.eventsToday} Events Today</div>
            <p className="text-xs text-slate-400 mt-1">Calendar & scheduled focus blocks</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Next: <span className="text-emerald-400 font-medium">{snapshot.calendarSummary.nextEvent?.title || 'No upcoming event'}</span>
          </div>
        </div>

        {/* Sector 4: Goals & Projects */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goals & Vision</span>
            </div>
            <button
              id="goto-goals-btn"
              onClick={() => onNavigateToSection('goals')}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{snapshot.goalsSummary.active} Active Goals</div>
            <p className="text-xs text-slate-400 mt-1">Average progress: {snapshot.goalsSummary.avgProgress}%</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Top Goal: <span className="text-indigo-400 font-medium">{snapshot.goalsSummary.topGoals[0]?.title || 'Q3 Mastery'}</span>
          </div>
        </div>

        {/* Sector 5: Finance & Wealth */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Finance & Wealth</span>
            </div>
            <button
              id="goto-finance-btn"
              onClick={() => onNavigateToSection('finance')}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">${snapshot.financeSummary.netWorth.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Net worth across synced accounts</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Upcoming Bills: <span className="text-slate-200 font-medium">{snapshot.financeSummary.upcomingBillsCount} unpaid</span>
          </div>
        </div>

        {/* Sector 6: Health Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health & Recovery</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{snapshot.healthSummary.score} / 100</div>
            <p className="text-xs text-slate-400 mt-1">Sleep: {snapshot.healthSummary.sleepHours}h • Active: {snapshot.healthSummary.activeMinutes}m</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Recovery: <span className="text-rose-400 font-medium">Optimal readiness</span>
          </div>
        </div>

        {/* Sector 7: Mood & Emotional Well-being */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Smile className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mood & Reflection</span>
            </div>
            <button
              id="goto-journal-btn"
              onClick={() => onNavigateToSection('journal')}
              className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              View <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{snapshot.journalSummary.recentMood}</div>
            <p className="text-xs text-slate-400 mt-1">{snapshot.journalSummary.totalEntries} journal entries logged</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Emotional Balance: <span className="text-violet-400 font-medium">Calm & Focused</span>
          </div>
        </div>

        {/* Sector 8: AI Intelligence Activity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI System State</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">100% Synced</div>
            <p className="text-xs text-slate-400 mt-1">Context gatherer active on port 3000</p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            Model: <span className="text-emerald-400 font-medium">Gemini 3.6 Flash</span>
          </div>
        </div>
      </div>

      {/* Quick Prompts & Suggestions */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> Quick Synthesis Prompts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              id={`quick-suggestion-btn-${i}`}
              onClick={() => onNavigateToChat(s)}
              className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/40 text-slate-300 text-xs text-left transition-all flex items-center justify-between gap-2 group cursor-pointer"
            >
              <span>{s}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
