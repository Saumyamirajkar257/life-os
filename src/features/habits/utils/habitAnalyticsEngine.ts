/**
 * @file habitAnalyticsEngine.ts
 * @description Comprehensive calculation engine for habit streaks, consistency scores, heat maps, and badge unlocks.
 * @module Features/Habits/Utils/HabitAnalyticsEngine
 */

import { HabitItem, HabitLog, HabitAnalyticsSummary, HeatMapCell, AchievementBadge } from '../types/habit.types';
import { getTodayDateString, getDateOffsetString, getPastNDays } from './habitDateUtils';
import { ACHIEVEMENT_BADGES_PRESETS } from '../constants/habitConstants';

/** Calculate current consecutive streak and best streak for a habit given its log history */
export function calculateHabitStreaks(habit: HabitItem, logs: HabitLog[]): { currentStreak: number; bestStreak: number; totalCompletions: number } {
  const habitLogs = logs
    .filter((l) => l.habitId === habit.id && l.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  const completedDates = new Set(habitLogs.map((l) => l.date));
  const today = getTodayDateString();
  const yesterday = getDateOffsetString(today, -1);

  let currentStreak = 0;
  let checkDate = completedDates.has(today) ? today : yesterday;

  // Count backwards day by day
  while (completedDates.has(checkDate)) {
    currentStreak++;
    checkDate = getDateOffsetString(checkDate, -1);
  }

  // Calculate best streak historically
  const sortedAscDates = Array.from(completedDates).sort();
  let bestStreak = 0;
  let runningStreak = 0;
  let lastDate: string | null = null;

  for (const dateStr of sortedAscDates) {
    if (!lastDate) {
      runningStreak = 1;
    } else {
      const expectedNext = getDateOffsetString(lastDate, 1);
      if (dateStr === expectedNext) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }
    lastDate = dateStr;
    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return {
    currentStreak,
    bestStreak,
    totalCompletions: completedDates.size,
  };
}

/** Calculate consistency score (0 - 100) over the last 30 days */
export function calculateConsistencyScore(habits: HabitItem[], logs: HabitLog[]): number {
  if (habits.length === 0) return 100;

  const past30Days = getPastNDays(30);
  let totalScheduled = 0;
  let totalCompleted = 0;

  const activeHabits = habits.filter((h) => h.status === 'active');
  if (activeHabits.length === 0) return 100;

  const logMap = new Map<string, HabitLog>();
  logs.forEach((l) => logMap.set(`${l.habitId}_${l.date}`, l));

  for (const day of past30Days) {
    for (const habit of activeHabits) {
      totalScheduled++;
      const key = `${habit.id}_${day}`;
      const log = logMap.get(key);
      if (log && log.status === 'completed') {
        totalCompleted++;
      } else if (log && log.status === 'partial') {
        totalCompleted += 0.5;
      }
    }
  }

  if (totalScheduled === 0) return 100;
  return Math.min(100, Math.round((totalCompleted / totalScheduled) * 100));
}

/** Calculate composite Habit Score (0 - 100) for an individual habit */
export function calculateHabitScore(habit: HabitItem, logs: HabitLog[]): number {
  const { currentStreak, totalCompletions } = calculateHabitStreaks(habit, logs);
  const streakFactor = Math.min(40, currentStreak * 4); // Max 40 pts
  const totalFactor = Math.min(30, totalCompletions * 1.5); // Max 30 pts

  const past30Days = getPastNDays(30);
  const habitLogs30 = logs.filter((l) => l.habitId === habit.id && past30Days.includes(l.date) && l.status === 'completed');
  const recent30Factor = Math.min(30, (habitLogs30.length / 30) * 30); // Max 30 pts

  return Math.min(100, Math.round(streakFactor + totalFactor + recent30Factor));
}

/** Generate 365-day heat map matrix cells */
export function generateHeatMapMatrix(logs: HabitLog[], daysCount: number = 365): HeatMapCell[] {
  const today = getTodayDateString();
  const pastDays = getPastNDays(daysCount, today);

  const dateCounts = new Map<string, number>();
  logs.forEach((l) => {
    if (l.status === 'completed') {
      dateCounts.set(l.date, (dateCounts.get(l.date) || 0) + 1);
    }
  });

  return pastDays.map((dateStr) => {
    const count = dateCounts.get(dateStr) || 0;
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 4) intensity = 4;
    else if (count === 3) intensity = 3;
    else if (count === 2) intensity = 2;
    else if (count === 1) intensity = 1;

    return {
      date: dateStr,
      count,
      intensity,
    };
  });
}

/** Compute user overall XP and level based on total check-ins and streaks */
export function calculateUserHabitLevelAndXP(habits: HabitItem[], logs: HabitLog[]): { level: number; currentXP: number; nextLevelXP: number; title: string } {
  let totalXP = 0;

  logs.forEach((l) => {
    if (l.status === 'completed') {
      totalXP += 50;
    } else if (l.status === 'partial') {
      totalXP += 25;
    }
  });

  habits.forEach((h) => {
    totalXP += h.currentStreak * 20;
    if (h.difficulty === 'hard') totalXP += 100;
  });

  const level = Math.floor(totalXP / 500) + 1;
  const currentXP = totalXP % 500;
  const nextLevelXP = 500;

  const titles = [
    'Habit Initiate',
    'Consistency Novice',
    'Routine Builder',
    'Momentum Architect',
    'Streak Specialist',
    'Discipline Vanguard',
    'Master of Systems',
    'Atomic Legend',
  ];

  const titleIndex = Math.min(titles.length - 1, level - 1);

  return {
    level,
    currentXP,
    nextLevelXP,
    title: titles[titleIndex],
  };
}

/** Evaluate and update achievement badges progress */
export function evaluateAchievementBadges(habits: HabitItem[], logs: HabitLog[]): AchievementBadge[] {
  const totalCheckIns = logs.filter((l) => l.status === 'completed').length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
  const consistency = calculateConsistencyScore(habits, logs);

  return ACHIEVEMENT_BADGES_PRESETS.map((badge) => {
    let progress = 0;
    let isUnlocked = badge.isUnlocked;

    if (badge.id === 'badge-first-step') {
      progress = totalCheckIns > 0 ? 100 : 0;
      isUnlocked = totalCheckIns > 0;
    } else if (badge.id === 'badge-streak-7') {
      progress = Math.min(100, Math.round((maxStreak / 7) * 100));
      isUnlocked = maxStreak >= 7;
    } else if (badge.id === 'badge-streak-30') {
      progress = Math.min(100, Math.round((maxStreak / 30) * 100));
      isUnlocked = maxStreak >= 30;
    } else if (badge.id === 'badge-century') {
      progress = Math.min(100, Math.round((totalCheckIns / 100) * 100));
      isUnlocked = totalCheckIns >= 100;
    } else if (badge.id === 'badge-consistency-90') {
      progress = Math.min(100, consistency);
      isUnlocked = consistency >= 90;
    } else if (badge.id === 'badge-flawless-week') {
      progress = maxStreak >= 7 ? 100 : Math.round((maxStreak / 7) * 100);
      isUnlocked = maxStreak >= 7;
    }

    return {
      ...badge,
      progress,
      isUnlocked,
    };
  });
}
