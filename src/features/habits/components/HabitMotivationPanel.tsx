/**
 * @file HabitMotivationPanel.tsx
 * @description Atomic Habits quotes, User Level & XP bar, and Achievement Badges grid.
 * @module Features/Habits/Components/HabitMotivationPanel
 */

import React, { useState } from 'react';
import { Sparkles, Trophy, Award, Flame, ChevronRight, Zap } from 'lucide-react';
import { ATOMIC_HABITS_QUOTES, HABIT_CHALLENGES } from '../constants/habitConstants';
import { useHabitAnalytics } from '../analytics/useHabitAnalytics';

export const HabitMotivationPanel: React.FC = () => {
  const { levelXP, badges } = useHabitAnalytics();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = ATOMIC_HABITS_QUOTES[quoteIndex % ATOMIC_HABITS_QUOTES.length];

  const xpPercentage = Math.min(100, Math.round((levelXP.currentXP / levelXP.nextLevelXP) * 100));

  return (
    <div className="space-y-6" id="habit-motivation-panel">
      {/* Atomic Habits Quote Carousel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-neutral-900 to-emerald-950/40 border border-purple-800/30 text-neutral-100 space-y-3 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Atomic Identity Principle
          </div>

          <button
            type="button"
            onClick={() => setQuoteIndex((prev) => prev + 1)}
            className="text-[10px] font-mono text-neutral-400 hover:text-neutral-200 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800 flex items-center gap-1"
          >
            <span>Next Quote</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-sm sm:text-base font-serif italic text-neutral-200 leading-relaxed">
          "{currentQuote.quote}"
        </p>

        <span className="text-xs font-mono font-semibold text-purple-400 block text-right">
          — {currentQuote.author}
        </span>
      </div>

      {/* User Level & XP Progression Card */}
      <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block font-semibold">Current Rank</span>
              <h3 className="text-sm font-bold text-neutral-100">{levelXP.title}</h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-amber-400">Level {levelXP.level}</span>
            <span className="text-[11px] text-neutral-400 block">{levelXP.currentXP} / {levelXP.nextLevelXP} XP</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievement Badges Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Achievement Badges ({badges.filter((b) => b.isUnlocked).length}/{badges.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                badge.isUnlocked
                  ? 'bg-amber-950/15 border-amber-500/30 text-amber-300'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-500 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-xl border ${
                    badge.isUnlocked
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-600'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold">{badge.progress}%</span>
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono text-neutral-100 truncate">{badge.title}</h4>
                <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight mt-0.5">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
