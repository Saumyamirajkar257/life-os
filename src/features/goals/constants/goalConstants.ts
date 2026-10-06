/**
 * @file goalConstants.ts
 * @description Master constants and default initial dataset for Milestone 14 Goals & Projects Module.
 * @module Features/Goals/Constants
 */

import { GoalCategory, GoalItem, ProjectItem, MilestoneItem, GoalPriority, GoalStatus, ProjectStatus } from '../types/goal.types';

export const GOAL_CATEGORIES: { name: GoalCategory; color: string; icon: string; bgClass: string }[] = [
  { name: 'Personal', color: '#3B82F6', icon: 'User', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { name: 'Career', color: '#8B5CF6', icon: 'Briefcase', bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { name: 'Education', color: '#EC4899', icon: 'GraduationCap', bgClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { name: 'Finance', color: '#10B981', icon: 'DollarSign', bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { name: 'Health', color: '#06B6D4', icon: 'Heart', bgClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { name: 'Fitness', color: '#F59E0B', icon: 'Dumbbell', bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { name: 'Learning', color: '#6366F1', icon: 'BookOpen', bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { name: 'Business', color: '#14B8A6', icon: 'Building2', bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  { name: 'Custom', color: '#64748B', icon: 'Compass', bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

export const GOAL_PRIORITY_CONFIG: Record<GoalPriority, { label: string; color: string; badgeClass: string }> = {
  low: { label: 'Low', color: '#94A3B8', badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  medium: { label: 'Medium', color: '#3B82F6', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  high: { label: 'High', color: '#F59E0B', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  urgent: { label: 'Urgent', color: '#EF4444', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export const GOAL_STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; badgeClass: string }> = {
  not_started: { label: 'Not Started', color: '#94A3B8', badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  in_progress: { label: 'In Progress', color: '#3B82F6', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  completed: { label: 'Completed', color: '#10B981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  paused: { label: 'Paused', color: '#F59E0B', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  archived: { label: 'Archived', color: '#64748B', badgeClass: 'bg-slate-700/30 text-slate-400 border-slate-700/50' },
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; badgeClass: string }> = {
  planning: { label: 'Planning', color: '#8B5CF6', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  active: { label: 'Active', color: '#3B82F6', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  on_hold: { label: 'On Hold', color: '#F59E0B', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  completed: { label: 'Completed', color: '#10B981', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  archived: { label: 'Archived', color: '#64748B', badgeClass: 'bg-slate-700/30 text-slate-400 border-slate-700/50' },
};

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'goal_1',
    userId: 'default_user',
    title: 'Master AI Engineering & Autonomous Systems',
    description: 'Build production-ready LLM agents, master vector search, and implement multi-agent orchestration frameworks.',
    category: 'Career',
    priority: 'urgent',
    status: 'in_progress',
    icon: 'BrainCircuit',
    color: '#8B5CF6',
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    progress: 68,
    motivationStatement: 'To pioneer next-generation intelligent applications that synthesize complex workflows autonomously.',
    visionStatement: 'Become a recognized Staff AI Systems Architect driving state-of-the-art cognitive software.',
    notes: 'Key focus areas: LangGraph, Antigravity, Gemini 1.5/3 Pro, and custom fine-tuning.',
    tags: ['AI', 'Engineering', 'Career', 'Autonomous'],
    attachments: [],
    isFavourite: true,
    isPinned: true,
    linkedHabitIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal_2',
    userId: 'default_user',
    title: 'Achieve Peak Physical Fitness & Marathon Readiness',
    description: 'Run 1000km throughout the year, build core muscular endurance, and maintain sub-12% body fat.',
    category: 'Fitness',
    priority: 'high',
    status: 'in_progress',
    icon: 'Dumbbell',
    color: '#F59E0B',
    startDate: '2026-01-01',
    targetDate: '2026-11-15',
    progress: 45,
    motivationStatement: 'Physical vitality unlocks mental sharpness and relentless endurance for cognitive work.',
    visionStatement: 'Cross the finish line of the National City Marathon under 3 hours 30 minutes.',
    notes: 'Weekly target: 35km running + 3 strength training sessions.',
    tags: ['Fitness', 'Marathon', 'Health'],
    attachments: [],
    isFavourite: true,
    isPinned: false,
    linkedHabitIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal_3',
    userId: 'default_user',
    title: 'Build $100k Investment Portfolio & Passive Yield',
    description: 'Diversify into index funds, high-growth AI equities, and automated real estate trust income.',
    category: 'Finance',
    priority: 'high',
    status: 'in_progress',
    icon: 'DollarSign',
    color: '#10B981',
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    progress: 82,
    motivationStatement: 'Financial autonomy creates total freedom of decision and long-term security.',
    visionStatement: 'Generate $1,500 monthly passive dividend income by year end.',
    notes: 'Monthly allocation: $3,000 auto-transferred to index portfolio.',
    tags: ['Finance', 'Investing', 'Wealth'],
    attachments: [],
    isFavourite: false,
    isPinned: false,
    linkedHabitIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj_1',
    userId: 'default_user',
    goalId: 'goal_1',
    title: 'Aura Life OS Engine Release',
    description: 'Design and ship the complete modular OS including Tasks, Habits, Goals & Projects, and AI Assistant.',
    category: 'Software Architecture',
    status: 'active',
    priority: 'urgent',
    icon: 'Sparkles',
    color: '#3B82F6',
    startDate: '2026-06-01',
    targetDate: '2026-08-31',
    progress: 75,
    members: [
      { id: 'mem_1', name: 'Lead Architect', email: 'architect@aura.os', role: 'owner' }
    ],
    notes: 'Engine architecture complete. Milestones 12, 13, and 14 deployed.',
    tags: ['Aura', 'React', 'TypeScript', 'Firestore'],
    isFavourite: true,
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_2',
    userId: 'default_user',
    goalId: 'goal_2',
    title: 'Marathon Base Building Program',
    description: '16-week progressive aerobic build, tempo run training, and injury prevention routine.',
    category: 'Fitness',
    status: 'active',
    priority: 'high',
    icon: 'Activity',
    color: '#F59E0B',
    startDate: '2026-05-01',
    targetDate: '2026-09-01',
    progress: 50,
    members: [],
    notes: 'Focus on Zone 2 cardio base building.',
    tags: ['Running', 'Training'],
    isFavourite: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'mile_1',
    userId: 'default_user',
    projectId: 'proj_1',
    goalId: 'goal_1',
    title: 'Complete Milestone 14 Goals & Projects Module',
    description: 'Full CRUD, Firestore sync, relationship mapping, Gantt roadmap, and analytics dashboard.',
    status: 'in_progress',
    dueDate: '2026-07-30',
    progress: 80,
    linkedTaskIds: [],
    linkedHabitIds: [],
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mile_2',
    userId: 'default_user',
    projectId: 'proj_1',
    goalId: 'goal_1',
    title: 'Aura Core Cloud & Offline Persistence Verification',
    description: 'Integrate full optimistic updates, real-time Firestore synchronization, and cache fallbacks.',
    status: 'pending',
    dueDate: '2026-08-15',
    progress: 30,
    linkedTaskIds: [],
    linkedHabitIds: [],
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
