/**
 * @file HabitFormModal.tsx
 * @description Modal form for creating and editing habit properties with full blueprint schema support.
 * @module Features/Habits/Components/HabitFormModal
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Flame, Check } from 'lucide-react';
import { useHabitUIStore } from '../stores/useHabitUIStore';
import { useHabitStore } from '../stores/useHabitStore';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { HABIT_CATEGORIES, HABIT_COLORS, TIME_SLOTS, FREQUENCY_OPTIONS, DIFFICULTY_LEVELS } from '../constants/habitConstants';
import { HabitItem, HabitFrequency, HabitType, HabitDifficulty, TimeOfDay } from '../types/habit.types';
import { validateHabitItem } from '../validation/habitValidation';

export const HabitFormModal: React.FC = () => {
  const { isFormModalOpen, closeFormModal, editingHabitId } = useHabitUIStore();
  const { habits } = useHabitStore();
  const { createHabit, updateHabit } = useHabitMutations();

  const editingHabit = habits.find((h) => h.id === editingHabitId);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('⚡');
  const [category, setCategory] = useState<string>('Health');
  const [color, setColor] = useState('#10b981');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [dailyGoal, setDailyGoal] = useState<number>(1);
  const [dailyGoalUnit, setDailyGoalUnit] = useState('times');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('anytime');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');
  const [motivationNote, setMotivationNote] = useState('');
  const [habitType, setHabitType] = useState<HabitType>('build');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description || '');
      setEmoji(editingHabit.emoji || '⚡');
      setCategory(editingHabit.category || 'Health');
      setColor(editingHabit.color || '#10b981');
      setFrequency(editingHabit.frequency || 'daily');
      setDailyGoal(editingHabit.dailyGoal || 1);
      setDailyGoalUnit(editingHabit.dailyGoalUnit || 'times');
      setTimeOfDay(editingHabit.timeOfDay || 'anytime');
      setDifficulty(editingHabit.difficulty || 'medium');
      setMotivationNote(editingHabit.motivationNote || '');
      setHabitType(editingHabit.habitType || 'build');
      setTagsInput(editingHabit.tags ? editingHabit.tags.join(', ') : '');
      setNotes(editingHabit.notes || '');
    } else {
      // Reset defaults
      setName('');
      setDescription('');
      setEmoji('⚡');
      setCategory('Health');
      setColor('#10b981');
      setFrequency('daily');
      setDailyGoal(1);
      setDailyGoalUnit('times');
      setTimeOfDay('anytime');
      setDifficulty('medium');
      setMotivationNote('');
      setHabitType('build');
      setTagsInput('');
      setNotes('');
    }
    setErrors({});
  }, [editingHabit, isFormModalOpen]);

  if (!isFormModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Partial<HabitItem> = {
      name,
      description,
      emoji,
      category,
      color,
      frequency,
      dailyGoal: Number(dailyGoal),
      dailyGoalUnit,
      timeOfDay,
      difficulty,
      motivationNote,
      habitType,
      tags,
      notes,
    };

    const val = validateHabitItem(payload);
    if (!val.isValid) {
      setErrors(val.errors);
      return;
    }

    if (editingHabitId) {
      updateHabit(editingHabitId, payload);
    } else {
      createHabit(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="max-w-xl w-full rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6 text-neutral-100 my-8 space-y-6"
        id="habit-form-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono tracking-tight text-neutral-100">
                {editingHabitId ? 'Edit Habit' : 'Create New Habit'}
              </h2>
              <p className="text-xs text-neutral-400">Design your daily system for compound growth</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeFormModal}
            className="p-1.5 rounded-xl bg-neutral-900 text-neutral-400 hover:text-neutral-100 border border-neutral-800"
            id="close-habit-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Name & Emoji */}
          <div className="flex gap-2">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="⚡"
              className="w-12 text-center text-lg p-2 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Habit name (e.g. Drink 2.5L Water, Daily Reading)..."
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500 text-neutral-100"
                id="habit-name-input"
              />
              {errors.name && <span className="text-rose-400 text-[10px] mt-1 block">{errors.name}</span>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or purpose of this habit..."
              rows={2}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500 text-neutral-100 resize-none"
            />
          </div>

          {/* Category & Habit Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-emerald-500"
              >
                {HABIT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Habit Direction</label>
              <div className="grid grid-cols-2 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setHabitType('build')}
                  className={`py-1 rounded-lg font-bold text-[10px] transition-colors ${
                    habitType === 'build' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-neutral-400'
                  }`}
                >
                  Build Habit
                </button>
                <button
                  type="button"
                  onClick={() => setHabitType('quit')}
                  className={`py-1 rounded-lg font-bold text-[10px] transition-colors ${
                    habitType === 'quit' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-neutral-400'
                  }`}
                >
                  Quit Habit
                </button>
              </div>
            </div>
          </div>

          {/* Daily Goal & Goal Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Daily Target Goal</label>
              <input
                type="number"
                min={1}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500 text-neutral-100"
              />
            </div>

            <div>
              <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Goal Unit</label>
              <input
                type="text"
                value={dailyGoalUnit}
                onChange={(e) => setDailyGoalUnit(e.target.value)}
                placeholder="times, mins, liters, pages..."
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500 text-neutral-100"
              />
            </div>
          </div>

          {/* Time of Day Slot */}
          <div>
            <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Preferred Time of Day</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setTimeOfDay(slot.id)}
                  className={`p-2 rounded-xl border text-[10px] font-semibold flex flex-col items-center justify-center transition-all ${
                    timeOfDay === slot.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="capitalize">{slot.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motivation Note */}
          <div>
            <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Motivation Note / Why Statement</label>
            <input
              type="text"
              value={motivationNote}
              onChange={(e) => setMotivationNote(e.target.value)}
              placeholder="Why is this habit important to your future self?"
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500 text-neutral-100"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-neutral-400 text-[10px] uppercase tracking-wider block mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="health, morning, deep-work"
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:border-emerald-500 text-neutral-100"
            />
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeFormModal}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-400 text-neutral-950 font-bold hover:bg-emerald-300 shadow-lg shadow-emerald-950/40"
              id="save-habit-submit"
            >
              {editingHabitId ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
