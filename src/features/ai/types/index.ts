/**
 * @file index.ts
 * @description Master TypeScript type definitions for Milestone 19 — Aura Intelligence (AI Operating System).
 * @module AuraAI/Types
 */

export type AIProviderId = 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'lmstudio' | 'openrouter' | 'custom';

export interface AIModelInfo {
  id: string;
  name: string;
  provider: AIProviderId;
  description: string;
  contextWindow: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  isPaid?: boolean;
}

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  activeModelId: string;
  availableModels: AIModelInfo[];
  enabled: boolean;
}

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ToolCallPayload {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  error?: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  toolCalls?: ToolCallPayload[];
  attachments?: {
    id: string;
    name: string;
    type: 'image' | 'file' | 'audio' | 'chart';
    url?: string;
    data?: string;
  }[];
  isStreaming?: boolean;
  reasoningSteps?: string[];
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  provider: AIProviderId;
  modelId: string;
  messages: AIMessage[];
  pinned: boolean;
  tags: string[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export type MemoryCategory =
  | 'user_preference'
  | 'favorite_theme'
  | 'working_hours'
  | 'study_hours'
  | 'workout_routine'
  | 'sleep_schedule'
  | 'frequently_used_modules'
  | 'recent_activity'
  | 'long_term_preference'
  | 'personal_fact';

export type MemoryImportance = 'low' | 'medium' | 'high' | 'critical';

export interface AIMemoryItem {
  id: string;
  userId: string;
  category: MemoryCategory;
  key: string;
  value: string;
  importance: MemoryImportance;
  source: string; // e.g. 'chat', 'user_explicit', 'auto_extracted'
  createdAt: string;
  updatedAt: string;
}

export interface AIContextSnapshot {
  timestamp: string;
  dateStr: string;
  timeStr: string;
  currentScreen?: string;
  selectedItemId?: string;
  tasksSummary: {
    total: number;
    pending: number;
    dueToday: number;
    urgent: number;
    topTasks: { id: string; title: string; priority: string; dueDate?: string }[];
  };
  habitsSummary: {
    total: number;
    completedToday: number;
    topStreaks: { name: string; streak: number }[];
  };
  goalsSummary: {
    total: number;
    active: number;
    avgProgress: number;
    topGoals: { title: string; progress: number }[];
  };
  calendarSummary: {
    eventsToday: number;
    nextEvent?: { title: string; time: string; location?: string };
  };
  journalSummary: {
    totalEntries: number;
    lastEntryDate?: string;
    recentMood?: string;
  };
  financeSummary: {
    netWorth: number;
    monthlyIncome: number;
    monthlyExpense: number;
    upcomingBillsCount: number;
  };
  healthSummary: {
    score: number;
    sleepHours: number;
    waterIntakeLiters: number;
    activeMinutes: number;
    moodScore: number; // 1-10
  };
  settingsSummary: {
    theme: string;
    workingHours: string;
  };
}

export interface AIToolInterface {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required?: string[];
  };
  execute: (args: Record<string, unknown>, contextSnapshot?: AIContextSnapshot) => Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
  }>;
}

export type WorkflowId =
  | 'plan_my_day'
  | 'review_my_week'
  | 'create_task'
  | 'summarize_journal'
  | 'analyze_spending'
  | 'review_habits'
  | 'suggest_focus_time'
  | 'health_summary'
  | 'goal_progress'
  | 'weekly_reflection'
  | 'monthly_reflection'
  | 'year_review';

export interface AIWorkflowDefinition {
  id: WorkflowId;
  name: string;
  description: string;
  icon: string;
  category: 'productivity' | 'wellness' | 'finance' | 'reflection';
  steps: {
    id: string;
    name: string;
    toolName?: string;
    promptTemplate?: string;
  }[];
  enabled: boolean;
}

export interface AIPromptTemplate {
  id: string;
  userId?: string;
  name: string;
  type: 'system' | 'module' | 'workflow' | 'developer' | 'user';
  description: string;
  template: string;
  version: number;
  category: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIPreference {
  id: string;
  userId: string;
  defaultProvider: AIProviderId;
  defaultModelId: string;
  systemPrompt: string;
  autoContextEnabled: boolean;
  temperature: number;
  thinkingEnabled: boolean;
  voiceEnabled: boolean;
  updatedAt: string;
}

export interface AIIntelligenceScores {
  productivityScore: number;
  habitConsistencyScore: number;
  goalProgressScore: number;
  financialHealthScore: number;
  healthScore: number;
  moodTrendScore: number;
  learningTrendScore: number;
  lifeBalanceScore: number;
}
