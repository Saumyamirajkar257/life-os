'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Play, Pause, RotateCcw, Target, CheckCircle2, ChevronRight, 
  Flame, CheckSquare, Plus, Clock, Volume2, Compass, X, Search
} from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/components/ui/Toast';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useBrainStore } from '@/store/useBrainStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAIStore } from '@/store/useAIStore';
import { useSyncStore } from '@/store/useSyncStore';
import { GlassCard, Badge } from '@/components/ui';
import { GreetingSection } from './GreetingSection';
import Link from 'next/link';

export function DashboardGrid() {
  const { soundEnabled } = useAppStore();
  const { loadedSections } = useSyncStore();
  const tasksLoaded = loadedSections.tasks;
  const habitsLoaded = loadedSections.habits;
  const financeLoaded = loadedSections.finance;

  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  // Focus Timer State
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [selectedPreset, setSelectedPreset] = useState(25);
  const [ambientSound, setAmbientSound] = useState<'none' | 'lofi' | 'rain' | 'cosmos'>('lofi');
  const [equalizerBars, setEqualizerBars] = useState<number[]>([10, 20, 15, 30, 25, 40, 20, 15, 35, 10]);

  // Quick Task State
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  // Store Hooks
  const { tasks, toggleTask, addTask } = useTasksStore();
  const { habits, toggleHabitComplete, addHabit } = useHabitsStore();
  const { nodes, addNode } = useBrainStore();
  const { transactions } = useFinanceStore();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Mount
  useEffect(() => { setMounted(true); }, []);

  // Seed data on first visit
  useEffect(() => {
    if (mounted) {
      if (tasks.length === 0) {
        addTask({
          title: 'Review German Grammar & Complete Conjugation Deck',
          priority: 'high',
          dueDate: todayStr,
          tags: ['learning', 'german'],
          project: 'Language Skills',
          description: 'Spaced repetition deck expires in 4 hours. Core habit lock.'
        });
        addTask({
          title: 'Implement AI state persistence & firestore sync',
          priority: 'high',
          dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
          tags: ['coding', 'nextjs'],
          project: 'Life OS Platform',
          description: 'Scaffold local storage fallback with sync queues.'
        });
        addTask({
          title: 'Read 10 pages of Atomic Habits',
          priority: 'medium',
          dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
          tags: ['personal-growth'],
          project: 'Daily Reading',
          description: 'Review Chapter 4 on Habit stacking.'
        });
      }

      if (habits.length === 0) {
        addHabit({
          title: 'Morning Meditation',
          description: '10 min box breathing and mindfulness',
          frequency: 'daily',
          targetDays: [0, 1, 2, 3, 4, 5, 6],
          icon: 'brain',
          color: '#a78bfa'
        });
        addHabit({
          title: 'German Vocabulary',
          description: 'Duolingo & Anki deck practice',
          frequency: 'daily',
          targetDays: [0, 1, 2, 3, 4, 5, 6],
          icon: 'languages',
          color: '#60a5fa'
        });
        addHabit({
          title: 'Drink 3L of Water',
          description: 'Stay hydrated throughout the day',
          frequency: 'daily',
          targetDays: [0, 1, 2, 3, 4, 5, 6],
          icon: 'droplet',
          color: '#38bdf8'
        });
      }

      if (nodes.length === 0) {
        addNode({
          title: 'Startup Ideas for College Students',
          content: '1. AI study buddy with social accountability\n2. Decentralized hackathon teaming web app\n3. Local student delivery network.',
          type: 'idea',
          tags: ['startup', 'ideation'],
          connections: []
        });
      }
    }
  }, [mounted, tasks.length, habits.length, nodes.length, addTask, addHabit, addNode, todayStr]);

  // Focus Timer Tick
  useEffect(() => {
    let interval: any;
    if (focusActive && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime((prev) => prev - 1);
        if (ambientSound !== 'none') {
          setEqualizerBars(prev => prev.map(() => Math.floor(Math.random() * 35) + 5));
        }
      }, 1000);
    } else if (focusTime === 0 && focusActive) {
      setFocusActive(false);
      try {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }
      } catch (e) {}
      toast('Focus session complete! Great work. 🎉', 'success');
      setFocusTime(selectedPreset * 60);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusTime, selectedPreset, ambientSound]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const selectPresetTime = (mins: number) => {
    setFocusActive(false);
    setSelectedPreset(mins);
    setFocusTime(mins * 60);
  };

  const handleQuickTaskAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle,
      priority: 'medium',
      dueDate: todayStr,
      tags: ['inbox'],
      project: 'Default Workspace',
      description: 'Quick task captured from dashboard.'
    });
    setQuickTaskTitle('');
  };

  // Search Filter
  const allFilteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return {
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q) || t.project?.toLowerCase().includes(q)).slice(0, 3),
      habits: habits.filter(h => h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q)).slice(0, 3),
      nodes: nodes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).slice(0, 3)
    };
  }, [searchQuery, tasks, habits, nodes]);

  // "What Should I Do Next?" recommendation
  const nextRecommendedAction = useMemo(() => {
    const uncompletedHabit = habits.find(h => !h.completedDates.includes(todayStr));
    if (uncompletedHabit) {
      return {
        title: `Complete Habit: ${uncompletedHabit.title}`,
        reason: `Maintain your active ${uncompletedHabit.currentStreak}-day streak. Daily routine targets build compound progress.`,
        actionLabel: 'Complete Now',
        associatedHabit: uncompletedHabit.id
      };
    }

    const highPriorityTask = tasks.find(t => t.priority === 'high' && !t.completed);
    if (highPriorityTask) {
      return {
        title: highPriorityTask.title,
        reason: `Urgent task in "${highPriorityTask.project || 'Inbox'}". High priority — due immediately.`,
        actionLabel: 'Start Focus Block',
        associatedTask: highPriorityTask.id
      };
    }

    const taskDueToday = tasks.find(t => t.dueDate === todayStr && !t.completed);
    if (taskDueToday) {
      return {
        title: taskDueToday.title,
        reason: `Task due today. Clear pending work to stay on track.`,
        actionLabel: 'Start Focus Block',
        associatedTask: taskDueToday.id
      };
    }

    return {
      title: 'Browse your Second Brain',
      reason: 'No urgent tasks detected. Review your ideas or start a study block.',
      actionLabel: 'Open Second Brain'
    };
  }, [tasks, habits, todayStr]);

  // Today's Mission objectives
  const missionObjectives = useMemo(() => {
    const objectives = [];
    
    const urgentTask = tasks.find(t => t.priority === 'high' && !t.completed);
    const regularTask = tasks.find(t => t.dueDate === todayStr && !t.completed);
    if (urgentTask) {
      objectives.push({
        title: `Clear high priority: ${urgentTask.title}`,
        desc: `Project: ${urgentTask.project || 'Inbox'}`,
        completed: false
      });
    } else if (regularTask) {
      objectives.push({
        title: `Complete task: ${regularTask.title}`,
        desc: `Due today`,
        completed: false
      });
    } else {
      const completedTask = tasks.find(t => t.completed);
      objectives.push({
        title: completedTask ? `Task cleared: ${completedTask.title}` : 'All tasks cleared today',
        desc: completedTask ? 'Objective completed' : 'Keep your inbox empty',
        completed: !!completedTask
      });
    }

    const pendingHabit = habits.find(h => !h.completedDates.includes(todayStr));
    if (pendingHabit) {
      objectives.push({
        title: `Maintain habit: ${pendingHabit.title}`,
        desc: `${pendingHabit.description} (${pendingHabit.currentStreak}d streak)`,
        completed: false
      });
    } else {
      const completedHabit = habits.find(h => h.completedDates.includes(todayStr));
      objectives.push({
        title: completedHabit ? `Completed: ${completedHabit.title}` : 'No habits tracked today',
        desc: completedHabit ? 'Streak secured' : 'Establish a routine',
        completed: !!completedHabit
      });
    }

    objectives.push({
      title: focusActive ? 'Focus Block Active' : 'Start a Focus Block',
      desc: focusActive ? `Time remaining: ${formatTime(focusTime)}` : 'Complete at least one 25m session',
      completed: focusTime === 0
    });

    return objectives;
  }, [tasks, habits, todayStr, focusActive, focusTime]);

  const todayMissions = useMemo(() => {
    const total = missionObjectives.length;
    const done = missionObjectives.filter(o => o.completed).length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, percentage };
  }, [missionObjectives]);

  const activeTasks = tasks.filter(t => !t.completed);

  // Quick Stats data
  const dynamicFinanceBalance = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const currentBalance = totalIncome - totalExpense;
    return currentBalance !== 0 ? `$${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$2,450.00';
  }, [transactions]);

  const dynamicProjectsCount = useMemo(() => {
    const uniqueProjects = Array.from(new Set(tasks.map(t => t.project).filter(Boolean)));
    return uniqueProjects.length > 0 ? `${uniqueProjects.length} Project${uniqueProjects.length === 1 ? '' : 's'}` : '5 Projects';
  }, [tasks]);

  const dynamicCoursesCount = useMemo(() => {
    const uniqueTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));
    return uniqueTags.length > 0 ? `${uniqueTags.length} Active` : '3 Active';
  }, [tasks]);

  const dynamicFitnessIndex = useMemo(() => {
    const fitnessHabits = habits.filter(h => 
      ['gym', 'fitness', 'workout', 'run', 'walk', 'meditation', 'water', 'health'].some(kw => 
        h.title.toLowerCase().includes(kw) || h.description.toLowerCase().includes(kw)
      )
    );
    const totalSessions = fitnessHabits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
    return totalSessions > 0 ? `${totalSessions} Session${totalSessions === 1 ? '' : 's'}` : '4 Sessions';
  }, [habits]);

  if (!mounted) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Loading dashboard...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-2 relative">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <GreetingSection />
        
        {/* Search Bar */}
        <div className="relative w-full md:w-[360px] z-30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search tasks, habits, notes... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
              className="w-full bg-white/5 hover:bg-white/10 focus:bg-black/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          <AnimatePresence>
            {searchFocus && searchQuery.trim() && allFilteredItems && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-panel-strong rounded-xl p-4 shadow-2xl z-50 max-h-[320px] overflow-y-auto"
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/30 block mb-2">Search results</span>
                
                {allFilteredItems.tasks.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] text-primary/60 font-semibold block mb-1">Tasks</span>
                    {allFilteredItems.tasks.map(t => (
                      <div key={t.id} className="text-xs py-1.5 border-b border-white/5 text-white/70 hover:text-white flex justify-between">
                        <span className="truncate pr-4">{t.title}</span>
                        <span className="text-white/30 font-mono text-[9px] shrink-0">{t.project}</span>
                      </div>
                    ))}
                  </div>
                )}

                {allFilteredItems.habits.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] text-amber-400 font-semibold block mb-1">Habits</span>
                    {allFilteredItems.habits.map(h => (
                      <div key={h.id} className="text-xs py-1.5 border-b border-white/5 text-white/70 hover:text-white">
                        {h.title}
                      </div>
                    ))}
                  </div>
                )}

                {allFilteredItems.nodes.length > 0 && (
                  <div>
                    <span className="text-[10px] text-purple-400 font-semibold block mb-1">Second Brain</span>
                    {allFilteredItems.nodes.map(n => (
                      <div key={n.id} className="text-xs py-1.5 border-b border-white/5 text-white/70 hover:text-white truncate">
                        {n.title}
                      </div>
                    ))}
                  </div>
                )}

                {allFilteredItems.tasks.length === 0 && allFilteredItems.habits.length === 0 && allFilteredItems.nodes.length === 0 && (
                  <div className="text-center py-4 text-white/30 text-xs">
                    No results found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CARD GRID — 6 essential cards */}
      <div className="grid grid-cols-12 gap-5 items-stretch">

        {/* 1. WHAT SHOULD I DO NEXT — Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-background/40 to-blue-500/10 p-6 backdrop-blur-md h-full flex flex-col justify-between breathe-glow">
            <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
              <Sparkles className="w-24 h-24 text-primary animate-pulse" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-semibold mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> What should I do next?
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-snug">
                  {nextRecommendedAction.title}
                </h2>
                <p className="text-white/60 mt-2 max-w-xl text-xs sm:text-sm leading-relaxed">
                  {nextRecommendedAction.reason}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    if (nextRecommendedAction.associatedHabit) {
                      toggleHabitComplete(nextRecommendedAction.associatedHabit, todayStr);
                    } else if (nextRecommendedAction.associatedTask) {
                      toggleTask(nextRecommendedAction.associatedTask);
                    } else {
                      setFocusActive(true);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-white/10"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> 
                  <span>{nextRecommendedAction.actionLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. TODAY'S MISSION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="col-span-12 lg:col-span-4"
        >
          <GlassCard
            icon={<Target className="w-5 h-5 text-emerald-400" />}
            header="Today's Mission"
            className="h-full flex flex-col justify-between"
            animated={false}
          >
            {!tasksLoaded || !habitsLoaded ? (
              <div className="animate-pulse space-y-4 py-4 w-full">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-white/10 rounded w-1/4" />
                  <div className="h-5 bg-white/10 rounded-full w-16" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-12 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-12 bg-white/5 border border-white/5 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/50 font-mono">TODAY&apos;S GOALS</span>
                    <Badge variant="success">{todayMissions.done} / {todayMissions.total} Done</Badge>
                  </div>

                  <div className="space-y-3">
                    {missionObjectives.map((obj, index) => (
                      <div key={index} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${obj.completed ? 'text-emerald-400' : 'text-white/20'}`} />
                        <div className="text-xs min-w-0">
                          <span className={`font-semibold text-white block truncate ${obj.completed ? 'line-through text-white/40' : ''}`}>{obj.title}</span>
                          <span className="text-white/40 block truncate">{obj.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider block mb-1 font-mono">PROGRESS</span>
                    <div className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                      {todayMissions.percentage}%
                    </div>
                  </div>
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#mission-gradient)" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (todayMissions.percentage / 100) * 251.2} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                      <defs>
                        <linearGradient id="mission-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>

        {/* 3. FOCUS TIMER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <GlassCard
            icon={<Clock className="w-5 h-5 text-white animate-pulse" />}
            header="Focus Timer"
            className="h-full flex flex-col justify-between"
            animated={false}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-white/40 uppercase">POMODORO</span>
                <div className="flex gap-1">
                  {[25, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => selectPresetTime(mins)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        selectedPreset === mins
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-white/50'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-6 bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#focus-gradient)" strokeWidth="4" strokeDasharray={282.7} strokeDashoffset={282.7 - ((focusTime) / (selectedPreset * 60)) * 282.7} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
                    <defs>
                      <linearGradient id="focus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-4xl font-mono font-bold tracking-widest text-white glow-text relative z-10">
                    {formatTime(focusTime)}
                  </span>
                </div>
                
                {focusActive && ambientSound !== 'none' && (
                  <div className="flex gap-0.5 justify-center items-end h-6 mt-3">
                    {equalizerBars.map((val, idx) => (
                      <div
                        key={idx}
                        className="w-0.5 bg-primary/70 rounded-full transition-all duration-300"
                        style={{ height: `${val}%` }}
                      />
                    ))}
                  </div>
                )}
                <span className="text-[9px] text-white/30 uppercase mt-2 font-mono">
                  {focusActive ? `Active (${ambientSound} ambient)` : 'Ready to start'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 p-2 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-white/40 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> AMBIENT:
                </span>
                <div className="flex gap-1.5">
                  {[
                    { id: 'none', label: 'Mute' },
                    { id: 'lofi', label: 'Lofi' },
                    { id: 'rain', label: 'Rain' },
                    { id: 'cosmos', label: 'Space' }
                  ].map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => setAmbientSound(sound.id as any)}
                      className={`px-2 py-1 rounded text-[9px] font-semibold transition-all ${
                        ambientSound === sound.id
                          ? 'bg-white/20 text-white border border-white/20'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {sound.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setFocusActive(!focusActive)}
                className={`flex-1 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  focusActive
                    ? 'bg-destructive text-white hover:opacity-90'
                    : 'bg-white text-black hover:opacity-95'
                }`}
              >
                {focusActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{focusActive ? 'Pause' : 'Start Focus'}</span>
              </button>
              <button
                onClick={() => {
                  setFocusActive(false);
                  setFocusTime(selectedPreset * 60);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* 4. ACTIVE TASKS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <GlassCard
            icon={<CheckSquare className="w-5 h-5 text-indigo-400" />}
            header="Active Tasks"
            className="h-full flex flex-col justify-between"
            animated={false}
          >
            {!tasksLoaded ? (
              <div className="animate-pulse space-y-4 py-4 w-full">
                <div className="h-10 bg-white/5 border border-white/5 rounded-xl" />
                <div className="space-y-3">
                  <div className="h-14 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-14 bg-white/5 border border-white/5 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <form onSubmit={handleQuickTaskAdd} className="flex gap-2 mb-4 bg-black/40 border border-white/5 p-2 rounded-xl">
                    <input
                      type="text"
                      placeholder="Quick capture task..."
                      value={quickTaskTitle}
                      onChange={(e) => setQuickTaskTitle(e.target.value)}
                      className="flex-1 bg-transparent border-none text-xs text-white placeholder-white/20 focus:outline-none pl-2"
                    />
                    <button type="submit" className="p-2 bg-white text-black rounded-lg hover:opacity-90 transition-all flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {activeTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-3 hover:bg-white/10 transition-all">
                        <button onClick={() => toggleTask(task.id)} className="w-4.5 h-4.5 rounded-md border border-white/20 hover:border-white/40 flex items-center justify-center">
                          <div className="w-2 h-2 bg-transparent rounded-[2px]" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-white block truncate">{task.title}</span>
                          <span className="text-[10px] text-white/40 block mt-0.5">{task.project}</span>
                        </div>
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'} className="text-[8px] uppercase tracking-wider font-mono">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                    {activeTasks.length === 0 && (
                      <div className="text-center py-6 text-white/30 text-xs font-mono">
                        No active tasks. You&apos;re all caught up! 🎉
                      </div>
                    )}
                  </div>
                </div>

                <Link href="/tasks" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                  <span>Open Task Manager</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </GlassCard>
        </motion.div>

        {/* 5. HABIT STREAKS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <GlassCard
            icon={<Flame className="w-5 h-5 text-amber-500" />}
            header="Habit Streaks"
            className="h-full flex flex-col justify-between"
            animated={false}
          >
            {!habitsLoaded ? (
              <div className="animate-pulse space-y-4 py-4 w-full">
                <div className="space-y-3">
                  <div className="h-14 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-14 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-14 bg-white/5 border border-white/5 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {habits.slice(0, 3).map((habit) => {
                    const isDoneToday = habit.completedDates.includes(todayStr);
                    return (
                      <div key={habit.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-white block truncate">{habit.title}</span>
                          <span className="text-[10px] text-white/40 block mt-0.5 truncate">{habit.description}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-mono font-bold text-amber-500 flex items-center gap-0.5">
                            🔥 {habit.currentStreak}d
                          </span>
                          <button 
                            onClick={() => toggleHabitComplete(habit.id, todayStr)}
                            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                              isDoneToday
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white text-black hover:opacity-90'
                            }`}
                          >
                            {isDoneToday ? 'Done ✓' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link href="/habits" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                  <span>Open Habit Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </GlassCard>
        </motion.div>

        {/* 6. QUICK STATS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <GlassCard
            icon={<Compass className="w-5 h-5 text-cyan-400" />}
            header="Quick Stats"
            className="h-full flex flex-col justify-between"
            animated={false}
          >
            {!financeLoaded || !tasksLoaded || !habitsLoaded ? (
              <div className="animate-pulse space-y-4 py-4 w-full">
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 border border-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 border border-white/5 rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="text-[9px] text-white/30 font-mono block uppercase">Balance</span>
                  <span className="text-sm font-bold text-white mt-1 block truncate">{dynamicFinanceBalance}</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="text-[9px] text-white/30 font-mono block uppercase">Projects</span>
                  <span className="text-sm font-bold text-white mt-1 block truncate">{dynamicProjectsCount}</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="text-[9px] text-white/30 font-mono block uppercase">Courses</span>
                  <span className="text-sm font-bold text-white mt-1 block truncate">{dynamicCoursesCount}</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="text-[9px] text-white/30 font-mono block uppercase">Fitness</span>
                  <span className="text-sm font-bold text-white mt-1 block truncate">{dynamicFitnessIndex}</span>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>

      </div>
    </div>
  );
}
