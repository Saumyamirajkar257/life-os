/**
 * @file types/index.ts
 * @description Type definitions for Milestone 20 — Analytics, Life Score & Personal Dashboard.
 * @module Features/Analytics/Types
 */

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export type DomainType =
  | 'productivity'
  | 'consistency'
  | 'health'
  | 'finance'
  | 'goals'
  | 'habits'
  | 'focus'
  | 'learning'
  | 'mood'
  | 'wellbeing';

export interface DomainScore {
  domain: DomainType;
  title: string;
  score: number; // 0 - 100
  previousScore: number;
  change: number; // positive or negative percentage/points
  explanation: string; // Explains WHY the score changed
  color: string;
  weight: number;
}

export interface LifeScoreSummary {
  overallScore: number;
  previousOverall: number;
  netChange: number;
  status: 'Thriving' | 'Balanced' | 'Needs Attention' | 'Critical Focus';
  domainScores: Record<DomainType, DomainScore>;
  lastUpdated: string;
}

export type InsightCategory = 'achievement' | 'warning' | 'highlight' | 'streak' | 'milestone' | 'recommendation';

export interface InsightItem {
  id: string;
  category: InsightCategory;
  domain: DomainType;
  title: string;
  description: string;
  impactScore: number; // 1-10
  timestamp: string;
  actionableStep?: string;
  isRead?: boolean;
}

export interface DailyMetricsSnapshot {
  date: string;
  productivityScore: number;
  habitsCompleted: number;
  totalHabits: number;
  focusMinutes: number;
  tasksCompleted: number;
  totalTasks: number;
  netWorth: number;
  sleepHours: number;
  moodRating: number; // 1-5
  goalsProgressAvg: number;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  periodLabel: string;
  generatedAt: string;
  summary: string;
  topAchievements: string[];
  keyWarnings: string[];
  recommendations: string[];
  metrics: {
    lifeScoreAvg: number;
    tasksCompleted: number;
    habitsRate: number;
    focusHours: number;
    netWorthChange: number;
  };
}
