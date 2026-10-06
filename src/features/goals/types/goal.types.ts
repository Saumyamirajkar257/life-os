/**
 * @file goal.types.ts
 * @description Master TypeScript definitions for Milestone 14 Goals & Projects Module in Aura Life OS.
 * @module Features/Goals/Types
 */

export type GoalCategory =
  | 'Personal'
  | 'Career'
  | 'Education'
  | 'Finance'
  | 'Health'
  | 'Fitness'
  | 'Learning'
  | 'Business'
  | 'Custom';

export type GoalPriority = 'low' | 'medium' | 'high' | 'urgent';

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'archived';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

export type GoalViewMode =
  | 'dashboard'
  | 'all'
  | 'active'
  | 'completed'
  | 'projects'
  | 'timeline'
  | 'milestones'
  | 'roadmap'
  | 'analytics'
  | 'archive';

export interface GoalAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface GoalItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory | string;
  priority: GoalPriority;
  status: GoalStatus;
  icon: string; // Lucide icon name key
  color: string; // Hex or accent color class
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  completionDate?: string | null;
  progress: number; // 0 - 100
  motivationStatement?: string;
  visionStatement?: string;
  notes?: string;
  tags: string[];
  attachments: GoalAttachment[];
  isFavourite: boolean;
  isPinned: boolean;
  linkedHabitIds: string[]; // Linked Habit IDs
  createdAt: string; // ISO Timestamp
  updatedAt: string; // ISO Timestamp
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'lead' | 'contributor';
}

export interface ProjectItem {
  id: string;
  userId: string;
  goalId?: string | null; // Linked Parent Goal ID
  title: string;
  description?: string;
  category: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  icon: string;
  color: string;
  startDate: string; // YYYY-MM-DD
  targetDate: string; // YYYY-MM-DD
  completionDate?: string | null;
  progress: number; // 0 - 100
  members: ProjectMember[];
  notes?: string;
  tags: string[];
  isFavourite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneItem {
  id: string;
  userId: string;
  projectId: string; // Parent Project ID
  goalId?: string | null; // Associated Goal ID
  title: string;
  description?: string;
  status: MilestoneStatus;
  dueDate: string; // YYYY-MM-DD
  progress: number; // 0 - 100
  linkedTaskIds: string[]; // Task IDs from Tasks Engine
  linkedHabitIds: string[]; // Habit IDs from Habits OS
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface GoalFilterState {
  searchQuery: string;
  categories: string[];
  priorities: GoalPriority[];
  statuses: GoalStatus[];
  tags: string[];
  isPinnedOnly: boolean;
  isFavouriteOnly: boolean;
  sortBy: 'targetDate' | 'priority' | 'progress' | 'title' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  groupBy: 'none' | 'category' | 'priority' | 'status';
}

export interface GoalAnalyticsSummary {
  totalGoals: number;
  activeGoalsCount: number;
  completedGoalsCount: number;
  pausedGoalsCount: number;
  goalCompletionRate: number; // Percentage 0 - 100
  totalProjects: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  averageProjectProgress: number; // 0 - 100
  totalMilestones: number;
  completedMilestonesCount: number;
  milestoneCompletionRate: number; // 0 - 100
  weeklyProgressDelta: number; // Percentage change over week
  monthlyProgressDelta: number; // Percentage change over month
  successPercentage: number; // 0 - 100
  estimatedCompletionWeeks: number;
  categoryBreakdown: Record<string, number>;
}
