/**
 * @file PersonalDashboardView.tsx
 * @description Master personal dashboard assembling Today's Command Center for Aura Life OS 2.0.
 * @module Features/Analytics/Dashboard
 */

import React, { useMemo } from 'react';
import { useTaskStore } from '../../tasks/stores/useTaskStore';
import { useHabitStore } from '../../habits/stores/useHabitStore';
import { useCalendarStore } from '../../calendar/stores/useCalendarStore';
import { useGoalStore } from '../../goals/stores/useGoalStore';
import { useLifeScore } from '../hooks/useLifeScore';
import { useAuth } from '../../auth/hooks/useAuth';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useFinance } from '../../finance/hooks/useFinance';
import { formatCurrency } from '../../finance/utils/financeUtils';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar as CalendarIcon,
  Target,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Activity,
  Wallet,
  Flame,
} from 'lucide-react';
import { SpatialCard } from '@/components/ui/spatial/spatial-card';

export const PersonalDashboardView: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.displayName?.split(' ')[0] || 'Architect';
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const { tasks, completeTask } = useTaskStore();
  const { habits, logs, checkInHabit } = useHabitStore();
  const { events } = useCalendarStore();
  const { goals } = useGoalStore();
  const { summary } = useLifeScore();
  const setActiveSection = useSidebarStore((state) => state.setActiveSection);

  const { accounts, netWorthSummary, monthlyCashFlow } = useFinance();
  const baseCurrency = accounts.length > 0 ? accounts[0].currency : 'USD';

  // 1. Data Processing
  const todayStr = today.toISOString().split('T')[0];

  // Tasks
  const allTodayTasks = tasks.filter((t) => t.dueDate === todayStr && t.status !== 'archived');
  const completedTasks = allTodayTasks.filter((t) => t.status === 'done');
  const focusTasks = allTodayTasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1, none: 0 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    })
    .slice(0, 3);

  // Habits
  const activeHabits = habits.filter((h) => h.status === 'active');
  const todayLogs = logs.filter((l) => l.date === todayStr);
  const completedHabitsCount = activeHabits.filter((h) => {
    const log = todayLogs.find((l) => l.habitId === h.id);
    return log && log.status === 'completed';
  }).length;
  const displayHabits = activeHabits.slice(0, 4);

  // Calendar
  const todayEvents = events
    .filter((e) => e.startDate === todayStr && e.status !== 'archived' && e.status !== 'cancelled')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Focus Time
  const focusTime = allTodayTasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0);

  // Goals
  const displayGoals = goals.filter((g) => g.status === 'in_progress').slice(0, 3);

  // Dynamic Status Message
  const getDynamicStatus = () => {
    if (focusTasks.length > 0) return `${focusTasks.length} high-priority tasks requiring attention.`;
    if (allTodayTasks.length > 0 && completedTasks.length === allTodayTasks.length)
      return "All daily commitments fulfilled. Excellent cadence.";
    return "Schedule and focus priorities calibrated for today.";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 py-2">
      {/* 1. EDITORIAL HEADER & CURRENT CONTEXT */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border)]/60 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Today's Command Center</span>
            <span>·</span>
            <span>{dateString}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-[var(--color-text-primary)]">
            Good morning, <span className="font-semibold text-white">{userName}</span>.
          </h1>

          <p className="text-sm text-[var(--color-text-secondary)] font-normal max-w-xl">
            {getDynamicStatus()}
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSection('tasks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] transition-colors text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            onClick={() => setActiveSection('calendar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] transition-colors text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Event</span>
          </button>
          <button
            onClick={() => setActiveSection('habits')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] transition-colors text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Habit</span>
          </button>
          <button
            onClick={() => setActiveSection('journal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] transition-colors text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
          <button
            onClick={() => setActiveSection('ai')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold cursor-pointer ml-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aura AI</span>
          </button>
        </div>
      </header>

      {/* 2. TODAY'S SUMMARY — MINIMAL METRICS ROW (NO CARD WALL) */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
        <div className="space-y-1 border-l-2 border-[var(--color-border)] pl-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" /> Tasks Done
          </div>
          <div className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {completedTasks.length} <span className="text-sm text-[var(--color-text-muted)] font-mono">/ {allTodayTasks.length}</span>
          </div>
        </div>

        <div className="space-y-1 border-l-2 border-[var(--color-border)] pl-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-neutral-400" /> Habits
          </div>
          <div className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {completedHabitsCount} <span className="text-sm text-[var(--color-text-muted)] font-mono">/ {activeHabits.length}</span>
          </div>
        </div>

        <div className="space-y-1 border-l-2 border-[var(--color-border)] pl-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" /> Focus Time
          </div>
          <div className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {focusTime} <span className="text-xs text-[var(--color-text-muted)] font-mono">min</span>
          </div>
        </div>

        <div className="space-y-1 border-l-2 border-[var(--color-border)] pl-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-neutral-400" /> Life Score
          </div>
          <div className="text-2xl sm:text-3xl font-light text-white tracking-tight flex items-baseline gap-2">
            {summary.overallScore}
            <span className="text-xs font-mono text-emerald-400 font-normal">+{summary.netChange}</span>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 pb-12">
        {/* COLUMN 1: FOCUS & SCHEDULE (5 cols) */}
        <div className="lg:col-span-5 space-y-10">
          {/* IMPORTANT TASKS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-primary)] font-semibold">
                Focus Today
              </h2>
              <button
                onClick={() => setActiveSection('tasks')}
                className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {focusTasks.length > 0 ? (
              <div className="space-y-2">
                {focusTasks.map((task) => (
                  <SpatialCard
                    key={task.id}
                    depth={1}
                    className="p-4 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="text-neutral-500 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                        title="Mark complete"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] truncate">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {task.priority === 'urgent' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                          urgent
                        </span>
                      )}
                      {task.priority === 'high' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                          high
                        </span>
                      )}
                      {task.estimatedDuration && (
                        <span className="text-xs font-mono text-[var(--color-text-muted)]">
                          {task.estimatedDuration}m
                        </span>
                      )}
                    </div>
                  </SpatialCard>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center justify-center space-y-3">
                <p className="text-sm text-[var(--color-text-secondary)]">Your focus queue is clear.</p>
                <button
                  onClick={() => setActiveSection('tasks')}
                  className="text-xs font-medium text-[var(--color-accent)] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add your first focus task</span>
                </button>
              </div>
            )}
          </section>

          {/* SCHEDULE / TIMELINE */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Today's Schedule
              </h2>
              <button
                onClick={() => setActiveSection('calendar')}
                className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Calendar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {todayEvents.length > 0 ? (
              <div className="space-y-2">
                {todayEvents.map((event) => (
                  <SpatialCard
                    key={event.id}
                    depth={1}
                    className="p-3.5 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[var(--color-text-muted)] w-14 shrink-0">
                        {event.startTime}
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">{event.title}</span>
                    </div>
                    {event.location && (
                      <span className="text-[var(--color-text-muted)] text-[11px] truncate">
                        {event.location}
                      </span>
                    )}
                  </SpatialCard>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center justify-center space-y-3">
                <p className="text-sm text-[var(--color-text-secondary)]">Your calendar is open.</p>
                <button
                  onClick={() => setActiveSection('calendar')}
                  className="text-xs font-medium text-[var(--color-accent)] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add an event</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* COLUMN 2: AURA & FINANCE (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          {/* AURA RECOMMENDATION */}
          <section>
            <SpatialCard depth={2} className="p-6 space-y-4 relative overflow-hidden bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-sunken)]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Aura Intelligence</span>
              </div>

              <p className="text-sm text-[var(--color-text-primary)] leading-relaxed font-normal">
                {focusTasks.length > 0
                  ? `You have ${focusTasks.length} priority items due today. Suggest completing "${focusTasks[0].title}" first during your peak focus window.`
                  : 'Your schedule is clear. Ideal moment for deep work on quarterly milestones or a mindfulness check-in.'}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setActiveSection('ai')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Consult Aura Assistant</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </SpatialCard>
          </section>

          {/* FINANCE SNAPSHOT */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Finance Snapshot
              </h2>
              <button
                onClick={() => setActiveSection('finance')}
                className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {accounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <SpatialCard depth={1} className="p-4 space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                    Total Net Worth
                  </div>
                  <div className="text-xl font-light text-white">
                    {formatCurrency(netWorthSummary.totalNetWorth, baseCurrency)}
                  </div>
                </SpatialCard>

                <SpatialCard depth={1} className="p-4 space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                    Monthly Cash Flow
                  </div>
                  <div className="text-xl font-light text-emerald-400">
                    {formatCurrency(monthlyCashFlow.netSavings, baseCurrency)}
                  </div>
                </SpatialCard>
              </div>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center justify-center space-y-3">
                <p className="text-sm text-[var(--color-text-secondary)]">Start your clean personal ledger.</p>
                <button
                  onClick={() => setActiveSection('finance')}
                  className="text-xs font-medium text-[var(--color-accent)] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Link an account</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* COLUMN 3: HABITS & GOALS (3 cols) */}
        <div className="lg:col-span-3 space-y-10">
          {/* HABIT PROGRESS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Habit Cadence
              </h2>
              <button
                onClick={() => setActiveSection('habits')}
                className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Habits</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {displayHabits.length > 0 ? (
              <div className="space-y-2">
                {displayHabits.map((habit) => {
                  const log = todayLogs.find((l) => l.habitId === habit.id);
                  const isCompleted = log?.status === 'completed';

                  return (
                    <SpatialCard
                      key={habit.id}
                      depth={1}
                      onClick={() => !isCompleted && checkInHabit(habit.id, todayStr)}
                      className="p-3 hover:border-neutral-700 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm shrink-0">{habit.emoji || '✨'}</span>
                        <span className="text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] truncate">
                          {habit.name}
                        </span>
                      </div>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 shrink-0" />
                      )}
                    </SpatialCard>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center justify-center space-y-3">
                <p className="text-sm text-[var(--color-text-secondary)] text-center">Build your first routine.</p>
                <button
                  onClick={() => setActiveSection('habits')}
                  className="text-xs font-medium text-[var(--color-accent)] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a habit</span>
                </button>
              </div>
            )}
          </section>

          {/* GOALS PROGRESS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)]">
                Active Goals
              </h2>
              <button
                onClick={() => setActiveSection('goals')}
                className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Goals</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {displayGoals.length > 0 ? (
              <div className="space-y-3">
                {displayGoals.map((goal) => (
                  <SpatialCard key={goal.id} depth={1} className="p-4 space-y-2" interactive={false}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-primary)] truncate pr-2">{goal.title}</span>
                      <span className="font-mono text-[var(--color-text-muted)] shrink-0">{goal.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </SpatialCard>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 flex flex-col items-center justify-center space-y-3">
                <p className="text-sm text-[var(--color-text-secondary)] text-center">Define what you're working toward.</p>
                <button
                  onClick={() => setActiveSection('goals')}
                  className="text-xs font-medium text-[var(--color-accent)] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create a goal</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboardView;
