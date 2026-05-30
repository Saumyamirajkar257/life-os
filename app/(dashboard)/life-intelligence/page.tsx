'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, Eye, Dna, MessageSquare, Compass, ShieldAlert,
  Zap, Trophy, Target, Search, Send, RefreshCw, Star, 
  ChevronRight, ArrowRight, UserCheck, Flame 
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

type MainTab = 'coach' | 'future' | 'dna';
type SubTab = string;

export default function LifeIntelligence() {
  const [activeTab, setActiveTab] = useState<MainTab>('coach');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('coach-chat');

  // Interactive Coach Chat States
  const [coachMessages, setCoachMessages] = useState([
    { sender: 'ai', text: "Systems sync complete. Here is what I notice this week:\n• You wasted 6 hours on distraction sites compared to last week.\n• You haven't reviewed German vocabulary for 8 days.\n• Your system design exam is in 12 days, and based on study logs, you are only 35% prepared.", time: '10:02 AM' }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachTyping, setCoachTyping] = useState(false);

  // Interactive Future Self Chat States
  const [futureMessages, setFutureMessages] = useState([
    { sender: 'future', text: "Hello from 2030. I'm the digital projection of who you'll become based on your current trajectory and accomplishments. What would you like to ask your future self?", time: 'Now' }
  ]);
  const [futureInput, setFutureInput] = useState('');
  const [futureTyping, setFutureTyping] = useState(false);

  // Pattern Discovery States
  const [patterns, setPatterns] = useState([
    { title: 'Peak Performance Time', desc: 'You complete coding sessions 3x faster and with 40% higher focus index between 9:00 PM and 11:30 PM.', type: 'strength' },
    { title: 'Habit Abandonment Hazard', desc: 'You consistently abandon new languages or habits after exactly 6 days. Let us set a micro-goal for day 7.', type: 'hazard' },
    { title: 'Physical Synergy', desc: 'Your focus session duration increases by average 28 minutes when completed within 3 hours after a workout.', type: 'strength' }
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
  const handleSendCoach = () => {
    if (!coachInput.trim()) return;
    const userMsg = { sender: 'user', text: coachInput, time: 'Just now' };
    setCoachMessages(prev => [...prev, userMsg]);
    setCoachInput('');
    setCoachTyping(true);

    setTimeout(() => {
      setCoachTyping(false);
      const responses = [
        "Analyzing priority targets... Let's adjust your schedule to fit 30 minutes of German focus today to break this 8-day drought.",
        "Understood. Your system design exam preparation index has been flagged. If we focus on mock architectures for 45 minutes today, preparedness will rise to 42%.",
        "Habit calibration updated. I will notify your companion pet to nudge you if you remain inactive during your peak coding window tonight."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setCoachMessages(prev => [...prev, { sender: 'ai', text: randomReply, time: 'Just now' }]);
    }, 1500);
  };

  const handleSendFuture = () => {
    if (!futureInput.trim()) return;
    const userMsg = { sender: 'user', text: futureInput, time: 'Just now' };
    setFutureMessages(prev => [...prev, userMsg]);
    setFutureInput('');
    setFutureTyping(true);

    setTimeout(() => {
      setFutureTyping(false);
      const responses = [
        "In 2030, that decision you made to stick through the hard study cycles paid off. The consistency built our foundation as a lead architect. Keep going.",
        "Our journey to Japan wasn't straight, but every hour you spent studying coding at night made it possible. Yes, it was worth it.",
        "Don't worry about the short-term setbacks. The habit streaks you are building right now in 2026 are what kept us stable during the 2028 startup build."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setFutureMessages(prev => [...prev, { sender: 'future', text: randomReply, time: 'Just now' }]);
    }, 1600);
  };

  const handleDiscoverPatterns = () => {
    setDiscoveringPatterns(true);
    setTimeout(() => {
      setDiscoveringPatterns(false);
      setPatterns([
        ...patterns,
        { title: 'Sleep-Focus Link', desc: 'When sleep index falls below 60%, your focus session decay rate increases by 2.2x the following morning.', type: 'hazard' }
      ]);
    }, 1200);
  };

  const handleGenerateDream = () => {
    if (!dreamInput.trim()) return;
    setDreamGenerating(true);
    setTimeout(() => {
      setDreamGenerating(false);
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
    }, 1500);
  };

  const handleSearchMemory = () => {
    if (!memoryQuery.trim()) return;
    setSearchingMemory(true);
    setTimeout(() => {
      setSearchingMemory(false);
      setMemoryResults([
        { date: 'Feb 12, 2026', type: 'Focus Session', detail: 'Studied Advanced Compiler Design for 2h 45m. Average heart rate 72bpm.' },
        { date: 'Feb 18, 2026', type: 'Goal Complete', detail: 'Achieved Level 2 in Programming. Unlocked Dark Glassmorphic Theme.' },
        { date: 'Feb 24, 2026', type: 'Journal Entry', detail: 'Recorded thoughts on systems project failure. "We must optimize memory safety early."' }
      ]);
    }, 1000);
  };

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
                        { title: 'System Architecture', val: 88, stat: 'Top 5% of Students', desc: 'Identified through rapid node graph connections in Second Brain and structure modeling in compiler projects.' },
                        { title: 'Visual UI Design', val: 76, stat: 'Top 15% of Students', desc: 'Corresponds with low styling edits during CSS configuration and active Tailwind layouts.' },
                        { title: 'Information Synthesis', val: 92, stat: 'Top 2% of Students', desc: 'Indicated by high efficiency in PDF summary reads and flashcard generation volumes.' }
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
                              { label: 'Rust Compiler Mechanics', percent: 35 },
                              { label: 'Distributed Systems & Consensuses', percent: 45 },
                              { label: 'UI/UX Visual Prototyping', percent: 60 }
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
                          Your focus style is highly concentrated but has high fatigue decay. You optimize codebases efficiently but require hard reset intervals to prevent burnout.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-4">
                        {[
                          { style: 'Focus Style', label: 'Hyperfocused Deep Work', value: 85 },
                          { style: 'Learning Style', label: 'Spaced Recurrence', value: 72 },
                          { style: 'Work Style', label: 'Concurrent Sprinting', value: 68 },
                          { style: 'Motivation Style', label: 'Rank Leaderboard XP', value: 91 }
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
