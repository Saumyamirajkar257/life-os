/**
 * @file PlannerView.tsx
 * @description Master productivity planner unifying Tasks, Habits, Goals/Milestones, Events, and Focus Notes.
 * @module Features/Calendar/Components
 */

import React, { useMemo } from 'react';
import {
  Sparkles,
  CheckSquare,
  Flame,
  Calendar as CalendarIcon,
  Flag,
  Play,
  Square,
  FileText,
  Target,
  Clock,
  PieChart
} from 'lucide-react';
import { useCalendarUIStore } from '../stores/useCalendarUIStore';
import { usePlannerStore } from '../stores/usePlannerStore';
import { usePlanner } from '../hooks/usePlanner';

export const PlannerView: React.FC = () => {
  const { currentDate } = useCalendarUIStore();
  const { items } = usePlanner(currentDate);

  const { plannerNotes, updateDailyNote, loadPlannerNote, addFocusTime } = usePlannerStore();
  const currentNote = plannerNotes[currentDate] || { notes: '', focusScore: 85, focusMinutes: 0 };

  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  React.useEffect(() => {
    loadPlannerNote(currentDate);
  }, [currentDate, loadPlannerNote]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      const mins = Math.max(1, Math.floor(timerSeconds / 60));
      addFocusTime(currentDate, mins);
      setTimerSeconds(0);
      setIsTimerRunning(false);
    } else {
      setIsTimerRunning(true);
    }
  };

  const formatTimerTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalCompleted = items.filter((i) => i.isCompleted).length;
  const isClear = items.length === 0 && currentNote.focusMinutes === 0;

  // Compute Priorities (Top tasks/milestones)
  const priorities = useMemo(() => {
    return items.filter(i => i.type === 'task' || i.type === 'milestone').slice(0, 5);
  }, [items]);

  // Compute Scheduled (Events with explicit times)
  const scheduled = useMemo(() => {
    return items.filter(i => i.type === 'event' || (i.type === 'task' && (i.rawItem as any).dueTime))
      .sort((a, b) => {
        const timeA = a.type === 'event' ? (a.rawItem as any).startTime : (a.rawItem as any).dueTime;
        const timeB = b.type === 'event' ? (b.rawItem as any).startTime : (b.rawItem as any).dueTime;
        return (timeA || '').localeCompare(timeB || '');
      });
  }, [items]);

  if (isClear) {
    return (
      <div className="p-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center mx-auto mb-2 text-[var(--color-text-secondary)]">
          <PieChart className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">YOUR PLANNER IS CLEAR</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">Schedule tasks, events, and focus sessions to build your daily plan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" id="planner-view">
      
      {/* 1. TODAY'S PLAN KPI HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-2 block">Focus Score</span>
          <span className="text-3xl font-bold text-emerald-400">{currentNote.focusScore}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-2 block">Focus Time</span>
          <span className="text-3xl font-bold text-blue-400">
            {Math.floor((currentNote.focusMinutes || 0) / 60)}h {(currentNote.focusMinutes || 0) % 60}m
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-2 block">Completed</span>
          <span className="text-3xl font-bold text-white">{totalCompleted} <span className="text-lg text-[var(--color-text-secondary)]">/ {items.length}</span></span>
        </div>

        {/* Focus Timer */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-blue-500/30 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col relative z-10">
            <span className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider mb-2">Active Timer</span>
            <span className={`text-3xl font-bold font-mono ${isTimerRunning ? 'text-blue-400' : 'text-white'}`}>
              {formatTimerTime(timerSeconds)}
            </span>
          </div>
          <button
            onClick={toggleTimer}
            className={`p-3.5 rounded-xl transition-all shadow-lg relative z-10 ${
              isTimerRunning
                ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                : 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-blue-500/50 text-white'
            }`}
          >
            {isTimerRunning ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-2">
        
        {/* LEFT COLUMN: Priorities & Scheduled */}
        <div className="lg:col-span-1 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Top Priorities
            </h2>
            <div className="space-y-3">
              {priorities.map(p => (
                <div key={p.id} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {p.isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 opacity-60" />
                    ) : (
                      <Square className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${p.isCompleted ? 'text-[var(--color-text-secondary)] line-through' : 'text-white'}`}>
                    {p.title}
                  </span>
                </div>
              ))}
              {priorities.length === 0 && <p className="text-xs text-[var(--color-text-secondary)] italic">No priorities defined for today.</p>}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Scheduled
            </h2>
            <div className="space-y-4">
              {scheduled.map(s => {
                const time = s.type === 'event' ? (s.rawItem as any).startTime : (s.rawItem as any).dueTime;
                return (
                  <div key={s.id} className="flex items-start gap-4">
                    <span className="text-[10px] font-bold text-[var(--color-text-secondary)] w-10 text-right mt-0.5">{time}</span>
                    <span className="text-sm font-medium text-white line-clamp-1 flex-1">{s.title}</span>
                  </div>
                );
              })}
              {scheduled.length === 0 && <p className="text-xs text-[var(--color-text-secondary)] italic">Nothing scheduled.</p>}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Reflection & Notes */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]/50">
            <FileText className="w-4 h-4 text-[var(--color-accent)]" />
            <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Daily Reflection & Notes</h3>
          </div>

          <textarea
            value={currentNote.notes || ''}
            onChange={(e) => updateDailyNote(currentDate, e.target.value)}
            placeholder="Jot down key learnings, thoughts, or daily scratchpad notes..."
            className="w-full flex-1 min-h-[300px] bg-transparent border-none text-sm text-white placeholder-[var(--color-text-secondary)] focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};
