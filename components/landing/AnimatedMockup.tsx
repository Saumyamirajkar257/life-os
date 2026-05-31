'use client';

import { motion } from 'framer-motion';
import { Check, Play, Sparkles } from 'lucide-react';

export function AnimatedMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000">
      {/* 3D Container with bobbing animation */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 grid gap-4 p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl rotate-y-minus-10 rotate-x-5 transform-style-3d"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="text-[10px] font-mono text-white/40">dashboard.tsx</div>
        </div>

        {/* Tasks Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="glass-panel p-4 rounded-2xl"
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-indigo-400" /> Today's Tasks
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1], backgroundColor: ['rgba(255,255,255,0.1)', 'rgba(16,185,129,1)', 'rgba(16,185,129,1)'] }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="w-4 h-4 rounded border border-white/20 flex items-center justify-center flex-shrink-0"
              >
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 1.7 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              <div className="relative text-xs text-white/80">
                <span className="relative z-10">Review Q3 Marketing Plan</span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.7, duration: 0.3 }}
                  className="absolute top-1/2 left-0 h-[1px] bg-emerald-500 z-20"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center bg-indigo-500/20 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              </div>
              <span className="text-xs text-white/80">Draft Product Spec</span>
            </div>
            
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0" />
              <span className="text-xs">Schedule Team Sync</span>
            </div>
          </div>
        </motion.div>

        {/* Habit Streak Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="glass-panel p-4 rounded-2xl flex justify-between items-center"
        >
          <div>
            <h3 className="text-xs font-semibold text-white/60 mb-1">Habit Streak</h3>
            <div className="text-sm font-bold flex items-center gap-1">
              🔥 7 Days
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < 6 ? 'bg-cyan-400' : 'bg-white/10'}`} />
            ))}
          </div>
        </motion.div>

        {/* Focus & AI Row */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Circular Progress */}
            <svg className="absolute w-24 h-24 -rotate-90 opacity-20">
              <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
            <svg className="absolute w-24 h-24 -rotate-90 text-indigo-500">
              <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="251" strokeDashoffset="50" className="animate-[spin_60s_linear_infinite]" />
            </svg>
            <div className="text-xl font-mono font-bold mb-1">25:00</div>
            <button className="flex items-center gap-1 text-[10px] font-semibold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">
              <Play className="w-3 h-3" /> Start
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="glass-panel p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 mb-2" />
            <p className="text-[10px] leading-relaxed text-white/70">
              <span className="font-semibold text-white">Insight:</span> You're most productive at 9am. 3 tasks scheduled for tomorrow.
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
