'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { type SavingsGoal } from '../types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent } from '@/animations';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<SavingsGoal, 'id'>) => void;
}

export function AddGoalModal({ isOpen, onClose, onSave }: AddGoalModalProps) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !target) return;

    const numTarget = parseFloat(target);
    const numSaved = parseFloat(saved || '0');
    if (isNaN(numTarget) || isNaN(numSaved)) return;

    onSave({
      name: name.trim(),
      target: numTarget,
      saved: numSaved,
    });

    setName('');
    setTarget('');
    setSaved('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-md glass-panel border border-white/10 rounded-2xl p-6 bg-zinc-950/80 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold text-white">
                New Savings Goal
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="Emergency Fund, Vacation..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Target (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="20000"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Already Saved (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={saved}
                    onChange={(e) => setSaved(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
