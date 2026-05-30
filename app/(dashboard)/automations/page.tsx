'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutomationsStore, type AutomationRule } from '@/store/useAutomationsStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { pageTransition, staggerContainer, staggerItem } from '@/animations';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings2, 
  ChevronRight,
  TrendingUp,
  Target,
  Wallet,
  Brain
} from 'lucide-react';

export default function AutomationsPage() {
  const { rules, toggleRule, deleteRule } = useAutomationsStore();

  const getConditionIcon = (type: string) => {
    switch (type) {
      case 'habit_streak': return <Target className="w-4 h-4 text-emerald-400" />;
      case 'productivity_score': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'finance_budget': return <Wallet className="w-4 h-4 text-amber-400" />;
      case 'mood_trend': return <Brain className="w-4 h-4 text-rose-400" />;
      default: return <Settings2 className="w-4 h-4 text-white/40" />;
    }
  };

  const formatOperator = (operator: string) => {
    switch (operator) {
      case 'greater_than': return 'is greater than';
      case 'less_than': return 'is less than';
      case 'equals': return 'equals';
      default: return operator;
    }
  };

  const formatAction = (actionType: string) => {
    return actionType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-6xl mx-auto h-[calc(100vh-2rem)] flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-400" />
            Automation Center
          </h1>
          <p className="text-white/60 mt-1">Smart rules that react to your behavior and adapt your OS.</p>
        </div>
        
        <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="md:col-span-2 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <AnimatePresence>
              {rules.map((rule) => (
                <motion.div key={rule.id} variants={staggerItem} layout>
                  <GlassCard className="mb-4" variant={rule.active ? 'default' : 'subtle'}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 mb-4">
                        <button 
                          onClick={() => toggleRule(rule.id)}
                          className={`w-10 h-6 rounded-full transition-colors relative ${rule.active ? 'bg-amber-500' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${rule.active ? 'left-5' : 'left-1'}`} />
                        </button>
                        <h3 className={`text-lg font-semibold ${rule.active ? 'text-white' : 'text-white/50'}`}>
                          {rule.name}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white/80 transition-colors">
                          <Settings2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-2 ${rule.active ? '' : 'opacity-50'}`}>
                      {/* IF Section */}
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                        <span className="text-[10px] font-mono font-semibold text-white/30 uppercase tracking-wider">IF CONDITION</span>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          {getConditionIcon(rule.condition.type)}
                          <span className="capitalize">{rule.condition.type.replace('_', ' ')}</span>
                          <span className="text-white/40">{formatOperator(rule.condition.operator)}</span>
                          <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-amber-400 font-semibold">{rule.condition.value}</span>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col justify-center items-center">
                        <ChevronRight className="w-6 h-6 text-white/20" />
                      </div>

                      {/* THEN Section */}
                      <div className="flex-1 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-2">
                        <span className="text-[10px] font-mono font-semibold text-amber-500/50 uppercase tracking-wider">THEN ACTION</span>
                        <div className="flex items-center gap-2 text-sm text-amber-100">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>{formatAction(rule.action.type)}</span>
                          {rule.action.payload?.title && (
                            <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 font-semibold text-xs">
                              "{rule.action.payload.title}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="hidden md:flex flex-col gap-6">
          <GlassCard variant="strong" className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-4">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display font-medium text-white/90">AI Suggestions</h3>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <Target className="w-4 h-4 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm text-white/80 font-medium">Morning Focus Lock</p>
                <p className="text-xs text-white/40 mt-1">If it's before 10 AM, automatically block distracting sites and start focus mode.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-white/80 font-medium">Auto-Adjust Goals</p>
                <p className="text-xs text-white/40 mt-1">If weekly productivity is &lt;40%, suggest adjusting milestones next week.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-2">
            <h3 className="font-display font-medium text-white/90 mb-2">Automation Stats</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/50">Active Rules</span>
              <span className="font-mono text-white">{rules.filter(r => r.active).length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/50">Triggers Today</span>
              <span className="font-mono text-white">12</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
