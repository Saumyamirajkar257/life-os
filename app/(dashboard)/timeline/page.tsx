'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useJournalStore } from '@/store/useJournalStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useAchievementsStore, Achievement } from '@/store/useAchievementsStore';
import { format, compareDesc, parseISO } from 'date-fns';
import { GlassCard } from '@/components/ui/GlassCard';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  History, 
  CheckSquare, 
  Target, 
  BookOpen, 
  Wallet, 
  Filter,
  PlayCircle,
  Calendar,
  Check,
  X,
  RefreshCw,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Heart,
  Code,
  Pencil
} from 'lucide-react';
import { pageTransition, staggerContainer, staggerItem } from '@/animations';

type EventType = 'task' | 'habit' | 'journal' | 'finance' | 'calendar';

interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  date: string;
  meta?: any;
}

export default function TimelinePage() {
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { entries } = useJournalStore();
  const { transactions } = useFinanceStore();
  const { calendarSynced, setCalendarSynced } = useFocusStore();
  const { achievements, addAchievement, deleteAchievement, updateAchievement } = useAchievementsStore();

  const [viewMode, setViewMode] = useState<'feed' | 'achievements'>('feed');
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [oauthStep, setOauthStep] = useState<'init' | 'accounts' | 'permissions' | 'syncing' | 'success' | null>(null);

  // Custom states for Cinematic Spotify-wrapped style Life Replay
  const [replayScope, setReplayScope] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auth and Firestore AI Replay States
  const [userId, setUserId] = useState<string | null>(null);
  const [aiReplayData, setAiReplayData] = useState<any>(null);
  const [isGeneratingReplay, setIsGeneratingReplay] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
        if (bypassed) {
          setUserId('sandbox-user-id');
        } else {
          setUserId(null);
        }
      }
    });
    return () => unsub();
  }, []);

  // Fetch the latest generated AI Replay from Firestore when scope changes
  useEffect(() => {
    if (!userId || !isPlaying) return;

    const fetchLatestReplay = async () => {
      try {
        const q = query(
          collection(db, 'users', userId, 'life_replays'),
          where('scope', '==', replayScope)
        );
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const docs = qSnap.docs.map(d => d.data());
          docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAiReplayData(docs[0]);
        } else {
          setAiReplayData(null);
        }
      } catch (e) {
        console.error('Failed to load AI Replay from Firestore:', e);
      }
    };

    fetchLatestReplay();
  }, [userId, replayScope, isPlaying]);

  // Simulate Triggering the Cron Job
  const handleTriggerCronReplay = async () => {
    if (!userId) return;
    setIsGeneratingReplay(true);
    try {
      const response = await fetch('/api/cron/life-replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userId, scope: replayScope }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiReplayData(data.data);
        alert(`Successfully generated AI Replay for this ${replayScope}! Slide 4 now contains live AI content.`);
      } else {
        throw new Error('Failed to run simulation');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to simulate AI Replay compilation.');
    } finally {
      setIsGeneratingReplay(false);
    }
  };

  // Compile real stats based on selected scope
  const filteredStats = useMemo(() => {
    const now = new Date();
    const daysLimit = replayScope === 'day' ? 1 : replayScope === 'week' ? 7 : replayScope === 'month' ? 30 : 365;
    const cutoffDate = new Date(now.getTime() - daysLimit * 24 * 60 * 60 * 1000);

    const checkDate = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        return d >= cutoffDate;
      } catch (e) {
        return false;
      }
    };

    const completedTasksCount = tasks.filter(t => t.completed && t.dueDate && checkDate(t.dueDate)).length;
    const totalHabitCheckins = habits.reduce((acc, h) => {
      const filteredDates = h.completedDates.filter(d => checkDate(d));
      return acc + filteredDates.length;
    }, 0);
    const totalJournalEntries = entries.filter(e => checkDate(e.date)).length;
    const totalSavings = transactions.filter(t => checkDate(t.date)).reduce((acc, t) => acc + t.amount, 0);
    const achievementsCount = achievements.filter(a => checkDate(a.dateAdded)).length;

    // Generate personality profile based on what is highest
    let profileName = 'The Quiet Pioneer';
    let profileColor = 'text-blue-400';
    if (completedTasksCount > 2 && totalHabitCheckins > 3) {
      profileName = 'The Hyper-focused Scholar';
      profileColor = 'text-amber-400';
    } else if (totalJournalEntries > 2) {
      profileName = 'The Mindful Philosopher';
      profileColor = 'text-rose-400';
    } else if (totalSavings > 500) {
      profileName = 'The Financial Architect';
      profileColor = 'text-emerald-400';
    } else if (achievementsCount > 0) {
      profileName = 'The Milestone Conqueror';
      profileColor = 'text-violet-400';
    }

    return {
      completedTasksCount,
      totalHabitCheckins,
      totalJournalEntries,
      totalSavings,
      achievementsCount,
      profileName,
      profileColor
    };
  }, [tasks, habits, entries, transactions, achievements, replayScope]);

  // Form states for adding milestone
  const [newYear, setNewYear] = useState<number>(2026);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Skills' | 'Projects' | 'Career' | 'Personal'>('Skills');
  const [newDesc, setNewDesc] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editYear, setEditYear] = useState<number>(2026);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<'Skills' | 'Projects' | 'Career' | 'Personal'>('Skills');
  const [editDesc, setEditDesc] = useState('');

  const handleAddMilestone = () => {
    if (!newTitle.trim()) return;
    addAchievement(newYear, newTitle.trim(), newCategory, newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const startEditing = (ach: Achievement) => {
    setEditingId(ach.id);
    setEditYear(ach.year);
    setEditTitle(ach.title);
    setEditCategory(ach.category);
    setEditDesc(ach.description);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    updateAchievement(id, {
      year: editYear,
      title: editTitle.trim(),
      category: editCategory,
      description: editDesc.trim()
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const achievementsByYear = useMemo(() => {
    const groups: { [key: number]: Achievement[] } = {};
    achievements.forEach(ach => {
      if (!groups[ach.year]) {
        groups[ach.year] = [];
      }
      groups[ach.year].push(ach);
    });
    const sortedYears = Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a);

    return sortedYears.map(year => ({
      year,
      items: groups[year].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    }));
  }, [achievements]);

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'Skills': return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
      case 'Projects': return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Career': return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'Personal': return <Heart className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const getCategoryBg = (category: Achievement['category']) => {
    switch (category) {
      case 'Skills': return 'bg-blue-500/10';
      case 'Projects': return 'bg-emerald-500/10';
      case 'Career': return 'bg-amber-500/10';
      case 'Personal': return 'bg-rose-500/10';
    }
  };

  const getCategoryBorder = (category: Achievement['category']) => {
    switch (category) {
      case 'Skills': return 'border-blue-500/20';
      case 'Projects': return 'border-emerald-500/20';
      case 'Career': return 'border-amber-500/20';
      case 'Personal': return 'border-rose-500/20';
    }
  };

  const handleCalendarSyncToggle = () => {
    if (calendarSynced) {
      setCalendarSynced(false);
    } else {
      setOauthStep('init');
      setTimeout(() => setOauthStep('accounts'), 800);
    }
  };

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add completed tasks
    tasks.filter(t => t.completed).forEach(task => {
      events.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        description: task.description,
        date: task.dueDate || new Date().toISOString(),
        meta: { project: task.project, tags: task.tags }
      });
    });

    // Add habit completions
    habits.forEach(habit => {
      habit.completedDates.forEach((dateStr, idx) => {
        events.push({
          id: `habit-${habit.id}-${idx}`,
          type: 'habit',
          title: `Completed: ${habit.title}`,
          date: dateStr,
          meta: { streak: habit.currentStreak }
        });
      });
    });

    // Add journal entries
    entries.forEach(entry => {
      events.push({
        id: `journal-${entry.id}`,
        type: 'journal',
        title: entry.title,
        description: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : ''),
        date: entry.date,
        meta: { mood: entry.mood }
      });
    });

    // Add significant financial transactions (e.g. income or large expense)
    transactions.filter(tx => tx.type === 'income' || Math.abs(tx.amount) > 100).forEach(tx => {
      events.push({
        id: `finance-${tx.id}`,
        type: 'finance',
        title: tx.name,
        description: `${tx.type === 'income' ? '+' : '-'}$${Math.abs(tx.amount).toFixed(2)} in ${tx.category}`,
        date: tx.date,
        meta: { amount: tx.amount, category: tx.category, type: tx.type }
      });
    });

    // Add dynamic calendar events if synced
    if (calendarSynced) {
      const today = new Date();
      const formatISO = (offsetDays: number, hour: number) => {
        const d = new Date(today);
        d.setDate(today.getDate() - offsetDays);
        d.setHours(hour, 0, 0, 0);
        return d.toISOString();
      };

      events.push({
        id: 'cal-event-1',
        type: 'calendar',
        title: 'Google Calendar: Startup Pitch Briefing',
        description: 'Reviewing systems architecture and coordinating compilation modules with team.',
        date: formatISO(0, 10), // today at 10 AM
        meta: { source: 'Google Calendar', duration: '1h 30m' }
      });

      events.push({
        id: 'cal-event-2',
        type: 'calendar',
        title: 'Google Calendar: Midterm Exam Study Group',
        description: 'Solving past practice exams and checking system engineering models.',
        date: formatISO(1, 14), // yesterday at 2 PM
        meta: { source: 'Google Calendar', duration: '2h 00m' }
      });

      events.push({
        id: 'cal-event-3',
        type: 'calendar',
        title: 'Google Calendar: Esports Team Tryouts',
        description: 'Coordinating team strategies for the upcoming regional sector tournament.',
        date: formatISO(2, 18), // 2 days ago at 6 PM
        meta: { source: 'Google Calendar', duration: '3h 00m' }
      });
    }

    return events.sort((a, b) => {
      // Sort descending (newest first)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateB - dateA;
    });
  }, [tasks, habits, entries, transactions, calendarSynced]);

  const filteredEvents = timelineEvents.filter(e => activeFilter === 'all' || e.type === activeFilter);

  const getEventIcon = (type: EventType) => {
    switch(type) {
      case 'task': return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case 'habit': return <Target className="w-5 h-5 text-emerald-400" />;
      case 'journal': return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'finance': return <Wallet className="w-5 h-5 text-violet-400" />;
      case 'calendar': return <Calendar className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getEventColor = (type: EventType) => {
    switch(type) {
      case 'task': return 'bg-blue-500/20 border-blue-500/30';
      case 'habit': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'journal': return 'bg-amber-500/20 border-amber-500/30';
      case 'finance': return 'bg-violet-500/20 border-violet-500/30';
      case 'calendar': return 'bg-indigo-500/20 border-indigo-500/30';
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-rose-400" />
            Life Timeline
          </h1>
          <p className="text-white/60 mt-1">Your personal history and milestones, beautifully visualized.</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          {/* View mode switcher */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'feed' ? 'bg-white text-black shadow-sm' : 'text-white/45 hover:text-white/80'
              }`}
            >
              Activity Feed
            </button>
            <button
              onClick={() => setViewMode('achievements')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'achievements' ? 'bg-white text-black shadow-sm' : 'text-white/45 hover:text-white/80'
              }`}
            >
              Life Achievements
            </button>
          </div>

          {viewMode === 'feed' && (
            <>
              <button
                onClick={handleCalendarSyncToggle}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  calendarSynced 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${calendarSynced ? 'text-indigo-400' : 'text-white/40'}`} />
                <span>{calendarSynced ? 'Google Calendar Synced' : 'Sync Calendar'}</span>
                {calendarSynced && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />}
              </button>

              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {(['all', 'task', 'habit', 'journal', 'finance', 'calendar'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                      activeFilter === filter 
                        ? 'bg-white/10 text-white shadow-sm' 
                        : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </>
          )}

          {userId && (
            <button
              onClick={handleTriggerCronReplay}
              disabled={isGeneratingReplay}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-indigo-500/20 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingReplay ? 'animate-spin' : ''}`} />
              {isGeneratingReplay ? 'Compiling Replay...' : 'Simulate Cron Replay'}
            </button>
          )}

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
          >
            <PlayCircle className="w-4 h-4" />
            {isPlaying ? 'Pause Replay' : 'Cinematic Replay'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative px-4">
        {viewMode === 'feed' ? (
          <>
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
            
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6 pb-20"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={staggerItem}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative pl-12"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-[-24px] top-4 w-12 h-12 rounded-full ${getEventColor(event.type)} border flex items-center justify-center z-10 shadow-lg backdrop-blur-md`}>
                      {getEventIcon(event.type)}
                    </div>

                    <GlassCard variant="subtle" className="ml-4 group hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-white/40 bg-black/20 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-white/60 mb-3 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Metadata display */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.type === 'task' && event.meta?.tags?.map((tag: string) => (
                          <span key={tag} className="text-[10px] px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {tag}
                          </span>
                        ))}
                        {event.type === 'habit' && event.meta?.streak > 0 && (
                          <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            🔥 {event.meta.streak} Day Streak
                          </span>
                        )}
                        {event.type === 'journal' && event.meta?.mood && (
                          <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 capitalize">
                            Mood: {event.meta.mood}
                          </span>
                        )}
                        {event.type === 'finance' && event.meta?.amount && (
                          <span className={`text-[10px] px-2 py-1 rounded border ${event.meta.type === 'income' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                            {event.meta.type === 'income' ? '+' : '-'}${Math.abs(event.meta.amount).toFixed(2)}
                          </span>
                        )}
                        {event.type === 'calendar' && event.meta?.source && (
                          <span className="text-[10px] px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            🌐 {event.meta.source} · {event.meta.duration}
                          </span>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-20 text-white/40">
                  No events found for this filter.
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-400" />
                Milestone Registry
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center gap-2 transition-all shadow-md animate-pulse"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddForm ? 'Close Editor' : 'Register New Achievement'}
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <GlassCard variant="subtle" className="p-5 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      Log Life Milestone
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-white/55 mb-1.5">Milestone Year</label>
                        <input
                          type="number"
                          value={newYear}
                          onChange={(e) => setNewYear(parseInt(e.target.value) || new Date().getFullYear())}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-white/55 mb-1.5">Milestone Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Mastered C programming or Deployed SaaS Portfolio"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-white/55 mb-1.5">Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                        >
                          <option value="Skills">Skills & Knowledge</option>
                          <option value="Projects">Projects & Build</option>
                          <option value="Career">Career & Education</option>
                          <option value="Personal">Personal & Hobby</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-white/55 mb-1.5">Short Description</label>
                        <textarea
                          placeholder="Provide supplementary details (technologies used, specific outcomes)..."
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewTitle('');
                          setNewDesc('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddMilestone}
                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-md shadow-rose-500/20"
                      >
                        Save Milestone
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Achievements timeline visualization */}
            <div className="relative pl-12">
              <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-gradient-to-b from-rose-500/50 via-white/10 to-transparent" />
              
              <div className="space-y-12 pb-24">
                {achievementsByYear.map(({ year, items }) => (
                  <div key={year} className="relative">
                    {/* Year Badge Node */}
                    <div className="absolute left-[-42px] top-0 z-20 flex items-center justify-center">
                      <div className="px-3 py-1 rounded-full bg-zinc-950 border border-rose-500/40 text-xs font-bold text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)] backdrop-blur-md">
                        {year}
                      </div>
                    </div>

                    <div className="space-y-6 pt-10">
                      {items.map((ach) => (
                        <div key={ach.id} className="relative pl-6">
                          {/* Inner timeline indicator */}
                          <div className="absolute left-[-15px] top-6 w-3 h-3 rounded-full bg-rose-500 border-2 border-zinc-950 z-10" />

                          {editingId === ach.id ? (
                            <GlassCard variant="subtle" className="p-4 border border-rose-500/30">
                              <h4 className="text-xs font-bold text-rose-400 mb-3">Edit Achievement Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <div>
                                  <label className="block text-[9px] font-semibold text-white/40 mb-1">Year</label>
                                  <input
                                    type="number"
                                    value={editYear}
                                    onChange={(e) => setEditYear(parseInt(e.target.value) || year)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[9px] font-semibold text-white/40 mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <div>
                                  <label className="block text-[9px] font-semibold text-white/40 mb-1">Category</label>
                                  <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value as any)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                                  >
                                    <option value="Skills">Skills</option>
                                    <option value="Projects">Projects</option>
                                    <option value="Career">Career</option>
                                    <option value="Personal">Personal</option>
                                  </select>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[9px] font-semibold text-white/40 mb-1">Description</label>
                                  <textarea
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white resize-none"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white/80 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(ach.id)}
                                  className="px-3 py-1 rounded bg-rose-500 hover:bg-rose-600 text-[10px] text-white transition-colors"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </GlassCard>
                          ) : (
                            <GlassCard variant="subtle" className="group hover:bg-white/10 transition-all border border-white/5 hover:border-rose-500/10">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${getCategoryBg(ach.category)} border ${getCategoryBorder(ach.category)}`}>
                                    {getCategoryIcon(ach.category)}
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-white/40 block leading-none mb-1 capitalize">{ach.category}</span>
                                    <h3 className="text-base font-semibold text-white group-hover:text-rose-300 transition-colors">
                                      {ach.title}
                                    </h3>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => startEditing(ach)}
                                    className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                                    title="Edit Milestone"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteAchievement(ach.id)}
                                    className="p-1.5 rounded-md hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                                    title="Delete Milestone"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              
                              {ach.description && (
                                <p className="text-xs text-white/60 mt-1 leading-relaxed pl-9">
                                  {ach.description}
                                </p>
                              )}
                            </GlassCard>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {achievements.length === 0 && (
                  <div className="text-center py-20 text-white/40">
                    No achievements recorded yet. Add your first milestone above!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OAuth Simulator Modal */}
      <AnimatePresence>
        {oauthStep && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              {oauthStep === 'init' && (
                <div className="text-center py-6 space-y-4">
                  <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                  <h3 className="text-base font-bold text-white">OAuth Initialization</h3>
                  <p className="text-xs text-white/40">Requesting token handshakes from secure servers...</p>
                </div>
              )}

              {oauthStep === 'accounts' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white font-mono text-xs font-extrabold">G</div>
                    <h3 className="text-sm font-bold text-white">Sign in with Google</h3>
                  </div>
                  <p className="text-xs text-white/50">Select your active account to connect Timeline sync:</p>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => setOauthStep('permissions')}
                      className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-white block">Saumya</span>
                        <span className="text-[10px] text-white/30 font-mono">saumya@lifeos.ai</span>
                      </div>
                      <span className="text-[9px] bg-indigo-500/25 text-indigo-300 px-2 py-0.5 rounded-full font-mono">Verified</span>
                    </button>
                    <button className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 opacity-40 text-[10px] text-white/40 cursor-not-allowed">
                      Use another account
                    </button>
                  </div>
                </div>
              )}

              {oauthStep === 'permissions' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                    Permissions Authorization
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Life OS is requesting calendar integration scopes to pull external schedules into your personal history flow.
                  </p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-[10px] text-white/60">
                    <div className="flex gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Read your calendar timelines & agendas</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>Sync events automatically in background</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setOauthStep(null)}
                      className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-semibold"
                    >
                      Deny
                    </button>
                    <button 
                      onClick={() => {
                        setOauthStep('syncing');
                        setTimeout(() => {
                          setOauthStep('success');
                          setTimeout(() => {
                            setCalendarSynced(true);
                            setOauthStep(null);
                          }, 1600);
                        }, 1600);
                      }}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold"
                    >
                      Allow Access
                    </button>
                  </div>
                </div>
              )}

              {oauthStep === 'syncing' && (
                <div className="text-center py-6 space-y-4">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                  <h3 className="text-base font-bold text-white">Importing Timelines</h3>
                  <p className="text-xs text-white/40">Fetching agenda items & caching schedules...</p>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-[200px] mx-auto">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.4, ease: 'easeInOut' }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {oauthStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Connection Established!</h3>
                  <p className="text-xs text-white/40">Events successfully mapped to Timeline database.</p>
                  <span className="inline-block text-[9px] bg-yellow-500/25 text-yellow-300 font-mono px-3 py-1 rounded-full border border-yellow-500/30 animate-bounce">
                    🏆 +150 FOCUS XP AWARDED!
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Life Replay Spotify Wrapped Style Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07020d]/95 backdrop-blur-md flex items-center justify-center p-6"
          >
            {/* Ambient glowing blobs in background */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg relative z-10 flex flex-col items-center justify-between h-[520px]">
              
              {/* Header: Scope selection and close button */}
              <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-2">
                  {(['day', 'week', 'month', 'year'] as const).map(scope => (
                    <button
                      key={scope}
                      onClick={() => {
                        setReplayScope(scope);
                        setCurrentSlide(0);
                      }}
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border transition-all ${
                        replayScope === scope
                          ? 'bg-rose-500 border-rose-500 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {scope}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentSlide(0);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main slide container */}
              <div className="flex-1 w-full flex items-center justify-center py-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  {currentSlide === 0 && (
                    <motion.div
                      key="slide0"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500 animate-pulse">
                        <History className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-display font-bold text-white tracking-tight uppercase">
                        This was your life
                      </h2>
                      <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
                        Loading focus logs, compound wealth data, habit streaks, and registered milestones...
                      </p>
                      <button
                        onClick={() => setCurrentSlide(1)}
                        className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                      >
                        Launch Replay
                      </button>
                    </motion.div>
                  )}

                  {currentSlide === 1 && (
                    <motion.div
                      key="slide1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full space-y-6"
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono text-rose-400 block uppercase font-bold tracking-widest">Consistency Card</span>
                        <h3 className="text-2xl font-display font-bold text-white">First, the daily grind.</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
                          <CheckSquare className="w-8 h-8 text-blue-400 mx-auto" />
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Completed Tasks</span>
                          <span className="text-3xl font-display font-bold text-white block">{filteredStats.completedTasksCount}</span>
                        </div>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
                          <Target className="w-8 h-8 text-emerald-400 mx-auto" />
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Habit Check-ins</span>
                          <span className="text-3xl font-display font-bold text-white block">{filteredStats.totalHabitCheckins}</span>
                        </div>
                      </div>

                      <p className="text-center text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                        Every task ticked off and habit check-in represents blocks of concentrated progress. Consistency breeds excellence.
                      </p>
                    </motion.div>
                  )}

                  {currentSlide === 2 && (
                    <motion.div
                      key="slide2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full space-y-6"
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono text-rose-400 block uppercase font-bold tracking-widest">Mind & milestones</span>
                        <h3 className="text-2xl font-display font-bold text-white">Reflections & Growth</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
                          <BookOpen className="w-8 h-8 text-amber-400 mx-auto" />
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Journal Logs</span>
                          <span className="text-3xl font-display font-bold text-white block">{filteredStats.totalJournalEntries}</span>
                        </div>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
                          <Award className="w-8 h-8 text-violet-400 mx-auto" />
                          <span className="text-[10px] font-mono text-white/40 block uppercase">Achievements</span>
                          <span className="text-3xl font-display font-bold text-white block">{filteredStats.achievementsCount}</span>
                        </div>
                      </div>

                      <p className="text-center text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                        You stayed in touch with your emotional core through journals while capturing critical career and skill milestones.
                      </p>
                    </motion.div>
                  )}

                  {currentSlide === 3 && (
                    <motion.div
                      key="slide3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full space-y-6"
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono text-rose-400 block uppercase font-bold tracking-widest">Financial Integrity</span>
                        <h3 className="text-2xl font-display font-bold text-white">Wealth Accrual</h3>
                      </div>

                      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-3">
                        <Wallet className="w-10 h-10 text-violet-400 mx-auto" />
                        <span className="text-[10px] font-mono text-white/40 block uppercase">Net Wealth Impact</span>
                        <span className="text-3xl font-display font-bold text-white block font-mono">
                          {filteredStats.totalSavings >= 0 ? '+' : '-'}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(filteredStats.totalSavings))}
                        </span>
                      </div>

                      <p className="text-center text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                        You monitored cash inflows and expenditures, reinforcing habits that secure long-term financial independence.
                      </p>
                    </motion.div>
                  )}

                  {currentSlide === 4 && (
                    <motion.div
                      key="slide4"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="w-full space-y-6"
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono text-rose-400 block uppercase font-bold tracking-widest">Replay Summary</span>
                        <h3 className="text-2xl font-display font-bold text-white">Your Personality Profile</h3>
                                      <div className="p-6 bg-gradient-to-br from-rose-500/10 via-violet-500/5 to-zinc-950 border border-rose-500/20 rounded-2xl relative overflow-hidden shadow-2xl space-y-4">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-rose-500/10 blur-2xl" />
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-white/30 block uppercase leading-none">Focus Class</span>
                            <span className={`text-lg font-bold block mt-1 ${aiReplayData ? aiReplayData.aiReplay.themeColor : filteredStats.profileColor}`}>
                              {aiReplayData ? aiReplayData.aiReplay.personalityClass : filteredStats.profileName}
                            </span>
                          </div>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded font-mono text-white/70 capitalize">{replayScope} Scope</span>
                        </div>

                        {aiReplayData && (
                          <div className="text-xs text-white/75 bg-white/5 border border-white/5 p-3 rounded-xl space-y-2">
                            <p className="leading-relaxed"><strong>AI Insight:</strong> {aiReplayData.aiReplay.aiSummary}</p>
                            <p className="leading-relaxed text-rose-300"><strong>AI Critique:</strong> {aiReplayData.aiReplay.brutalCritique}</p>
                          </div>
                        )}

                        <div className="space-y-2.5 pt-2 border-t border-white/5 text-xs text-white/60">
                          <div className="flex justify-between">
                            <span>Tasks Completed:</span>
                            <span className="font-mono text-white font-bold">{filteredStats.completedTasksCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Habits Tracked:</span>
                            <span className="font-mono text-white font-bold">{filteredStats.totalHabitCheckins}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maturity Growth:</span>
                            <span className="font-mono text-white font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(filteredStats.totalSavings)}</span>
                          </div>
                        </div>

                        <span className="text-[9px] bg-rose-500/20 text-rose-300 font-mono px-3 py-1 rounded-full border border-rose-500/30 block text-center animate-bounce">
                          🔥 {aiReplayData ? aiReplayData.aiReplay.achievementAward : 'A+ GROWTH RATE MEASURED!'}
                        </span>
                      </div>           </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            alert("Share Card details copied to clipboard!");
                          }}
                          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-semibold font-mono"
                        >
                          Copy Share Card
                        </button>
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentSlide(0);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                          Finish Replay
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Slider Navigation Indicators */}
              <div className="w-full flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  disabled={currentSlide === 0}
                  onClick={() => setCurrentSlide(prev => prev - 1)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Back
                </button>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        currentSlide === i ? 'bg-rose-500 scale-125' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                {currentSlide < 4 ? (
                  <button
                    onClick={() => setCurrentSlide(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 text-xs font-mono transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <div className="w-[60px]" />
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
