'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/features/dashboard/components/DashboardGrid';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { HeroParticles } from '@/components/landing/HeroParticles';
import { TypewriterText } from '@/components/landing/TypewriterText';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { ArrowRight, Sparkles, Target, Shield, Activity, Star, Plus, X, Lock, Database, Cpu, Calendar, HelpCircle, Trash2, DollarSign, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import { AnimatedMockup } from '@/components/landing/AnimatedMockup';
import { CycleText } from '@/components/landing/CycleText';
import { ScrollProgress } from '@/components/landing/ScrollProgress';
import { LiveAiDemo } from '@/components/landing/LiveAiDemo';
import { NumberTicker } from '@/components/landing/NumberTicker';
import { WaitlistModal } from '@/components/landing/WaitlistModal';
import { Logo } from '@/components/Logo';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isBypassed, setIsBypassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Magnetic CTA states
  const [ctaCoords, setCtaCoords] = useState({ x: 0, y: 0 });
  const [ctaHover, setCtaHover] = useState(false);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCtaCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleCtaMouseLeave = () => {
    setCtaHover(false);
    setCtaCoords({ x: 0, y: 0 });
  };

  // Waitlist Modal States
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Mobile Sticky bottom bar and Toast help popups
  const [mobileStickyVisible, setMobileStickyVisible] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Interactive Live Sandbox states
  const [sandboxTasks, setSandboxTasks] = useState<{ id: number; text: string; done: boolean }[]>([
    { id: 1, text: 'Establish local database schema foundations', done: false },
    { id: 2, text: 'Verify IndexedDB storage consistency logs', done: true },
    { id: 3, text: 'Run 90-minute CAT quantitative sprint block', done: false },
  ]);
  const [newSandboxTask, setNewSandboxTask] = useState('');
  const [sandboxHabits, setSandboxHabits] = useState([
    { id: 1, name: 'Somatic Focused Meditation', streak: 8, doneToday: false },
    { id: 2, name: '90-Min Core Sprint Session', streak: 21, doneToday: true },
  ]);

  // AI Plan simulator states
  const [goalInput, setGoalInput] = useState('');
  const [goalOutput, setGoalOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Beta waitlist registration states
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');
  const [adoptersCount, setAdoptersCount] = useState(312);

  useEffect(() => {
    const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
    setIsBypassed(bypassed);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Monitor scroll for mobile sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const scrolledPastHero = scrollPos > 450;
      const reachedBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 160;
      setMobileStickyVisible(scrolledPastHero && !reachedBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger soft help toast after 25 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 25000);
    return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Sandbox handlers
  const handleAddSandboxTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSandboxTask.trim()) return;
    setSandboxTasks(prev => [...prev, { id: Date.now(), text: newSandboxTask.trim(), done: false }]);
    setNewSandboxTask('');
  };

  const handleToggleSandboxTask = (id: number) => {
    setSandboxTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDeleteSandboxTask = (id: number) => {
    setSandboxTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleSandboxHabit = (id: number) => {
    setSandboxHabits(prev => prev.map(h => {
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

  // AI Typewriter sandbox
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

  // Firestore Waitlist Submit
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;

    setWaitlistError('');
    setWaitlistSubmitting(true);
    const trimmedEmail = waitlistEmail.toLowerCase().trim();

    try {
      const q = query(collection(db, 'waitlist'), where('email', '==', trimmedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setWaitlistError("You're already on the list! 🎉");
        setWaitlistSuccess(true);
        setWaitlistSubmitting(false);
        return;
      }

      await addDoc(collection(db, 'waitlist'), {
        email: trimmedEmail,
        plan: 'pro',
        joinedAt: serverTimestamp(),
        source: 'beta-section'
      });

      setWaitlistSuccess(true);
      setAdoptersCount(prev => prev + 1);
    } catch (err) {
      console.error("Waitlist error: ", err);
      setWaitlistError("Something went wrong. Please try again.");
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  // Show dashboard only after client-side auth is verified and logged in/bypassed
  if (!loading && (user || isBypassed)) {
    return (
      <AppShell>
        <DashboardGrid />
      </AppShell>
    );
  }

  // Landing Page
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen relative bg-black text-white selection:bg-indigo-500/30 overflow-x-hidden"
    >
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      
      {/* SECTION 1: Cinematic Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        {/* Dot Grid Background overlay (masked to fade out at edges) */}
        <div className="absolute inset-0 dot-grid-bg pointer-events-none z-0" />
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-80 z-0" />
        <HeroParticles />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Version badge animate on mount */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-300 mb-4 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              LIFE OS v2.0
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter mb-4 leading-none">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 drop-shadow-2xl pb-1">
                Your
              </span>
              <span className="block pb-2 h-[1.2em]">
                <CycleText words={['Tasks.', 'Habits.', 'Goals.', 'Life.']} />
              </span>
            </h1>

            <div className="h-20 lg:h-16 flex items-center justify-center lg:justify-start mb-6 w-full">
              <TypewriterText 
                text="Take control of your daily schedule, habits, and long-term goals in one unified space. Experience a clean, beautiful digital environment built to keep you focused and consistent."
                delay={0.5}
                className="text-base md:text-lg text-zinc-200 max-w-2xl font-light leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mt-2 w-full">
              <motion.div
                animate={{ x: ctaCoords.x, y: ctaCoords.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                className="w-full sm:w-auto flex justify-center"
              >
                <Link 
                  href="/login" 
                  onMouseMove={handleCtaMouseMove}
                  onMouseLeave={handleCtaMouseLeave}
                  onMouseEnter={() => setCtaHover(true)}
                  className={`px-8 py-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all duration-300 w-full sm:w-auto ${ctaHover ? 'shadow-[0_0_35px_rgba(255,255,255,0.6)]' : 'shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                >
                  Get Started Free
                  <motion.span
                    animate={{ x: ctaHover ? 6 : 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
              <a href="#ai-demo" className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                Watch Demo →
              </a>
            </div>
            <p className="text-xs text-white/40 mt-4 font-mono w-full text-center lg:text-left flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-2">
              <span>Cancel anytime</span>
            </p>
          </div>

          <div className="w-full relative mt-12 lg:mt-0">
            <AnimatedMockup />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="relative z-20 mt-12 mb-24 max-w-5xl mx-auto px-6">
        <div className="glass-panel px-8 py-5 rounded-full flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-white/70 font-medium tracking-wide">
          
          {/* Avatar Stack */}
          <div className="flex items-center gap-3">
            <div className="flex pl-[10px]">
              {[
                { bg: 'bg-cyan-500', text: 'AK' },
                { bg: 'bg-violet-500', text: 'SR' },
                { bg: 'bg-amber-500', text: 'PM' },
                { bg: 'bg-green-500', text: 'RJ' },
                { bg: 'bg-pink-500', text: 'NV' },
              ].map((avatar, i) => (
                <div key={i} className={`w-[36px] h-[36px] rounded-full ${avatar.bg} border-2 border-[#0a0a0f] flex items-center justify-center text-xs text-white font-bold -ml-[10px] relative z-[${5 - i}]`}>
                  {avatar.text}
                </div>
              ))}
            </div>
            <span className="text-white/60 text-sm">★★★★★ Loved by <NumberTicker value={500} />+ people</span>
          </div>

          <span className="text-white/20 hidden md:inline">•</span>
          <span className="flex items-center gap-1.5"><NumberTicker value={50000} />+ Tasks Completed</span>
          <span className="text-white/20 hidden md:inline">•</span>
          <span className="flex items-center gap-1.5 text-indigo-300">4.9★ Rating</span>
          <span className="text-white/20 hidden md:inline">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">Free Forever</span>
        </div>
      </section>

      {/* REDESIGNED FEATURE SECTION: ASYMMETRIC MAGAZINE MOSAIC GRID */}
      <section id="features" className="py-24 border-t border-white/5 relative z-10 max-w-7xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Everything You Need. Nothing Tracking You.</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">High-performance client-side modules built for fluid daily flow.</p>
        </div>

        {/* magazine mosaic grid (flip patterns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Large Hero Card (Col-span 2) */}
          <div className="lg:col-span-2 group bg-[#13131A]/40 border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00d4ff]/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div>
              <div className="inline-flex p-3 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/20 mb-6 text-[#00d4ff]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">One Place For Everything — Stop The Tab Chaos</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xl font-light">
                Consolidate your daily actions under a single window. LIFE OS combines standard task mapping, habits tracking, budgetary checklists, Pomodoro timers, and secure journals. No syncing delay. No web lookup friction.
              </p>
            </div>
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-wrap gap-4 text-xs font-mono text-white/40">
              <span>✓ INSTANT CLIENT STATE</span>
              <span>✓ ZERO NETWORK OVERHEAD</span>
              <span>✓ SECURE DATABASE DUMPS</span>
            </div>
          </div>

          {/* Small Feature Card */}
          <div className="group bg-[#13131A]/40 border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00d4ff]/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div>
              <div className="inline-flex p-3 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/20 mb-6 text-[#00d4ff]">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Streaks Math — 30, 90, 365 Days</h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                Visualize behavioral compounding metrics. Deep statistical streaks help you construct long-term daily routines and trace streaks with complete mathematical visualization.
              </p>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4 text-xs font-mono text-[#00d4ff]">
              LOCAL STREAK METRICS
            </div>
          </div>

          {/* Small Feature Card */}
          <div className="group bg-[#13131A]/40 border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00d4ff]/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div>
              <div className="inline-flex p-3 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/20 mb-6 text-[#00d4ff]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">AI Plans — Week-by-Week Breakdown</h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                Type your high-level plans directly. Our system maps complete action matrices in seconds. Zero prompt engineering needed. Zero analytics saved on backend servers.
              </p>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4 text-xs font-mono text-[#00d4ff]">
              OFFLINE-BASED INSIGHTS
            </div>
          </div>

          {/* Large Hero Card (Col-span 2) */}
          <div className="lg:col-span-2 group bg-[#13131A]/40 border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00d4ff]/30 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
            <div>
              <div className="inline-flex p-3 rounded bg-[#00d4ff]/10 border border-[#00d4ff]/20 mb-6 text-[#00d4ff]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Client Encryption Architecture</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xl font-light">
                Security is built into our core codebase. Absolute zero-knowledge client database structures mean you never sacrifice integrity for mobility. No unauthorized server accesses.
              </p>
            </div>
            <div className="mt-8 border-t border-white/5 pt-6 flex flex-wrap gap-4 text-xs font-mono text-white/40">
              <span>✓ CLIENT-SIDE AES-256 KEYS</span>
              <span>✓ PRIVATE SYNC ARCHITECTURE</span>
              <span>✓ AUDITED ROADMAP ENGINE</span>
            </div>
          </div>

        </div>
      </section>

      {/* REPLACE YOUR STACK COMPARISON GRID */}
      <section id="comparison" className="py-24 border-t border-white/5 relative z-10 max-w-5xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Consolidate Your Workspace</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">Evaluate the monthly costs of keeping your daily data siloed across separate applications.</p>
        </div>

        <div className="bg-[#13131A]/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white font-mono">
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
                  <td className="p-4 font-semibold text-white">{row.name}</td>
                  <td className="p-4 text-white/50 font-light">{row.task}</td>
                  <td className="p-4 text-right font-mono text-white/50">{row.price}</td>
                </tr>
              ))}
              <tr className="bg-white/5 border-b border-white/10 font-bold">
                <td className="p-4 text-white/50">Cumulative Overhead</td>
                <td className="p-4"></td>
                <td className="p-4 text-right font-mono text-rose-400">₹4,896 / month</td>
              </tr>
              <tr className="bg-[#00d4ff]/5 font-black text-[#00d4ff]">
                <td className="p-4">LIFE OS</td>
                <td className="p-4 font-light">All Core Utilities Integrated</td>
                <td className="p-4 text-right font-mono">₹0 / month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* DYNAMIC LIVE INTERACTIVE SANDBOX DEMO */}
      <section id="live-demo" className="py-24 border-t border-white/5 relative z-10 max-w-5xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00d4ff]/10 text-xs font-mono text-[#00d4ff] mb-3">
            TRY IT BEFORE YOU TRUST IT
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Experience Live Local State</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">Add items, complete tasks, and simulate AI generation directly. Zero registrations. Safe sandbox.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive tasks panel */}
          <div className="lg:col-span-5 bg-[#13131A]/60 border border-white/10 rounded-xl p-6 flex flex-col gap-5 backdrop-blur-sm">
            <div>
              <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                <Check className="w-5 h-5 text-[#00d4ff]" /> Dynamic Task Ledger
              </h3>
              <p className="text-xs text-white/40 font-light font-mono">STORES DIRECTLY TO YOUR BROWSER COGNITIVE ENGINE</p>
            </div>

            <form onSubmit={handleAddSandboxTask} className="flex gap-2">
              <input 
                type="text" 
                value={newSandboxTask}
                onChange={(e) => setNewSandboxTask(e.target.value)}
                placeholder="e.g. Solve 5 logical analysis mock drills..." 
                className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#00d4ff] text-white"
              />
              <button type="submit" className="p-2 rounded bg-[#00d4ff] hover:bg-[#00bced] text-black font-semibold flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {sandboxTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                  <div className="flex items-center gap-2.5 flex-1 cursor-pointer select-none" onClick={() => handleToggleSandboxTask(t.id)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${t.done ? 'bg-[#00d4ff]/25 border-[#00d4ff]' : 'border-white/20'}`}>
                      {t.done && <Check className="w-3 h-3 text-[#00d4ff] stroke-[3]" />}
                    </div>
                    <span className={`text-xs ${t.done ? 'text-white/40 line-through' : 'text-white'}`}>{t.text}</span>
                  </div>
                  <button onClick={() => handleDeleteSandboxTask(t.id)} className="text-white/40 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Micro habit indicators */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-mono text-white/40 mb-3">COMPANION HABITS DAILY COMPACT</h4>
              <div className="space-y-2">
                {sandboxHabits.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                    <span className="text-xs text-white">{h.name}</span>
                    <button 
                      onClick={() => handleToggleSandboxHabit(h.id)}
                      className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${h.doneToday ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/25' : 'bg-black/40 text-white/40 border border-white/10'}`}
                    >
                      {h.doneToday ? `✓ Streak: ${h.streak}d` : `Streak: ${h.streak}d · Complete`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Generator simulator panel */}
          <div className="lg:col-span-7 bg-[#13131A]/60 border border-white/10 rounded-xl p-6 flex flex-col gap-4 backdrop-blur-sm">
            <div>
              <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00d4ff]" /> Tactical AI Plan Blueprint Generator
              </h3>
              <p className="text-xs text-white/40 font-light">DESCRIBE YOUR GOAL IN PLAIN LANGUAGE. GET A WEEK-BY-WEEK ACTION PLAN IN 10 SECONDS.</p>
            </div>

            <form onSubmit={handleAiPlanGenerate} className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. I want to get into IIT by next year..." 
                className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#00d4ff] text-white"
              />
              <button 
                type="submit" 
                disabled={aiLoading || !goalInput.trim()}
                className="px-4 py-2 rounded bg-[#00d4ff] hover:bg-[#00bced] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,212,255,0.3)]"
              >
                {aiLoading ? 'Analyzing...' : 'Generate Plan →'}
              </button>
            </form>

            <div className="bg-black/60 border border-white/5 rounded-lg p-4 font-mono text-[11px] text-white/50 min-h-[160px] max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {goalOutput ? (
                <div>
                  <span className="text-[#00d4ff] font-bold">LIFE OS AI ENGINE OUTPUT:</span>
                  <div className="mt-2 text-white">{goalOutput}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[120px] text-center opacity-40">
                  <Cpu className="w-8 h-8 mb-2 animate-pulse text-[#00d4ff]" />
                  <span>Enter goal blueprint details above to trigger internal compilation sandbox.</span>
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-white/30 flex items-center justify-between border-t border-white/5 pt-3">
              <span>🔒 Zero-knowledge offline prompt parsing</span>
              <span>Pune-built intelligence model</span>
            </div>
          </div>

        </div>
      </section>

      {/* BUILT-PARANOID TECHNICAL PRIVACY SECTION */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Built Paranoid. By Design.</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">Absolute mathematical assurance. Your database is strictly yours.</p>
        </div>

        <div className="text-left text-sm text-white/60 leading-relaxed font-light space-y-4 max-w-2xl mx-auto border-l-2 border-[#00d4ff] pl-6">
          <p>
            Kortex is built local-first. We use browser IndexedDB sandboxing to store all your logs directly inside your local hardware cache.
          </p>
          <p>
            If you decide to coordinate cloud sync across multi-device configurations, client-side AES-256 zero-knowledge encryption triggers before data packets leave your device. We hold no keys. We run zero server content scraping loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: <Lock className="w-5 h-5 text-[#00d4ff]" />, title: 'AES-256 Encryption', desc: 'Secure local-based client-side scambling patterns.' },
            { icon: <Database className="w-5 h-5 text-[#00d4ff]" />, title: 'Local-First DB', desc: 'Private IndexedDB architecture, 100% offline ready.' },
            { icon: <Shield className="w-5 h-5 text-[#00d4ff]" />, title: 'No Content Tracking', desc: 'Zero analytics scrapers. Technically clean isolation.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#13131A]/40 border border-white/5 rounded-xl p-5 hover:border-[#00d4ff]/30 transition-all duration-300">
              <div className="w-8 h-8 rounded bg-[#00d4ff]/10 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1.5">{item.title}</h4>
              <p className="text-[11px] text-white/40 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED ROADMAP timeline */}
      <section id="roadmap" className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Incremental Engineering</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">Follow our active roadmap as we harden local-first components and optional zero-knowledge syncs.</p>
        </div>

        <div className="relative border-l border-white/10 pl-6 space-y-12">
          {[
            { phase: 'Q2 2026 — Alpha Engine (Now)', active: true, items: ['Tasks & modular project ledger', 'Streaks analytics database', 'IndexedDB sandboxed storage', 'Integrated Pomodoro timer', 'Tactical AI model generator (local prompt patterns)', 'Expense ledger & visual budget dashboard'] },
            { phase: 'Q3 2026 — Zero-Knowledge Sync Beta (Upcoming)', active: false, items: ['Client-side AES-256 cloud sync architecture', 'Polish PWA offline storage parameters', 'Deep behavioral routine statistics reports', 'AI private journal sentiment summaries'] },
            { phase: 'Q4 2026 — Public Launch v1.0', active: false, items: ['Mobile browser fluid shell integrations', 'Voice task & journal registry', 'Sync with traditional calendars (Google/Outlook)', 'Open Roadmap public vault updates'] },
          ].map((step, idx) => (
            <div key={idx} className="relative">
              <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-black ${step.active ? 'bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]' : 'bg-[#13131A] border-white/20'}`} />
              <h3 className={`text-sm font-mono font-bold uppercase tracking-wider mb-2 ${step.active ? 'text-[#00d4ff]' : 'text-white/40'}`}>{step.phase}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-white/50 font-light">
                {step.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={step.active ? 'text-[#00d4ff]' : 'text-white/20'}>▪</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* RADICAL TRANSPARENCY: AUDIENCE MATCHING */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Radical Transparency</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">We build for specific workflows. Here is an honest audit to verify if LIFE OS matches your cognitive demands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#13131A]/40 border border-[#00d4ff]/20 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold text-[#00d4ff] tracking-wider uppercase">✅ PERFECT IF YOU ARE:</h3>
            <ul className="space-y-3.5 text-xs text-white/50 leading-relaxed font-light">
              <li className="flex items-start gap-2.5">
                <span className="text-[#00d4ff] mt-0.5">✔</span>
                <span>An IIT/NIT student coordinating complex coursework, test mock drills, and routines under strict focus slots.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#00d4ff] mt-0.5">✔</span>
                <span>A freelance product developer balancing 3 concurrent clients while executing tactical long-term MVPs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#00d4ff] mt-0.5">✔</span>
                <span>Exhausted by complex Notion dashboards and looking for an absolute speed, zero-setup ledger.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#13131A]/40 border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase">❌ NOT FOR YOU IF:</h3>
            <ul className="space-y-3.5 text-xs text-white/50 leading-relaxed font-light">
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
                <span>You absolutely demand native mobile application wrappers today (mobile PWA wrapping in Q4 2026).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SHAPE THE PRODUCT BETA APPLICATION */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
        <div className="bg-[#13131A]/60 border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-4 bg-[#00d4ff]/10 text-[#00d4ff] text-[10px] font-mono border-l border-b border-white/5">
            BETA SPRINT BLOCK
          </div>

          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-black mb-4 tracking-tight">This product is young. Help us make it yours.</h2>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed mb-6 font-light">
              We are enrolling exactly 100 beta testers (engineers, builders, and creators) to collaborate directly on the zero-knowledge sync pipelines. You will receive 12 months of premium features for free, direct votes on the roadmap, and option for credits listing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-md">
              <input 
                type="email" 
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="your@email.com" 
                disabled={waitlistSuccess}
                className="flex-1 bg-black/60 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-[#00d4ff] text-white disabled:opacity-50"
              />
              <button 
                onClick={handleWaitlistSubmit}
                disabled={waitlistSuccess || !waitlistEmail.trim()}
                className="px-6 py-3 rounded bg-[#00d4ff] hover:bg-[#00bced] text-black font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-50"
              >
                {waitlistSuccess ? 'Applied' : 'Apply to Beta Test →'}
              </button>
            </div>

            {waitlistSuccess && (
              <p className="text-xs text-[#00d4ff] font-mono mt-3">
                Application received. We will follow up in 24 hours. Your spot is locked!
              </p>
            )}

            <div className="mt-8 text-xs text-white/40 font-mono">
              STATUS ENGAGEMENT: <span className="text-[#00d4ff] font-semibold">{100 - (adoptersCount % 100)} of 100 spots remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* PUNE FOUNDER ORIGIN STORY */}
      <section className="py-24 border-t border-white/5 relative z-10 max-w-3xl mx-auto px-6 text-center scroll-fade-up">
        <h2 className="font-display text-3xl font-black mb-6 tracking-tight">The Origin Blueprint</h2>
        <div className="text-left text-sm text-white/50 leading-relaxed font-light space-y-4">
          <p>
            Hey there. I'm a software engineer based in Pune, India.
          </p>
          <p>
            Back in late 2025, I was paying over ₹3,200 every month across 5 separate planning, habit, and expense tracking apps. Despite that financial cost, my day felt scattered between browser tabs. I spent three weeks searching for a private, fast, offline-first system that felt clean and secure.
          </p>
          <p>
            I couldn't find one. So, I started hacking together the first draft of this local engine. Today, it resides 100% in your device sandbox. No corporate data models. Just a clean tool built to help you finish things and own your data workspace.
          </p>
        </div>
      </section>

      {/* PRICING GRID */}
      <section id="pricing" className="py-24 border-t border-white/5 relative z-10 max-w-6xl mx-auto px-6 scroll-fade-up">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">Clean, Uncompromising Tiers</h2>
          <p className="text-base text-white/50 max-w-md mx-auto">Start with complete local databases or opt for client-side encrypted sync configurations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Free Tier */}
          <div className="bg-[#13131A]/40 border border-white/5 rounded-xl p-8 flex flex-col justify-between hover:border-[#00d4ff]/30 transition-all duration-300 backdrop-blur-sm">
            <div>
              <h3 className="text-lg font-mono font-bold mb-2">FREE TIER</h3>
              <p className="text-xs text-white/40 mb-6 font-light">Essential sandboxed organization tools.</p>
              <div className="flex items-baseline mb-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-white/30 font-mono ml-2">/ FOREVER</span>
              </div>
              <ul className="space-y-3.5 text-xs text-white/50 font-light">
                <li className="flex items-center gap-2">✓ Unlimited local tasks & ledgers</li>
                <li className="flex items-center gap-2">✓ Dynamic habit tracker compounding</li>
                <li className="flex items-center gap-2">✓ Full localized database dumps</li>
                <li className="flex items-center gap-2">✓ Offline focus timer sprint sessions</li>
                <li className="flex items-center gap-2">✓ sandboxed local AI plans (5 / mo)</li>
              </ul>
            </div>
            <Link href="/login" className="mt-8 w-full py-3 rounded bg-black/40 border border-white/10 hover:border-[#00d4ff]/30 text-center text-xs font-mono transition-colors text-white">
              LAUNCH FREE SANDBOX →
            </Link>
          </div>

          {/* Early Adopter Lifetime Tier */}
          <div className="bg-[#13131A]/60 border-2 border-[#00d4ff] rounded-xl p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(0,212,255,0.1)] hover:border-[#00d4ff] transition-all backdrop-blur-sm">
            <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-[#00d4ff] text-black text-[9px] font-mono font-bold tracking-wider">
              LIFETIME PASS (LIMITED)
            </div>
            <div>
              <h3 className="text-lg font-mono font-bold mb-2 text-[#00d4ff]">EARLY ADOPTER</h3>
              <p className="text-xs text-white/40 mb-6 font-light">Secure complete lifetime access before cloud launch.</p>
              <div className="flex items-baseline mb-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-white">₹1,999</span>
                <span className="text-xs text-white/30 font-mono ml-2">/ ONE-TIME</span>
              </div>
              <ul className="space-y-3.5 text-xs text-white/50 font-light">
                <li className="flex items-center gap-2">✓ Everything in Free Tier</li>
                <li className="flex items-center gap-2 text-white">✓ Lifetime zero-knowledge cloud sync</li>
                <li className="flex items-center gap-2">✓ Unlimited local and synced AI plans</li>
                <li className="flex items-center gap-2">✓ Direct feature roadmap priority keys</li>
                <li className="flex items-center gap-2 text-white">✓ Permanent name listing in credits</li>
              </ul>
            </div>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="mt-8 w-full py-3 rounded bg-[#00d4ff] hover:bg-[#00bced] text-black text-center text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all cursor-pointer border-none"
            >
              SECURE LIFETIME PASS →
            </button>
          </div>

          {/* Pro Monthly Tier */}
          <div className="bg-[#13131A]/40 border border-white/5 rounded-xl p-8 flex flex-col justify-between hover:border-[#00d4ff]/30 transition-all duration-300 backdrop-blur-sm">
            <div>
              <h3 className="text-lg font-mono font-bold mb-2">PRO MONTHLY</h3>
              <p className="text-xs text-white/40 mb-6 font-light">Launching Q3 2026 for late adopters.</p>
              <div className="flex items-baseline mb-6 border-b border-white/5 pb-4">
                <span className="text-3xl font-extrabold text-white">₹299</span>
                <span className="text-xs text-white/30 font-mono ml-2">/ MONTH</span>
              </div>
              <ul className="space-y-3.5 text-xs text-white/50 font-light">
                <li className="flex items-center gap-2">✓ Everything in Free Tier</li>
                <li className="flex items-center gap-2">✓ Full zero-knowledge multi-device sync</li>
                <li className="flex items-center gap-2">✓ Advanced routine behavior statistics</li>
                <li className="flex items-center gap-2">✓ Local AI voice input pipelines</li>
                <li className="flex items-center gap-2">✓ Priority developer support line</li>
              </ul>
            </div>
            <button disabled className="mt-8 w-full py-3 rounded bg-white/5 border border-white/10 text-center text-xs font-mono text-white/20 cursor-not-allowed">
              LAUNCHES Q3 2026
            </button>
          </div>

        </div>

        <p className="text-center text-[10px] text-white/30 font-mono mt-8">
          🔒 Early adopter pass limited to first 100 developers. {100 - (adoptersCount % 100)} passes remaining.
        </p>
      </section>

      {/* FINAL MID-PAGE CTA BANNER */}
      <section className="py-20 text-center relative overflow-hidden border-t border-white/5 z-10 max-w-4xl mx-auto px-6 scroll-fade-up">
        <h2 className="font-display text-3xl font-black mb-3">Your productivity stack is waiting.</h2>
        <p className="text-sm text-white/50 max-w-md mx-auto mb-8 font-light leading-relaxed">
          Take absolute custody of your cognitive drivers. No credit cards required. Setup sandbox in 20 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto">
          <Link href="/login" className="px-8 py-4 rounded bg-[#00d4ff] hover:bg-[#00bced] text-black font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">
            Start Free Sandbox →
          </Link>
          <a href="#live-demo" className="px-8 py-4 rounded bg-[#13131A]/40 border border-white/10 text-white font-bold flex items-center justify-center gap-2 w-full sm:w-auto hover:border-[#00d4ff]/30 transition-all">
            See the Demo ↓
          </a>
        </div>
      </section>

      {/* MOBILE STICKY BOTTOM BAR */}
      {mobileStickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#13131A]/95 border-t border-white/10 backdrop-blur-md py-3.5 px-6 flex items-center justify-between z-50 md:hidden animate-fade-in">
          <span className="text-[10px] font-mono text-white/50">FREE FOREVER MODULES</span>
          <Link href="/login" className="px-4 py-2 rounded bg-[#00d4ff] text-black text-xs font-bold font-mono">
            START NOW →
          </Link>
        </div>
      )}

      {/* HELP TOAST TRIGGER BOX */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#13131A] border border-white/10 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-xs flex gap-3 items-start"
          >
            <HelpCircle className="w-5 h-5 text-[#00d4ff] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Got questions?</h4>
              <p className="text-[10px] text-white/40 leading-normal mt-1">Chat directly with the Pune developer team about security parameters or waitlists.</p>
              <div className="flex gap-2.5 mt-3">
                <a href="mailto:support@lifeos-257.vercel.app" className="text-[10px] text-[#00d4ff] font-mono font-bold hover:underline">MAIL TEAM →</a>
                <button onClick={() => setShowToast(false)} className="text-[10px] text-white/40 font-mono hover:underline ml-auto">DISMISS</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER & TRUST CHECKLIST */}
      <footer className="border-t border-white/5 bg-black py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/5 pb-12">
          
          {/* Logo & Pune-made details */}
          <div className="md:col-span-4 flex flex-col items-start text-left">
            <span className="font-display font-black text-lg tracking-wider text-white mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#00d4ff]" />
              LIFE OS
            </span>
            <p className="text-white/40 text-xs max-w-xs leading-relaxed font-light mb-4">
              A private, local-first productivity command center. Own your personal actions, streaks, and routines with total encryption sanity.
            </p>
            <div className="text-[10px] font-mono text-white/40 bg-[#13131A] px-3 py-1.5 rounded border border-white/5 select-none">
              🇮🇳 Made in Pune, India
            </div>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h4 className="text-xs font-mono font-bold text-white tracking-wider uppercase mb-1">Information Architecture</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/40">
              <Link href="/" className="hover:text-white transition-colors">/ (Home Page)</Link>
              <Link href="/login" className="hover:text-white transition-colors">/app (Dashboard)</Link>
              <a href="#manifesto" className="hover:text-white transition-colors">/about (Manifesto)</a>
              <a href="#roadmap" className="hover:text-white transition-colors">/roadmap (Updates)</a>
              <Link href="/privacy" className="hover:text-white transition-colors">/privacy (Vaults)</Link>
              <Link href="/security" className="hover:text-white transition-colors">/security (AES keys)</Link>
              <a href="#live-demo" className="hover:text-white transition-colors">/beta (Sandbox)</a >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">/changelog (GitHub)</a>
            </div>
          </div>

          {/* Trust Checklist footer widget */}
          <div className="md:col-span-4 flex flex-col gap-3 text-left">
            <h4 className="text-xs font-mono font-bold text-white tracking-wider uppercase mb-1">Trust Verification Check</h4>
            <div className="space-y-2 font-mono text-[10px] text-white/30">
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff] font-bold">☑</span>
                <span>No credit card checks required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff] font-bold">☑</span>
                <span>Database stored locally on your device</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff] font-bold">☑</span>
                <span>Works 100% offline without wifi dependencies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff] font-bold">☑</span>
                <span>No trackers. Zero marketing cookies used</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00d4ff] font-bold">☑</span>
                <span>Independent Pune-based developer project</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/20 font-mono gap-4">
          <p>© 2026 LIFE OS. All rights reserved. Zero-knowledge productivity.</p>
          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter Updates</a>
          </div>
        </div>
      </footer>

      {/* Waitlist modal */}
      <WaitlistModal 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </motion.main>
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
      className="fixed top-0 left-0 h-[2.5px] bg-[#00d4ff] z-[10000] pointer-events-none transition-all duration-75"
      style={{ width: scrollWidth }}
    />
  );
}
