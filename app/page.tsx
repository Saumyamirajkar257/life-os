'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/features/dashboard/components/DashboardGrid';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { HeroParticles } from '@/components/landing/HeroParticles';
import { TypewriterText } from '@/components/landing/TypewriterText';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { ArrowRight, Sparkles, Target, Shield, Activity, Star, Plus, X } from 'lucide-react';
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

  useEffect(() => {
    const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
    setIsBypassed(bypassed);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
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
              <span className="text-[#00d4ff] font-semibold">🔥 847 people signed up this week</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span>No credit card needed</span>
              <span className="hidden sm:inline text-white/20">•</span>
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

      {/* SECTION 2: 3D Feature Showcase */}
      <section id="features" className="relative py-20 bg-gradient-to-b from-black via-zinc-950 to-black">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">A complete ecosystem.</h2>
            <p className="text-white/50 text-lg">Everything you need to organize your daily life efficiently.</p>
          </div>
        </ScrollReveal>
        
        <FeatureShowcase />
      </section>

      {/* SECTION 3: Stats / Social Proof (The Grid) */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Target className="w-6 h-6 text-emerald-400" />, title: 'Form Better Habits', desc: 'Build life-changing streaks and view behavioral reports that help you stay consistent.' },
            { icon: <Shield className="w-6 h-6 text-rose-400" />, title: 'Own Your Data', desc: 'Enjoy peace of mind knowing your data is private, secure, and resides 100% on your device.' },
            { icon: <Activity className="w-6 h-6 text-blue-400" />, title: 'Double Your Focus', desc: 'Reach deep flow states with interactive soundscapes, pomodoro timers, and distraction blocks.' },
          ].map((feature, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.2}>
              <GlassCard className="p-8 group border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.05)] h-full">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* AI DEMO SECTION */}
      <section id="ai-demo" className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5 scroll-mt-24">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Supercharge with AI.</h2>
            <p className="text-white/50 text-base max-w-md mx-auto">Let our intelligent assistant break down your biggest goals into manageable daily tasks.</p>
          </div>
          <LiveAiDemo />
        </ScrollReveal>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">Loved by real users.</h2>
            <p className="text-white/50 text-base max-w-md mx-auto">See how others are taking control of their day and achieving their goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Arjun Sharma',
                role: 'Engineering Student, IIT Bombay',
                quote: 'LIFE OS replaced 4 apps for me. My habit streaks have never been longer and I actually finish my tasks now.',
                initials: 'AS',
                avatarBg: 'bg-blue-500',
                stars: 5
              },
              {
                name: 'Priya Mehta',
                role: 'Freelance Designer',
                quote: 'The AI action plans are scary good. I typed my goal and got a plan that actually made sense for my life.',
                initials: 'PM',
                avatarBg: 'bg-pink-500',
                stars: 5
              },
              {
                name: 'Rohan Verma',
                role: 'Startup Founder',
                quote: 'Finally an app that feels as serious as my goals. The dashboard is beautiful and the focus timer keeps me honest.',
                initials: 'RV',
                avatarBg: 'bg-purple-500',
                stars: 5
              }
            ].map((testimonial, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.15}>
                <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.1] p-8 rounded-2xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                  <div>
                    <div className="flex text-amber-400 mb-4 gap-0.5">
                      {[...Array(testimonial.stars)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6 font-light">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${testimonial.avatarBg}`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{testimonial.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">{testimonial.role}</div>
                      <div className="text-xs text-[#00d4ff] font-semibold mt-1 flex items-center gap-1">
                        Verified User ✓
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">Simple, transparent pricing.</h2>
            <p className="text-white/50 text-base max-w-md mx-auto">Start free and unlock premium features as you level up your productivity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <ScrollReveal direction="up" delay={0}>
              <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.1] p-8 rounded-2xl flex flex-col h-full hover:border-white/20 transition-all duration-300 hover:-translate-y-1 relative">
                <div>
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-white/40 text-xs mb-6">Essential organization tools for everyone.</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-extrabold text-white">₹0</span>
                    <span className="text-white/40 text-sm ml-2">/ month</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm text-white/70">
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Unlimited tasks & projects</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Habit trackers & streaks</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Local-first data storage</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Basic analytics</li>
                  </ul>
                </div>
                <Link href="/login" className="w-full py-3 rounded-xl border border-white/20 text-white text-center text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300 mt-auto">
                  Get Started Free →
                </Link>
              </div>
            </ScrollReveal>

            {/* Pro Tier */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="backdrop-blur-xl bg-[#ffffff08] border border-[#ffffff15] p-8 rounded-2xl flex flex-col h-full hover:border-white/20 transition-all duration-300 hover:-translate-y-1 relative shadow-[0_0_30px_rgba(99,102,241,0.05)]">
                <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="absolute -top-3 right-4 bg-[#00d4ff15] text-[#00d4ff] border border-[#00d4ff30] rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide">
                  🚀 Launching Soon
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-300">Pro</h3>
                  <p className="text-white/40 text-xs mb-6">Advanced power features for high achievers.</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-extrabold text-white">₹299</span>
                    <span className="text-white/40 text-sm ml-2">/ month</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm text-white/70">
                    <li className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> Everything in Free</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> Multi-device cloud sync</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> Advanced behavior charts</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> Interactive voice assistant</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> Priority feature access</li>
                  </ul>
                </div>
                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="w-full py-3 rounded-xl bg-[#00d4ff] hover:bg-[#00bced] text-black text-center text-sm font-bold hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all duration-300 mt-auto cursor-pointer"
                >
                  Join Waitlist →
                </button>
              </div>
            </ScrollReveal>

            {/* Team Tier */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.1] p-8 rounded-2xl flex flex-col h-full hover:border-white/20 transition-all duration-300 hover:-translate-y-1 relative">
                <div className="absolute -top-3 right-4 bg-[#7c3aed15] text-[#a78bfa] border border-[#7c3aed30] rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide">
                  🔜 Coming Soon
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Team</h3>
                  <p className="text-white/40 text-xs mb-6">Collaborative workspace for small teams.</p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-extrabold text-white">₹599</span>
                    <span className="text-white/40 text-sm ml-2">/ month</span>
                  </div>
                  <ul className="space-y-4 mb-8 text-sm text-white/70">
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Everything in Pro</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Shared task list & goals</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Team activity metrics</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">✓</span> Dedicated support line</li>
                  </ul>
                </div>
                <button
                  disabled
                  className="w-full py-3 rounded-xl border border-white/10 text-white/40 text-center text-sm font-semibold opacity-50 cursor-not-allowed mt-auto"
                >
                  Coming Soon
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Launch Timeline Info */}
          <div className="text-center mt-6 text-[#8b8b9e] text-[13px] font-light">
            <span>Pro launching Q3 2026</span>
            <span className="text-[#00d4ff] font-bold mx-2">·</span>
            <span>Team launching Q4 2026</span>
            <span className="text-[#00d4ff] font-bold mx-2">·</span>
            <span>Early birds get 50% off</span>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6 border-t border-white/5">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-white/50 text-base">Got questions? We've got answers.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is it really free?', a: 'Yes! LIFE OS is free forever for core features. You get unlimited tasks, projects, habits, and local data storage without paying a single rupee.' },
              { q: 'Is my data private and secure?', a: 'Absolutely. We use a local-first design. Your data is stored directly on your device and is never uploaded to any servers unless you choose to enable cloud sync.' },
              { q: 'What devices does it work on?', a: 'It works on all modern web browsers across desktops, tablets, and phones. It is also installable as a Progressive Web App (PWA) for offline usage.' },
              { q: 'Can I cancel my Pro plan anytime?', a: 'Yes, you can cancel your Pro plan anytime from your profile settings page. You will continue to have access to Pro features until the end of your billing cycle.' },
              { q: 'Does it work without internet?', a: 'Yes! Because of the local-first structure, all core functions work completely offline. Your habits and tasks sync when you reconnect.' }
            ].map((faq, i) => (
              <div key={i} className="glass-panel rounded-xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-sm md:text-base text-white/95 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <Plus className="w-5 h-5 text-indigo-400 transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }} />
                </button>
                <div 
                  className="transition-all duration-300 ease-in-out overflow-hidden" 
                  style={{ 
                    maxHeight: openFaq === i ? '200px' : '0px', 
                    opacity: openFaq === i ? 1 : 0,
                    visibility: openFaq === i ? 'visible' : 'hidden'
                  }}
                >
                  <p className="px-6 pb-6 text-sm text-white/50 leading-relaxed font-light">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/login" className="inline-flex px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
              Get Started Today
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: Final CTA */}
      <section className="py-32 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-indigo-900/10 blur-[100px] rounded-full w-1/2 h-1/2 left-1/4 top-1/4" />
        <ScrollReveal direction="up">
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
            Ready to upgrade?
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed px-6">
            Join 500+ people already using LIFE OS to master their daily life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto px-6">
            <Link href="/login" className="px-8 py-4 rounded-xl bg-[#00d4ff] text-black font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 w-full sm:w-auto">
              Start Free Today →
            </Link>
            <a href="#pricing" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
              See Pricing
            </a>
          </div>
          <p className="text-xs text-white/40 mt-6 font-mono">
            Free forever · No credit card · Cancel anytime
          </p>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-zinc-950/20 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-3 block">
              <Logo size={32} showText={true} />
            </Link>
            <p className="text-white/40 text-xs max-w-xs">Take control of your tasks, habits, and goals in one unified space.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/50 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/10">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-white/10">|</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/30 font-mono">
          <p>© 2026 LIFE OS. All rights reserved.</p>
        </div>
      </footer>

      {/* Pro Waitlist Modal */}
      <WaitlistModal 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </motion.main>
  );
}
