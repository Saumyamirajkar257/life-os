/**
 * @file index.ts
 * @description Master constants and defaults for Aura Intelligence AI OS (Milestone 19).
 * @module AuraAI/Constants
 */

import { AIProviderConfig, AIWorkflowDefinition, AIPromptTemplate, AIPreference, AIMemoryItem } from '../types';

export const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    enabled: true,
    activeModelId: 'gemini-3.6-flash',
    availableModels: [
      {
        id: 'gemini-3.6-flash',
        name: 'Gemini 3.6 Flash',
        provider: 'gemini',
        description: 'Fast, intelligent model for daily productivity and context synthesis.',
        contextWindow: 1000000,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
      },
      {
        id: 'gemini-3.1-pro-preview',
        name: 'Gemini 3.1 Pro Preview',
        provider: 'gemini',
        description: 'Advanced reasoning model for complex life planning and deep analysis.',
        contextWindow: 2000000,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
        isPaid: true,
      },
      {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite',
        provider: 'gemini',
        description: 'Ultra-fast low-latency assistant for quick action execution.',
        contextWindow: 1000000,
        supportsStreaming: true,
        supportsVision: false,
        supportsFunctionCalling: true,
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    enabled: true,
    activeModelId: 'gpt-4o',
    availableModels: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        description: 'Omni model for text, reasoning, and multi-modal tasks.',
        contextWindow: 128000,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        description: 'Lightweight fast model for simple queries.',
        contextWindow: 128000,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    enabled: true,
    activeModelId: 'claude-3-5-sonnet',
    availableModels: [
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        description: 'Exceptional reasoning and creative synthesis.',
        contextWindow: 200000,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
      },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    enabled: false,
    baseUrl: 'http://localhost:11434',
    activeModelId: 'llama3.2',
    availableModels: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2 (Local)',
        provider: 'ollama',
        description: 'Private offline LLM running locally via Ollama.',
        contextWindow: 128000,
        supportsStreaming: true,
        supportsVision: false,
        supportsFunctionCalling: true,
      },
    ],
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (Local)',
    enabled: false,
    baseUrl: 'http://localhost:1234/v1',
    activeModelId: 'local-model',
    availableModels: [
      {
        id: 'local-model',
        name: 'LM Studio Local Server',
        provider: 'lmstudio',
        description: 'Local server instance hosted on port 1234.',
        contextWindow: 32000,
        supportsStreaming: true,
        supportsVision: false,
        supportsFunctionCalling: false,
      },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    enabled: false,
    activeModelId: 'openrouter-auto',
    availableModels: [
      {
        id: 'openrouter-auto',
        name: 'OpenRouter Auto Router',
        provider: 'openrouter',
        description: 'Unified router access to all top open source and proprietary LLMs.',
        contextWindow: 128000,
        supportsStreaming: true,
        supportsVision: true,
        supportsFunctionCalling: true,
      },
    ],
  },
];

