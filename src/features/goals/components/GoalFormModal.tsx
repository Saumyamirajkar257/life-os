/**
 * @file GoalFormModal.tsx
 * @description Modal form for creating and editing strategic goals.
 * @module Features/Goals/Components
 */

import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useGoalStore } from '../stores/useGoalStore';
import { GoalCategory, GoalPriority, GoalStatus } from '../types/goal.types';

export const GoalFormModal: React.FC = () => {
  const { isFormModalOpen, closeFormModal, createGoal } = useGoalStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });
  const [color, setColor] = useState('#8B5CF6');

  if (!isFormModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];

    createGoal({
      userId: '',
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'not_started' as GoalStatus,
      icon: 'Target',
      color,
      startDate: todayStr,
      targetDate,
      progress: 0,
      tags: [category],
      attachments: [],
      isFavourite: false,
      isPinned: false,
      linkedHabitIds: [],
    });

    setTitle('');
    setDescription('');
    closeFormModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">New Strategic Goal</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">Define an actionable aspiration.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeFormModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Goal Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Autonomous Cloud Systems"
              className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this goal matter and what is the milestone definition?"
              className="w-full px-3.5 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[var(--color-accent)] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="Personal">Personal</option>
                <option value="Career">Career</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Learning">Learning</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Target Completion Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
