/**
 * @file habitConstants.ts
 * @description Constants, default options, preset habits, and Atomic Habits quotes for the Habits Module.
 * @module Features/Habits/Constants
 */

import {
  HabitCategory,
  HabitDifficulty,
  HabitFrequency,
  TimeOfDay,
  AchievementBadge,
  HabitChallenge,
  HabitItem,
} from '../types/habit.types';

export const HABIT_CATEGORIES: HabitCategory[] = [
  'Health',
  'Fitness',
  'Mindset',
  'Productivity',
  'Learning',
  'Personal',
  'Finance',
  'Lifestyle',
  'Social',
];

export const HABIT_COLORS = [
  { name: 'Emerald Green', value: '#10b981', border: 'border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { name: 'Aura Purple', value: '#a855f7', border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
  { name: 'Amber Gold', value: '#f59e0b', border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  { name: 'Sky Blue', value: '#0ea5e9', border: 'border-sky-500', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  { name: 'Rose Red', value: '#f43f5e', border: 'border-rose-500', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  { name: 'Indigo Night', value: '#6366f1', border: 'border-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  { name: 'Teal Fresh', value: '#14b8a6', border: 'border-teal-500', bg: 'bg-teal-500/10', text: 'text-teal-400' },
  { name: 'Orange Flame', value: '#f97316', border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
];

export const TIME_SLOTS: { id: TimeOfDay; label: string; icon: string; description: string }[] = [
  { id: 'morning', label: 'Morning', icon: 'Sun', description: '05:00 - 12:00' },
  { id: 'afternoon', label: 'Afternoon', icon: 'SunMedium', description: '12:00 - 17:00' },
  { id: 'evening', label: 'Evening', icon: 'Moon', description: '17:00 - 23:00' },
  { id: 'anytime', label: 'Anytime', icon: 'Clock', description: 'Flexible throughout the day' },
];

export const FREQUENCY_OPTIONS: { id: HabitFrequency; label: string }[] = [
  { id: 'daily', label: 'Every Day' },
  { id: 'specific_days', label: 'Specific Days of Week' },
  { id: 'weekly', label: 'X Times per Week' },
  { id: 'monthly', label: 'X Times per Month' },
  { id: 'interval', label: 'Interval (Every N Days)' },
];

export const DIFFICULTY_LEVELS: { id: HabitDifficulty; label: string; multiplier: number; color: string }[] = [
  { id: 'easy', label: 'Easy (50 XP)', multiplier: 1.0, color: 'text-emerald-400' },
  { id: 'medium', label: 'Medium (100 XP)', multiplier: 1.5, color: 'text-amber-400' },
  { id: 'hard', label: 'Hard (200 XP)', multiplier: 2.0, color: 'text-rose-400' },
];

export const ATOMIC_HABITS_QUOTES = [
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
  { quote: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { quote: "Small habits don't add up. They compound.", author: "James Clear" },
  { quote: "Be the architect of your habits, not the victim of your environment.", author: "James Clear" },
  { quote: "Success is the product of daily habits—not once-in-a-lifetime transformations.", author: "James Clear" },
  { quote: "Break through your plateaus with small, steady identity shifts.", author: "Atomic Principles" },
];

export const ACHIEVEMENT_BADGES_PRESETS: AchievementBadge[] = [
  {
    id: 'badge-first-step',
    title: 'First Step',
    description: 'Complete your first habit check-in in Aura Life OS.',
    icon: 'Footprints',
    isUnlocked: true,
    progress: 100,
    category: 'completion',
  },
  {
    id: 'badge-streak-7',
    title: '7-Day Master',
    description: 'Maintain a 7-day streak on any active habit.',
    icon: 'Flame',
    isUnlocked: false,
    progress: 50,
    category: 'streak',
  },
  {
    id: 'badge-streak-30',
    title: '30-Day Legend',
    description: 'Reach an unstoppable 30-day streak on a core habit.',
    icon: 'Zap',
    isUnlocked: false,
    progress: 20,
    category: 'streak',
  },
  {
    id: 'badge-century',
    title: 'Century Club',
    description: 'Reach 100 total lifetime habit check-ins.',
    icon: 'Trophy',
    isUnlocked: false,
    progress: 35,
    category: 'mastery',
  },
  {
    id: 'badge-consistency-90',
    title: 'Habit Architect',
    description: 'Achieve an overall consistency score of 90% or higher.',
    icon: 'Target',
    isUnlocked: false,
    progress: 75,
    category: 'consistency',
  },
  {
    id: 'badge-flawless-week',
    title: 'Flawless Week',
    description: 'Complete 100% of scheduled daily habits for 7 consecutive days.',
    icon: 'Sparkles',
    isUnlocked: false,
    progress: 60,
    category: 'consistency',
  },
];

export const PRESET_HABIT_TEMPLATES: Partial<HabitItem>[] = [
  {
    name: 'Hydrate 2.5 Liters Water',
    description: 'Optimal hydration for mental focus and physical vitality.',
    emoji: '💧',
    icon: 'Droplets',
    category: 'Health',
    color: '#0ea5e9',
    frequency: 'daily',
    dailyGoal: 5,
    dailyGoalUnit: 'glasses',
    timeOfDay: 'morning',
    difficulty: 'easy',
    habitType: 'build',
    motivationNote: 'Hydrated brain operates with 20% higher cognitive velocity.',
    tags: ['health', 'morning', 'vitality'],
  },
  {
    name: 'Morning Mindfulness Meditation',
    description: '10 minutes of diaphragmatic breathing and calm presence.',
    emoji: '🧘‍♂️',
    icon: 'Sparkles',
    category: 'Mindset',
    color: '#a855f7',
    frequency: 'daily',
    dailyGoal: 10,
    dailyGoalUnit: 'mins',
    timeOfDay: 'morning',
    difficulty: 'medium',
    habitType: 'build',
    motivationNote: 'Peace precedes performance.',
    tags: ['meditation', 'zen', 'focus'],
  },
  {
    name: 'Read 20 Pages of Non-Fiction',
    description: 'Daily compound learning through high-signal books.',
    emoji: '📚',
    icon: 'BookOpen',
    category: 'Learning',
    color: '#f59e0b',
    frequency: 'daily',
    dailyGoal: 20,
    dailyGoalUnit: 'pages',
    timeOfDay: 'evening',
    difficulty: 'medium',
    habitType: 'build',
    motivationNote: 'Knowledge compounds like interest.',
    tags: ['reading', 'learning', 'growth'],
  },
  {
    name: '30-Minute Daily Physical Exercise',
    description: 'Strength training, cardio run, or mobility movement.',
    emoji: '🏃‍♂️',
    icon: 'Dumbbell',
    category: 'Fitness',
    color: '#10b981',
    frequency: 'daily',
    dailyGoal: 30,
    dailyGoalUnit: 'mins',
    timeOfDay: 'afternoon',
    difficulty: 'hard',
    habitType: 'build',
    motivationNote: 'Physical strength fuels mental resilience.',
    tags: ['fitness', 'workout', 'energy'],
  },
  {
    name: 'Digital Detox After 9 PM',
    description: 'Quit screen time 1 hour before sleep to boost deep sleep cycles.',
    emoji: '📵',
    icon: 'Moon',
    category: 'Lifestyle',
    color: '#6366f1',
    frequency: 'daily',
    dailyGoal: 1,
    dailyGoalUnit: 'session',
    timeOfDay: 'evening',
    difficulty: 'medium',
    habitType: 'quit',
    motivationNote: 'Protect circadian rhythms for maximum tomorrow recovery.',
    tags: ['sleep', 'detox', 'health'],
  },
];

export const HABIT_CHALLENGES: HabitChallenge[] = [
  {
    id: 'challenge-hydration-hero',
    title: '30-Day Hydration Hero',
    description: 'Drink 2.5L water every day for 30 consecutive days to unlock the Liquid Gold Badge.',
    durationDays: 30,
    icon: 'Droplets',
    category: 'Health',
    participantCount: 1420,
    rewardXP: 1000,
    recommendedHabits: [PRESET_HABIT_TEMPLATES[0]],
  },
  {
    id: 'challenge-atomic-reader',
    title: '21-Day Reading Sprint',
    description: 'Read 20 pages every single day for 3 weeks and complete 420 pages.',
    durationDays: 21,
    icon: 'BookOpen',
    category: 'Learning',
    participantCount: 890,
    rewardXP: 750,
    recommendedHabits: [PRESET_HABIT_TEMPLATES[2]],
  },
  {
    id: 'challenge-zen-mind',
    title: '14-Day Zen Mindfulness',
    description: '10 minutes morning meditation to reduce cortisol levels and double focus.',
    durationDays: 14,
    icon: 'Sparkles',
    category: 'Mindset',
    participantCount: 2100,
    rewardXP: 500,
    recommendedHabits: [PRESET_HABIT_TEMPLATES[1]],
  },
];
