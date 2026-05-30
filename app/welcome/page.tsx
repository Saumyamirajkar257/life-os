'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Brain, Target, Shield, Zap, Sparkles, Activity } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          LIFE OS
        </div>
        <div className="flex gap-4 items-center text-sm font-medium">
          <Link href="#features" className="text-white/60 hover:text-white transition-colors hidden sm:block">Features</Link>
          <Link href="#pricing" className="text-white/60 hover:text-white transition-colors hidden sm:block">Pricing</Link>
          <Link href="/login" className="bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center min-h-[80vh] justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-300 mb-8"
        >
          <Zap className="w-3 h-3" />
          LIFE OS v1.0 is now live
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6"
        >
          Your cognitive <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
            operating system.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-10"
        >
          A cinematic, AI-powered command center for your life. Manage tasks, optimize habits, track finances, and cultivate your second brain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/login" className="px-8 py-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Initialize System <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#preview" className="px-8 py-4 rounded-xl bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center">
            View Demo
          </Link>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-zinc-900/50 p-2 md:p-4 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2000" alt="Dashboard Preview" className="rounded-xl md:rounded-2xl opacity-60 w-full object-cover" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">A complete ecosystem.</h2>
          <p className="text-white/50">Everything you need to optimize your daily existence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Brain className="w-6 h-6 text-indigo-400" />, title: 'Second Brain', desc: 'Visualize your knowledge dynamically with a neural graph.' },
            { icon: <Target className="w-6 h-6 text-emerald-400" />, title: 'Habit Analytics', desc: 'Deep dive into your behavior patterns and streaks.' },
            { icon: <Shield className="w-6 h-6 text-rose-400" />, title: 'Local First', desc: 'Your data never leaves your device unless you want it to.' },
            { icon: <Activity className="w-6 h-6 text-blue-400" />, title: 'Focus Ecosystem', desc: 'Enter flow state with ambient soundscapes and deep work tracking.' },
            { icon: <Zap className="w-6 h-6 text-amber-400" />, title: 'Smart Automations', desc: 'Set up rules that adapt the OS to your burnout and productivity levels.' },
            { icon: <Sparkles className="w-6 h-6 text-purple-400" />, title: 'AI Companion', desc: 'A built-in voice assistant and life coach that evolves with you.' },
          ].map((feature, i) => (
            <GlassCard key={i} className="p-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-sm text-white/40">
        <p>© 2026 LIFE OS. Built for the future.</p>
      </footer>
    </div>
  );
}
