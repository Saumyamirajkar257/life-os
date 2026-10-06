/**
 * @file defaultModules.ts
 * @description Standard module declarations for future Aura modules (Tasks, Habits, Finance, Journal, Fitness, Shopping, Learning, AI).
 * Demonstrates full SDK compliance, zero business logic, strong typing, and dynamic registration capability.
 * @module SDK/Modules/DefaultModules
 */

import React from 'react';
import { createModule } from '../registration/registerModule';
import { AuraModule } from '../interfaces/module';
import { useTaskUIStore } from '../../features/tasks/stores/useTaskUIStore';

const LazyTasksPage = React.lazy(() =>
  import('../../features/tasks/pages/TasksPage').then((m) => ({ default: m.TasksPage }))
);

const TasksPageWrapper: React.FC = (props) => (
  <React.Suspense fallback={<div className="w-full min-h-[400px] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" /></div>}>
    <LazyTasksPage {...props} />
  </React.Suspense>
);

// Generic lightweight view placeholder generator for zero business logic compliance
const createModuleView = (title: string, description: string) => {
  const Component: React.FC = () => (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold text-neutral-100">{title}</h1>
        <p className="text-sm text-neutral-400 mt-1">{description}</p>
      </div>
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            Aura SDK Plugged Module
          </span>
          <span className="text-xs text-neutral-500">v1.0.0</span>
        </div>
        <p className="text-sm text-neutral-300">
          This module is dynamically loaded and registered through the Aura Module SDK.
        </p>
      </div>
    </div>
  );
  Component.displayName = `${title.replace(/\s+/g, '')}ModuleView`;
  return Component;
};

/** Tasks Module Declaration */
export const TasksModule: AuraModule = createModule(
  'tasks',
  'Tasks & Projects',
  'productivity',
  (builder) =>
    builder
      .setDescription('Task management, project planning, and GTD execution matrix.')
      .setVersion('1.0.0')
      .setIcon('CheckSquare')
      .addSidebarItem({
        itemId: 'tasks-nav',
        label: 'Tasks',
        icon: 'CheckSquare',
        path: '/tasks',
        section: 'primary',
        order: 10,
        shortcut: '⌘1',
      })
      .addRoute({
        path: '/tasks',
        component: TasksPageWrapper,
        protected: true,
        title: 'Tasks — Aura Life OS',
      })
      .addCommand({
        commandId: 'tasks:create',
        title: 'Create New Task',
        subtitle: 'Add a new item to your master task inbox',
        category: 'Tasks',
        shortcut: '⌥N',
        action: () => useTaskUIStore.getState().openFormModal(),
      })
      .addCommand({
        commandId: 'tasks:focus',
        title: 'Launch Focus Mode',
        subtitle: 'Start Pomodoro timer for deep execution',
        category: 'Tasks',
        shortcut: '⌥F',
        action: () => useTaskUIStore.getState().openFocusModal(),
      })
      .addPermission({
        permissionId: 'tasks:write',
        name: 'Modify Tasks',
        description: 'Allows creating and editing project tasks',
        defaultGranted: true,
      })
) as AuraModule;

/** Habits Module Declaration */
export const HabitsModule: AuraModule = createModule(
  'habits',
  'Habits & Routines',
  'wellness',
  (builder) =>
    builder
      .setDescription('Daily routine tracker, habit streaks, and behavior reinforcement.')
      .setVersion('1.0.0')
      .setIcon('Flame')
      .addSidebarItem({
        itemId: 'habits-nav',
        label: 'Habits',
        icon: 'Flame',
        path: '/habits',
        section: 'primary',
        order: 20,
        shortcut: '⌘2',
      })
      .addRoute({
        path: '/habits',
        component: createModuleView('Habits & Routines', 'Track daily rituals, consistency loops, and streak records.'),
        protected: true,
        title: 'Habits — Aura Life OS',
      })
      .addCommand({
        commandId: 'habits:log',
        title: 'Log Habit Completion',
        subtitle: 'Mark today’s habits as complete',
        category: 'Habits',
        action: () => console.log('[SDK] Habits: Log action invoked'),
      })
) as AuraModule;

/** Finance Module Declaration */
export const FinanceModule: AuraModule = createModule(
  'finance',
  'Finance & Wealth',
  'finance',
  (builder) =>
    builder
      .setDescription('Expense tracking, budget allocation, asset overview, and cashflow.')
      .setVersion('1.0.0')
      .setIcon('CreditCard')
      .addSidebarItem({
        itemId: 'finance-nav',
        label: 'Finance',
        icon: 'CreditCard',
        path: '/finance',
        section: 'primary',
        order: 30,
        shortcut: '⌘3',
      })
      .addRoute({
        path: '/finance',
        component: createModuleView('Finance & Wealth', 'Monitor accounts, budgets, investments, and recurring bills.'),
        protected: true,
        title: 'Finance — Aura Life OS',
      })
      .addCommand({
        commandId: 'finance:add-transaction',
        title: 'Log Transaction',
        subtitle: 'Record an income or expense line item',
        category: 'Finance',
        action: () => console.log('[SDK] Finance: Add Transaction invoked'),
      })
) as AuraModule;

