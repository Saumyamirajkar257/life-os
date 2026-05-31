'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Brain, ArrowUpRight, Activity, BookOpen, Wallet, X, Hexagon } from 'lucide-react';
import { generateProjections, TrajectoryProjection } from '../utils/projections';

interface FutureSelfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FutureSelfModal({ isOpen, onClose }: FutureSelfModalProps) {
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0: initializing, 1: analyzing, 2: projected
  const [projections, setProjections] = useState<TrajectoryProjection[]>([]);
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStage(0);
      setProjections(generateProjections([], []));
      
      const t1 = setTimeout(() => setStage(1), 2000);
      const t2 = setTimeout(() => setStage(2), 5000);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentProjection = projections[activeTimeline];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] h-[700px] glass-panel border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(99,102,241,0.2)]"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Visualization */}
          <div className="w-full md:w-1/2 relative bg-black/50 flex flex-col items-center justify-center border-r border-white/5 overflow-hidden">
            {/* Animated orb/mesh */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: stage === 2 ? [1, 1.2, 1] : [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-[150%] h-[150%] opacity-30"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,0) 0%, rgba(168,85,247,0.5) 25%, rgba(236,72,153,0) 50%, rgba(99,102,241,0.5) 75%, rgba(99,102,241,0) 100%)'
                }}
              />
            </div>
            
            <div className="relative z-10 text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 mx-auto rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center relative shadow-[0_0_50px_rgba(168,85,247,0.3)]"
              >
                <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                <Brain className="w-12 h-12 text-purple-400" />
              </motion.div>
              
              <div className="mt-8 h-12">
                <AnimatePresence mode="wait">
                  {stage === 0 && (
                    <motion.p key="init" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-white/60 font-mono tracking-widest text-sm shimmer-text uppercase">
                      Initializing Neural Link...
                    </motion.p>
                  )}
                  {stage === 1 && (
                    <motion.p key="analyze" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-white/60 font-mono tracking-widest text-sm shimmer-text uppercase">
                      Analyzing Current Trajectory...
                    </motion.p>
                  )}
                  {stage === 2 && (
                    <motion.p key="project" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-emerald-400 font-mono tracking-widest text-sm glow-text uppercase font-bold">
                      Simulation Ready
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel: Data */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col">
            {stage === 2 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex-1 flex flex-col">
                <h3 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Future Self</h3>
                <p className="text-white/40 text-sm mb-8">Projecting outcomes based on your current momentum.</p>

                {/* Timeline selector */}
                <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl">
                  {projections.map((p, idx) => (
                    <button
                      key={p.timeline}
                      onClick={() => setActiveTimeline(idx)}
                      className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                        activeTimeline === idx ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {p.timeline} MONTH{p.timeline > 1 ? 'S' : ''}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <StatBox icon={Activity} label="Health & Energy" value={currentProjection?.health} color="emerald" />
                  <StatBox icon={BookOpen} label="Knowledge base" value={currentProjection?.knowledge} color="blue" />
                  <StatBox icon={Wallet} label="Wealth & Assets" value={currentProjection?.wealth} color="amber" />
                  <StatBox icon={Hexagon} label="Overall Mastery" value={currentProjection?.overall} color="purple" />
                </div>

                <div className="mt-auto">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-2">AI Analysis</h4>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {currentProjection?.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-xs space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ width: 0 }}
                      animate={{ width: stage === 1 ? '100%' : '30%' }}
                      transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
                      className="h-[2px] bg-white/10 rounded-full overflow-hidden"
                    >
                      <motion.div 
                        animate={{ x: ['-100%', '200%'] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-1/3 h-full bg-indigo-500/50" 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };

  return (
    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={value}
          className="text-3xl font-display font-bold text-white tracking-tight"
        >
          {value}
        </motion.span>
        <span className="text-white/30 text-xs mb-1">/100</span>
      </div>
    </div>
  );
}
