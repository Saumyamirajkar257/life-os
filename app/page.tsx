'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/features/dashboard/components/DashboardGrid';
import { 
  Check, Play, Sparkles, Target, Shield, Activity, Plus, Trash2, 
  ArrowRight, Lock, Database, Cpu, Users, Calendar, ArrowUp, Menu, X 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isBypassed, setIsBypassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Custom Cursor state
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovering, setCursorHovering] = useState(false);

  // Custom Cycle words state
  const [cycleIndex, setCycleIndex] = useState(0);
  const [cycleText, setCycleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const cycleWords = [
    'Life, Organized.',
    'Habits, Built.',
    'Goals, Achieved.',
    'Focus, Unlocked.'
  ];

  // Interactive Live Demo states
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Review deep learning roadmap', done: false },
    { id: 2, text: 'Draft modular structure document', done: true },
    { id: 3, text: 'Practice CAT exam prep questions', done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  
  const [habits, setHabits] = useState([
    { id: 1, name: '90 Min Deep Work', streak: 12, checkedToday: false },
    { id: 2, name: 'Somatic Mindfulness Session', streak: 4, checkedToday: true },
  ]);

  // AI goal action plan simulator states
  const [demoGoalInput, setDemoGoalInput] = useState('');
  const [demoGoalOutput, setDemoGoalOutput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Waitlist count state
  const [earlySpots, setEarlySpots] = useState(67);
  const [joinedEarly, setJoinedEarly] = useState(false);
  const [earlyEmail, setEarlyEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  useEffect(() => {
    const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
    setIsBypassed(bypassed);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Custom cursor logic
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.clickable')) {
        setCursorHovering(true);
      } else {
        setCursorHovering(false);
      }
    };
    window.addEventListener('mousemove', updateMouse);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Typewriter text loop effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = cycleWords[cycleIndex];
    if (isDeleting) {
      timer = setTimeout(() => {
        setCycleText(prev => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCycleText(currentWord.slice(0, cycleText.length + 1));
      }, 70);
    }

    if (!isDeleting && cycleText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && cycleText === '') {
      setIsDeleting(false);
      setCycleIndex(prev => (prev + 1) % cycleWords.length);
    }

    return () => clearTimeout(timer);
  }, [cycleText, isDeleting, cycleIndex]);

  if (!loading && (user || isBypassed)) {
    return (
      <AppShell>
        <DashboardGrid />
      </AppShell>
    );
  }

  // Interactive Live Demo task functions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText.trim(), done: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Interactive Live Demo habit streak logic
  const toggleHabit = (id: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextChecked = !h.checkedToday;
        return {
          ...h,
          checkedToday: nextChecked,
          streak: nextChecked ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  // Simulated AI plan output generator
  const triggerAiPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoGoalInput.trim()) return;
    setAiGenerating(true);
    setDemoGoalOutput('');
    
    // Custom strategic pre-generated responses mapping common goals to impressive blueprints
    const inputClean = demoGoalInput.toLowerCase();
    let steps = '';
    
    if (inputClean.includes('iit') || inputClean.includes('cat') || inputClean.includes('gate') || inputClean.includes('exam')) {
      steps = `WEEKLY PREPARATION BLUEPRINT (Targeting IIT/CAT Exam)

[Phase 1: Daily Diagnostic Rhythms]
• Daily Slot A (06:00 - 08:30): High-cognitive syllabus sprint (Logical Reasoning / Advanced Mechanics).
• Daily Slot B (21:00 - 22:30): Diagnostic test analytics. Document error logic immediately.

[Behavioral Constraints]
• Distraction Block: Place absolute firewall on phone between 06:00 and 12:00.
• Mindful Recovery: Somatic mindfulness session (10 min) post study block to restore focus.

[Success Milestones]
• Sunday: Proctored baseline diagnostic trial run under exact constraints.`;
    } else if (inputClean.includes('saas') || inputClean.includes('build') || inputClean.includes('startup') || inputClean.includes('code')) {
      steps = `RAPID BUILD STRATEGY (SaaS MVP in 30 Days)

[Phase 1: Scope Hardening & Data Models]
• Days 1 - 7: Architect schemas. Strict focus on zero-knowledge encryption patterns. No premium UI fluff yet.
• Days 8 - 15: Scaffold client-side storage foundations using IndexedDB. Build core features.

[Behavioral Constraints]
• Output Over Input: Restrict reading documentation/tutorials to 30 min daily. Focus 100% on execution.
• Pomodoro Shield: Use 90-min focused sprint blocks. 

[Success Milestones]
• Day 30: Launch alpha landing page with simple waitlist forms and basic feature demos.`;
    } else {
      steps = `TACTICAL ACTION ARCHITECTURE

[Phase 1: System Alignment & Scaffolding]
• Block A (Daily Morning): Dedicated 90-minute hyper-focused block on critical bottlenecks.
• Block B (Daily Evening): Action mapping for the subsequent day. Empty the cognitive buffer.

[Behavioral Constraints]
• Environmental Hygiene: Lock device inside focus cage during active cognitive slots.
• Daily Habit Streaks: Track habits immediately upon completion. Do not defer registry.

[Success Milestones]
• Weekend: Audit completed action items and evaluate efficiency metrics.`;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDemoGoalOutput(steps.slice(0, i));
      i += 3;
      if (i > steps.length + 3) {
        clearInterval(interval);
        setAiGenerating(false);
      }
    }, 15);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!earlyEmail.trim()) return;
    setJoinedEarly(true);
    setWaitlistSuccess(true);
    setEarlySpots(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F5] relative overflow-hidden font-sans selection:bg-[#0CDBC1]/30">
      
      {/* 8px custom cursor with 80ms lag */}
      <div 
        className="fixed w-3 h-3 rounded-full bg-[#0CDBC1] pointer-events-none z-[9999] mix-blend-screen transition-transform duration-75 ease-out hidden md:block"
        style={{
          transform: `translate3d(${mousePos.x - 6}px, ${mousePos.y - 6}px, 0) scale(${cursorHovering ? 2.5 : 1})`,
          boxShadow: cursorHovering ? '0 0 12px rgba(12,219,193,0.8)' : '0 0 4px rgba(12,219,193,0.3)',
        }}
      />

      {/* 2px Scroll progress indicator bar */}
      <ScrollProgressBar />

      {/* STICKY NAV */}
      <header className="sticky top-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-[#0A0A0F]/65 backdrop-blur-[12px]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display font-black text-xl tracking-[0.1em] text-[#F0F0F5] flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#0CDBC1] inline-block animate-pulse" />
              LIFE OS
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-[#8B8B9E]">
            <a href="#manifesto" className="hover:text-[#0CDBC1] transition-colors">Manifesto</a>
            <a href="#comparison" className="hover:text-[#0CDBC1] transition-colors">Replace Stack</a>
            <a href="#features" className="hover:text-[#0CDBC1] transition-colors">Features</a>
            <a href="#security" className="hover:text-[#0CDBC1] transition-colors">Security</a>
            <a href="#roadmap" className="hover:text-[#0CDBC1] transition-colors">Roadmap</a>
            <a href="#pricing" className="hover:text-[#0CDBC1] transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:inline-flex px-5 py-2.5 rounded bg-[#13131A] border border-white/10 hover:border-[#0CDBC1]/40 text-[#F0F0F5] text-xs font-mono tracking-wide hover:shadow-[0_0_15px_rgba(12,219,193,0.15)] transition-all duration-300">
              OPEN APP →
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#8B8B9E] hover:text-[#F0F0F5] p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0A0A0F] py-6 px-6 flex flex-col gap-4 text-base font-medium text-[#8B8B9E]">
            <a href="#manifesto" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">Manifesto</a>
            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">Replace Stack</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">Features</a>
            <a href="#security" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">Security</a>
            <a href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">Roadmap</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">Pricing</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2 w-full py-3 rounded bg-[#13131A] border border-white/10 text-[#F0F0F5] text-center text-sm font-mono">
              OPEN APP →
            </Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        {/* Animated parallax dot grid */}
        <div className="absolute inset-0 dot-grid-bg pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0CDBC1]/5 via-[#0A0A0F] to-[#0A0A0F] opacity-90 z-0" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 max-w-7xl mx-auto w-full">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13131A] border border-white/10 text-xs font-mono text-[#0CDBC1] mb-6 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              LIFE OS: PERSONAL INTELLIGENCE ENGINE
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter mb-6 leading-[0.9] text-[#F0F0F5]">
              <span className="block opacity-90">Stop switching.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0CDBC1] via-[#0CDBC1]/90 to-white/60 drop-shadow-2xl h-[1.3em]">
                {cycleText}
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#8B8B9E] max-w-xl font-light leading-relaxed mb-8">
              LIFE OS is a private, local-first productivity workspace. Your tasks, habits, budgets, and focus timers reside in a zero-knowledge ecosystem. No accounts required. No cloud access. Free forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full">
              <Link 
                href="/login" 
                className="group px-8 py-4 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto shadow-[0_0_20px_rgba(12,219,193,0.25)] hover:shadow-[0_0_35px_rgba(12,219,193,0.4)]"
              >
                Start free — no card, no catch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#live-demo" className="px-8 py-4 rounded bg-[#13131A] text-[#F0F0F5] font-semibold border border-white/10 hover:border-[#0CDBC1]/30 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-[#13131A]/80">
                Try it in 90 seconds ↓
              </a>
            </div>
            
            <div className="text-xs text-[#8B8B9E]/60 mt-5 font-mono w-full text-center lg:text-left flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-2">
              <span className="text-[#0CDBC1] font-semibold">🔒 AES-256 Zero-Knowledge Protection</span>
              <span className="hidden sm:inline text-white/10">•</span>
              <span>1,200+ early adopters joined</span>
              <span className="hidden sm:inline text-white/10">•</span>
              <span>Pune-built indie project</span>
            </div>

            {/* Stat Counters Row */}
            <div className="grid grid-cols-3 gap-6 w-full mt-10 pt-8 border-t border-white/5 text-left">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#F0F0F5]">
                  <NumberTicker value={100} />%
                </div>
                <div className="text-xs text-[#8B8B9E] font-mono mt-1">Data Ownership</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0CDBC1] flex items-center gap-1">
                  <span>0</span>
                </div>
                <div className="text-xs text-[#8B8B9E] font-mono mt-1">Server Content Analytics</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  Fully
                </div>
                <div className="text-xs text-[#8B8B9E] font-mono mt-1">Local & Offline</div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Dashboard Mockup */}
          <div className="lg:col-span-6 w-full relative mt-12 lg:mt-0">
            <div className="relative w-full max-w-xl mx-auto rounded-xl p-4 bg-[#13131A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Header division lines */}
              <div className="flex items-center justify-between px-2 mb-4 border-b border-white/5 pb-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0CDBC1]/80" />
                </div>
                <div className="text-[10px] font-mono text-[#8B8B9E]">lifeos_dashboard_v1.0</div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                
                {/* Sidebar Navigation */}
                <div className="col-span-3 flex flex-col gap-3 border-r border-white/5 pr-3">
                  {[
                    { label: 'Tasks', active: true },
                    { label: 'Habits', active: false },
                    { label: 'Focus', active: false },
                    { label: 'Finance', active: false },
                    { label: 'AI Plans', active: false },
                  ].map((tab, idx) => (
                    <div 
                      key={idx} 
                      className={`px-3 py-2 rounded text-[11px] font-mono transition-colors ${tab.active ? 'bg-[#0CDBC1]/10 text-[#0CDBC1] border border-[#0CDBC1]/25' : 'text-[#8B8B9E] hover:text-[#F0F0F5]'}`}
                    >
                      {tab.label}
                    </div>
                  ))}
                  <div className="mt-auto pt-6 text-[9px] font-mono text-[#8B8B9E]/40 text-center">
                    LOCAL-ONLY
                  </div>
                </div>

                {/* Main panel */}
                <div className="col-span-9 flex flex-col gap-4">
                  
                  {/* Today's task list (3 items, one checked) */}
                  <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3">
                    <h3 className="text-xs font-mono text-[#F0F0F5] mb-2.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#0CDBC1]" /> Today's Core Drivers
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded border border-[#0CDBC1] flex items-center justify-center bg-[#0CDBC1]/20">
                          <Check className="w-2.5 h-2.5 text-[#0CDBC1] stroke-[3]" />
                        </div>
                        <span className="text-[11px] text-[#8B8B9E] line-through">Establish SQLite backup logic</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded border border-white/20" />
                        <span className="text-[11px] text-[#F0F0F5]">Practice Verbal CAT mock section</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded border border-white/20" />
                        <span className="text-[11px] text-[#F0F0F5]">Draft zero-knowledge sync protocol</span>
                      </div>
                    </div>
                  </div>

                  {/* Habit streak calendar & Pomodoro timer */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Habit Streak grid */}
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3">
                      <h4 className="text-[10px] font-mono text-[#8B8B9E] mb-1.5">Deep Work Streaks</h4>
                      <div className="text-xs font-bold text-[#F0F0F5] mb-2">🔥 12 Days</div>
                      <div className="grid grid-cols-7 gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className={`h-2.5 rounded-sm ${i < 6 ? 'bg-[#0CDBC1]' : 'bg-[#13131A] border border-white/5'}`} />
                        ))}
                      </div>
                    </div>

                    {/* Pomodoro timer */}
                    <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3 flex flex-col justify-between items-center text-center">
                      <span className="text-[9px] font-mono text-[#8B8B9E]">POMODORO SPRINT</span>
                      <div className="text-sm font-mono font-bold text-[#0CDBC1] my-1">18:42</div>
                      <div className="text-[8px] px-2 py-0.5 rounded bg-[#13131A] text-[#8B8B9E] font-mono">
                        FOCUSING
                      </div>
                    </div>

                  </div>

                  {/* Floating AI Insight Card */}
                  <div className="bg-gradient-to-br from-[#0CDBC1]/10 to-[#13131A] border border-[#0CDBC1]/20 rounded-lg p-3 relative overflow-hidden">
                    <Sparkles className="absolute -right-2 -bottom-2 w-10 h-10 text-[#0CDBC1]/10 pointer-events-none" />
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#0CDBC1] mb-1">
                      <Cpu className="w-3 h-3 animate-spin" /> SYSTEM INSIGHT
                    </div>
                    <p className="text-[10px] text-[#8B8B9E] leading-relaxed">
                      You complete <span className="text-[#F0F0F5] font-semibold">40% more tasks</span> before 11:00 AM. We've queued 3 high-impact items for tomorrow's early block.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* WHY US MANIFESTO */}
      <section id="manifesto" className="py-24 max-w-4xl mx-auto px-6 border-t border-white/5 relative z-10">
        <div className="text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-6 tracking-tight">Built Paranoid. By Design.</h2>
          <p className="text-lg md:text-xl text-[#F0F0F5] leading-relaxed font-light mb-8 italic">
            "LIFE OS represents an absolute departure from central storage architectures. Our core advantage is our total, mathematical inability to view or compromise your personal workspace."
          </p>
          <div className="text-left text-base text-[#8B8B9E] leading-relaxed font-light space-y-4 max-w-2xl mx-auto">
            <p>
              Most productivity apps treat your daily plans, thoughts, and financial reports as server training logs. We engineered a workspace where your core database resides completely inside your browser's private sandbox (IndexedDB). 
            </p>
            <p>
              If you decide to coordinate sync between your devices, LIFE OS performs client-side AES-256 zero-knowledge encryption before a single bit leaves your sandbox. We never hold your encryption key because you are the exclusive root owner of your data. Technically impossible for us to track; built secure by architectural physics.
            </p>
          </div>
        </div>

        {/* 3-Column Trust Grid with Bioluminescent Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: <Lock className="w-5 h-5 text-[#0CDBC1]" />, title: 'AES-256 Encryption', desc: 'Zero-knowledge data scrambling occurs directly inside your local CPU before saving.' },
            { icon: <Database className="w-5 h-5 text-[#0CDBC1]" />, title: 'Local-First DB', desc: 'Saves your database internally via IndexedDB. No remote network reliance.' },
            { icon: <Shield className="w-5 h-5 text-[#0CDBC1]" />, title: 'Zero Trackers', desc: 'Complete mathematical isolation. No cookies. No user tracking libraries.' },
          ].map((trust, idx) => (
            <div key={idx} className="bg-[#13131A] border border-white/5 rounded-xl p-6 hover:border-[#0CDBC1]/30 transition-all duration-300">
              <div className="w-10 h-10 rounded bg-[#0CDBC1]/10 flex items-center justify-center mb-4">
                {trust.icon}
              </div>
              <h3 className="text-sm font-mono font-bold mb-2 text-[#F0F0F5] uppercase tracking-wider">{trust.title}</h3>
              <p className="text-xs text-[#8B8B9E] leading-relaxed font-light">{trust.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REPLACE YOUR STACK COMPARISON */}
      <section id="comparison" className="py-24 border-t border-white/5 relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Consolidate Your Workspace</h2>
          <p className="text-base text-[#8B8B9E] max-w-md mx-auto">Evaluate the monthly costs of keeping your daily data siloed across separate applications.</p>
        </div>

        <div className="bg-[#13131A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[#F0F0F5] font-mono">
                <th className="p-4">App Stack</th>
                <th className="p-4">Utility Area</th>
                <th className="p-4 text-right">Monthly Premium Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Notion', task: 'Structured Knowledge Base', price: '₹1,650' },
                { name: 'Todoist', task: 'Task Tracking', price: '₹749' },
                { name: 'Habitica', task: 'Streak Analytics', price: '₹399' },
                { name: 'YNAB', task: 'Expense Outflow Budgets', price: '₹1,200' },
                { name: 'Forest', task: 'Pomodoro Timer Blocks', price: '₹299' },
                { name: 'Day One', task: 'Personal Journal Notes', price: '₹599' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-semibold text-[#F0F0F5]">{row.name}</td>
                  <td className="p-4 text-[#8B8B9E] font-light">{row.task}</td>
                  <td className="p-4 text-right font-mono text-[#8B8B9E]">{row.price}</td>
                </tr>
              ))}
              <tr className="bg-white/5 border-b border-white/10 font-bold">
                <td className="p-4 text-[#8B8B9E]">Cumulative Overhead</td>
                <td className="p-4"></td>
                <td className="p-4 text-right font-mono text-rose-400">₹4,896 / month</td>
              </tr>
              <tr className="bg-[#0CDBC1]/5 font-black text-[#0CDBC1]">
                <td className="p-4">LIFE OS</td>
                <td className="p-4 font-light">All Core Utilities Integrated</td>
                <td className="p-4 text-right font-mono">₹0 / month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* MAGAZINE MOSAIC FEATURE GRID */}
      <section id="features" className="py-24 border-t border-white/5 relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Everything You Need. Nothing Tracking You.</h2>
          <p className="text-base text-[#8B8B9E] max-w-md mx-auto">High-performance client-side modules built for fluid daily flow.</p>
        </div>

        {/* magazine mosaic grid (flip patterns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Large Hero Card (Col-span 2) */}
          <div className="lg:col-span-2 group bg-[#13131A] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#0CDBC1]/30 transition-all duration-300 relative overflow-hidden">
            <div>
              <div className="inline-flex p-3 rounded bg-[#0CDBC1]/10 border border-[#0CDBC1]/20 mb-6 text-[#0CDBC1]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">One Place For Everything — No More Tab Chaos</h3>
              <p className="text-[#8B8B9E] text-sm leading-relaxed max-w-xl font-light">
                Consolidate your daily actions under a single window. LIFE OS combines standard task mapping, micro habit streaking, budgetary checkouts, Pomodoro shielding, and secure journals. No syncing delay. No web lookup friction.
              </p>
            </div>
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-wrap gap-4 text-xs font-mono text-[#8B8B9E]">
              <span>✓ INSTANT CLIENT STATE</span>
              <span>✓ ZERO NETWORK OVERHEAD</span>
              <span>✓ SECURE DATABASE DUMPS</span>
            </div>
          </div>

          {/* Small Feature Card */}
          <div className="group bg-[#13131A] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#0CDBC1]/30 transition-all duration-300 relative overflow-hidden">
            <div>
              <div className="inline-flex p-3 rounded bg-[#0CDBC1]/10 border border-[#0CDBC1]/20 mb-6 text-[#0CDBC1]">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Streaks Math — 30, 90, 365 Days</h3>
              <p className="text-[#8B8B9E] text-xs leading-relaxed font-light">
                Visualize behavioral compounding metrics. Deep statistical streaks help you construct long-term daily routines and trace streaks with complete mathematical visualization.
              </p>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4 text-xs font-mono text-[#0CDBC1]">
              LOCAL STREAK METRICS
            </div>
          </div>

          {/* Small Feature Card */}
          <div className="group bg-[#13131A] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#0CDBC1]/30 transition-all duration-300 relative overflow-hidden">
            <div>
              <div className="inline-flex p-3 rounded bg-[#0CDBC1]/10 border border-[#0CDBC1]/20 mb-6 text-[#0CDBC1]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">AI Plans — Week-by-Week Breakdown</h3>
              <p className="text-[#8B8B9E] text-xs leading-relaxed font-light">
                Type your high-level plans directly. Our system maps complete action matrices in seconds. Zero prompt engineering needed. Zero analytics saved on backend servers.
              </p>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4 text-xs font-mono text-[#0CDBC1]">
              OFFLINE-BASED INSIGHTS
            </div>
          </div>

          {/* Large Hero Card (Col-span 2) */}
          <div className="lg:col-span-2 group bg-[#13131A] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#0CDBC1]/30 transition-all duration-300 relative overflow-hidden">
            <div>
              <div className="inline-flex p-3 rounded bg-[#0CDBC1]/10 border border-[#0CDBC1]/20 mb-6 text-[#0CDBC1]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Client Encryption Architecture</h3>
              <p className="text-[#8B8B9E] text-sm leading-relaxed max-w-xl font-light">
                Security is built into our core codebase. Absolute zero-knowledge client database structures mean you never sacrifice integrity for mobility. No unauthorized server accesses.
              </p>
            </div>
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-wrap gap-4 text-xs font-mono text-[#8B8B9E]">
              <span>✓ CLIENT-SIDE AES-256 KEYS</span>
              <span>✓ PRIVATE SYNC ARCHITECTURE</span>
              <span>✓ AUDITED ROADMAP ENGINE</span>
            </div>
          </div>

        </div>
      </section>

      {/* LIVE MINI-DEMO SECTION */}
      <section id="live-demo" className="py-24 border-t border-white/5 relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0CDBC1]/10 text-xs font-mono text-[#0CDBC1] mb-3">
            TRY IT BEFORE YOU TRUST IT
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Experience Live Local State</h2>
          <p className="text-base text-[#8B8B9E] max-w-md mx-auto">Add items, complete tasks, and simulate AI generation directly. Zero registrations. Safe sandbox.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive tasks panel */}
          <div className="lg:col-span-5 bg-[#13131A] border border-white/10 rounded-xl p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                <Check className="w-5 h-5 text-[#0CDBC1]" /> Dynamic Task Ledger
              </h3>
              <p className="text-xs text-[#8B8B9E] font-light font-mono">STORES DIRECTLY TO YOUR BROWSER COGNITIVE ENGINE</p>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="e.g. Solve 5 logical analysis mock drills..." 
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0CDBC1]"
              />
              <button type="submit" className="p-2 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded bg-[#0A0A0F]/50 border border-white/5">
                  <div className="flex items-center gap-2.5 flex-1 cursor-pointer" onClick={() => toggleTask(t.id)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${t.done ? 'bg-[#0CDBC1]/25 border-[#0CDBC1]' : 'border-white/20'}`}>
                      {t.done && <Check className="w-3 h-3 text-[#0CDBC1] stroke-[3]" />}
                    </div>
                    <span className={`text-xs ${t.done ? 'text-[#8B8B9E] line-through' : 'text-[#F0F0F5]'}`}>{t.text}</span>
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-[#8B8B9E] hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Micro habit indicators */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-mono text-[#8B8B9E] mb-3">COMPANION HABITS DAILY COMPACT</h4>
              <div className="space-y-2">
                {habits.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-2 rounded bg-[#0A0A0F]/50 border border-white/5">
                    <span className="text-xs text-[#F0F0F5]">{h.name}</span>
                    <button 
                      onClick={() => toggleHabit(h.id)}
                      className={`px-3 py-1 rounded text-[10px] font-mono transition-colors ${h.checkedToday ? 'bg-[#0CDBC1]/10 text-[#0CDBC1] border border-[#0CDBC1]/25' : 'bg-[#13131A] text-[#8B8B9E] border border-white/10'}`}
                    >
                      {h.checkedToday ? `✓ Streak: ${h.streak}d` : `Streak: ${h.streak}d · Complete`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Generator simulator panel */}
          <div className="lg:col-span-7 bg-[#13131A] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0CDBC1]" /> Tactical AI Plan Blueprint Generator
              </h3>
              <p className="text-xs text-[#8B8B9E] font-light">TYPE YOUR GOAL IN PLAIN LANGUAGE. GET A WEEK-BY-WEEK ACTION PLAN IN 10 SECONDS.</p>
            </div>

            <form onSubmit={triggerAiPlan} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={demoGoalInput}
                onChange={(e) => setDemoGoalInput(e.target.value)}
                placeholder="e.g. I want to get into IIT by next year..." 
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0CDBC1]"
              />
              <button 
                type="submit" 
                disabled={aiGenerating || !demoGoalInput.trim()}
                className="px-4 py-2 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(12,219,193,0.3)]"
              >
                {aiGenerating ? 'Analyzing...' : 'Generate Plan →'}
              </button>
            </form>

            <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-4 font-mono text-[11px] text-[#8B8B9E] min-h-[160px] max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {demoGoalOutput ? (
                <div>
                  <span className="text-[#0CDBC1] font-bold">LIFE OS AI ENGINE OUTPUT:</span>
                  <div className="mt-2 text-white">{demoGoalOutput}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[120px] text-center opacity-40">
                  <Cpu className="w-8 h-8 mb-2 animate-pulse text-[#0CDBC1]" />
                  <span>Enter goal blueprint details above to trigger internal compilation sandbox.</span>
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-[#8B8B9E]/60 flex items-center justify-between border-t border-white/5 pt-3">
              <span>🔒 Zero-knowledge offline prompt parsing</span>
              <span>Pune-built intelligence model</span>
            </div>
          </div>

        </div>
      </section>

      {/* DETAILED ROADMAP */}
      <section id="roadmap" className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Incremental Engineering</h2>
          <p className="text-base text-[#8B8B9E] max-w-md mx-auto">Follow our active timeline as we harden client components and rollout optional zero-knowledge sync pipelines.</p>
        </div>

        <div className="relative border-l border-white/10 pl-6 space-y-12">
          
          {[
            { phase: 'Q2 2026 — Alpha Engine (Now)', active: true, items: ['Tasks & modular project ledger', 'Streaks analytics database', 'IndexedDB sandboxed storage', 'Integrated Pomodoro timer', 'Tactical AI model generator (local prompt patterns)', 'Expense ledger & visual budget dashboard'] },
            { phase: 'Q3 2026 — Zero-Knowledge Sync Beta (Upcoming)', active: false, items: ['Client-side AES-256 cloud sync architecture', 'Polish PWA offline storage parameters', 'Deep behavioral routine statistics reports', 'AI private journal sentiment summaries'] },
            { phase: 'Q4 2026 — Public Launch v1.0', active: false, items: ['Mobile browser fluid shell integrations', 'Voice task & journal registry', 'Sync with traditional calendars (Google/Outlook)', 'Open Roadmap public vault updates'] },
            { phase: 'Q1 2027 — Collaborative Team Spaces', active: false, items: ['Multi-license shared secure vaults', 'Custom developer plugin & system API access'] },
          ].map((step, idx) => (
            <div key={idx} className="relative">
              {/* Timeline status indicator */}
              <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-[#0A0A0F] ${step.active ? 'bg-[#0CDBC1] shadow-[0_0_8px_#0CDBC1]' : 'bg-[#13131A] border-white/20'}`} />
              <h3 className={`text-base font-mono font-bold uppercase tracking-wider mb-3 ${step.active ? 'text-[#0CDBC1]' : 'text-[#8B8B9E]'}`}>{step.phase}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#8B8B9E] font-light">
                {step.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={step.active ? 'text-[#0CDBC1]' : 'text-[#8B8B9E]/55'}>▪</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </section>

      {/* AUDIENCE DEFINITION: PERFECT FOR VS NOT FOR YOU */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Radical Transparency</h2>
          <p className="text-base text-[#8B8B9E] max-w-md mx-auto">We build for specific workflows. Here is an honest audit to verify if LIFE OS matches your cognitive demands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ✅ Perfect for you if */}
          <div className="bg-[#13131A] border border-[#0CDBC1]/20 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-mono font-bold text-[#0CDBC1] tracking-wider uppercase">✅ PERFECT IF YOU ARE:</h3>
            <ul className="space-y-3.5 text-xs text-[#8B8B9E] leading-relaxed font-light">
              <li className="flex items-start gap-2.5">
                <span className="text-[#0CDBC1] mt-0.5">✔</span>
                <span>An IIT/NIT student coordinating complex coursework, test mock drills, and routines under strict focus slots.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0CDBC1] mt-0.5">✔</span>
                <span>A freelance product developer balancing 3 concurrent clients while executing tactical long-term MVPs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0CDBC1] mt-0.5">✔</span>
                <span>Exhausted by complex Notion dashboards and looking for an absolute speed, zero-setup ledger.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0CDBC1] mt-0.5">✔</span>
                <span>Extremely conscious of data privacy, client-side encryption keys, and independent storage principles.</span>
              </li>
            </ul>
          </div>

          {/* ❌ Not for you if */}
          <div className="bg-[#13131A] border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-mono font-bold text-rose-400 tracking-wider uppercase">❌ NOT FOR YOU IF:</h3>
            <ul className="space-y-3.5 text-xs text-[#8B8B9E] leading-relaxed font-light">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✖</span>
                <span>You require real-time team collaboration with active shared work docs (use Notion).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✖</span>
                <span>You need enterprise accounting tools or direct bank sync hooks (use Zoho).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✖</span>
                <span>You absolutely demand native mobile application wrappers today (mobile shell launches in Q4 2026).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 mt-0.5">✖</span>
                <span>You want typical advertising-driven dashboards that package your thoughts to centralized sync points.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* HONEST ORIGIN STORY */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl font-black mb-6 tracking-tight">The Origin Blueprint</h2>
        <div className="text-left text-sm text-[#8B8B9E] leading-relaxed font-light space-y-4">
          <p>
            Hey there. I'm a software engineer based in Pune, India. 
          </p>
          <p>
            Back in late 2025, I realized I was paying over ₹3,200 every month across 5 separate planning, habit, and tracking applications. Despite that financial overhead, my day felt divided between browser tabs, and my notes kept ending up locked behind account registration servers. I spent three weeks searching for a private, fast, offline-first system that felt clean and secure. 
          </p>
          <p>
            I couldn't find one. So, I started hacking together the first draft of this local engine. Today, it resides 100% in your device sandbox. No corporate data models. No funding rounds. Just a clean tool built to help you finish things and own your workspace.
          </p>
        </div>
      </section>

      {/* SHAPE THE PRODUCT BETA APPLICATION */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6">
        <div className="bg-[#13131A] border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 bg-[#0CDBC1]/10 text-[#0CDBC1] text-[10px] font-mono border-l border-b border-white/5">
            BETA SPRINT BLOCK
          </div>

          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-black mb-4 tracking-tight">This product is young. Help us make it yours.</h2>
            <p className="text-xs md:text-sm text-[#8B8B9E] leading-relaxed mb-6 font-light">
              We are enrolling exactly 100 beta testers (engineers, builders, and deep learners) to collaborate directly on the final encrypted sync pipelines. You will receive 12 months of premium features for free, direct votes on the core technical roadmap, and option for credit listings in the codebase.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-md">
              <input 
                type="email" 
                value={earlyEmail}
                onChange={(e) => setEarlyEmail(e.target.value)}
                placeholder="your@email.com" 
                disabled={joinedEarly}
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#0CDBC1] disabled:opacity-50"
              />
              <button 
                onClick={handleWaitlistSubmit}
                disabled={joinedEarly || !earlyEmail.trim()}
                className="px-6 py-3 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-50"
              >
                {joinedEarly ? 'Applied' : 'Apply to Beta Test →'}
              </button>
            </div>

            {waitlistSuccess && (
              <p className="text-xs text-[#0CDBC1] font-mono mt-3">
                Application received. We will follow up in 24 hours. Your spot is locked!
              </p>
            )}

            <div className="mt-8 text-xs text-[#8B8B9E]/60 font-mono">
              STATUS ENGAGEMENT: <span className="text-[#0CDBC1] font-semibold">{earlySpots} of 100 spots remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section id="pricing" className="py-24 border-t border-white/5 relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Clean, Uncompromising Tiers</h2>
          <p className="text-base text-[#8B8B9E] max-w-md mx-auto">Start with complete local databases or opt for client-side encrypted sync configurations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Free Tier */}
          <div className="bg-[#13131A] border border-white/5 rounded-xl p-8 flex flex-col justify-between hover:border-[#0CDBC1]/30 transition-all duration-300">
            <div>
              <h3 className="text-lg font-mono font-bold mb-2">FREE TIER</h3>
              <p className="text-xs text-[#8B8B9E] mb-6 font-light">Essential sandboxed organization tools.</p>
              <div className="flex items-baseline mb-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-[#F0F0F5]">₹0</span>
                <span className="text-xs text-[#8B8B9E]/50 font-mono ml-2">/ FOREVER</span>
              </div>
              <ul className="space-y-3.5 text-xs text-[#8B8B9E] font-light">
                <li className="flex items-center gap-2">✓ Unlimited local tasks & ledgers</li>
                <li className="flex items-center gap-2">✓ Dynamic habit tracker compounding</li>
                <li className="flex items-center gap-2">✓ Full localized database dumps</li>
                <li className="flex items-center gap-2">✓ Offline focus timer sprint sessions</li>
                <li className="flex items-center gap-2">✓ sandboxed local AI plans (5 / mo)</li>
              </ul>
            </div>
            <Link href="/login" className="mt-8 w-full py-3 rounded bg-[#13131A] border border-white/10 hover:border-[#0CDBC1]/30 text-center text-xs font-mono transition-colors">
              LAUNCH FREE SANDBOX →
            </Link>
          </div>

          {/* Early Adopter Lifetime Tier */}
          <div className="bg-[#13131A] border-2 border-[#0CDBC1] rounded-xl p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(12,219,193,0.1)]">
            <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-[#0CDBC1] text-black text-[9px] font-mono font-bold tracking-wider">
              LIFETIME PASS (LIMITED)
            </div>
            <div>
              <h3 className="text-lg font-mono font-bold mb-2 text-[#0CDBC1]">EARLY ADOPTER</h3>
              <p className="text-xs text-[#8B8B9E] mb-6 font-light">Secure complete lifetime access before cloud launch.</p>
              <div className="flex items-baseline mb-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-[#F0F0F5]">₹1,999</span>
                <span className="text-xs text-[#8B8B9E]/50 font-mono ml-2">/ ONE-TIME</span>
              </div>
              <ul className="space-y-3.5 text-xs text-[#8B8B9E] font-light">
                <li className="flex items-center gap-2">✓ Everything in Free Tier</li>
                <li className="flex items-center gap-2 text-[#F0F0F5]">✓ Lifetime zero-knowledge cloud sync</li>
                <li className="flex items-center gap-2">✓ Unlimited local and synced AI plans</li>
                <li className="flex items-center gap-2">✓ Direct feature roadmap priority keys</li>
                <li className="flex items-center gap-2 text-[#F0F0F5]">✓ Permanent name listing in credits</li>
              </ul>
            </div>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="mt-8 w-full py-3 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black text-center text-xs font-mono font-bold shadow-[0_0_15px_rgba(12,219,193,0.3)] transition-all cursor-pointer"
            >
              SECURE LIFETIME PASS →
            </button>
          </div>

          {/* Pro Monthly Tier */}
          <div className="bg-[#13131A] border border-white/5 rounded-xl p-8 flex flex-col justify-between hover:border-[#0CDBC1]/30 transition-all duration-300">
            <div>
              <h3 className="text-lg font-mono font-bold mb-2">PRO MONTHLY</h3>
              <p className="text-xs text-[#8B8B9E] mb-6 font-light">Launching Q3 2026 for late adopters.</p>
              <div className="flex items-baseline mb-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-[#F0F0F5]">₹299</span>
                <span className="text-xs text-[#8B8B9E]/50 font-mono ml-2">/ MONTH</span>
              </div>
              <ul className="space-y-3.5 text-xs text-[#8B8B9E] font-light">
                <li className="flex items-center gap-2">✓ Everything in Free Tier</li>
                <li className="flex items-center gap-2">✓ Full zero-knowledge multi-device sync</li>
                <li className="flex items-center gap-2">✓ Advanced routine behavior statistics</li>
                <li className="flex items-center gap-2">✓ Local AI voice input pipelines</li>
                <li className="flex items-center gap-2">✓ Priority developer support line</li>
              </ul>
            </div>
            <button disabled className="mt-8 w-full py-3 rounded bg-white/5 border border-white/10 text-center text-xs font-mono text-[#8B8B9E]/50 cursor-not-allowed">
              LAUNCHES Q3 2026
            </button>
          </div>

        </div>

        <p className="text-center text-[10px] text-[#8B8B9E]/40 font-mono mt-8">
          🔒 Early adopter pass limited to first 100 developers. 67 passes remaining.
        </p>
      </section>

      {/* MID-PAGE CTA BANNER */}
      <section className="py-20 text-center relative overflow-hidden border-t border-white/5 z-10 max-w-4xl mx-auto px-6">
        <h2 className="font-display text-3xl font-black mb-3">Still reading? That means you need this.</h2>
        <p className="text-sm text-[#8B8B9E] max-w-md mx-auto mb-8 font-light leading-relaxed">
          Take absolute custody of your cognitive drivers. No credit cards required. Setup sandbox in 20 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto">
          <Link href="/login" className="px-8 py-4 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(12,219,193,0.3)] transition-all">
            Start Free Sandbox →
          </Link>
          <a href="#live-demo" className="px-8 py-4 rounded bg-[#13131A] border border-white/10 text-[#F0F0F5] font-bold flex items-center justify-center gap-2 w-full sm:w-auto hover:border-[#0CDBC1]/30 transition-all">
            See the Demo ↓
          </a>
        </div>
      </section>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#13131A]/95 border-t border-white/10 backdrop-blur-md py-3 px-6 flex items-center justify-between z-50 md:hidden">
        <span className="text-[10px] font-mono text-[#8B8B9E]">FREE SANDBOX ACTIVE</span>
        <Link href="/login" className="px-4 py-2 rounded bg-[#0CDBC1] text-black text-xs font-bold font-mono">
          START NOW →
        </Link>
      </div>

      {/* FOOTER & TRUST CHECKLIST */}
      <footer className="border-t border-white/5 bg-[#0A0A0F] py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/5 pb-12">
          
          {/* Logo & Pune-made details */}
          <div className="md:col-span-4 flex flex-col items-start text-left">
            <span className="font-display font-black text-lg tracking-wider text-[#F0F0F5] mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#0CDBC1]" />
              LIFE OS
            </span>
            <p className="text-[#8B8B9E] text-xs max-w-xs leading-relaxed font-light mb-4">
              A private, local-first productivity command center. Own your personal actions, streaks, and routines with total encryption sanity.
            </p>
            <div className="text-[10px] font-mono text-[#8B8B9E] bg-[#13131A] px-3 py-1.5 rounded border border-white/5">
              🇮🇳 Built in Pune, India
            </div>
          </div>

          {/* Sitemap (Information Architecture) */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h4 className="text-xs font-mono font-bold text-[#F0F0F5] tracking-wider uppercase mb-1">Information Architecture</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#8B8B9E]">
              <Link href="/" className="hover:text-[#F0F0F5] transition-colors">/ (Home Page)</Link>
              <Link href="/login" className="hover:text-[#F0F0F5] transition-colors">/app (Dashboard)</Link>
              <Link href="#manifesto" className="hover:text-[#F0F0F5] transition-colors">/about (Manifesto)</Link>
              <a href="#roadmap" className="hover:text-[#F0F0F5] transition-colors">/roadmap (Updates)</a>
              <Link href="/privacy" className="hover:text-[#F0F0F5] transition-colors">/privacy (Vaults)</Link>
              <Link href="/security" className="hover:text-[#F0F0F5] transition-colors">/security (AES keys)</Link>
              <a href="#live-demo" className="hover:text-[#F0F0F5] transition-colors">/beta (Sandbox)</a >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F0F5] transition-colors">/changelog (GitHub)</a>
            </div>
          </div>

          {/* Trust Checklist footer widget */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h4 className="text-xs font-mono font-bold text-[#F0F0F5] tracking-wider uppercase mb-1">Trust Verification Check</h4>
            <div className="space-y-2 font-mono text-[10px] text-[#8B8B9E]">
              <div className="flex items-center gap-2">
                <span className="text-[#0CDBC1] font-bold">☑</span>
                <span>No credit card checks required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0CDBC1] font-bold">☑</span>
                <span>Database stored locally on your device</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0CDBC1] font-bold">☑</span>
                <span>Works 100% offline without wifi dependencies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0CDBC1] font-bold">☑</span>
                <span>No trackers. Zero marketing cookies used</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0CDBC1] font-bold">☑</span>
                <span>Independent Pune-based developer project</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#8B8B9E]/50 font-mono gap-4">
          <p>© 2026 LIFE OS. All rights reserved. Zero-knowledge productivity.</p>
          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F0F5] transition-colors">GitHub Repository</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F0F5] transition-colors">Twitter Updates</a>
          </div>
        </div>
      </footer>

      <WaitlistModal 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}

