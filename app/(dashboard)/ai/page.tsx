'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  Sparkles,
  Trophy,
  Flame,
  AlertTriangle,
  Send,
  User,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Percent,
  Layers,
  Heart,
  Moon,
  Clock,
  Briefcase,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { useAIStore, type AIGoal, type Milestone, type AIInsight } from '@/store/useAIStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function AIPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'chat'>('dashboard');
  
  // Goal Creator Form
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalType, setNewGoalType] = useState<'short-term' | 'long-term'>('short-term');
  const [generatingGoal, setGeneratingGoal] = useState(false);

  // Chat Input
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'user' | 'assistant'; content: string }[]>([
    { id: '1', sender: 'assistant', content: 'Welcome to your Life OS Cognitive Core. I am reading your active stats, habit streaks, and financial data. Ask me anything about your productivity or habits.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // AI Memory Editors
  const [editBestFocus, setEditBestFocus] = useState('');
  const [editMainWeakness, setEditMainWeakness] = useState('');
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  // Syncing states
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { transactions } = useFinanceStore();

  const {
    goals,
    memory,
    dailyBriefing,
    weeklyReview,
    insights,
    burnoutStatus,
    lifeScore,
    addGoal,
    toggleMilestone,
    deleteGoal,
    updateMemory,
    setDailyBriefing,
    setWeeklyReview,
    setInsights,
    setBurnoutStatus,
    setLifeScore
  } = useAIStore();

  // Populate memory editors
  useEffect(() => {
    if (mounted) {
      setEditBestFocus(memory.bestFocusTime);
      setEditMainWeakness(memory.mainWeakness);
    }
  }, [mounted, memory]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Build secure request payload
  const requestContext = useMemo(() => {
    return { tasks, habits, transactions, memory };
  }, [tasks, habits, transactions, memory]);

  // Synchronize AI predictions with actual Zustand store data
  const handleSyncAI = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'briefing', context: requestContext }),
      });
      if (response.ok) {
        const data = await response.json();
        setDailyBriefing(data);
      }

      const burnoutRes = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'burnout', context: requestContext }),
      });
      if (burnoutRes.ok) {
        const data = await burnoutRes.json();
        setBurnoutStatus(data);
      }

      const insightsRes = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insights', context: requestContext }),
      });
      if (insightsRes.ok) {
        const data = await insightsRes.json();
        setInsights(data);
      }

      const scoreRes = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lifescore', context: requestContext }),
      });
      if (scoreRes.ok) {
        const data = await scoreRes.json();
        setLifeScore(data);
      }
    } catch (e) {
      console.error('Error synchronizing AI Core:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Goal with AI milestone generation
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    setGeneratingGoal(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'milestones',
          goalName: newGoalName.trim(),
          goalType: newGoalType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addGoal(newGoalName.trim(), newGoalType, data.milestones, data.timeline);
      } else {
        // Fallback milestones
        addGoal(newGoalName.trim(), newGoalType, [
          { name: 'Research and define prerequisites', targetDate: 'In 2 days' },
          { name: 'Complete initial setup', targetDate: 'In 5 days' },
          { name: 'User review and adjustment', targetDate: 'In 10 days' },
          { name: 'Deploy final release', targetDate: 'In 15 days' },
        ], '15 days');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNewGoalName('');
      setGeneratingGoal(false);
    }
  };

  // Conversational coach message request
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user' as const, content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: userMsg.content,
          context: requestContext,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: 'assistant', content: data.response }]);
      } else {
        setChatMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: 'assistant', content: 'Cognitive Core encountered a synching delay. Maintain current habit streaks to lock in progress.' }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Initializing Cognitive Core AI Strategist...
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
      {/* Header and Sync controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BrainCircuit className="w-8 h-8 text-white/90 stroke-[1.5]" />
            <span>Cognitive Core</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Autonomous personal strategist, burnout monitor, and life mentor node</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Section Navigation Tabs */}
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
            {(['dashboard', 'goals', 'chat'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-all",
                  activeTab === tab
                    ? "bg-white text-black font-semibold"
                    : "text-white/40 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={handleSyncAI}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 text-white hover:bg-white/5 text-xs font-mono rounded-xl transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? 'SYNING...' : 'SYNC CORE'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="w-full">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left & Center: Core Insights & Briefing */}
            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              {/* Burnout Indicator Flash Banner */}
              {burnoutStatus?.detected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl border border-zinc-500 bg-zinc-950/80 flex items-start gap-3 shadow-[0_0_15px_rgba(240,240,240,0.1)]"
                >
                  <AlertTriangle className="w-5 h-5 text-zinc-300 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Cognitive Burnout Indicator Detected ({burnoutStatus?.level || 'none'})</h4>
                    <p className="text-xs text-white/60 mt-1">{burnoutStatus?.explanation || 'Rest advised.'}</p>
                    <div className="mt-3 flex flex-col gap-1">
                      {burnoutStatus?.suggestions?.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-white/80 font-mono">
                          <ChevronRight className="w-3 h-3 text-white/40" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Daily Briefing Card */}
              {dailyBriefing && (
                <GlassCard className="p-5 flex flex-col gap-4 border-white/20">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-display font-medium text-white/90 text-sm tracking-wide flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white/50" />
                      <span>Daily Briefing</span>
                    </h3>
                    <span className="text-[10px] font-mono text-white/30">{dailyBriefing.date}</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-white/80 leading-relaxed italic">
                      "{dailyBriefing.productivitySummary}"
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="text-[10px] font-mono text-white/40 uppercase">Focus Recommendation</div>
                        <p className="text-xs text-white/80 mt-1">{dailyBriefing.todayFocusRecommendation}</p>
                      </div>
                      <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="text-[10px] font-mono text-white/40 uppercase">Streaks Node</div>
                        <p className="text-xs text-white/80 mt-1">{dailyBriefing.streakUpdates}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center text-xs font-mono tracking-widest text-white/70 uppercase">
                      &gt;&gt; {dailyBriefing.motivation}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Correlation Analysis Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {/* 1. Habit correlation */}
                <GlassCard className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
                    <Heart className="w-4 h-4 text-white/30" />
                    <span>Habits ↔ Productivity</span>
                  </div>
                  <div className="h-16 flex items-end gap-1.5 w-full pt-2">
                    {[20, 40, 55, 60, 85, 90, 95].map((h, idx) => (
                      <div key={idx} className="flex-1 bg-white/10 rounded-sm h-full flex items-end">
                        <div className="bg-white rounded-t-sm w-full transition-all" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                    Completing Morning routines directly precedes higher task execution yields.
                  </p>
                </GlassCard>

                {/* 2. Sleep correlation */}
                <GlassCard className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
                    <Moon className="w-4 h-4 text-white/30" />
                    <span>Sleep ↔ Focus Index</span>
                  </div>
                  <div className="h-16 flex items-end gap-1.5 w-full pt-2">
                    {[80, 75, 45, 60, 85, 90, 70].map((h, idx) => (
                      <div key={idx} className="flex-1 bg-white/10 rounded-sm h-full flex items-end">
                        <div className="bg-white/40 rounded-t-sm w-full transition-all" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                    Sleep durations below 6.5 hours show immediate focus drop indexes.
                  </p>
                </GlassCard>
              </div>

              {/* Insights Feed */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-mono tracking-wider text-white/40 uppercase border-b border-white/5 pb-2">Integrated Insights Feed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {insights.map((insight) => (
                    <GlassCard key={insight.id} className="p-4 flex flex-col justify-between gap-3 min-h-[120px] hover:scale-[1.02] transition-all">
                      <div className="flex items-center justify-between text-[8px] font-mono tracking-widest text-white/30 uppercase">
                        <span>{insight.category}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                      <p className="text-xs text-white/80 font-medium leading-relaxed">
                        {insight.text}
                      </p>
                      <span className="text-[8px] font-mono text-white/20 mt-1">{insight.correlation}</span>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Life Score System & AI Memory */}
            <div className="flex flex-col gap-6 w-full">
              {/* Life Score card */}
              <GlassCard className="p-5 flex flex-col items-center justify-center text-center gap-4">
                <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3 w-full text-left">
                  <TrendingUp className="w-4 h-4 text-white/50" />
                  <span>LIFE INDEX SCORE</span>
                </div>
                <div className="relative w-32 h-32 flex items-center justify-center mt-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    <circle className="fill-none stroke-white/5" cx="70" cy="70" r="55" strokeWidth="8" />
                    <circle
                      className="fill-none stroke-white transition-all duration-700"
                      cx="70"
                      cy="70"
                      r="55"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 55}
                      strokeDashoffset={2 * Math.PI * 55 - ((lifeScore?.score || 84) / 100) * 2 * Math.PI * 55}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-display text-3xl font-bold text-white">{lifeScore?.score || 84}</span>
                    <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase">Index</span>
                  </div>
                </div>
                <p className="text-xs text-white/70 mt-2 max-w-xs">
                  {lifeScore?.explanation || 'Life index stable.'}
                </p>
              </GlassCard>

              {/* AI Memory Panel */}
              <GlassCard className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase">
                    <Layers className="w-4 h-4 text-white/50" />
                    <span>AI Cognitive Memory</span>
                  </div>
                  <button
                    onClick={() => setShowMemoryForm(!showMemoryForm)}
                    className="text-[10px] font-mono text-white/40 hover:text-white transition-all"
                  >
                    {showMemoryForm ? 'CLOSE' : 'EDIT'}
                  </button>
                </div>

                {!showMemoryForm ? (
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-white/40">Optimum Focus</span>
                      <span className="font-semibold text-white font-mono">{memory.bestFocusTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-white/40">Primary Weakness</span>
                      <span className="font-semibold text-white/80">{memory.mainWeakness}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-white/40">Consistent Routine</span>
                      <span className="font-semibold text-white/80">{memory.strongHabit}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40">Output Pattern</span>
                      <span className="font-semibold text-white/80">{memory.productivityPattern}</span>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateMemory({ bestFocusTime: editBestFocus, mainWeakness: editMainWeakness });
                      setShowMemoryForm(false);
                    }}
                    className="space-y-3.5"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-white/40 uppercase">Best Focus Time</label>
                      <input
                        type="text"
                        value={editBestFocus}
                        onChange={(e) => setEditBestFocus(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-white/40 uppercase">Primary Weakness</label>
                      <input
                        type="text"
                        value={editMainWeakness}
                        onChange={(e) => setEditMainWeakness(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-white text-black font-semibold text-[10px] rounded hover:bg-white/90"
                      >
                        SAVE
                      </button>
                    </div>
                  </form>
                )}
              </GlassCard>
            </div>
          </div>
        )}

        {/* AI Goal System View */}
        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Create Goal Form */}
            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              <GlassCard className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
                  <Trophy className="w-4 h-4 text-white/50" />
                  <span>Establish AI Objectives</span>
                </div>
                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Goal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Master React Native, Save $10K..."
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Timeline Horizon</label>
                    <select
                      value={newGoalType}
                      onChange={(e) => setNewGoalType(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
                    >
                      <option value="short-term">Short-Term (15-30 days)</option>
                      <option value="long-term">Long-Term (3-6 months)</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={generatingGoal}
                      className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                    >
                      {generatingGoal ? 'GENERATING MILESTONES...' : 'ADD OBJECTIVE'}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>

            {/* Active Goals list */}
            <div className="lg:col-span-3 flex flex-col gap-4 w-full">
              <h3 className="text-xs font-mono tracking-wider text-white/40 uppercase border-b border-white/5 pb-2">Active Objectives</h3>
              <div className="flex flex-col gap-4">
                {goals.map((goal) => (
                  <GlassCard key={goal.id} className="p-5 border-white/10 relative">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{goal.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/30 font-mono uppercase">
                          <span>{goal.type}</span>
                          <span>•</span>
                          <span>Timeline: {goal.timeline}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 rounded-md text-white/20 hover:text-white/80 hover:bg-white/5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Progress slider */}
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span className="font-mono text-xs text-white/50">{goal.progress}%</span>
                    </div>

                    {/* Milestones check list */}
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                      {goal.milestones.map((ms) => (
                        <button
                          key={ms.id}
                          onClick={() => toggleMilestone(goal.id, ms.id)}
                          className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                            ms.completed ? "bg-white border-white text-black" : "border-white/20"
                          )}>
                            {ms.completed && <CheckCircle className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-xs text-white/80 leading-normal", ms.completed && "line-through text-white/30")}>
                              {ms.name}
                            </p>
                            <span className="text-[9px] font-mono text-white/20 block mt-0.5">Target: {ms.targetDate}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                ))}

                {goals.length === 0 && (
                  <div className="glass-panel border border-white/10 rounded-2xl p-12 text-center text-white/30 font-mono text-xs">
                    No active objectives established yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Conversational AI Coach Chat view */}
        {activeTab === 'chat' && (
          <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden relative bg-zinc-950/40 h-[500px] flex flex-col max-w-3xl mx-auto w-full">
            {/* Message thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div key={msg.id} className={cn("flex gap-3 max-w-[85%] sm:max-w-[75%]", isAssistant ? "mr-auto" : "ml-auto flex-row-reverse")}>
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5",
                      isAssistant ? "bg-white text-black" : "bg-white/5 text-white/55"
                    )}>
                      {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "rounded-2xl p-4 text-xs sm:text-sm leading-relaxed border transition-all duration-300",
                      isAssistant ? "glass-panel border-white/10 text-white/85" : "bg-white border-white text-black font-semibold"
                    )}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 max-w-[70%] mr-auto items-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0 border border-white/5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="glass-panel border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSendChat} className="shrink-0 p-4 border-t border-white/5 flex gap-3 bg-zinc-950/80">
              <input
                type="text"
                required
                placeholder="Ask me questions e.g. 'What is my optimal focus time?'"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-mono"
              />
              <button
                type="submit"
                className="w-11 h-11 bg-white text-black rounded-xl hover:bg-white/90 transition-all flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.15)]"
              >
                <Send className="w-4 h-4 fill-black" />
              </button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
}
