/**
 * @file HabitHeatMap.tsx
 * @description Interactive activity heat map matrix showing habit completion volume.
 * @module Features/Habits/Components/HabitHeatMap
 */

import React from 'react';
import { useHabitAnalytics } from '../analytics/useHabitAnalytics';
import { formatHumanDate } from '../utils/habitDateUtils';

export const HabitHeatMap: React.FC = () => {
  const { heatMapData } = useHabitAnalytics();

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-[var(--color-accent)] border-[var(--color-accent)]/80';
      case 3:
        return 'bg-[var(--color-accent)]/80 border-[var(--color-accent)]/60';
      case 2:
        return 'bg-[var(--color-accent)]/50 border-[var(--color-accent)]/40';
      case 1:
        return 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/10';
      default:
        return 'bg-[var(--color-surface-elevated)] border-[var(--color-border)]/50';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm" id="habit-heat-map">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">30-Day Activity</span>
        <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)] font-medium">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/50" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/10" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-accent)]/50 border border-[var(--color-accent)]/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-accent)]/80 border border-[var(--color-accent)]/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-accent)] border border-[var(--color-accent)]/80" />
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {/* Just mapping backwards for layout */}
        {heatMapData.slice(-30).map((dayData, i) => (
          <div
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 rounded-sm border ${getIntensityColor(
              dayData.intensity
            )} group relative transition-transform hover:scale-110`}
            title={`${formatHumanDate(dayData.date)}: ${dayData.count} completed`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
              {dayData.count} completed
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
