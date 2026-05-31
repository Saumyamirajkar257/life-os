'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, Target, TrendingUp, Wallet, Brain } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAutomationsStore, type ConditionType, type OperatorType, type ActionType } from '@/store/useAutomationsStore';
import { useToast } from '@/components/ui/Toast';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONDITION_TYPES: { value: ConditionType; label: string; icon: any }[] = [
  { value: 'habit_streak', label: 'Habit Streak', icon: Target },
  { value: 'productivity_score', label: 'Productivity Score', icon: TrendingUp },
  { value: 'finance_budget', label: 'Finance Budget Spent', icon: Wallet },
  { value: 'mood_trend', label: 'Mood Trend Score', icon: Brain },
];

const OPERATORS: { value: OperatorType; label: string }[] = [
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'equals', label: 'Equals' },
];

const ACTION_TYPES: { value: ActionType; label: string; description: string }[] = [
  { value: 'create_achievement', label: 'Unlock Achievement', description: 'Award a badge or custom milestone achievement' },
  { value: 'show_recovery_plan', label: 'Show Recovery Plan', description: 'Display guided mental or physical recovery suggestions' },
  { value: 'generate_warning', label: 'Generate System Warning', description: 'Display a glow-border warning alert on the screen' },
  { value: 'suggest_break', label: 'Suggest Cognitive Break', description: 'Trigger focus break recommendation with ambient sounds' },
];

export function RuleModal({ isOpen, onClose }: RuleModalProps) {
  const { addRule } = useAutomationsStore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [conditionType, setConditionType] = useState<ConditionType>('habit_streak');
  const [operator, setOperator] = useState<OperatorType>('greater_than');
  const [value, setValue] = useState<number>(0);
  const [actionType, setActionType] = useState<ActionType>('create_achievement');
  const [payloadTitle, setPayloadTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setConditionType('habit_streak');
      setOperator('greater_than');
      setValue(0);
      setActionType('create_achievement');
      setPayloadTitle('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Rule name is required', 'warning');
      return;
    }

    const ruleData = {
      name: name.trim(),
      active: true,
      condition: {
        type: conditionType,
        operator,
        value: Number(value),
      },
      action: {
        type: actionType,
        payload: actionType === 'create_achievement' ? { title: payloadTitle.trim() || 'New Milestone' } : undefined,
      },
    };

    addRule(ruleData);
    toast('Automation rule created successfully', 'success');
    onClose();
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with transition */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70" 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col z-10"
        style={{ willChange: 'transform' }}
      >
        <GlassCard className="flex flex-col h-full overflow-hidden" variant="strong">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" /> Create Automation Rule
            </h2>
            <button type="button" onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
            {/* Rule Name */}
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-white/40 uppercase mb-1.5">Rule Name</label>
              <input
                type="text"
                required
                placeholder="E.g., Burnout Preventer..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Condition Setup */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
              <div className="text-[10px] font-mono tracking-wider text-amber-400 font-semibold uppercase">IF CONDITION</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Trigger Metric</label>
                  <select
                    value={conditionType}
                    onChange={(e) => setConditionType(e.target.value as ConditionType)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {CONDITION_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1">Comparison</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as OperatorType)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1">Threshold Value</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                />
              </div>
            </div>

            {/* Action Setup */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-4">
              <div className="text-[10px] font-mono tracking-wider text-amber-500/70 font-semibold uppercase">THEN ACTION</div>

              <div>
                <label className="block text-xs text-white/50 mb-1">OS Response</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ActionType)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                >
                  {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>

              {actionType === 'create_achievement' && (
                <div>
                  <label className="block text-xs text-white/50 mb-1">Achievement Badge Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Consistency Champion!"
                    value={payloadTitle}
                    onChange={(e) => setPayloadTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              )}

              <p className="text-xs text-white/40 italic">
                {ACTION_TYPES.find(a => a.value === actionType)?.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Assemble Rule
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
