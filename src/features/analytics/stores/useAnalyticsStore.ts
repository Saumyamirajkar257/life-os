/**
 * @file useAnalyticsStore.ts
 * @description Zustand state management store for Analytics OS filters, reports, and insights search.
 * @module Features/Analytics/Stores
 */

import { create } from 'zustand';
import { InsightItem, LifeScoreSummary, ReportItem, TimeRange } from '../types';
import { LifeScoreEngine } from '../services/lifeScoreEngine';

interface AnalyticsState {
  timeRange: TimeRange;
  searchQuery: string;
  activeReportType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lifeScoreSummary: LifeScoreSummary;
  insights: InsightItem[];
  reports: ReportItem[];

  // Actions
  setTimeRange: (range: TimeRange) => void;
  setSearchQuery: (query: string) => void;
  setActiveReportType: (type: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  refreshScores: () => void;
  generateReport: (type: 'daily' | 'weekly' | 'monthly' | 'yearly') => ReportItem;
}

const INITIAL_INSIGHTS: InsightItem[] = [
  {
    id: 'ins-1',
    category: 'achievement',
    domain: 'productivity',
    title: 'Zero Urgent Task Backlog',
    description: 'All high-priority tasks for today were completed ahead of schedule.',
    impactScore: 9,
    timestamp: new Date().toISOString(),
    actionableStep: 'Maintain momentum by assigning focus blocks for tomorrow.',
  },
  {
    id: 'ins-2',
    category: 'streak',
    domain: 'habits',
    title: '14-Day Morning Routine Streak',
    description: 'You have consistently completed your morning hydration and meditation habit.',
    impactScore: 8,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'ins-3',
    category: 'warning',
    domain: 'health',
    title: 'Late Bedtime Pattern Detected',
    description: 'Sleep start times shifted past midnight 3 nights in a row.',
    impactScore: 7,
    timestamp: new Date().toISOString(),
    actionableStep: 'Schedule a wind-down alarm at 22:30 tonight.',
  },
  {
    id: 'ins-4',
    category: 'highlight',
    domain: 'finance',
    title: 'Net Worth Milestone Reached',
    description: 'Your combined asset balances crossed the $25,000 threshold.',
    impactScore: 10,
    timestamp: new Date().toISOString(),
  },
];

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  timeRange: 'weekly',
  searchQuery: '',
  activeReportType: 'weekly',
  lifeScoreSummary: LifeScoreEngine.calculateLifeScore(),
  insights: INITIAL_INSIGHTS,
  reports: [
    {
      id: 'rep-1',
      title: 'Weekly Executive Life Brief',
      type: 'weekly',
      periodLabel: 'Jul 26 - Aug 01, 2026',
      generatedAt: new Date().toISOString(),
      summary: 'Outstanding holistic performance. High productivity throughput combined with strong financial stability and consistent habit streaks.',
      topAchievements: [
        'Cleared 18 tasks with zero overdue items',
        'Built 14-day streak on morning routine habit',
        'Net worth grew by +$1,250 this week',
      ],
      keyWarnings: ['Sleep start time delayed on Thursday night (+45 mins)'],
      recommendations: [
        'Allocate 2 hours of focus time for goal milestone planning',
        'Maintain emergency fund allocation rate',
      ],
      metrics: {
        lifeScoreAvg: 86,
        tasksCompleted: 18,
        habitsRate: 92,
        focusHours: 14.5,
        netWorthChange: 1250,
      },
    },
  ],

  setTimeRange: (range) => set({ timeRange: range }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveReportType: (type) => set({ activeReportType: type }),

  refreshScores: () => {
    const updated = LifeScoreEngine.calculateLifeScore();
    set({ lifeScoreSummary: updated });
  },

  generateReport: (type) => {
    const currentScores = LifeScoreEngine.calculateLifeScore();
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      title: `${type.toUpperCase()} Executive Synthesis Report`,
      type,
      periodLabel: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      generatedAt: new Date().toISOString(),
      summary: `Automated ${type} synthesis evaluated 10 life domains with a composite score of ${currentScores.overallScore}/100.`,
      topAchievements: [
        `Achieved ${currentScores.domainScores.productivity.score}/100 productivity score`,
        `Habit consistency rating at ${currentScores.domainScores.consistency.score}%`,
      ],
      keyWarnings: [`${currentScores.domainScores.health.explanation}`],
      recommendations: [`Maintain current trajectory across goals and financial allocations.`],
      metrics: {
        lifeScoreAvg: currentScores.overallScore,
        tasksCompleted: 12,
        habitsRate: currentScores.domainScores.consistency.score,
        focusHours: 8.5,
        netWorthChange: 450,
      },
    };

    set((state) => ({ reports: [newReport, ...state.reports] }));
    return newReport;
  },
}));
