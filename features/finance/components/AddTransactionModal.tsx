'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { type Transaction } from '../types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent } from '@/animations';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'date'>) => void;
}

export function AddTransactionModal({ isOpen, onClose, onSave }: AddTransactionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    onSave({
      name: name.trim(),
      amount: type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount),
      category: type === 'income' ? 'Income' : category,
      type,
    });

    setName('');
    setAmount('');
    setCategory('Groceries');
    setType('expense');
    onClose();
  };

  const categories = ['Groceries', 'Housing', 'Entertainment', 'Transport', 'Utilities', 'Other'];

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
                Add Transaction
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
              {/* Type Toggle */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                    type === 'expense'
                      ? "bg-white text-black"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 py-2 text-xs font-semibold rounded-lg transition-all",
                    type === 'income'
                      ? "bg-white text-black"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  Income
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Description</label>
                <input
                  type="text"
                  required
                  placeholder="Whole Foods Market..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                />
              </div>

              {type === 'expense' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

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
                  Add Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