export const DEFAULT_AI_PREFERENCE: AIPreference = {
  id: 'default_preference',
  userId: 'user_default',
  defaultProvider: 'gemini',
  defaultModelId: 'gemini-3.6-flash',
  systemPrompt:
    'You are Aura Intelligence, the central AI Operating System for Aura LIFE OS. You are empathetic, precise, structured, and action-oriented. You understand the user’s tasks, habits, goals, calendar, journal, finances, and health routines to provide hyper-personalized proactive support.',
  autoContextEnabled: true,
  temperature: 0.7,
  thinkingEnabled: true,
  voiceEnabled: false,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_PROMPT_TEMPLATES: AIPromptTemplate[] = [
  {
    id: 'sys_core',
    name: 'Aura Intelligence Core System Prompt',
    type: 'system',
    description: 'Master system prompt defining Aura Intelligence identity and operating principles.',
    template: `You are Aura Intelligence, the central AI OS of Aura LIFE OS.
Your objective is to provide intelligent daily guidance, automatic workflow assistance, and holistic life synthesis.
Always align suggestions with the user's active goals, habits, working hours, and energy patterns.`,
    version: 1,
    category: 'system',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wf_plan_day',
    name: 'Plan My Day Assistant Prompt',
    type: 'workflow',
    description: 'Prompt template for synthesizing today\'s schedule, high priority tasks, and habit targets.',
    template: `Analyze today's context:
- Tasks due today: {{tasksCount}}
- Scheduled calendar events: {{eventsCount}}
- Habits to complete: {{habitsCount}}
- Current focus time target: {{workingHours}}

Generate a prioritized timeline for today with recommended focus blocks, habit check-ins, and rest intervals.`,
    version: 1,
    category: 'productivity',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wf_finance_analysis',
    name: 'Financial Health Summarizer Prompt',
    type: 'workflow',
    description: 'Prompt template for analyzing monthly cashflow, savings goals, and upcoming bill reminders.',
    template: `Evaluate recent financial activity:
- Monthly Income: {{monthlyIncome}}
- Monthly Expenses: {{monthlyExpense}}
- Active Savings Goals: {{savingsGoalsCount}}
- Upcoming Unpaid Bills: {{billsCount}}

Provide 3 actionable tips to optimize cashflow and highlight any potential budget overruns.`,
    version: 1,
    category: 'finance',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_WORKFLOWS: AIWorkflowDefinition[] = [
  {
    id: 'plan_my_day',
    name: 'Plan My Day',
    description: 'Synthesize tasks, calendar, and habit goals into an optimized daily focus schedule.',
    icon: 'Calendar',
    category: 'productivity',
    steps: [
      { id: '1', name: 'Gather Context', toolName: 'CalendarTool' },
      { id: '2', name: 'Task Prioritization', toolName: 'TaskTool' },
      { id: '3', name: 'Habit Integration', toolName: 'HabitTool' },
      { id: '4', name: 'Generate Plan', promptTemplate: 'wf_plan_day' },
    ],
    enabled: true,
  },
  {
    id: 'review_my_week',
    name: 'Review My Week',
    description: 'Comprehensive weekly retrospective analyzing task velocity, habit streaks, and financial trends.',
    icon: 'Activity',
    category: 'productivity',
    steps: [
      { id: '1', name: 'Analyze Tasks Completed', toolName: 'TaskTool' },
      { id: '2', name: 'Calculate Habit Streaks', toolName: 'HabitTool' },
      { id: '3', name: 'Generate Summary', promptTemplate: 'wf_plan_day' },
    ],
    enabled: true,
  },
  {
    id: 'create_task',
    name: 'Smart Task Creator',
    description: 'Parse natural language user input into structured task parameters with automatic tags and priority.',
    icon: 'CheckSquare',
    category: 'productivity',
    steps: [{ id: '1', name: 'Parse and Add Task', toolName: 'TaskTool' }],
    enabled: true,
  },
  {
    id: 'summarize_journal',
    name: 'Summarize Journal & Mood',
    description: 'Extract key reflections, recurring themes, and emotional mood trends from recent journal entries.',
    icon: 'BookOpen',
    category: 'reflection',
    steps: [{ id: '1', name: 'Journal Extraction', toolName: 'JournalTool' }],
    enabled: true,
  },
  {
    id: 'analyze_spending',
    name: 'Analyze Spending & Budget',
    description: 'Audit monthly cashflow, check budget thresholds, and suggest savings opportunities.',
    icon: 'Wallet',
    category: 'finance',
    steps: [{ id: '1', name: 'Financial Audit', toolName: 'FinanceTool' }],
    enabled: true,
  },
  {
    id: 'review_habits',
    name: 'Habit Consistency Audit',
    description: 'Evaluate habit check-in frequency and highlight habits needing consistency boosts.',
    icon: 'Flame',
    category: 'wellness',
    steps: [{ id: '1', name: 'Audit Streaks', toolName: 'HabitTool' }],
    enabled: true,
  },
  {
    id: 'suggest_focus_time',
    name: 'Suggest Deep Focus Blocks',
    description: 'Identify free calendar slots and propose deep work focus sessions for high-priority tasks.',
    icon: 'Zap',
    category: 'productivity',
    steps: [{ id: '1', name: 'Scan Schedule', toolName: 'CalendarTool' }],
    enabled: true,
  },
  {
    id: 'health_summary',
    name: 'Health & Energy Insights',
    description: 'Correlate sleep, active time, and mood score with productivity output.',
    icon: 'HeartPulse',
    category: 'wellness',
    steps: [{ id: '1', name: 'Evaluate Health Indicators', toolName: 'HealthTool' }],
    enabled: true,
  },
  {
    id: 'goal_progress',
    name: 'Goal & Project Alignment',
    description: 'Check active goals and ensure daily tasks contribute to milestone completion.',
    icon: 'Target',
    category: 'productivity',
    steps: [{ id: '1', name: 'Goal Alignment Check', toolName: 'TaskTool' }],
    enabled: true,
  },
  {
    id: 'weekly_reflection',
    name: 'Weekly Reflection Guide',
    description: 'Guided end-of-week reflection prompts for personal growth and second brain notes.',
    icon: 'Compass',
    category: 'reflection',
    steps: [{ id: '1', name: 'Reflection Prompting', toolName: 'JournalTool' }],
    enabled: true,
  },
  {
    id: 'monthly_reflection',
    name: 'Monthly Life OS Review',
    description: 'High-level monthly audit across all 8 life balance sectors.',
    icon: 'Layers',
    category: 'reflection',
    steps: [{ id: '1', name: 'System Multi-Module Scan' }],
    enabled: true,
  },
  {
    id: 'year_review',
    name: 'Year Review Placeholder',
    description: 'Annual milestone achievement summary and long-term vision alignment.',
    icon: 'Sparkles',
    category: 'reflection',
    steps: [{ id: '1', name: 'Annual Recap' }],
    enabled: false,
  },
];

export const INITIAL_MEMORIES: AIMemoryItem[] = [
  {
    id: 'mem_1',
    userId: 'user_default',
    category: 'working_hours',
    key: 'Preferred Working Hours',
    value: '09:00 - 18:00 (Monday to Friday)',
    importance: 'high',
    source: 'user_explicit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_2',
    userId: 'user_default',
    category: 'workout_routine',
    key: 'Morning Exercise Routine',
    value: '30-minute cardio or strength training at 07:30 AM',
    importance: 'medium',
    source: 'user_explicit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_3',
    userId: 'user_default',
    category: 'sleep_schedule',
    key: 'Sleep Target',
    value: 'Target 7.5 - 8.0 hours sleep per night, wind down by 23:00',
    importance: 'high',
    source: 'user_explicit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_4',
    userId: 'user_default',
    category: 'favorite_theme',
    key: 'Aura UI Preference',
    value: 'Prefers high contrast dark slate theme with emerald accents',
    importance: 'low',
    source: 'auto_extracted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mem_5',
    userId: 'user_default',
    category: 'long_term_preference',
    key: 'Primary Focus Sector',
    value: 'Building full-stack software and maintaining consistent daily health habits',
    importance: 'critical',
    source: 'user_explicit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const QUICK_SUGGESTIONS = [
  "Plan my day with my current tasks and calendar events",
  "Summarize my financial health and upcoming bills",
  "What habits do I need to complete today?",
  "Analyze my productivity trends and suggest focus blocks",
  "Summarize my recent journal entries and mood trends",
  "Draft a new high-priority goal for Q3",
];
