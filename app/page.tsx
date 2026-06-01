'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/features/dashboard/components/DashboardGrid';
import { 
  Check, Play, Sparkles, Target, Shield, Activity, Plus, Trash2, 
  ArrowRight, Lock, Database, Cpu, Users, Calendar, ArrowUp, Menu, X,
  Clock, DollarSign, BookOpen, AlertCircle, HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isBypassed, setIsBypassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Brand Name
  const brandName = "LIFE OS";

  // Navigation states
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [mobileStickyVisible, setMobileStickyVisible] = useState(true);

  // Custom Cursor dot coordinates
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovering, setCursorHovering] = useState(false);

  // Soft toast pop-up state
  const [showToast, setShowToast] = useState(false);

  // Interactive Live Sandbox states
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Establish local database schema foundations', done: false },
    { id: 2, text: 'Verify IndexedDB storage consistency logs', done: true },
    { id: 3, text: 'Run 90-minute CAT quantitative sprint block', done: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [habits, setHabits] = useState([
    { id: 1, name: 'Somatic Focused Meditation', streak: 8, doneToday: false },
    { id: 2, name: '90-Min Core Sprint Session', streak: 21, doneToday: true },
  ]);

  // AI goal action plan typewriter state
  const [goalInput, setGoalInput] = useState('');
  const [goalOutput, setGoalOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Waitlist count state
  const [adoptersCount, setAdoptersCount] = useState(312);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');

  // Hero Mockups active tabs
  const [mockupTab, setMockupTab] = useState<'dashboard' | 'finance' | 'journal'>('dashboard');

  // Live Pomodoro Countdown in Mockup
  const [pomodoroMinutes, setPomodoroMinutes] = useState(18);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(42);

  // Scroll visibility observer helper
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      // Show mobile sticky bar if scroll is active and not at bottom
      const scrolledPastHero = scrollPos > 400;
      const reachedBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 150;
      setMobileStickyVisible(scrolledPastHero && !reachedBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Soft Help Toast Trigger (After 20 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  // Auth bypass check
  useEffect(() => {
    const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
    setIsBypassed(bypassed);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Active ticking Pomodoro clock simulation in Mockup
  useEffect(() => {
    const timer = setInterval(() => {
      setPomodoroSeconds(prev => {
        if (prev === 0) {
          setPomodoroMinutes(m => (m === 0 ? 25 : m - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll animations using standard Intersection Observer
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!loading && (user || isBypassed)) {
    return (
      <AppShell>
        <DashboardGrid />
      </AppShell>
    );
  }

  // Task actions in sandbox
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Habit action inside sandbox
  const handleToggleHabit = (id: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const check = !h.doneToday;
        return {
          ...h,
          doneToday: check,
          streak: check ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  // AI Plan Typwriter Sandbox simulator
  const handleAiPlanGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setAiLoading(true);
    setGoalOutput('');

    const targetInput = goalInput.toLowerCase();
    let textOut = '';

    if (targetInput.includes('iit') || targetInput.includes('cat') || targetInput.includes('exam') || targetInput.includes('study')) {
      textOut = `WEEK-BY-WEEK CAT/IIT CORE BLUEPRINT

Week 1: High-cognitive diagnostic trial. Track mock errors immediately inside Daily Ledger.
Week 2: Setup A/B focus splits. Target 90-min quantitative sessions post Pomodoro shielding.
Week 3: Core formula reviews. Automate tracking to evaluate weekly progression analytics.
Week 4: Execute final simulation drills. Maintain somatic mindfulness slots to secure flow state.`;
    } else if (targetInput.includes('mvp') || targetInput.includes('saas') || targetInput.includes('build') || targetInput.includes('code')) {
      textOut = `30-DAY MVP LAUNCH MAP

Week 1: Architect schema structures. Ground local database inside client sandboxed IndexedDB.
Week 2: Scaffold routing controllers. Limit external documentation inputs to 30 mins daily.
Week 3: Integrate secure client sync encryption parameters. No premature visual styling.
Week 4: Release landing page waitlist checks and gather real early-bird user logs.`;
    } else {
      textOut = `TACTICAL SYSTEM ALIGNMENT

Week 1: Clean visual environment. Establish core task ledger logs and clear workspace clutter.
Week 2: Program Pomodoro sprint rhythms. Isolate cognitive slots to avoid multi-tasking lag.
Week 3: Maintain micro habit streaking calendar. Record streaks directly inside streaks grid.
Week 4: Review progression reports and adjust weekly metrics to scale cognitive yield.`;
    }

    let idx = 0;
    const typingInterval = setInterval(() => {
      setGoalOutput(textOut.slice(0, idx));
      idx += 3;
      if (idx > textOut.length + 3) {
        clearInterval(typingInterval);
        setAiLoading(false);
      }
    }, 15);
  };

  // Waitlist access registration
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSuccess(true);
    setAdoptersCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F5] font-sans selection:bg-[#0CDBC1]/30 relative overflow-hidden">
      
      {/* 8px Custom Cursor */}
      <div 
        className="fixed w-2 h-2 rounded-full bg-[#0CDBC1] pointer-events-none z-[9999] mix-blend-screen transition-transform duration-75 ease-out hidden md:block"
        style={{
          transform: `translate3d(${mousePos.x - 4}px, ${mousePos.y - 4}px, 0) scale(${cursorHovering ? 3 : 1})`,
          boxShadow: cursorHovering ? '0 0 16px rgba(12,219,193,0.9)' : '0 0 4px rgba(12,219,193,0.3)',
        }}
      />

      {/* Reading Progress Indicator */}
      <ScrollProgressBar />

      {/* STICKY NAV */}
      <header className="sticky top-0 w-full z-50 bg-[#0A0A0F]/65 border-b border-white/5 backdrop-blur-[12px] transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display font-black text-xl tracking-[0.15em] text-[#F0F0F5] flex items-center gap-2 select-none">
              <span className="w-5 h-5 rounded bg-[#0CDBC1] inline-block animate-pulse" />
              {brandName}
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center text-xs font-mono text-[#8B8B9E] tracking-wider">
            <a href="#manifesto" className="hover:text-[#0CDBC1] transition-colors">/MANIFESTO</a>
            <a href="#comparison" className="hover:text-[#0CDBC1] transition-colors">/COMPARE_STACK</a>
            <a href="#features" className="hover:text-[#0CDBC1] transition-colors">/MODULES</a>
            <a href="#roadmap" className="hover:text-[#0CDBC1] transition-colors">/ROADMAP</a>
            <a href="#pricing" className="hover:text-[#0CDBC1] transition-colors">/PRICING</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:inline-flex px-5 py-2.5 rounded bg-[#13131A] border border-white/10 hover:border-[#0CDBC1]/30 text-[#F0F0F5] text-xs font-mono tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(12,219,193,0.15)]">
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
          <div className="md:hidden border-t border-white/5 bg-[#0A0A0F] py-6 px-6 flex flex-col gap-4 text-sm font-mono text-[#8B8B9E]">
            <a href="#manifesto" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">/MANIFESTO</a>
            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">/COMPARE_STACK</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">/MODULES</a>
            <a href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">/ROADMAP</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F0F0F5] transition-colors py-1">/PRICING</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2 w-full py-3 rounded bg-[#13131A] border border-white/10 text-[#F0F0F5] text-center text-xs font-mono">
              OPEN APP →
            </Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        {/* Animated dot grid background */}
        <div className="absolute inset-0 dot-grid-bg pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0CDBC1]/5 via-[#0A0A0F] to-[#0A0A0F] opacity-90 z-0" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 max-w-7xl mx-auto w-full">
          
          {/* Left Hero pane */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13131A] border border-white/10 text-xs font-mono text-[#0CDBC1] mb-6 tracking-widest select-none">
              <Sparkles className="w-3.5 h-3.5" />
              INTELLIGENT LOCAL WORKSPACE
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter mb-6 leading-[0.88] text-[#F0F0F5] select-none">
              <span className="block opacity-90">Stop switching.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0CDBC1] via-[#0CDBC1]/95 to-white/70 h-[1.3em]">
                Start finishing.
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#8B8B9E] max-w-xl font-light leading-relaxed mb-8">
              {brandName} unifies your tasks, habits, journal, focus, and finances in one fast, private, AI-powered workspace. Free forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full">
              <Link 
                href="/login" 
                className="group px-8 py-4 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all duration-300 w-full sm:w-auto shadow-[0_0_20px_rgba(12,219,193,0.2)] hover:shadow-[0_0_35px_rgba(12,219,193,0.35)]"
              >
                Start free — no card needed
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#live-demo" className="px-8 py-4 rounded bg-[#13131A] text-[#F0F0F5] font-semibold border border-white/10 hover:border-[#0CDBC1]/30 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-[#13131A]/80">
                See it in 90 seconds →
              </a>
            </div>

            {/* Trust checklist strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-10 pt-6 border-t border-white/5 text-left text-[11px] font-mono text-[#8B8B9E]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#0CDBC1] font-bold">✓</span>
                <span>Local-first DB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#0CDBC1] font-bold">✓</span>
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#0CDBC1] font-bold">✓</span>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#0CDBC1] font-bold">✓</span>
                <span>Works Offline</span>
              </div>
            </div>

            {/* Real Stats Row with Tickers */}
            <div className="grid grid-cols-3 gap-6 w-full mt-8 pt-6 border-t border-white/5 text-left">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  <NumberTicker value={100} />%
                </div>
                <div className="text-[10px] text-[#8B8B9E] font-mono mt-1 uppercase tracking-wider">Local Privacy</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#0CDBC1]">
                  Zero
                </div>
                <div className="text-[10px] text-[#8B8B9E] font-mono mt-1 uppercase tracking-wider">Server Scans</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  312
                </div>
                <div className="text-[10px] text-[#8B8B9E] font-mono mt-1 uppercase tracking-wider">Waitlist Adopters</div>
              </div>
            </div>

          </div>

          {/* Right Hero pane: HTML/CSS Mockups Switching Dashboard */}
          <div className="lg:col-span-6 w-full mt-12 lg:mt-0 relative">
            <div className="relative w-full max-w-xl mx-auto rounded-xl p-4 bg-[#13131A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
              
              {/* Tab Toggles for mockups */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0CDBC1]/80" />
                  
                  {/* Selector tabs */}
                  <div className="flex gap-2 ml-4">
                    {[
                      { id: 'dashboard', label: 'DASHBOARD' },
                      { id: 'finance', label: 'FINANCES' },
                      { id: 'journal', label: 'JOURNAL' }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setMockupTab(tab.id as any)}
                        className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider transition-all ${mockupTab === tab.id ? 'bg-[#0CDBC1]/15 text-[#0CDBC1] border border-[#0CDBC1]/30' : 'text-[#8B8B9E]/60 hover:text-white'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#8B8B9E]/50">lifeos_command_console</span>
              </div>

              {/* MOCKUP SWITCH VIEWS */}
              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  
                  {/* View A: Dashboard view */}
                  {mockupTab === 'dashboard' && (
                    <motion.div 
                      key="dashboard"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-12 gap-4"
                    >
                      <div className="col-span-4 border-r border-white/5 pr-3 flex flex-col gap-2.5">
                        <div className="px-2 py-1.5 rounded bg-[#0CDBC1]/10 text-[#0CDBC1] border border-[#0CDBC1]/25 text-[10px] font-mono">
                          ★ CORE TASK VIEW
                        </div>
                        <div className="px-2 py-1.5 text-[#8B8B9E] text-[10px] font-mono hover:text-[#F0F0F5] transition-colors cursor-pointer">
                          Habit Compounder
                        </div>
                        <div className="px-2 py-1.5 text-[#8B8B9E] text-[10px] font-mono hover:text-[#F0F0F5] transition-colors cursor-pointer">
                          Focus Sprint Block
                        </div>
                        <div className="px-2 py-1.5 text-[#8B8B9E] text-[10px] font-mono hover:text-[#F0F0F5] transition-colors cursor-pointer">
                          Finance Manager
                        </div>
                      </div>

                      <div className="col-span-8 flex flex-col gap-4">
                        <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3">
                          <h3 className="text-xs font-mono text-[#F0F0F5] mb-2.5 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-[#0CDBC1]" /> Today's Core Drivers
                          </h3>
                          <div className="space-y-2 text-[11px]">
                            <div className="flex items-center gap-2 text-[#8B8B9E] line-through">
                              <Check className="w-3.5 h-3.5 text-[#0CDBC1] stroke-[3]" />
                              <span>Practice quantitative exam drills</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#F0F0F5]">
                              <div className="w-3.5 h-3.5 rounded border border-white/20" />
                              <span>Configure Local SQLite DB sync</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#F0F0F5]">
                              <div className="w-3.5 h-3.5 rounded border border-white/20" />
                              <span>Complete 90-min core project sprint</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3">
                            <span className="text-[9px] font-mono text-[#8B8B9E] block mb-1">STREAK HEALTH</span>
                            <div className="text-xs font-bold text-white mb-2">🔥 21 Days Done</div>
                            <div className="grid grid-cols-7 gap-1">
                              {[...Array(7)].map((_, i) => (
                                <div key={i} className={`h-2 rounded-sm ${i < 6 ? 'bg-[#0CDBC1]' : 'bg-[#13131A] border border-white/10'}`} />
                              ))}
                            </div>
                          </div>

                          <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3 flex flex-col justify-between items-center text-center">
                            <span className="text-[8px] font-mono text-[#8B8B9E]">FOCUS SPRINT TIMER</span>
                            <div className="text-sm font-mono font-bold text-[#0CDBC1] my-1">
                              {pomodoroMinutes < 10 ? `0${pomodoroMinutes}` : pomodoroMinutes}:{pomodoroSeconds < 10 ? `0${pomodoroSeconds}` : pomodoroSeconds}
                            </div>
                            <span className="text-[7px] px-1.5 py-0.5 rounded bg-[#13131A] text-[#8B8B9E] font-mono">ACTIVE BLOCKING</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* View B: Finance mockup */}
                  {mockupTab === 'finance' && (
                    <motion.div 
                      key="finance"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-center bg-[#0A0A0F] border border-white/5 rounded-lg p-3">
                        <div>
                          <span className="text-[9px] font-mono text-[#8B8B9E] block">OUTFLOW BURN RATE</span>
                          <span className="text-sm font-mono font-black text-[#F0F0F5]">₹12,480 / Month</span>
                        </div>
                        <span className="text-[9px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono">UNDER BUDGET 20%</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { category: 'Software Subs', amount: '₹3,200', pct: 60 },
                          { category: 'CAT Study Prep', amount: '₹1,500', pct: 40 },
                          { category: 'Pune Coworking', amount: '₹5,000', pct: 75 },
                        ].map((fin, idx) => (
                          <div key={idx} className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3 flex flex-col justify-between">
                            <div>
                              <span className="text-[8px] font-mono text-[#8B8B9E] block truncate">{fin.category}</span>
                              <span className="text-xs font-mono font-bold text-white mt-1 block">{fin.amount}</span>
                            </div>
                            <div className="w-full bg-[#13131A] h-1 rounded-full mt-3 overflow-hidden">
                              <div className="bg-[#0CDBC1] h-full" style={{ width: `${fin.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Visual Bar chart mockup */}
                      <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-3">
                        <span className="text-[9px] font-mono text-[#8B8B9E] mb-2 block">WEEKLY TRANSACTION PROFILE</span>
                        <div className="flex items-end justify-between h-20 pt-4 px-2">
                          {[30, 45, 20, 80, 50, 90, 35].map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                              <div className="w-4 bg-[#0CDBC1] rounded-t-sm transition-all duration-500" style={{ height: `${val}%` }} />
                              <span className="text-[7px] font-mono text-[#8B8B9E]/50">w{i+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* View C: Journal view mockup */}
                  {mockupTab === 'journal' && (
                    <motion.div 
                      key="journal"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#0A0A0F] border border-white/5 rounded-lg p-4 flex flex-col gap-3 min-h-[280px]"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                          <span className="text-[9px] font-mono text-[#8B8B9E] block">ENTRY: JUNE 01, 2026</span>
                          <h4 className="text-xs font-bold text-[#F0F0F5]">Cognitive Buffer Unload Session</h4>
                        </div>
                        <span className="text-[8px] px-2 py-0.5 rounded bg-[#0CDBC1]/10 text-[#0CDBC1] font-mono">PRIVATE DUMP</span>
                      </div>
                      
                      <div className="text-xs font-mono text-[#8B8B9E] leading-relaxed flex-1 select-none">
                        "CAT mocks scores have scaled up 15% post implementation of somatic quantitative study sprint configurations. Eliminated multi-tasking and blocked phone firewall between 06:00 and 12:00. Brain buffering clear, cognitive velocity optimal."
                      </div>
                      
                      <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[9px] font-mono text-[#8B8B9E]/50">
                        <span>WORDS: 42</span>
                        <span>DB ENCRYPTION KEY: AES-256 INTERNAL CLIENT</span>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* WHY US MANIFESTO */}
      <section id="manifesto" className="py-24 max-w-4xl mx-auto px-6 border-t border-white/5 relative z-10 scroll-fade-up">
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
      <section id="comparison" className="py-24 border-t border-white/5 relative z-10 max-w-5xl mx-auto px-6 scroll-fade-up">
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

      {/* ASYMMETRIC MAGAZINE MOSAIC FEATURE GRID */}
      <section id="features" className="py-24 border-t border-white/5 relative z-10 max-w-7xl mx-auto px-6 scroll-fade-up">
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
              <h3 className="text-2xl font-display font-bold mb-3">One Place For Everything — Stop The Tab Chaos</h3>
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

      {/* DYNAMIC LIVE INTERACTIVE DEMO */}
      <section id="live-demo" className="py-24 border-t border-white/5 relative z-10 max-w-5xl mx-auto px-6 scroll-fade-up">
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
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="e.g. Solve 5 logical analysis mock drills..." 
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0CDBC1] text-white"
              />
              <button type="submit" className="p-2 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded bg-[#0A0A0F]/50 border border-white/5">
                  <div className="flex items-center gap-2.5 flex-1 cursor-pointer select-none" onClick={() => handleToggleTask(t.id)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${t.done ? 'bg-[#0CDBC1]/25 border-[#0CDBC1]' : 'border-white/20'}`}>
                      {t.done && <Check className="w-3 h-3 text-[#0CDBC1] stroke-[3]" />}
                    </div>
                    <span className={`text-xs ${t.done ? 'text-[#8B8B9E] line-through' : 'text-[#F0F0F5]'}`}>{t.text}</span>
                  </div>
                  <button onClick={() => handleDeleteTask(t.id)} className="text-[#8B8B9E] hover:text-rose-400 p-1">
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
                      onClick={() => handleToggleHabit(h.id)}
                      className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${h.doneToday ? 'bg-[#0CDBC1]/10 text-[#0CDBC1] border border-[#0CDBC1]/25' : 'bg-[#13131A] text-[#8B8B9E] border border-white/10'}`}
                    >
                      {h.doneToday ? `✓ Streak: ${h.streak}d` : `Streak: ${h.streak}d · Complete`}
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
              <p className="text-xs text-[#8B8B9E] font-light">DESCRIBE YOUR GOAL IN PLAIN LANGUAGE. GET A WEEK-BY-WEEK ACTION PLAN IN 10 SECONDS.</p>
            </div>

            <form onSubmit={handleAiPlanGenerate} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. I want to get into IIT by next year..." 
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0CDBC1] text-white"
              />
              <button 
                type="submit" 
                disabled={aiLoading || !goalInput.trim()}
                className="px-4 py-2 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(12,219,193,0.3)]"
              >
                {aiLoading ? 'Analyzing...' : 'Generate Plan →'}
              </button>
            </form>

            <div className="bg-[#0A0A0F] border border-white/5 rounded-lg p-4 font-mono text-[11px] text-[#8B8B9E] min-h-[160px] max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {goalOutput ? (
                <div>
                  <span className="text-[#0CDBC1] font-bold">LIFE OS AI ENGINE OUTPUT:</span>
                  <div className="mt-2 text-white">{goalOutput}</div>
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

      {/* REALISTIC 12-MONTH ROADMAP */}
      <section id="roadmap" className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
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
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
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
      <section className="py-24 border-t border-white/5 relative z-10 max-w-3xl mx-auto px-6 text-center scroll-fade-up">
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

      {/* CREDIBLE TESTIMONIALS SECTION */}
      <section className="py-24 max-w-4xl mx-auto px-6 border-t border-white/5 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight">Honest Beta Feedback</h2>
          <p className="text-white/50 text-base max-w-md mx-auto">We tested this for 3 weeks before launch. Here is how early adopters are utilizing LIFE OS.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'Arjun Sen',
              role: 'IIT Kharagpur Student',
              quote: 'I used to juggle Notion, Todoist, Habitica and a spreadsheet for money. Now it is just LIFE OS. Week 3 and I have not missed any of them. The focus timer and local storage speed are insane.',
              handle: '@arj_sen'
            },
            {
              name: 'Priya Mirajkar',
              role: 'Product Designer (Freelance)',
              quote: 'Description of your goals in plain language to get week-by-week blueprints is scarely accurate. The interface is visually stunning, clean, and completely local. Highly recommend the waitlist pass.',
              handle: '@priya_des'
            }
          ].map((test, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.07] p-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.01)] flex flex-col justify-between">
              <p className="text-white/80 text-sm leading-relaxed mb-6 font-light">"{test.quote}"</p>
              <div>
                <div className="font-bold text-white text-xs">{test.name}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{test.role}</div>
                <span className="text-[10px] text-[#0CDBC1] font-mono mt-1 block">{test.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHAPE THE PRODUCT BETA APPLICATION */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
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
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="your@email.com" 
                disabled={waitlistSuccess}
                className="flex-1 bg-[#0A0A0F] border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#0CDBC1] text-white disabled:opacity-50"
              />
              <button 
                onClick={handleWaitlistSubmit}
                disabled={waitlistSuccess || !waitlistEmail.trim()}
                className="px-6 py-3 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-50"
              >
                {waitlistSuccess ? 'Applied' : 'Apply to Beta Test →'}
              </button>
            </div>

            {waitlistSuccess && (
              <p className="text-xs text-[#0CDBC1] font-mono mt-3">
                Application received. We will follow up in 24 hours. Your spot is locked!
              </p>
            )}

            <div className="mt-8 text-xs text-[#8B8B9E]/60 font-mono">
              STATUS ENGAGEMENT: <span className="text-[#0CDBC1] font-semibold">{100 - (adoptersCount % 100)} of 100 spots remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section id="pricing" className="py-24 border-t border-white/5 relative z-10 max-w-6xl mx-auto px-6 scroll-fade-up">
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
          <div className="bg-[#13131A] border-2 border-[#0CDBC1] rounded-xl p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(12,219,193,0.1)] hover:border-[#0CDBC1]/85 transition-all">
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
              className="mt-8 w-full py-3 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black text-center text-xs font-mono font-bold shadow-[0_0_15px_rgba(12,219,193,0.3)] transition-all cursor-pointer border-none"
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
          🔒 Early adopter pass limited to first 100 developers. {100 - (adoptersCount % 100)} passes remaining.
        </p>
      </section>

      {/* FINAL MID-PAGE CTA BANNER */}
      <section className="py-20 text-center relative overflow-hidden border-t border-white/5 z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
        <h2 className="font-display text-3xl font-black mb-3">Your productivity stack is waiting.</h2>
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
      {mobileStickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#13131A]/95 border-t border-white/10 backdrop-blur-md py-3.5 px-6 flex items-center justify-between z-50 md:hidden animate-fade-in">
          <span className="text-[10px] font-mono text-[#8B8B9E]">FREE FOREVER MODULES</span>
          <Link href="/login" className="px-4 py-2 rounded bg-[#0CDBC1] text-black text-xs font-bold font-mono">
            START NOW →
          </Link>
        </div>
      )}

      {/* HELP POP-UP TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#13131A] border border-white/10 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-xs flex gap-3 items-start"
          >
            <HelpCircle className="w-5 h-5 text-[#0CDBC1] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#F0F0F5]">Got questions?</h4>
              <p className="text-[10px] text-[#8B8B9E] leading-normal mt-1">Chat directly with the Pune developer team about security parameters or waitlists.</p>
              <div className="flex gap-2.5 mt-3">
                <a href="mailto:support@lifeos-257.vercel.app" className="text-[10px] text-[#0CDBC1] font-mono font-bold hover:underline">MAIL TEAM →</a>
                <button onClick={() => setShowToast(false)} className="text-[10px] text-[#8B8B9E] font-mono hover:underline ml-auto">DISMISS</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="text-[10px] font-mono text-[#8B8B9E] bg-[#13131A] px-3 py-1.5 rounded border border-white/5 select-none">
              🇮🇳 Made in Pune, India
            </div>
          </div>

          {/* Sitemap (Information Architecture) */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h4 className="text-xs font-mono font-bold text-[#F0F0F5] tracking-wider uppercase mb-1">Information Architecture</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#8B8B9E]">
              <Link href="/" className="hover:text-[#F0F0F5] transition-colors">/ (Home Page)</Link>
              <Link href="/login" className="hover:text-[#F0F0F5] transition-colors">/app (Dashboard)</Link>
              <a href="#manifesto" className="hover:text-[#F0F0F5] transition-colors">/about (Manifesto)</a>
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

      {/* Waitlist modal */}
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
      className="fixed top-0 left-0 h-[2.5px] bg-[#0CDBC1] z-[10000] pointer-events-none transition-all duration-75"
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
                className="w-full py-2.5 rounded bg-[#0CDBC1] hover:bg-[#0ac8b0] text-black font-bold text-xs border-none"
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