// Inline Helper Components

function ScrollProgressBar() {
  const [scrollWidth, setScrollWidth] = useState('0%');

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setScrollWidth(`${scrolled}%`);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-[2px] bg-[#0CDBC1] z-[10000] pointer-events-none transition-all duration-75"
      style={{ width: scrollWidth }}
    />
  );
}

function NumberTicker({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, Math.max(stepTime, 10));

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

// Local mock waitlist modal component
function WaitlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail('');
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-[6px]" onClick={onClose} />
      <div className="bg-[#13131A] border border-white/10 p-8 rounded-xl max-w-sm w-full relative z-10 text-center flex flex-col gap-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8B8B9E] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        {success ? (
          <div className="py-6 flex flex-col items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-[#0CDBC1]/10 flex items-center justify-center text-[#0CDBC1] text-2xl font-bold">
              ✓
            </span>
            <h3 className="text-lg font-bold">Access Slot Locked!</h3>
            <p className="text-xs text-[#8B8B9E]">Your early adopter pass discount has been registered.</p>
          </div>
        ) : (
          <div>
            <span className="text-3xl mb-2 block">🚀</span>
            <h3 className="text-lg font-bold mb-1">Lock In Early Adopter Access</h3>
            <p className="text-xs text-[#8B8B9E] leading-relaxed mb-4">Secure your permanent AES-256 synced license with 50% discount locked forever.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                className="bg-[#0A0A0F] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0CDBC1]"
              />
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-2.5 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-bold text-xs"
              >
                {submitting ? 'Registering...' : 'Lock Lifetime Discount →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