/** Journal Module Declaration */
export const JournalModule: AuraModule = createModule(
  'journal',
  'Daily Journal',
  'lifestyle',
  (builder) =>
    builder
      .setDescription('Reflective journaling, daily logs, and structured mental clarity notes.')
      .setVersion('1.0.0')
      .setIcon('BookOpen')
      .addSidebarItem({
        itemId: 'journal-nav',
        label: 'Journal',
        icon: 'BookOpen',
        path: '/journal',
        section: 'workspace',
        order: 40,
      })
      .addRoute({
        path: '/journal',
        component: createModuleView('Daily Journal', 'Write morning pages, evening reflections, and gratitude logs.'),
        protected: true,
        title: 'Journal — Aura Life OS',
      })
) as AuraModule;

/** Fitness Module Declaration */
export const FitnessModule: AuraModule = createModule(
  'fitness',
  'Fitness & Health',
  'wellness',
  (builder) =>
    builder
      .setDescription('Workout logging, physical metrics, cardio tracking, and recovery scores.')
      .setVersion('1.0.0')
      .setIcon('Activity')
      .addSidebarItem({
        itemId: 'fitness-nav',
        label: 'Fitness',
        icon: 'Activity',
        path: '/fitness',
        section: 'workspace',
        order: 50,
      })
      .addRoute({
        path: '/fitness',
        component: createModuleView('Fitness & Health', 'Track workouts, personal records, and wellness biometrics.'),
        protected: true,
        title: 'Fitness — Aura Life OS',
      })
) as AuraModule;

/** Shopping Module Declaration */
export const ShoppingModule: AuraModule = createModule(
  'shopping',
  'Shopping & Inventory',
  'utility',
  (builder) =>
    builder
      .setDescription('Pantry inventory, groceries lists, and recurring order checklists.')
      .setVersion('1.0.0')
      .setIcon('ShoppingCart')
      .addSidebarItem({
        itemId: 'shopping-nav',
        label: 'Shopping',
        icon: 'ShoppingCart',
        path: '/shopping',
        section: 'workspace',
        order: 60,
      })
      .addRoute({
        path: '/shopping',
        component: createModuleView('Shopping & Inventory', 'Manage purchase lists, household supplies, and order histories.'),
        protected: true,
        title: 'Shopping — Aura Life OS',
      })
) as AuraModule;

/** Learning Module Declaration */
export const LearningModule: AuraModule = createModule(
  'learning',
  'Learning & Knowledge',
  'productivity',
  (builder) =>
    builder
      .setDescription('Book summaries, study flashcards, course notes, and skill roadmaps.')
      .setVersion('1.0.0')
      .setIcon('GraduationCap')
      .addSidebarItem({
        itemId: 'learning-nav',
        label: 'Learning',
        icon: 'GraduationCap',
        path: '/learning',
        section: 'tools',
        order: 70,
      })
      .addRoute({
        path: '/learning',
        component: createModuleView('Learning & Knowledge', 'Organize courses, book notes, and active recall decks.'),
        protected: true,
        title: 'Learning — Aura Life OS',
      })
) as AuraModule;

/** AI Module Declaration */
export const AIModule: AuraModule = createModule(
  'ai',
  'Aura AI Assistant',
  'ai',
  (builder) =>
    builder
      .setDescription('Intelligent assistant, automated workflows, and life context synthesis.')
      .setVersion('1.0.0')
      .setIcon('Sparkles')
      .addSidebarItem({
        itemId: 'ai-nav',
        label: 'Aura AI',
        icon: 'Sparkles',
        path: '/ai',
        section: 'tools',
        order: 80,
        shortcut: '⌘K',
      })
      .addRoute({
        path: '/ai',
        component: createModuleView('Aura AI Assistant', 'Conversational AI, smart suggestions, and contextual insights.'),
        protected: true,
        title: 'AI Assistant — Aura Life OS',
      })
      .addCommand({
        commandId: 'ai:prompt',
        title: 'Ask Aura AI',
        subtitle: 'Open instant AI assistant dialog',
        category: 'AI',
        shortcut: '⌘J',
        action: () => console.log('[SDK] AI: Prompt action invoked'),
      })
) as AuraModule;

/** List of all standard future modules ready for one-line SDK auto-registration */
export const STANDARD_AURA_MODULES: AuraModule[] = [
  TasksModule,
  HabitsModule,
  FinanceModule,
  JournalModule,
  FitnessModule,
  ShoppingModule,
  LearningModule,
  AIModule,
];
