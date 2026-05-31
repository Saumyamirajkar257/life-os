'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Brain, Flame, Zap, Target, Sparkles, LayoutDashboard } from 'lucide-react';

const features = [
  {
    title: 'Master Your Day',
    description: 'Track your tasks, habits, and daily schedules in one beautiful, unified dashboard designed to reduce mental clutter.',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'Compound Your Habits',
    description: 'Visualize how your daily habits compound over 30, 90, and 365 days, helping you stay consistent over the long term.',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Connect Your Thoughts',
    description: 'Build a private library of notes and ideas that link together dynamically, acting as a second brain for all your knowledge.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Eliminate Distractions',
    description: 'Enter deep flow states instantly with built-in ambient soundscapes and intelligent focus sessions that keep you productive.',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
  },
];

export function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={containerRef} className="py-24 relative z-10 w-full max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            style={{ y: idx % 2 === 1 ? y : 0 }}
            className={`group perspective-1000 ${idx % 2 === 1 ? 'md:mt-24' : ''}`}
          >
            <motion.div
              whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative h-full"
            >
              <GlassCard variant="elevated" className="h-full p-8 overflow-hidden relative">
                {/* Glow behind icon */}
                <div className={`absolute top-8 left-8 w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 mb-6 border border-white/10 relative z-10`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed relative z-10">{feature.description}</p>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
              </GlassCard>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
