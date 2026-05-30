'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Play, Pause, RotateCcw, Target, CheckCircle2, ChevronRight, Zap, 
  Trophy, History, BookOpen, Compass, FileText, Plus, Search, Calendar, 
  TrendingUp, Flame, AlertCircle, ArrowUpRight, CheckSquare, Dumbbell, 
  Droplet, Laptop, GraduationCap, DollarSign, Brain, PlusCircle, Volume2, 
  X, Share2, Eye, ShieldAlert, Award, Clock, ArrowUpDown, HelpCircle, LayoutDashboard
} from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useToast } from '@/components/ui/Toast';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useBrainStore } from '@/store/useBrainStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAIStore } from '@/store/useAIStore';
import { useRoutinesStore } from '@/store/useRoutinesStore';
import { useAutomationsStore } from '@/store/useAutomationsStore';
import { GlassCard, Badge, ProgressBar } from '@/components/ui';
import { GreetingSection } from './GreetingSection';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type PriorityMode = 'balanced' | 'urgency' | 'focus' | 'habits';

export function DashboardGrid() {
  const { isMobile, userName, soundEnabled } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [prioritization, setPrioritization] = useState<PriorityMode>('balanced');
  const [constellationMode, setConstellationMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isMobile) {
      setConstellationMode(true);
    }
  }, [isMobile]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search suggestion active overlay
  const [searchFocus, setSearchFocus] = useState(false);

  // Focus Launcher State
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [selectedPreset, setSelectedPreset] = useState(25);
  const [ambientSound, setAmbientSound] = useState<'none' | 'lofi' | 'rain' | 'cosmos'>('lofi');
  const [equalizerBars, setEqualizerBars] = useState<number[]>([10, 20, 15, 30, 25, 40, 20, 15, 35, 10]);

  // Quick Note State
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteContent, setQuickNoteContent] = useState('');
  
  // Quick Task State
  const [quickTaskTitle, setQuickTaskTitle] = useState('');

  // Life Replay Cinematic Modal State
  const [replayOpen, setReplayOpen] = useState(false);
  const [replaySlide, setReplaySlide] = useState(0);

  // Store Hooks
  const { tasks, toggleTask, addTask } = useTasksStore();
  const { habits, toggleHabitComplete, addHabit } = useHabitsStore();
  const { nodes, addNode } = useBrainStore();
  const { goals, toggleMilestone, insights, lifeScore, burnoutStatus, memory } = useAIStore();
  const { transactions, goals: financeGoals, budgets } = useFinanceStore();
  const { routines } = useRoutinesStore();
  const { rules } = useAutomationsStore();

  // Universe Spatial Navigator States
  const router = useRouter();
  const [universeOpen, setUniverseOpen] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [zoomPlanet, setZoomPlanet] = useState<string | null>(null);
  const [universeZoom, setUniverseZoom] = useState(1.0);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Planets Config
  const planets = useMemo(() => [
    {
      id: 'study',
      title: 'Study Sphere',
      icon: GraduationCap,
      path: '/study',
      color: 'from-blue-500 to-cyan-400',
      shadow: 'rgba(59, 130, 246, 0.4)',
      stats: '42.5h logged · Lvl 24',
      description: 'Optimize your learning modules, course tracks, and review cards.',
      x: 150,
      y: 0,
      speed: 30
    },
    {
      id: 'startup',
      title: 'Startup Syndicate',
      icon: Laptop,
      path: '/student-hub',
      color: 'from-emerald-500 to-teal-400',
      shadow: 'rgba(16, 185, 129, 0.4)',
      stats: '5 Active Projects',
      description: 'Build your startup team, track hackathons, and plan college products.',
      x: -150,
      y: 0,
      speed: 30
    },
    {
      id: 'gaming',
      title: 'Esports Guild',
      icon: Trophy,
      path: '/student-hub',
      color: 'from-amber-500 to-orange-400',
      shadow: 'rgba(245, 158, 11, 0.4)',
      stats: 'Rank #14 Commander',
      description: 'Manage esports training, team tournaments, and achievements.',
      x: 120,
      y: 208,
      speed: 45
    },
    {
      id: 'fitness',
      title: 'Fitness Fortress',
      icon: Dumbbell,
      path: '/student-hub',
      color: 'from-rose-500 to-pink-400',
      shadow: 'rgba(244, 63, 94, 0.4)',
      stats: '4 Sessions · 92% Hit',
      description: 'Track gym routines, hydration streaks, and physical performance.',
      x: -120,
      y: -208,
      speed: 45
    },
    {
      id: 'finance',
      title: 'Finance Vault',
      icon: DollarSign,
      path: '/finance',
      color: 'from-cyan-500 to-blue-400',
      shadow: 'rgba(6, 182, 212, 0.4)',
      stats: '$2,450.00 synced',
      description: 'Manage encrypted budgets, transaction flows, and savings targets.',
      x: -165,
      y: 286,
      speed: 60
    },
    {
      id: 'brain',
      title: 'Second Brain',
      icon: Brain,
      path: '/brain',
      color: 'from-purple-500 to-fuchsia-400',
      shadow: 'rgba(168, 85, 247, 0.4)',
      stats: `${nodes.length} Nodes loaded`,
      description: 'Explore connection graphs, capture notes, and build knowledge.',
      x: 165,
      y: -286,
      speed: 60
    }
  ], [nodes.length]);

  const zoomPlanetCoordinates = useMemo(() => {
    const planet = planets.find(p => p.id === zoomPlanet);
    return planet ? { x: planet.x, y: planet.y } : { x: 0, y: 0 };
  }, [zoomPlanet, planets]);

  const hoveredPlanetObj = useMemo(() => {
    if (hoveredPlanet === 'core') {
      return {
        id: 'core',
        title: 'Commander Core',
        icon: Trophy,
        color: 'from-purple-500 via-blue-500 to-cyan-500',
        stats: `Life Score: ${lifeScore?.score || 84} · Burnout: ${burnoutStatus?.level || 'none'}`,
        description: `Central processing hub coordinating ${tasks.length} active tasks, ${habits.length} habits, ${routines.length} routines, and ${rules.length} automation triggers.`,
        x: 0,
        y: 0
      };
    }
    return planets.find(p => p.id === hoveredPlanet);
  }, [hoveredPlanet, planets, lifeScore?.score, burnoutStatus?.level, tasks.length, habits.length, routines.length, rules.length]);

  // 1. Mount Trigger
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Seeding Data if Stores are Empty (First Visit Visuals)
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
        addNode({
          title: 'Next.js 15 App Router Cheatsheet',
          content: 'Detailed list of new APIs: server actions, layouts, streaming Suspense blocks, route handlers.',
          type: 'resource',
          tags: ['webdev', 'nextjs'],
          connections: []
        });
      }
    }
  }, [mounted, tasks.length, habits.length, nodes.length, addTask, addHabit, addNode, todayStr]);

  // 3. Focus Timer Tick
  useEffect(() => {
    let interval: any;
    if (focusActive && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime((prev) => prev - 1);
        // Animate equalizer bars
        if (ambientSound !== 'none') {
          setEqualizerBars(prev => prev.map(() => Math.floor(Math.random() * 35) + 5));
        }
      }, 1000);
    } else if (focusTime === 0 && focusActive) {
      // Completed Focus Block!
      setFocusActive(false);
      // Play brief synth sound
      try {
        if (soundEnabled) {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }
      } catch (e) {}
      toast('Focus Block Complete! +100 XP awarded to your Life Profile.', 'success');
      // Reset timer
      setFocusTime(selectedPreset * 60);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusTime, selectedPreset, ambientSound]);

  // 4. Format Timer Display
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 5. Preset selection
  const selectPresetTime = (mins: number) => {
    setFocusActive(false);
    setSelectedPreset(mins);
    setFocusTime(mins * 60);
  };

  // 6. Inline Capture Note
  const handleCaptureNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteTitle.trim()) return;
    addNode({
      title: quickNoteTitle,
      content: quickNoteContent || 'No additional content provided.',
      type: 'idea',
      tags: ['quick-capture'],
      connections: []
    });
    setQuickNoteTitle('');
    setQuickNoteContent('');
  };

  // 7. Inline Quick Task Add
  const handleQuickTaskAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    addTask({
      title: quickTaskTitle,
      priority: 'medium',
      dueDate: todayStr,
      tags: ['inbox'],
      project: 'Default Workspace',
      description: 'Quick task captured from command center dashboard.'
    });
    setQuickTaskTitle('');
  };

  // 8. Search Filter Logic
  const allFilteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    
    const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.project?.toLowerCase().includes(q));
    const matchedHabits = habits.filter(h => h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));
    const matchedNodes = nodes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));

    return {
      tasks: matchedTasks.slice(0, 3),
      habits: matchedHabits.slice(0, 3),
      nodes: matchedNodes.slice(0, 3)
    };
  }, [searchQuery, tasks, habits, nodes]);

  // 9. "What Should I Do Next?" - Dynamic Smart Recommendation
  const nextRecommendedAction = useMemo(() => {
    // Priority 1: Any uncompleted habit today
    const uncompletedHabit = habits.find(h => !h.completedDates.includes(todayStr));
    if (uncompletedHabit) {
      return {
        title: `Complete Habit: ${uncompletedHabit.title}`,
        reason: `Maintain your active ${uncompletedHabit.currentStreak}-day streak. Daily routine targets build compound progress.`,
        actionLabel: 'Complete Now',
        xpReward: 60,
        associatedHabit: uncompletedHabit.id
      };
    }

    // Priority 2: High priority task due today or overdue
    const highPriorityTask = tasks.find(t => t.priority === 'high' && !t.completed);
    if (highPriorityTask) {
      return {
        title: highPriorityTask.title,
        reason: `Urgent requirement inside "${highPriorityTask.project || 'Inbox'}". High priority task due immediately.`,
        actionLabel: 'Launch Deep Focus Block',
        xpReward: 150,
        associatedTask: highPriorityTask.id
      };
    }

    // Priority 3: Any uncompleted task due today
    const taskDueToday = tasks.find(t => t.dueDate === todayStr && !t.completed);
    if (taskDueToday) {
      return {
        title: taskDueToday.title,
        reason: `Standard workflow task due today. Clear pending backlog to prevent rollover deficits.`,
        actionLabel: 'Launch Deep Focus Block',
        xpReward: 80,
        associatedTask: taskDueToday.id
      };
    }

    // Priority 4: Default fallback
    return {
      title: 'Review Second Brain Ideations',
      reason: 'No urgent task conflicts detected today. Browse your Idea Vault or start a general study block.',
      actionLabel: 'Browse Vault',
      xpReward: 40
    };
  }, [tasks, habits, todayStr]);

  // 9.5. Dynamic checklist of objectives for Today's Mission
  const missionObjectives = useMemo(() => {
    const objectives = [];
    
    // Objective 1: High priority task or standard task
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

    // Objective 2: Habits
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

    // Objective 3: Focus Timer / Study Block
    objectives.push({
      title: focusActive ? 'Focus Block Active' : 'Initiate Deep Focus Block',
      desc: focusActive ? `Time remaining: ${formatTime(focusTime)}` : 'Complete at least one 25m Pomodoro block',
      completed: focusTime === 0
    });

    return objectives;
  }, [tasks, habits, todayStr, focusActive, focusTime]);

  // 10. Today's Mission Counts and Progress
  const todayMissions = useMemo(() => {
    const total = missionObjectives.length;
    const done = missionObjectives.filter(o => o.completed).length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, percentage };
  }, [missionObjectives]);

  // 11. Custom Grid Sort & Prioritization Order based on PriorityMode
  const dashboardBlocks = useMemo(() => {
    const blocks = [
      { id: 'recommendation', urgency: 1, focus: 2, habits: 2, balanced: 1 },
      { id: 'mission', urgency: 2, focus: 3, habits: 3, balanced: 2 },
      { id: 'focusLauncher', urgency: 6, focus: 1, habits: 8, balanced: 3 },
      { id: 'tasks', urgency: 3, focus: 4, habits: 9, balanced: 4 },
      { id: 'habits', urgency: 8, focus: 9, habits: 1, balanced: 5 },
      { id: 'overview', urgency: 4, focus: 5, habits: 4, balanced: 6 },
      { id: 'xp', urgency: 9, focus: 7, habits: 5, balanced: 7 },
      { id: 'insights', urgency: 5, focus: 6, habits: 6, balanced: 8 },
      { id: 'predictions', urgency: 7, focus: 8, habits: 7, balanced: 9 },
      { id: 'calendar', urgency: 4, focus: 10, habits: 10, balanced: 10 },
      { id: 'opportunities', urgency: 10, focus: 11, habits: 11, balanced: 11 },
      { id: 'notes', urgency: 11, focus: 6, habits: 12, balanced: 12 },
      { id: 'wrapped', urgency: 12, focus: 12, habits: 2, balanced: 13 },
      { id: 'stats', urgency: 13, focus: 3, habits: 6, balanced: 14 }
    ];

    return blocks.sort((a, b) => {
      if (prioritization === 'urgency') return a.urgency - b.urgency;
      if (prioritization === 'focus') return a.focus - b.focus;
      if (prioritization === 'habits') return a.habits - b.habits;
      return a.balanced - b.balanced;
    });
  }, [prioritization]);

  // Pre-calculations for display
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed);
  const highPriorityActive = activeTasks.filter(t => t.priority === 'high');
  const upcomingDeadlines = activeTasks
    .filter(t => t.dueDate)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  // 1. Synced finance balance
  const dynamicFinanceBalance = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const currentBalance = totalIncome - totalExpense;
    return currentBalance !== 0 ? `$${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$2,450.00';
  }, [transactions]);

  // 2. Active projects count
  const dynamicProjectsCount = useMemo(() => {
    const uniqueProjects = Array.from(new Set(tasks.map(t => t.project).filter(Boolean)));
    return uniqueProjects.length > 0 ? `${uniqueProjects.length} Project${uniqueProjects.length === 1 ? '' : 's'}` : '5 Projects';
  }, [tasks]);

  // 3. Courses learning count
  const dynamicCoursesCount = useMemo(() => {
    const uniqueTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));
    const activeCount = uniqueTags.length;
    return activeCount > 0 ? `${activeCount} Active` : '3 Active';
  }, [tasks]);

  // 4. Fitness Index sessions
  const dynamicFitnessIndex = useMemo(() => {
    const fitnessHabits = habits.filter(h => 
      ['gym', 'fitness', 'workout', 'run', 'walk', 'meditation', 'water', 'health'].some(kw => 
        h.title.toLowerCase().includes(kw) || h.description.toLowerCase().includes(kw)
      )
    );
    const totalSessions = fitnessHabits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
    return totalSessions > 0 ? `${totalSessions} Session${totalSessions === 1 ? '' : 's'}` : '4 Sessions';
  }, [habits]);

  // 5. Study hours estimation
  const dynamicStudyHours = useMemo(() => {
    const studyHabits = habits.filter(h => 
      ['study', 'learn', 'read', 'german', 'course', 'class'].some(kw => 
        h.title.toLowerCase().includes(kw) || h.description.toLowerCase().includes(kw)
      )
    );
    const totalSessions = studyHabits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
    const calculatedHrs = totalSessions * 0.5; // 30m per session
    return calculatedHrs > 0 ? `${calculatedHrs.toFixed(1)}h` : '42.5h';
  }, [habits]);

  // 6. Dynamic XP & Level Progression
  const dynamicProgression = useMemo(() => {
    const totalHabitsCompletions = habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);
    const calculatedXP = (completedTasksCount * 50) + (totalHabitsCompletions * 30);
    const baseScore = lifeScore?.score || 84;
    // Add baseScore weight to XP so users have a healthy baseline
    const finalXP = (baseScore * 10) + calculatedXP;
    const computedLevel = Math.floor(finalXP / 1000) + 1;
    const currentLevelXP = finalXP % 1000;
    const targetLevelXP = 1000;
    return {
      level: computedLevel,
      xp: currentLevelXP,
      total: targetLevelXP,
      deficit: targetLevelXP - currentLevelXP
    };
  }, [completedTasksCount, habits, lifeScore]);

  // 7. Dynamic Sleep Quality based on AI Memory mainWeakness
  const sleepQuality = useMemo(() => {
    const isLateSleeper = memory?.mainWeakness?.toLowerCase().includes('sleep') || memory?.mainWeakness?.toLowerCase().includes('night');
    const score = isLateSleeper ? 68 : 86;
    const hours = isLateSleeper ? '6h 12m' : '7h 48m';
    const status = isLateSleeper 
      ? 'Late night fatigue patterns detected. Sleep rest index indicates potential focus deficit warnings.'
      : 'Optimal sleep duration logged. Rest index matches high morning productivity metrics.';
    return { score, hours, status };
  }, [memory]);

  // 8. Weekly Focus Hours Chart Data based on actual completions
  const last7DaysActivity = useMemo(() => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = daysOfWeek[d.getDay()];
      
      const habitsDone = habits.filter(h => h.completedDates.includes(dateStr)).length;
      const tasksDone = tasks.filter(t => t.completed && t.dueDate === dateStr).length;
      
      const score = (habitsDone * 1.5) + (tasksDone * 2.0);
      result.push({
        day: dayLabel,
        hrs: score > 0 ? Math.min(8.0, 1.5 + score) : 1.5 + (Math.sin(d.getDate()) + 1) * 1.5 // gentle variations if empty
      });
    }
    return result;
  }, [habits, tasks]);

  // 9. Spotify-wrapped variables
  const wrappedStats = useMemo(() => {
    const currentMonthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const highestStreak = habits.reduce((max, h) => h.currentStreak > max ? h.currentStreak : max, 0);
    const uniqueSkills = Array.from(new Set(tasks.flatMap(t => t.tags || []).concat(habits.map(h => h.category).filter(Boolean) as string[])));
    return {
      month: currentMonthLabel,
      streak: highestStreak > 0 ? highestStreak : 42,
      skills: uniqueSkills.length > 0 ? uniqueSkills.slice(0, 4).join(', ') : 'German, Rust, UI, Alg',
      skillsCount: uniqueSkills.length > 0 ? uniqueSkills.length : 4
    };
  }, [habits, tasks]);

  if (!mounted) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Powering up Life OS Dashboard...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-2 relative">
      
      {/* 1. TOP HEADER & SEARCH WIDGET */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <GreetingSection />
        
        {/* Universal Search Bar */}
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

          {/* Search suggestions overlay */}
          <AnimatePresence>
            {searchFocus && searchQuery.trim() && allFilteredItems && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-panel-strong rounded-xl p-4 shadow-2xl z-50 max-h-[320px] overflow-y-auto"
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/30 block mb-2">Search results</span>
                
                {/* Matched tasks */}
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

                {/* Matched habits */}
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

                {/* Matched nodes */}
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
                    No exact matches found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. DYNAMIC PRIORITIZATION MATRIX SELECTOR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 text-white/60">
          <ArrowUpDown className="w-4 h-4 text-white/50" />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono">Rearrange Command Center:</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {[
            { id: 'balanced', label: 'Balanced Grid', icon: LayoutDashboard },
            { id: 'urgency', label: 'Urgent Priority', icon: ShieldAlert },
            { id: 'focus', label: 'Deep Focus Mode', icon: Zap },
            { id: 'habits', label: 'Habit Streaks', icon: Flame },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setPrioritization(mode.id as PriorityMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                prioritization === mode.id
                  ? 'bg-white text-black font-semibold shadow-md shadow-white/5 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white'
              }`}
            >
              <mode.icon className="w-3.5 h-3.5" />
              <span>{mode.label}</span>
            </button>
          ))}

          <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

          <button
            onClick={() => setUniverseOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/60 transition-all shadow-[0_0_15px_rgba(167,139,250,0.15)] hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] animate-pulse"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Enter Life Universe</span>
          </button>
        </div>
      </motion.div>

      {/* 3. GRID OF MODULES WITH LAYOUT-ANIMATED REARRANGING */}
      <motion.div layout className="grid grid-cols-12 gap-5 items-stretch">
        
        <AnimatePresence mode="popLayout">
          {dashboardBlocks.map((block) => {
            
            // CARD A: SMART RECOMMENDATION ("What Should I Do Next?")
            if (block.id === 'recommendation') {
              return (
                <motion.div
                  layout
                  key="recommendation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 lg:col-span-8"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-background/40 to-blue-500/10 p-6 backdrop-blur-md h-full flex flex-col justify-between">
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
                        <div className="text-xs text-white/40 font-mono">
                          Goal Impact: <span className="text-primary font-bold">+{nextRecommendedAction.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // CARD B: TODAY'S MISSION
            if (block.id === 'mission') {
              return (
                <motion.div
                  layout
                  key="mission"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Target className="w-5 h-5 text-emerald-400" />}
                    header="Today's Mission"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/50 font-mono">SYSTEM OBJECTIVE</span>
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

                    <div className="mt-6 pt-4 border-t border-white/5">
                      <div className="flex justify-between text-xs text-white/40 mb-1.5 font-mono">
                        <span>MISSION SUCCESS RATE</span>
                        <span>{todayMissions.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${todayMissions.percentage}%` }}
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD C: FOCUS LAUNCHER WIDGET
            if (block.id === 'focusLauncher') {
              return (
                <motion.div
                  layout
                  key="focusLauncher"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Clock className="w-5 h-5 text-white animate-pulse" />}
                    header="Focus Mode Launcher"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-mono text-white/40 uppercase">POMODORO TIMER</span>
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

                      {/* Display timer */}
                      <div className="text-center py-6 bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
                        <span className="text-4xl font-mono font-bold tracking-widest text-white glow-text">
                          {formatTime(focusTime)}
                        </span>
                        
                        {/* Audio equalizer visualization */}
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
                          {focusActive ? `Focus block active (${ambientSound} ambient)` : 'Ready to start focus block'}
                        </span>
                      </div>

                      {/* Ambient Sound options */}
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
                        <span>{focusActive ? 'Pause Session' : 'Enter Deep Work'}</span>
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
              );
            }

            // CARD D: TODAY'S TASKS & DEADLINES BOARD
            if (block.id === 'tasks') {
              return (
                <motion.div
                  layout
                  key="tasks"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<CheckSquare className="w-5 h-5 text-white/70" />}
                    header="Today's Tasks & Priorities"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div>
                      {/* Quick Inline task creator */}
                      <form onSubmit={handleQuickTaskAdd} className="flex gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Quick add task for today..."
                          value={quickTaskTitle}
                          onChange={(e) => setQuickTaskTitle(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all font-sans"
                        />
                        <button type="submit" className="p-2 bg-white text-black rounded-xl hover:opacity-90 active:scale-95 transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>

                      {/* Task checklist */}
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {tasks.slice(0, 4).map((task) => (
                          <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                              task.completed 
                                ? 'bg-white/5 border-white/5 text-white/30 line-through' 
                                : 'bg-black/30 border-white/5 hover:border-white/15 text-white'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${
                                task.completed ? 'text-white/30' : task.priority === 'high' ? 'text-rose-400' : 'text-white/20'
                              }`} />
                              <div className="text-xs">
                                <span className="font-semibold block">{task.title}</span>
                                <span className="text-[10px] text-white/40 block mt-0.5">{task.project || 'Inbox'}</span>
                              </div>
                            </div>
                            {task.priority === 'high' && !task.completed && (
                              <Badge variant="destructive" className="text-[8px] tracking-wide shrink-0">HIGH</Badge>
                            )}
                          </div>
                        ))}

                        {tasks.length === 0 && (
                          <div className="text-center py-8 text-white/30 text-xs font-mono">
                            No tasks found. Use task editor.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upcoming deadlines */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider block mb-2 font-mono">Upcoming Deadlines</span>
                      <div className="space-y-2">
                        {upcomingDeadlines.slice(0, 2).map((task) => (
                          <div key={task.id} className="flex justify-between items-center text-xs font-medium">
                            <span className="text-white/60 truncate pr-4">{task.title}</span>
                            <span className="text-rose-400/90 text-[10px] font-mono shrink-0">Due: {task.dueDate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD E: HABIT TRACKER PANEL
            if (block.id === 'habits') {
              return (
                <motion.div
                  layout
                  key="habits"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Flame className="w-5 h-5 text-amber-500" />}
                    header="Habit Tracker Checklist"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-white/40 uppercase">DAILY STREAKS</span>
                        <Badge variant="glow" className="bg-amber-500/10 text-amber-400 border-amber-500/20">MULT: 1.5X</Badge>
                      </div>

                      <div className="space-y-3">
                        {habits.slice(0, 3).map((habit) => {
                          const isDone = habit.completedDates.includes(todayStr);
                          return (
                            <div 
                              key={habit.id}
                              onClick={() => toggleHabitComplete(habit.id, todayStr)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                isDone 
                                  ? 'bg-amber-500/10 border-amber-500/20 text-white/70' 
                                  : 'bg-black/30 border-white/5 hover:border-white/15 text-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                                  {habit.icon === 'brain' ? '🧠' : habit.icon === 'languages' ? '🌐' : '💧'}
                                </div>
                                <div>
                                  <span className="text-xs font-semibold block">{habit.title}</span>
                                  <span className="text-[10px] text-white/40 block mt-0.5">{habit.description}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-mono text-amber-500 font-bold flex items-center gap-0.5">
                                  <Flame className="w-3.5 h-3.5 fill-current" /> {habit.currentStreak}d
                                </span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                  isDone ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/20'
                                }`}>
                                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3px]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Link href="/habits" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                      <span>View All Habits</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD F: LIFE OVERVIEW WIDGET
            if (block.id === 'overview') {
              return (
                <motion.div
                  layout
                  key="overview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: 'Study Hours', value: dynamicStudyHours, sub: 'Last 7 days', xp: 'Flow sessions', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400', icon: GraduationCap },
                      { label: 'Career Level', value: `Level ${dynamicProgression.level}`, sub: 'Commander', xp: `${dynamicProgression.xp} / ${dynamicProgression.total} XP`, color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400', icon: Trophy },
                      { label: 'Active Projects', value: dynamicProjectsCount, sub: 'In Workspace', xp: 'Milestones tracked', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: Laptop },
                      { label: 'Courses Learning', value: dynamicCoursesCount, sub: 'Topic tags active', xp: 'Workspace tags', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400', icon: BookOpen },
                      { label: 'Fitness Index', value: dynamicFitnessIndex, sub: 'Routines hit', xp: 'Hydration & Gym', color: 'from-rose-500/20 to-rose-600/5', border: 'border-rose-500/20', text: 'text-rose-400', icon: Dumbbell },
                      { label: 'Encrypted Finance', value: dynamicFinanceBalance, sub: 'Budget synced', xp: 'Transactions logged', color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-400', icon: DollarSign },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={idx}
                          className={`rounded-2xl border ${stat.border} bg-gradient-to-b ${stat.color} p-4.5 backdrop-blur-md flex flex-col justify-between min-h-[130px] hover:scale-[1.02] transition-transform duration-300`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-white/50 font-medium block">{stat.label}</span>
                            <Icon className={`w-4 h-4 ${stat.text}`} />
                          </div>
                          <div>
                            <span className="text-lg md:text-xl font-display font-bold text-white block mt-2">{stat.value}</span>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[10px] font-mono">
                            <span className="text-white/40">{stat.sub}</span>
                            <span className={`${stat.text} font-semibold`}>{stat.xp}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            }

            // CARD G: XP & RANK PROGRESSION
            if (block.id === 'xp') {
              return (
                <motion.div
                  layout
                  key="xp"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Trophy className="w-5 h-5 text-purple-400" />}
                    header="XP & Level Progression"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center border border-white/10 shrink-0 shadow-lg shadow-primary/20">
                          <span className="text-xl font-display font-extrabold text-black">{dynamicProgression.level}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-white">Level {dynamicProgression.level} Commander</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Rank #{(15 - Math.min(5, dynamicProgression.level))}</span>
                          </div>
                          <div className="text-[10px] text-white/50 mt-0.5">Title: Strategic Visionary</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/40 font-mono">
                          <span>Next level in {dynamicProgression.deficit} XP</span>
                          <span>{dynamicProgression.xp} / {dynamicProgression.total} XP</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full"
                            style={{ width: `${(dynamicProgression.xp / dynamicProgression.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider block mb-2 font-mono">Recent Activity Log</span>
                      <div className="space-y-2">
                        {[
                          { act: `Completed ${completedTasksCount} total tasks`, xp: `+${completedTasksCount * 50} XP`, time: 'Active' },
                          { act: `Logged active habit routines`, xp: `+${habits.reduce((acc, h) => acc + h.completedDates.length, 0) * 30} XP`, time: 'Secured' },
                          { act: `Synchronized Life OS systems`, xp: `+${lifeScore?.score || 84} XP`, time: 'Optimal' },
                        ].map((log, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-medium">
                            <span className="text-white/60">{log.act}</span>
                            <div className="flex gap-2 font-mono shrink-0">
                              <span className="text-primary">{log.xp}</span>
                              <span className="text-white/20">{log.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD H: AI INSIGHTS
            if (block.id === 'insights') {
              return (
                <motion.div
                  layout
                  key="insights"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Brain className="w-5 h-5 text-white" />}
                    header="AI Behavioral Diagnostics"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div className="font-mono text-[11px] sm:text-xs leading-relaxed space-y-2.5">
                      <p className="text-emerald-400/90">&gt; Initializing diagnostics...</p>
                      {insights.slice(0, 3).map((ins, idx) => (
                        <p key={ins.id || idx} className="text-white/70">
                          &gt; {ins.text} <span className="text-white/30 text-[9px]">({ins.correlation})</span>
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                      <span className="text-white/40 font-mono">Neural Model: v2.4-alpha</span>
                      <Link href="/life-intelligence" className="text-primary font-semibold hover:underline flex items-center gap-0.5">
                        Deep Diagnostics <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD I: FUTURE PREDICTIONS
            if (block.id === 'predictions') {
              return (
                <motion.div
                  layout
                  key="predictions"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<AlertCircle className="w-5 h-5 text-rose-400" />}
                    header="Future Predictions & Deficits"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div className="space-y-4">
                      <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                        <span className="text-[10px] font-bold text-rose-400 font-mono tracking-wider block uppercase">Semester Deficit Warning</span>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">
                          At your current pace, you are projected to fall 18% short of your 200h goal. Increase daily blocks by 15m.
                        </p>
                      </div>

                      <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                        <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wider block uppercase">Focus Burnout Probability</span>
                        <p className="text-xs text-white/70 mt-1 leading-relaxed">
                          High mental workload detected on Tuesday night. Recovery session recommended.
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-white/30 font-mono mt-4 text-center">
                      Metrics refresh daily at midnight.
                    </div>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD J: CALENDAR EVENTS
            if (block.id === 'calendar') {
              return (
                <motion.div
                  layout
                  key="calendar"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Calendar className="w-5 h-5 text-white/70" />}
                    header="Upcoming Calendar Agenda"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div className="space-y-3.5">
                      {[
                        { time: '10:00 AM', name: 'Stanford CS AI Seminar', type: 'webinar', match: '96% Fit', color: 'text-emerald-400 bg-emerald-500/10' },
                        { time: '02:00 PM', name: 'German Conversation Group', type: 'routine', match: '89% Fit', color: 'text-blue-400 bg-blue-500/10' },
                        { time: '04:30 PM', name: 'Project Demo Standup', type: 'work', match: 'Core', color: 'text-purple-400 bg-purple-500/10' }
                      ].map((evt, idx) => (
                        <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-white block">{evt.name}</span>
                            <span className="text-[10px] text-white/40 block mt-0.5">{evt.time} · {evt.type}</span>
                          </div>
                          <Badge variant="glow" className="text-[8px] tracking-wide shrink-0">{evt.match}</Badge>
                        </div>
                      ))}
                    </div>

                    <Link href="/timeline" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                      <span>Sync Calendar Settings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD K: OPPORTUNITY FEED
            if (block.id === 'opportunities') {
              return (
                <motion.div
                  layout
                  key="opportunities"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<Compass className="w-5 h-5 text-cyan-400" />}
                    header="Opportunity Radar Feed"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div className="space-y-3.5">
                      {[
                        { title: 'Global Next-Gen Hackathon', match: '96% Match', deadline: 'June 12', tags: ['CS', 'Next.js'] },
                        { title: 'Google CS Research Fellowship', match: '89% Match', deadline: 'June 20', tags: ['AI', 'Python'] },
                        { title: 'Stanford AI Summer Research Lab', match: '88% Match', deadline: 'July 05', tags: ['Deep Learning'] }
                      ].map((opp, idx) => (
                        <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white block truncate">{opp.title}</span>
                            <span className="text-[10px] text-white/40 block mt-0.5">Deadline: {opp.deadline}</span>
                          </div>
                          <Badge variant="success" className="text-[8px] shrink-0 font-mono">{opp.match}</Badge>
                        </div>
                      ))}
                    </div>

                    <Link href="/life-vision" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                      <span>Explore Matches</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD L: SECOND BRAIN / IDEAS VAULT
            if (block.id === 'notes') {
              return (
                <motion.div
                  layout
                  key="notes"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <GlassCard
                    icon={<BookOpen className="w-5 h-5 text-purple-400" />}
                    header="Ideas Vault & Quick Capture"
                    className="h-full flex flex-col justify-between"
                    animated={false}
                  >
                    <div>
                      {/* Inline Capture form */}
                      <form onSubmit={handleCaptureNote} className="space-y-2 mb-4 bg-black/40 border border-white/5 p-3 rounded-xl">
                        <input
                          type="text"
                          placeholder="Idea / Note Title..."
                          value={quickNoteTitle}
                          onChange={(e) => setQuickNoteTitle(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-white/5 pb-1 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-all font-semibold"
                        />
                        <textarea
                          placeholder="Write contents..."
                          value={quickNoteContent}
                          onChange={(e) => setQuickNoteContent(e.target.value)}
                          rows={2}
                          className="w-full bg-transparent border-0 text-[11px] text-white/70 placeholder-white/20 focus:outline-none resize-none"
                        />
                        <button type="submit" className="w-full py-1.5 bg-white text-black text-[10px] font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1">
                          <PlusCircle className="w-3.5 h-3.5" /> Capture Idea
                        </button>
                      </form>

                      {/* Recent brain items */}
                      <div className="space-y-2">
                        {nodes.slice(0, 2).map((node) => (
                          <div key={node.id} className="p-2.5 bg-white/5 border border-white/5 rounded-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-white/90 truncate">{node.title}</span>
                              <Badge variant="outline" className="text-[8px]">{node.type}</Badge>
                            </div>
                            <p className="text-[10px] text-white/40 truncate mt-1">{node.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/brain" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5">
                      <span>Open Second Brain</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            }

            // CARD M: MONTHLY CINEMATIC REPLAY (SPOTIFY WRAPPED)
            if (block.id === 'wrapped') {
              return (
                <motion.div
                  layout
                  key="wrapped"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/20 via-background/40 to-purple-500/20 p-6 backdrop-blur-md h-full flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                      <History className="w-20 h-20 text-white" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/15 border border-white/10 text-[9px] font-mono text-white/80 uppercase mb-3">
                        VIRAL SYSTEM REPLAY
                      </div>
                      <h3 className="text-lg font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 leading-snug">
                        Your Life Replay: {wrappedStats.month}
                      </h3>
                      <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                        Your monthly cinematic report of focus sessions, completed milestones, and skill multipliers is compiled and ready.
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setReplaySlide(0);
                        setReplayOpen(true);
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Launch Cinematic Replay</span>
                    </button>
                  </div>
                </motion.div>
              );
            }

            // CARD N: WEEKLY / PULSE CHART PANEL
            if (block.id === 'stats') {
              return (
                <motion.div
                  layout
                  key="stats"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-12 lg:col-span-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                    {/* Weekly Chart */}
                    <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between min-h-[200px]">
                      <div>
                        <span className="text-xs text-white/40 block font-mono">PRODUCTIVITY DRIFT</span>
                        <h4 className="text-base font-semibold mt-1">Weekly Focus Activity</h4>
                      </div>
                      <div className="h-28 flex items-end gap-2.5 px-1 mt-4">
                        {last7DaysActivity.map((d, index) => {
                          const maxHrs = 8.0;
                          const percent = (d.hrs / maxHrs) * 100;
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                              <div className="w-full rounded-t bg-white/20 group-hover:bg-white transition-all cursor-pointer relative" style={{ height: `${percent}%` }}>
                                <div className="absolute top-full text-[9px] text-white/30 text-center w-full mt-1.5 font-mono">{d.day}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sleep Metric Circle */}
                    <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center min-h-[200px] text-center">
                      <div className="relative w-24 h-24 mb-3">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="6" strokeDasharray={251.2} strokeDashoffset={251.2 - (sleepQuality.score / 100) * 251.2} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold text-white">{sleepQuality.score}%</div>
                      </div>
                      <span className="text-xs font-semibold">Sleep Recovery Quality</span>
                      <p className="text-[10px] text-white/40 mt-1 max-w-[160px] leading-relaxed">{sleepQuality.hours} sleep logged. {sleepQuality.status}</p>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>

      </motion.div>

      {/* 4. CINEMATIC WRAPPED REPLAY STORY-STYLE MODAL */}
      <AnimatePresence>
        {replayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
            
            {/* Slide story indicators */}
            <div className="absolute top-6 inset-x-6 flex gap-2 z-50 max-w-md mx-auto">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: replaySlide > idx ? '100%' : replaySlide === idx ? '60%' : '0%' }}
                  />
                </div>
              ))}
            </div>

            {/* Slide contents container */}
            <div className="w-full max-w-md mx-4 p-8 relative flex flex-col justify-between h-[80vh] bg-gradient-to-b from-purple-950/20 via-black to-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Close button */}
              <button 
                onClick={() => setReplayOpen(false)}
                className="absolute top-10 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white z-50 border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center mt-6">
                
                {/* SLIDE 0: Welcome */}
                {replaySlide === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 mx-auto flex items-center justify-center border border-white/20 animate-bounce shadow-xl shadow-pink-500/10">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 font-bold block mb-1">{wrappedStats.month.toUpperCase()} REPLAY</span>
                      <h2 className="text-3xl font-display font-extrabold text-white leading-tight">Your life, dynamic.</h2>
                      <p className="text-xs text-white/40 max-w-xs mt-2">Let's walk through what you built, studied, and achieved this month.</p>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 1: Hours studied */}
                {replaySlide === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center space-y-4"
                  >
                    <span className="text-sm font-mono text-purple-400 block font-semibold">DEEP WORK FOCUS</span>
                    <h3 className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{dynamicStudyHours}</h3>
                    <p className="text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
                      You logged {dynamicStudyHours} of deep focus sessions. That puts you in the <span className="text-white font-bold">top 3% of global commanders</span> this month.
                    </p>
                  </motion.div>
                )}

                {/* SLIDE 2: Habits streak */}
                {replaySlide === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-500 text-3xl">
                      🔥
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white">{wrappedStats.streak}-Day Streak</h3>
                    <p className="text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
                      Your vocabulary retention and meditation routines remained locked. Next landmark milestone unlocks at {wrappedStats.streak + 8} days.
                    </p>
                  </motion.div>
                )}

                {/* SLIDE 3: Tasks and projects completed */}
                {replaySlide === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold block">PROJECT PROGRESSION</span>
                    <h3 className="text-4xl font-display font-bold text-white">{completedTasksCount} Objectives Closed</h3>
                    <p className="text-sm text-white/70 max-w-xs mx-auto leading-relaxed">
                      Completed {completedTasksCount} individual tasks, closing active nodes and securing your workspace achievements.
                    </p>
                  </motion.div>
                )}

                {/* SLIDE 4: Share Replay */}
                {replaySlide === 4 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 mx-auto">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white">Share Your Achievements</h3>
                      <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">Generate a public link or download a custom infographic summary for GitHub & Twitter.</p>
                    </div>
                    <div className="flex gap-2 justify-center pt-2">
                      <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" /> Share Replay
                      </button>
                      <button 
                        onClick={() => setReplayOpen(false)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <button 
                  disabled={replaySlide === 0}
                  onClick={() => setReplaySlide(prev => prev - 1)}
                  className={`text-xs text-white/50 hover:text-white transition-all disabled:opacity-0`}
                >
                  Previous
                </button>
                
                {replaySlide < 4 ? (
                  <button 
                    onClick={() => setReplaySlide(prev => prev + 1)}
                    className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                  >
                    Next Slide
                  </button>
                ) : (
                  <span className="text-[10px] text-white/20 font-mono">End of Replay</span>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 5. 3D PLANET UNIVERSE NAVIGATOR OVERLAY */}
        {universeOpen && (
          <motion.div
            key="universe-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#05020c]/98 overflow-hidden font-sans select-none"
          >
            {/* Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
              .space-bg {
                background-image: 
                  radial-gradient(white, rgba(255,255,255,.2) 1.5px, transparent 30px),
                  radial-gradient(white, rgba(255,255,255,.1) 1px, transparent 20px);
                background-size: 400px 400px, 250px 250px;
                opacity: 0.18;
                animation: stars-drift 160s linear infinite;
              }
              @keyframes stars-drift {
                from { background-position: 0 0, 40px 60px; }
                to { background-position: 400px 400px, 290px 310px; }
              }
              .glow-text {
                text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
              }
            `}} />

            {/* Stars background */}
            <div className="absolute inset-0 space-bg pointer-events-none" />
            
            {/* Ambient Nebula Glows */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />

            {/* Close Button */}
            <button 
              onClick={() => {
                if (zoomPlanet) return;
                setUniverseOpen(false);
              }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 z-50 transition-all flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top HUD Panel */}
            <div className="absolute top-6 left-6 z-40 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase">
                  LIFE OPERATING SYSTEM · {constellationMode ? 'CONSTELLATION VIEW' : 'SPATIAL VIEW'}
                </span>
              </div>
              <h2 className="text-2xl font-display font-extrabold text-white mt-1 uppercase tracking-tight">The Life Universe</h2>
              <p className="text-xs text-white/40 font-mono mt-0.5">Click a sector planet to zoom in and warp to that workspace.</p>
            </div>

            {/* View Toggle (Top Middle) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1 backdrop-blur-md">
              <button 
                onClick={() => setConstellationMode(false)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${!constellationMode ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                3D Spatial
              </button>
              <button 
                onClick={() => setConstellationMode(true)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${constellationMode ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
              >
                2D Constellation
              </button>
            </div>

            {/* Telemetry Detail HUD Panel (Bottom Left) */}
            <AnimatePresence>
              {hoveredPlanetObj && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-6 left-6 w-80 bg-black/85 border border-white/15 rounded-2xl p-5 z-40 shadow-2xl backdrop-blur-xl pointer-events-none"
                >
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 font-bold uppercase block mb-1">Sector Telemetry</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${hoveredPlanetObj.color} flex items-center justify-center text-white border border-white/10 shadow-lg`}>
                      <hoveredPlanetObj.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-white leading-none">{hoveredPlanetObj.title}</h3>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 block">{hoveredPlanetObj.stats}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-3 leading-relaxed">
                    {hoveredPlanetObj.description}
                  </p>
                  
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/30">
                    <span>SECTOR_COORDS: {hoveredPlanetObj.x}, {hoveredPlanetObj.y}</span>
                    <span className="text-purple-400 font-semibold animate-pulse">WARP STATUS: READY</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* General Help Subtext HUD (Bottom Right) */}
            <div className="absolute bottom-6 right-6 z-40 text-right pointer-events-none font-mono text-[9px] text-white/20 uppercase tracking-widest">
              <span>SYSTEM: ONLINE · LOCAL STORAGE: BACKUP SYNCED</span>
            </div>

            {/* Orbit / Planets Camera Viewport */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                animate={{
                  scale: universeZoom,
                  x: zoomPlanet ? -zoomPlanetCoordinates.x : 0,
                  y: zoomPlanet ? -zoomPlanetCoordinates.y : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 45,
                  damping: 15,
                  mass: 1.2
                }}
                className="relative flex items-center justify-center w-0 h-0"
              >
                {constellationMode ? (
                  <>
                    {/* SVG Constellation Connective Grid */}
                    <svg className="absolute w-[800px] h-[800px] pointer-events-none overflow-visible z-0" viewBox="-400 -400 800 800">
                      <defs>
                        <filter id="star-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="8" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {/* Connection lines from Core (0,0) */}
                      <line x1="0" y1="0" x2="150" y2="0" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" filter="url(#star-glow)" />
                      <line x1="0" y1="0" x2="-150" y2="0" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" filter="url(#star-glow)" />
                      <line x1="0" y1="0" x2="120" y2="208" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" filter="url(#star-glow)" />
                      <line x1="0" y1="0" x2="-120" y2="-208" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" filter="url(#star-glow)" />
                      <line x1="0" y1="0" x2="-165" y2="286" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" filter="url(#star-glow)" />
                      <line x1="0" y1="0" x2="165" y2="-286" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" filter="url(#star-glow)" />
                      
                      {/* Inter-node constellation links */}
                      <line x1="150" y1="0" x2="165" y2="-286" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1" />
                      <line x1="-150" y1="0" x2="-120" y2="-208" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1" />
                      <line x1="120" y1="208" x2="165" y2="-286" stroke="rgba(244, 63, 94, 0.25)" strokeWidth="1" />
                      <line x1="-120" y1="-208" x2="-165" y2="286" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1" />
                    </svg>

                    {/* Constellation Planet Nodes */}
                    {planets.map(planet => (
                      <div
                        key={planet.id}
                        className="absolute pointer-events-auto z-20"
                        style={{
                          left: `calc(50% + ${planet.x}px)`,
                          top: `calc(50% + ${planet.y}px)`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <motion.button
                          onClick={() => {
                            if (zoomPlanet) return;
                            setZoomPlanet(planet.id);
                            setUniverseZoom(5.5);
                            setTimeout(() => {
                              router.push(planet.path);
                            }, 1200);
                          }}
                          onMouseEnter={() => setHoveredPlanet(planet.id)}
                          onMouseLeave={() => setHoveredPlanet(null)}
                          whileHover={{ scale: 1.15 }}
                          className={`w-12 h-12 rounded-full bg-gradient-to-tr ${planet.color} p-[1px] border border-white/25 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300`}
                          style={{
                            boxShadow: hoveredPlanet === planet.id ? `0 0 25px ${planet.shadow}` : undefined
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-black/85 flex items-center justify-center text-white hover:bg-transparent transition-all">
                            <planet.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider text-white whitespace-nowrap shadow-md pointer-events-none opacity-80">
                            {planet.title}
                          </div>
                        </motion.button>
                      </div>
                    ))}

                    {/* Constellation Commander Core */}
                    <motion.div
                      onMouseEnter={() => setHoveredPlanet('core')}
                      onMouseLeave={() => setHoveredPlanet(null)}
                      whileHover={{ scale: 1.05 }}
                      className="absolute z-10 w-28 h-28 flex flex-col items-center justify-center rounded-full bg-black/90 backdrop-blur-xl border border-white/15 shadow-[0_0_30px_rgba(168,85,247,0.25)] cursor-pointer"
                    >
                      <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse pointer-events-none" />
                      <Trophy className="w-4 h-4 text-purple-400 mb-0.5" />
                      <span className="text-[8px] font-mono text-white/40 tracking-wider">
                        {mounted ? userName.toUpperCase() : 'COMMANDER'}&apos;S CORE
                      </span>
                      <span className="text-sm font-display font-extrabold text-white mt-0.5">Level 24</span>
                      <span className="text-[8px] font-mono text-emerald-400 mt-0.5 font-bold">SCORE: 84</span>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Orbit 1 Container (Radius 150px) */}
                    <motion.div
                      animate={zoomPlanet ? { rotate: 0 } : { rotate: 360 }}
                      transition={zoomPlanet 
                        ? { type: 'spring', stiffness: 50, damping: 15 } 
                        : { repeat: Infinity, duration: 30, ease: "linear" }
                      }
                      className="absolute w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none flex items-center justify-center"
                    >
                      {planets.filter(p => Math.abs(p.x) === 150).map(planet => (
                        <div
                          key={planet.id}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `calc(50% + ${planet.x}px)`,
                            top: `calc(50% + ${planet.y}px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <motion.button
                            animate={zoomPlanet ? { rotate: 0 } : { rotate: -360 }}
                            transition={zoomPlanet 
                              ? { type: 'spring', stiffness: 50, damping: 15 } 
                              : { repeat: Infinity, duration: 30, ease: "linear" }
                            }
                            onClick={() => {
                              if (zoomPlanet) return;
                              setZoomPlanet(planet.id);
                              setUniverseZoom(5.5);
                              setTimeout(() => {
                                router.push(planet.path);
                              }, 1200);
                            }}
                            onMouseEnter={() => setHoveredPlanet(planet.id)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                            whileHover={{ scale: 1.15 }}
                            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${planet.color} p-[1px] border border-white/20 flex items-center justify-center cursor-pointer shadow-lg transition-shadow duration-300`}
                            style={{
                              boxShadow: hoveredPlanet === planet.id ? `0 0 25px ${planet.shadow}` : undefined
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-transparent transition-all">
                              <planet.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider text-white whitespace-nowrap shadow-md pointer-events-none opacity-80">
                              {planet.title}
                            </div>
                          </motion.button>
                        </div>
                      ))}
                    </motion.div>

                    {/* Orbit 2 Container (Radius 240px) */}
                    <motion.div
                      animate={zoomPlanet ? { rotate: 0 } : { rotate: 360 }}
                      transition={zoomPlanet 
                        ? { type: 'spring', stiffness: 50, damping: 15 } 
                        : { repeat: Infinity, duration: 45, ease: "linear" }
                      }
                      className="absolute w-[480px] h-[480px] rounded-full border border-white/5 pointer-events-none flex items-center justify-center"
                    >
                      {planets.filter(p => Math.abs(p.x) === 120).map(planet => (
                        <div
                          key={planet.id}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `calc(50% + ${planet.x}px)`,
                            top: `calc(50% + ${planet.y}px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <motion.button
                            animate={zoomPlanet ? { rotate: 0 } : { rotate: -360 }}
                            transition={zoomPlanet 
                              ? { type: 'spring', stiffness: 50, damping: 15 } 
                              : { repeat: Infinity, duration: 45, ease: "linear" }
                            }
                            onClick={() => {
                              if (zoomPlanet) return;
                              setZoomPlanet(planet.id);
                              setUniverseZoom(5.5);
                              setTimeout(() => {
                                router.push(planet.path);
                              }, 1200);
                            }}
                            onMouseEnter={() => setHoveredPlanet(planet.id)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                            whileHover={{ scale: 1.15 }}
                            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${planet.color} p-[1px] border border-white/20 flex items-center justify-center cursor-pointer shadow-lg transition-shadow duration-300`}
                            style={{
                              boxShadow: hoveredPlanet === planet.id ? `0 0 25px ${planet.shadow}` : undefined
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-transparent transition-all">
                              <planet.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider text-white whitespace-nowrap shadow-md pointer-events-none opacity-80">
                              {planet.title}
                            </div>
                          </motion.button>
                        </div>
                      ))}
                    </motion.div>

                    {/* Orbit 3 Container (Radius 330px) */}
                    <motion.div
                      animate={zoomPlanet ? { rotate: 0 } : { rotate: 360 }}
                      transition={zoomPlanet 
                        ? { type: 'spring', stiffness: 50, damping: 15 } 
                        : { repeat: Infinity, duration: 60, ease: "linear" }
                      }
                      className="absolute w-[660px] h-[660px] rounded-full border border-white/5 pointer-events-none flex items-center justify-center"
                    >
                      {planets.filter(p => Math.abs(p.x) === 165).map(planet => (
                        <div
                          key={planet.id}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `calc(50% + ${planet.x}px)`,
                            top: `calc(50% + ${planet.y}px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <motion.button
                            animate={zoomPlanet ? { rotate: 0 } : { rotate: -360 }}
                            transition={zoomPlanet 
                              ? { type: 'spring', stiffness: 50, damping: 15 } 
                              : { repeat: Infinity, duration: 60, ease: "linear" }
                            }
                            onClick={() => {
                              if (zoomPlanet) return;
                              setZoomPlanet(planet.id);
                              setUniverseZoom(5.5);
                              setTimeout(() => {
                                router.push(planet.path);
                              }, 1200);
                            }}
                            onMouseEnter={() => setHoveredPlanet(planet.id)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                            whileHover={{ scale: 1.15 }}
                            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${planet.color} p-[1px] border border-white/20 flex items-center justify-center cursor-pointer shadow-lg transition-shadow duration-300`}
                            style={{
                              boxShadow: hoveredPlanet === planet.id ? `0 0 25px ${planet.shadow}` : undefined
                            }}
                          >
                            <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-transparent transition-all">
                              <planet.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider text-white whitespace-nowrap shadow-md pointer-events-none opacity-80">
                              {planet.title}
                            </div>
                          </motion.button>
                        </div>
                      ))}
                    </motion.div>

                    {/* Central Commander Core */}
                    <motion.div
                      onMouseEnter={() => setHoveredPlanet('core')}
                      onMouseLeave={() => setHoveredPlanet(null)}
                      whileHover={{ scale: 1.05 }}
                      className="absolute z-10 w-36 h-36 flex flex-col items-center justify-center rounded-full bg-black/90 backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(168,85,247,0.25)] cursor-pointer"
                    >
                      <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse pointer-events-none" />
                      
                      <Trophy className="w-5 h-5 text-purple-400 mb-1" />
                      <span className="text-[9px] font-mono text-white/40 tracking-wider">
                        {mounted ? userName.toUpperCase() : 'COMMANDER'}&apos;S CORE
                      </span>
                      <span className="text-base font-display font-extrabold text-white mt-0.5">Level 24</span>
                      <span className="text-[9px] font-mono text-emerald-400 mt-1 font-bold">SCORE: 84</span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
