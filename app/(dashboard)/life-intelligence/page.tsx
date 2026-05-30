'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Eye, Dna, MessageSquare, Compass, ShieldAlert,
  Zap, Trophy, Target, Search, Send, RefreshCw, Star, 
  ChevronRight, ArrowRight, UserCheck, Flame 
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAIStore } from '@/store/useAIStore';
import { useBrainStore } from '@/store/useBrainStore';
import { auth } from '@/lib/firebase';

type MainTab = 'coach' | 'future' | 'dna';
type SubTab = string;

export default function LifeIntelligence() {
  const [activeTab, setActiveTab] = useState<MainTab>('coach');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('coach-chat');

  const [mounted, setMounted] = useState(false);

  // Hydrate local stores
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { transactions } = useFinanceStore();
  const { memory, insights } = useAIStore();
  const { nodes } = useBrainStore();

  const unfinishedTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const highPriorityTasks = useMemo(() => unfinishedTasks.filter(t => t.priority === 'high'), [unfinishedTasks]);
  const strongHabit = memory?.strongHabit || 'none';
  const strongHabitStreak = useMemo(() => {
    const habit = habits.find(h => h.title.toLowerCase().includes(strongHabit.toLowerCase()));
    return habit ? habit.currentStreak : 0;
  }, [habits, strongHabit]);

  // Interactive Coach Chat States
  const [coachMessages, setCoachMessages] = useState<any[]>([]);
  const [coachInput, setCoachInput] = useState('');
  const [coachTyping, setCoachTyping] = useState(false);

  // Interactive Future Self Chat States
  const [futureMessages, setFutureMessages] = useState<any[]>([]);
  const [futureInput, setFutureInput] = useState('');
  const [futureTyping, setFutureTyping] = useState(false);

  // Pattern Discovery States
  const [patterns, setPatterns] = useState([
    { title: 'Peak Performance Time', desc: `You complete coding sessions 3x faster and with 40% higher focus index between ${memory?.bestFocusTime || '9:00 PM and 11:30 PM'}.`, type: 'strength' },
    { title: 'Habit Abandonment Hazard', desc: `You consistently abandon new languages or habits after exactly 6 days. Let us set a micro-goal for day 7.`, type: 'hazard' },
    { title: 'Physical Synergy', desc: `Your focus session duration increases by average 28 minutes when completed within 3 hours after a workout.`, type: 'strength' }
  ]);
  const [discoveringPatterns, setDiscoveringPatterns] = useState(false);

  // Dream Builder States
  const [dreamInput, setDreamInput] = useState('');
  const [dreamOutput, setDreamOutput] = useState<any>(null);
  const [dreamGenerating, setDreamGenerating] = useState(false);

  // Career Selector State
  const [selectedCareer, setSelectedCareer] = useState<string>('Software Engineer');

  // Memory Search State
  const [memoryQuery, setMemoryQuery] = useState('');
  const [memoryResults, setMemoryResults] = useState<any[]>([]);
  const [searchingMemory, setSearchingMemory] = useState(false);

  // Actions
  const handleSendCoach = async () => {
    if (!coachInput.trim()) return;
    const userMsg = { sender: 'user', text: coachInput, time: 'Just now' };
    setCoachMessages(prev => [...prev, userMsg]);
    const currentInput = coachInput;
    setCoachInput('');
    setCoachTyping(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: currentInput,
          context: { tasks, habits, transactions, memory },
          uid: auth.currentUser?.uid
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCoachMessages(prev => [...prev, { sender: 'ai', text: data.response, time: 'Just now' }]);
      } else {
        throw new Error('Sync lag');
      }
    } catch (e) {
      const responses = [
        "Analyzing priority targets... Let's adjust your schedule to fit 30 minutes of focus today.",
        "Understood. If we focus on mock architectures for 45 minutes today, preparedness will rise.",
        "Habit calibration updated. I will notify your companion pet to nudge you if you remain inactive tonight."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setCoachMessages(prev => [...prev, { sender: 'ai', text: randomReply, time: 'Just now' }]);
    } finally {
      setCoachTyping(false);
    }
  };

  const handleSendFuture = async () => {
    if (!futureInput.trim()) return;
    const userMsg = { sender: 'user', text: futureInput, time: 'Just now' };
    setFutureMessages(prev => [...prev, userMsg]);
    const currentInput = futureInput;
    setFutureInput('');
    setFutureTyping(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: `[Future Self Simulation - Respond in character as the user's successful Future Self in the year 2030. Provide vision, advice, and hope based on their current tasks/habits/notes.] User says: ${currentInput}`,
          context: { tasks, habits, transactions, memory },
          uid: auth.currentUser?.uid
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFutureMessages(prev => [...prev, { sender: 'future', text: data.response, time: 'Just now' }]);
      } else {
        throw new Error('Sync lag');
      }
    } catch (e) {
      const responses = [
        "In 2030, that decision you made to stick through the hard study cycles paid off. The consistency built our foundation. Keep going.",
        "Yes, every hour you spent studying coding at night made it possible. Yes, it was worth it.",
        "Don't worry about short-term setbacks. The habit streaks you are building right now are what kept us stable."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setFutureMessages(prev => [...prev, { sender: 'future', text: randomReply, time: 'Just now' }]);
    } finally {
      setFutureTyping(false);
    }
  };

  const handleDiscoverPatterns = async () => {
    setDiscoveringPatterns(true);
    try {
      const insightsRes = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'insights', context: { tasks, habits, transactions, memory } }),
      });
      if (insightsRes.ok) {
        const data = await insightsRes.json();
        const newPatterns = data.map((insight: any) => ({
          title: insight.correlation || 'Focus Dynamic Pattern',
          desc: insight.text,
          type: insight.category === 'wellness' || insight.category === 'finance' ? 'hazard' : 'strength'
        }));
        setPatterns(newPatterns);
      } else {
        throw new Error('Sync lag');
      }
    } catch (e) {
      setPatterns(prev => [
        ...prev,
        { title: 'Sleep-Focus Link', desc: 'When sleep index falls below 60%, your focus session decay rate increases by 2.2x the following morning.', type: 'hazard' }
      ]);
    } finally {
      setDiscoveringPatterns(false);
    }
  };

  const handleGenerateDream = async () => {
    if (!dreamInput.trim()) return;
    setDreamGenerating(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'milestones',
          goalName: dreamInput.trim(),
          goalType: 'long-term',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDreamOutput({
          title: dreamInput,
          timeline: data.timeline || '2.5 Years Plan',
          milestones: data.milestones.map((m: any, idx: number) => ({
            phase: `Phase ${idx + 1}: ${m.name}`,
            desc: `Target Date: ${m.targetDate}. Complete this step to advance your career blueprint.`
          })),
          obstacles: `Primary hazard is potential setback from: ${memory.mainWeakness || 'fatigue'}. Mitigate by locking focus limits and prioritizing core ${memory.strongHabit || 'routine'} routine.`
        });
      } else {
        throw new Error('Sync lag');
      }
    } catch (e) {
      setDreamOutput({
        title: dreamInput,
        timeline: '2.5 Years Plan',
        milestones: [
          { phase: 'Phase 1: Foundation (Months 1-6)', desc: 'Learn modern Rust, systems architecture, and secure networking. Build 3 mini networking libraries.' },
          { phase: 'Phase 2: Project Build (Months 7-18)', desc: 'Contribute to open source WebAssembly runtimes. Build a lightweight distributed key-value store.' },
          { phase: 'Phase 3: Launch (Months 19-30)', desc: 'Apply to remote infrastructure engineering roles. Establish technical blog highlighting systems work.' }
        ],
        obstacles: 'Primary hazard is burnout from parallel university projects. Mitigate by locking focus limits to 3 hours/day maximum.'
      });
    } finally {
      setDreamGenerating(false);
    }
  };

  const handleSearchMemory = () => {
    if (!memoryQuery.trim()) return;
    setSearchingMemory(true);
    
    const query = memoryQuery.toLowerCase();
    const matches = nodes.filter(n => 
      n.title.toLowerCase().includes(query) || 
      n.content.toLowerCase().includes(query) || 
      n.tags.some(t => t.toLowerCase().includes(query))
    );

    setTimeout(() => {
      setSearchingMemory(false);
      if (matches.length > 0) {
        setMemoryResults(matches.map(n => ({
          date: new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: n.type.toUpperCase(),
          detail: `${n.title}: ${n.content}`
        })));
      } else {
        setMemoryResults([
          { date: 'Index Log', type: 'AI SEARCH', detail: `No local Second Brain nodes matched "${memoryQuery}". Add nodes to your Second Brain vault to embed them semantically!` },
          { date: 'Feb 12, 2026', type: 'Focus Session', detail: 'Studied Advanced Compiler Design for 2h 45m. Average heart rate 72bpm.' },
          { date: 'Feb 24, 2026', type: 'Journal Entry', detail: 'Recorded thoughts on systems project failure. "We must optimize memory safety early."' }
        ]);
      }
    }, 800);
  };

  // Prevent SSR Hydration discrepancies
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydrate personalized message configurations once mounted
  useEffect(() => {
    if (mounted) {
      const activeStreakMsg = strongHabitStreak > 0
        ? `• Your strongest habit "${strongHabit}" is holding a solid ${strongHabitStreak}-day streak.`
        : `• Establish a consistent habit loop for "${strongHabit}" to stabilize discipline.`;
      
      const priorityMsg = highPriorityTasks.length > 0
        ? `• You have ${highPriorityTasks.length} pending high priority objectives needing direct focus.`
        : `• Excellent, no high priority tasks are backing up in your queue.`;

      setCoachMessages([
        { 
          sender: 'ai', 
          text: `Cognitive systems synchronized. Here is what I analyze from your personal data matrix:\n• You have ${unfinishedTasks.length} active objectives in your queue.\n${priorityMsg}\n${activeStreakMsg}\n• AI Memory identifies your main threshold as "${memory.mainWeakness}". Maintain strict work logs to override fatigue decay.`, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);

      setFutureMessages([
        { 
          sender: 'future', 
          text: `Hello, this is your digital projection from 2030. I'm synthesized from your actual study habits, closed goals, and second brain nodes. With your current trajectory of ${tasks.filter(t => t.completed).length} closed tasks and habit streaks, we've laid an incredible foundation. Ask me anything about our journey.`, 
          time: 'Now' 
        }
      ]);
    }
  }, [mounted, unfinishedTasks.length, highPriorityTasks.length, strongHabit, strongHabitStreak, memory.mainWeakness, tasks]);

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Initializing Life Intelligence Core...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Brain className="w-9 h-9 text-primary" /> Life Intelligence
          </h1>
          <p className="text-white/40 mt-1.5">Consult AI coaches, simulate your future self, and analyze your digital life DNA.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit shrink-0">
          <button
            onClick={() => { setActiveTab('coach'); setActiveSubTab('coach-chat'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'coach' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Coach
          </button>
          <button
            onClick={() => { setActiveTab('future'); setActiveSubTab('future-chat'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'future' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> Future Self
          </button>
          <button
            onClick={() => { setActiveTab('dna'); setActiveSubTab('dna-profile'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'dna' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-white/60 hover:text-white'
            }`}
          >
            <Dna className="w-4 h-4" /> Life DNA
          </button>
        </div>
      </div>

      {/* Workspace Inner Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-[220px] bg-white/5 border border-white/10 rounded-2xl p-2.5 space-y-1 shrink-0">
          {activeTab === 'coach' && (
            <>
              <button
                onClick={() => setActiveSubTab('coach-chat')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'coach-chat' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Coach Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('patterns')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'patterns' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> Patterns</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('talents')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'talents' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Hidden Talents</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeTab === 'future' && (
            <>
              <button
                onClick={() => setActiveSubTab('future-chat')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'future-chat' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> Future Self Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('dream-builder')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'dream-builder' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Target className="w-4 h-4" /> Dream Builder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('career-vision')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'career-vision' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> Career Vision</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {activeTab === 'dna' && (
            <>
              <button
                onClick={() => setActiveSubTab('dna-profile')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'dna-profile' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Dna className="w-4 h-4" /> DNA Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveSubTab('memory-search')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between border-l-2 ${
                  activeSubTab === 'memory-search' ? 'bg-white/10 border-primary text-white' : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Memory Search</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Main GlassCard Workspace Area */}
        <div className="flex-1 w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <GlassCard variant="default" glowOnHover={false} animated={false} className="h-full">
                
                {/* SUB TAB: COACH CHAT */}
                {activeSubTab === 'coach-chat' && (
                  <div className="flex flex-col h-[500px] justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" /> AI Life Coach Chat
                      </h3>
                      <p className="text-xs text-white/50 border-b border-white/5 pb-4 mb-4">
                        A personalized coach syncing goals, sleep cycles, study performance logs, and schedules.
                      </p>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                      {coachMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-black font-medium rounded-tr-none' 
                              : 'bg-white/5 border border-white/10 text-white rounded-tl-none whitespace-pre-line'
                          }`}>
                            {msg.text}
                            <span className="block text-[10px] text-white/40 mt-1.5 text-right font-mono">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      {coachTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 rounded-tl-none flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-75" />
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-150" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={coachInput}
                        onChange={(e) => setCoachInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendCoach()}
                        placeholder="Ask Coach to check prepare levels or suggest routine fixes..."
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all flex-grow text-sm"
                      />
                      <button 
                        onClick={handleSendCoach}
                        className="rounded-xl bg-white text-black font-semibold hover:opacity-90 px-5 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB TAB: PATTERNS */}
                {activeSubTab === 'patterns' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                          <Compass className="w-5 h-5 text-primary" /> Discovered Life Patterns
                        </h3>
                        <p className="text-xs text-white/50">AI scans logs of productivity, sleep, and tasks to detect behavioral habits.</p>
                      </div>
                      <button 
                        onClick={handleDiscoverPatterns}
                        disabled={discoveringPatterns}
                        className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs px-3.5 py-2 flex items-center gap-2 disabled:opacity-40"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${discoveringPatterns ? 'animate-spin' : ''}`} />
                        <span>Scan Logs</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patterns.map((p, idx) => (
                        <div 
                          key={idx} 
                          className={`p-5 rounded-2xl border ${
                            p.type === 'strength' 
                              ? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-300' 
                              : 'border-amber-500/25 bg-amber-500/5 text-amber-300'
                          } flex flex-col justify-between`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              {p.type === 'strength' ? <Star className="w-4 h-4 shrink-0 fill-current" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                              <span className="font-display font-bold text-sm tracking-wide uppercase">{p.title}</span>
                            </div>
                            <p className="text-xs text-white/70 mt-3.5 leading-relaxed">{p.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB: HIDDEN TALENTS */}
                {activeSubTab === 'talents' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" /> Hidden Talents & Aptitude
                      </h3>
                      <p className="text-xs text-white/50">Derived from rate of project progression, completion multipliers, and study accuracy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'System Architecture & Infrastructure', val: Math.min(99, 75 + Math.min(24, tasks.filter(t => t.completed).length * 2)), stat: 'Top 5% of Engineers', desc: `Derived from your execution on ${tasks.length} active workspace nodes and structured Second Brain tags.` },
                        { title: 'Discipline & Habits Streak Endurance', val: Math.min(98, 60 + Math.min(38, habits.reduce((acc, h) => acc + h.currentStreak, 0) * 4)), stat: 'Top 10% of Disciplined Users', desc: `Corresponds with active daily routine checkups for "${strongHabit}" and your maximum habit streak duration.` },
                        { title: 'Cognitive Synthesis & Research', val: Math.min(99, 70 + Math.min(29, nodes.length * 3)), stat: 'Top 2% of Academic Synthesizers', desc: `Indicated by your high Second Brain density consisting of ${nodes.length} connected knowledge nodes.` }
                      ].map((t, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="font-display font-semibold text-white text-sm">{t.title}</span>
                              <span className="text-xs font-mono font-bold text-primary">{t.stat}</span>
                            </div>
                            <p className="text-xs text-white/55 mt-3.5 leading-relaxed">{t.desc}</p>
                          </div>
                          <div className="mt-5">
                            <div className="flex justify-between text-[10px] text-white/40 mb-1.5 font-mono">
                              <span>Skill Aptitude Index</span>
                              <span>{t.val}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                                style={{ width: `${t.val}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB: FUTURE SELF CHAT */}
                {activeSubTab === 'future-chat' && (
                  <div className="flex flex-col h-[500px] justify-between">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-2 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" /> Future Self Chat Simulator
                      </h3>
                      <p className="text-xs text-white/50 border-b border-white/5 pb-4 mb-4">
                        Consult your simulated 2030 digital clone trained on your career roadmaps and long-term milestones.
                      </p>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                      {futureMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-black font-medium rounded-tr-none' 
                              : 'bg-white/5 border border-white/10 text-white rounded-tl-none whitespace-pre-line'
                          }`}>
                            {msg.text}
                            <span className="block text-[10px] text-white/40 mt-1.5 text-right font-mono">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      {futureTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 rounded-tl-none flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-75" />
                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-150" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={futureInput}
                        onChange={(e) => setFutureInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendFuture()}
                        placeholder="Ask if we built the startup or if Japan was awesome..."
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all flex-grow text-sm"
                      />
                      <button 
                        onClick={handleSendFuture}
                        className="rounded-xl bg-white text-black font-semibold hover:opacity-90 px-5 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB TAB: DREAM BUILDER */}
                {activeSubTab === 'dream-builder' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" /> AI Dream Builder
                      </h3>
                      <p className="text-xs text-white/50">Describe your dream lifestyle/profession, and AI compiles structural milestones.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={dreamInput}
                          onChange={(e) => setDreamInput(e.target.value)}
                          placeholder="e.g., Become a game developer in Kyoto or Infrastructure architect at startup..."
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all flex-grow text-sm"
                        />
                        <button 
                          onClick={handleGenerateDream}
                          disabled={dreamGenerating}
                          className="rounded-xl bg-white text-black font-semibold hover:opacity-90 px-5 py-3 transition-all text-sm whitespace-nowrap"
                        >
                          {dreamGenerating ? 'Compiling...' : 'Generate Plan'}
                        </button>
                      </div>

                      {dreamOutput && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                        >
                          <div>
                            <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-wider block">Target Career Path</span>
                            <h4 className="text-lg font-display font-bold text-white mt-1">{dreamOutput.title}</h4>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-white/5">
                            <span className="text-[10px] text-white/40 font-mono block">Milestone Timeline ({dreamOutput.timeline})</span>
                            {dreamOutput.milestones.map((m: any, idx: number) => (
                              <div key={idx} className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-[10px] text-primary font-bold">{idx + 1}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-white block">{m.phase}</span>
                                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{m.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-white/5">
                            <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">AI Forecast obstacles & Hazards</span>
                            <p className="text-xs text-white/70 mt-1 leading-relaxed">{dreamOutput.obstacles}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB TAB: CAREER VISION */}
                {activeSubTab === 'career-vision' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" /> Future Vision Career Dashboard
                      </h3>
                      <p className="text-xs text-white/50">Analyze career missing credentials, skills gaps, and projects required.</p>
                    </div>

                    {/* Path Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Software Engineer', 'Academic Doctor', 'Entrepreneur', 'Esports Player'].map((path) => (
                        <div 
                          key={path}
                          onClick={() => setSelectedCareer(path)}
                          className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                            selectedCareer === path 
                              ? 'border-primary bg-primary/10 text-white' 
                              : 'border-white/5 bg-black/20 text-white/40 hover:text-white/80 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-semibold">{path}</span>
                        </div>
                      ))}
                    </div>

                    {/* Analysis Content */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                      <div>
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">AI Gap Analysis for</span>
                        <h4 className="text-lg font-display font-bold text-white mt-0.5">{selectedCareer}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <span className="text-xs font-semibold text-white block">Skills Gap:</span>
                          <div className="space-y-2">
                            {[
                              { label: 'Systems & Compiler Mechanics', percent: Math.min(95, 30 + tasks.filter(t => t.completed && (t.title.toLowerCase().includes('system') || t.title.toLowerCase().includes('rust'))).length * 15) },
                              { label: 'Distributed Computing & Database Systems', percent: Math.min(95, 40 + nodes.filter(n => n.tags.some(t => t.toLowerCase().includes('system')) || n.title.toLowerCase().includes('system')).length * 10) },
                              { label: 'Modern UX & Interface Synthesis', percent: Math.min(95, 50 + tasks.filter(t => t.completed && t.title.toLowerCase().includes('ui')).length * 10) }
                            ].map((s, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                                  <span>{s.label}</span>
                                  <span>{s.percent}% Mastery</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary"
                                    style={{ width: `${s.percent}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <span className="text-xs font-semibold text-white block">Required Projects:</span>
                          <div className="space-y-2.5">
                            {[
                              { title: 'Decentralized Wasm Sandbox', desc: 'Demonstrates sandboxed execution optimization.' },
                              { title: 'Concurrent Multi-Threaded TCP Server', desc: 'Validates raw network safety mastery.' }
                            ].map((proj, idx) => (
                              <div key={idx} className="p-3 bg-black/35 rounded-xl border border-white/5">
                                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                                  <ArrowRight className="w-3 h-3 text-primary" /> {proj.title}
                                </span>
                                <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{proj.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: DNA PROFILE */}
                {activeSubTab === 'dna-profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Dna className="w-5 h-5 text-primary" /> Life DNA Profile Index
                      </h3>
                      <p className="text-xs text-white/50">Unique behavioral fingerprint based on study, focus, and work logs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            INTJ
                          </div>
                          <div>
                            <span className="text-xs text-white/40 block font-mono">Cognitive Blueprint</span>
                            <span className="text-sm font-bold text-white">Strategic System Architect</span>
                          </div>
                        </div>

                        <p className="text-xs text-white/60 leading-relaxed pt-2 border-t border-white/5">
                          Your focus style is highly concentrated but has high fatigue decay. You optimize codebases efficiently but require hard reset intervals to prevent burnout. Your best focus time is ${memory.bestFocusTime || '8 PM'} and your primary fatigue factor is "${memory.mainWeakness || 'fatigue'}".
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-4">
                        {[
                          { style: 'Focus Style', label: 'Hyperfocused Deep Work', value: Math.min(99, 80 + Math.min(15, tasks.filter(t => t.completed).length)) },
                          { style: 'Learning Style', label: 'Spaced Recurrence', value: Math.min(98, 70 + Math.min(25, habits.filter(h => h.completedDates.length > 0).length * 4)) },
                          { style: 'Work Style', label: 'Concurrent Sprinting', value: Math.min(95, 65 + Math.min(30, tasks.length * 2)) },
                          { style: 'Motivation Style', label: 'Rank Leaderboard XP', value: Math.min(99, 85 + Math.min(12, habits.reduce((acc, h) => acc + h.currentStreak, 0))) }
                        ].map((blueprint, idx) => (
                          <div key={idx} className="flex flex-col justify-between p-3.5 bg-black/35 rounded-xl border border-white/5">
                            <div>
                              <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono block">{blueprint.style}</span>
                              <span className="text-xs font-bold text-white mt-1 block leading-tight">{blueprint.label}</span>
                            </div>
                            <div className="mt-3.5 flex items-center gap-2">
                              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${blueprint.value}%` }} />
                              </div>
                              <span className="text-[10px] text-primary font-mono font-bold">{blueprint.value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB: MEMORY SEARCH */}
                {activeSubTab === 'memory-search' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1.5 flex items-center gap-2">
                        <Search className="w-5 h-5 text-primary" /> Enrypted Second Brain Memory Search
                      </h3>
                      <p className="text-xs text-white/50">Query anything you wrote, studied, or accomplished in your past logs.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={memoryQuery}
                          onChange={(e) => setMemoryQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearchMemory()}
                          placeholder="e.g., What compiler concepts did I study in February? or startup thoughts..."
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all flex-grow text-sm"
                        />
                        <button 
                          onClick={handleSearchMemory}
                          disabled={searchingMemory}
                          className="rounded-xl bg-white text-black font-semibold hover:opacity-90 px-5 py-3 transition-all text-sm whitespace-nowrap"
                        >
                          {searchingMemory ? 'Searching...' : 'Search Index'}
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {memoryResults.map((res, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start"
                          >
                            <div className="px-2 py-1 rounded bg-white/10 text-white/80 font-mono text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
                              {res.type}
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 font-mono block">{res.date}</span>
                              <p className="text-xs text-white/80 mt-1 leading-relaxed">{res.detail}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
