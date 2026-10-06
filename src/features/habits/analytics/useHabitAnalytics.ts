/**
 * @file useHabitAnalytics.ts
 * @description Hook providing calculated analytics, heat maps, category performance charts, and level/XP metrics.
 * @module Features/Habits/Analytics/UseHabitAnalytics
 */

import { useMemo } from 'react';
import { useHabitStore } from '../stores/useHabitStore';
import {
  generateHeatMapMatrix,
  calculateUserHabitLevelAndXP,
  evaluateAchievementBadges,
  calculateConsistencyScore,
} from '../utils/habitAnalyticsEngine';

export function useHabitAnalytics() {
  const { habits, logs } = useHabitStore();

  const heatMapData = useMemo(() => {
    return generateHeatMapMatrix(logs, 90); // 90 days for clean compact heat map
  }, [logs]);

  const levelXP = useMemo(() => {
    return calculateUserHabitLevelAndXP(habits, logs);
  }, [habits, logs]);

  const badges = useMemo(() => {
    return evaluateAchievementBadges(habits, logs);
  }, [habits, logs]);

  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, { total: number; completed: number }>();

    habits.forEach((h) => {
      const current = counts.get(h.category) || { total: 0, completed: 0 };
      counts.set(h.category, {
        total: current.total + 1,
        completed: current.completed + (h.currentStreak > 0 ? 1 : 0),
      });
    });

    return Array.from(counts.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      completed: data.completed,
      rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  }, [habits]);

  const consistencyScore = useMemo(() => {
    return calculateConsistencyScore(habits, logs);
  }, [habits, logs]);

  return {
    heatMapData,
    levelXP,
    badges,
    categoryBreakdown,
    consistencyScore,
  };
}
