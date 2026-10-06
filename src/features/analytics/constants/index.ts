/**
 * @file constants/index.ts
 * @description Constants, default weights, and static options for Analytics OS.
 * @module Features/Analytics/Constants
 */

import { DomainType } from '../types';

export const DOMAIN_WEIGHTS: Record<DomainType, number> = {
  productivity: 0.15,
  consistency: 0.15,
  health: 0.15,
  finance: 0.12,
  goals: 0.12,
  habits: 0.12,
  focus: 0.08,
  learning: 0.05,
  mood: 0.03,
  wellbeing: 0.03,
};

export const DOMAIN_METADATA: Record<DomainType, { title: string; color: string; description: string }> = {
  productivity: {
    title: 'Productivity',
    color: '#3B82F6', // Blue
    description: 'Task completion rate, priority handling, and throughput.',
  },
  consistency: {
    title: 'Consistency',
    color: '#F59E0B', // Amber
    description: 'Habit streak preservation and routine adherence.',
  },
  health: {
    title: 'Health & Vitality',
    color: '#F43F5E', // Rose
    description: 'Sleep duration, recovery score, and active movement.',
  },
  finance: {
    title: 'Finance & Wealth',
    color: '#10B981', // Emerald
    description: 'Net worth balance, budget adherence, and bill status.',
  },
  goals: {
    title: 'Goal Alignment',
    color: '#6366F1', // Indigo
    description: 'Progress across long-term milestone targets.',
  },
  habits: {
    title: 'Habit Formation',
    color: '#8B5CF6', // Purple
    description: 'Daily check-in accuracy and habit streak building.',
  },
  focus: {
    title: 'Deep Focus Work',
    color: '#06B6D4', // Cyan
    description: 'Interruption-free focus session time logged.',
  },
  learning: {
    title: 'Learning & Growth',
    color: '#14B8A6', // Teal
    description: 'Journal reflections, reading notes, and skill practice.',
  },
  mood: {
    title: 'Emotional Well-being',
    color: '#A855F7', // Violet
    description: 'Sentiment trends and mood logs from daily journals.',
  },
  wellbeing: {
    title: 'Life Balance',
    color: '#10B981', // Emerald
    description: 'Equilibrium across work, rest, and personal endeavors.',
  },
};

export const TIME_RANGES = [
  { id: 'daily', label: 'Today' },
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'yearly', label: 'This Year' },
] as const;
