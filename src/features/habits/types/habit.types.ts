/**
 * @file habit.types.ts
 * @description Core TypeScript interfaces and types for Milestone 13 Habits Module in Aura Life OS.
 * @module Features/Habits/Types
 */

export type HabitType = 'build' | 'quit';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'specific_days' | 'interval';

export type HabitStatus = 'active' | 'paused' | 'archived';

export type HabitLogStatus = 'completed' | 'partial' | 'skipped' | 'missed';

export type HabitActiveView =
  | 'today'
  | 'all'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'completed'
  | 'missed'
  | 'archived'
  | 'calendar'
  | 'timeline'
  | 'analytics';

export type HabitCategory =
  | 'Health'
  | 'Fitness'
  | 'Mindset'
  | 'Productivity'
  | 'Learning'
  | 'Personal'
  | 'Finance'
  | 'Lifestyle'
  | 'Social';

export interface HabitItem {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string; // Lucide icon key
  emoji: string; // Emoji character
  category: HabitCategory | string;
  color: string; // Hex color or Tailwind accent
  frequency: HabitFrequency;
  frequencyDays?: string[]; // ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  frequencyInterval?: number; // Every N days
  dailyGoal: number; // Target count per day (e.g., 3 for 3 liters)
  dailyGoalUnit: string; // e.g., 'times', 'mins', 'liters', 'pages', 'steps'
  weeklyGoal?: number;
  monthlyGoal?: number;
  timeOfDay: TimeOfDay;
  reminder: boolean;
  reminderTime?: string; // HH:mm format
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  difficulty: HabitDifficulty;
  motivationNote?: string;
  habitType: HabitType;
  tags: string[];
  notes?: string;
  status: HabitStatus;
  isFavourite: boolean;

  // Streak & Lifetime Aggregates
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  lastCompletedDate?: string; // YYYY-MM-DD

  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface HabitLog {
  id: string; // e.g. `log_${habitId}_${date}`
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  status: HabitLogStatus;
  value: number; // Current completed progress (e.g. 2 out of 3)
  target: number; // Daily goal target
  notes?: string;
  completedAt?: string; // ISO String timestamp
  createdAt: string;
  updatedAt: string;
}

export interface HabitAnalyticsSummary {
  totalActive: number;
  completedTodayCount: number;
  todayCompletionRate: number; // 0 - 100
  overallSuccessRate: number; // 0 - 100
  consistencyScore: number; // 0 - 100
  overallHabitScore: number; // 0 - 100
  longestActiveStreak: number;
  totalCheckInsLifetime: number;
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
}

export interface HeatMapCell {
  date: string; // YYYY-MM-DD
  count: number; // Number of habits completed on date
  intensity: 0 | 1 | 2 | 3 | 4; // Visual density level
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number; // 0 - 100
  category: 'streak' | 'completion' | 'consistency' | 'mastery';
}

export interface HabitChallenge {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  icon: string;
  category: string;
  participantCount: number;
  rewardXP: number;
  recommendedHabits: Partial<HabitItem>[];
}
