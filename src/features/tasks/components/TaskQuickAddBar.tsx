/**
 * @file TaskQuickAddBar.tsx
 * @description Linear-inspired natural language quick task capture bar.
 * Parses priority (!urgent, !high), category (#work, #personal), and due dates on the fly.
 * @module Features/Tasks/Components/TaskQuickAddBar
 */

import React, { useState, useRef, useMemo } from 'react';
import { Plus, Sparkles, CornerDownLeft, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { TaskPriority } from '../types/task.types';
import { TASK_CATEGORIES, PRIORITY_CONFIG } from '../constants/taskConstants';

export const TaskQuickAddBar: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { createTask } = useTaskMutations();

  // Natural Language Syntax Parser
  const parsed = useMemo(() => {
    let cleanTitle = inputVal;
    let priority: TaskPriority = 'none';
    let category = 'Inbox';
    let dueDate: string | null = null;

    // 1. Priority Parser (!urgent, !high, !medium, !low)
    const priorityMatch = cleanTitle.match(/!(urgent|high|medium|low|none)/i);
    if (priorityMatch) {
      priority = priorityMatch[1].toLowerCase() as TaskPriority;
      cleanTitle = cleanTitle.replace(priorityMatch[0], '');
    }

    // 2. Category Parser (#work, #personal, #fitness, #finance)
    const categoryMatch = cleanTitle.match(/#([a-zA-Z&]+)/i);
    if (categoryMatch) {
      const matchedTag = categoryMatch[1].toLowerCase();
      const matchedCategory = TASK_CATEGORIES.find(
        (c) => c.toLowerCase().includes(matchedTag) || matchedTag.includes(c.toLowerCase().split(' ')[0])
      );
      if (matchedCategory) {
        category = matchedCategory;
      }
      cleanTitle = cleanTitle.replace(categoryMatch[0], '');
    }

    // 3. Date Parser (today, tomorrow, or @YYYY-MM-DD)
    const today = new Date();
    if (/\btoday\b/i.test(cleanTitle)) {
      dueDate = today.toISOString().split('T')[0];
      cleanTitle = cleanTitle.replace(/\btoday\b/i, '');
    } else if (/\btomorrow\b/i.test(cleanTitle)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString().split('T')[0];
      cleanTitle = cleanTitle.replace(/\btomorrow\b/i, '');
    } else {
      const explicitDateMatch = cleanTitle.match(/@(\d{4}-\d{2}-\d{2})/);
      if (explicitDateMatch) {
        dueDate = explicitDateMatch[1];
        cleanTitle = cleanTitle.replace(explicitDateMatch[0], '');
      }
    }

    cleanTitle = cleanTitle.trim().replace(/\s+/g, ' ');

    return {
      title: cleanTitle,
      priority,
      category,
      dueDate,
    };
  }, [inputVal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed.title.trim()) return;

    createTask({
      title: parsed.title.trim(),
      priority: parsed.priority,
      category: parsed.category,
      dueDate: parsed.dueDate,
      status: 'inbox',
      estimatedDuration: 30,
      tags: parsed.category !== 'Inbox' ? [parsed.category] : [],
      isPinned: false,
      isFavourite: false,
      recurrence: 'none',
      progress: 0,
      labels: [],
      attachments: [],
      subtasks: [],
    });

    setInputVal('');
  };

  const hasModifiers = parsed.priority !== 'none' || parsed.category !== 'Inbox' || parsed.dueDate;

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full mb-6 rounded-2xl transition-all duration-200 border ${
        isFocused
          ? 'bg-[var(--color-surface-elevated)] border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 shadow-lg'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
      }`}
      id="task-quick-add-bar"
    >
      <div className="flex items-center px-4 py-3 gap-3">
        <div className="shrink-0 text-[var(--color-text-muted)]">
          <Plus className={`w-5 h-5 transition-transform duration-200 ${isFocused ? 'rotate-90 text-[var(--color-accent)]' : ''}`} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Capture a task... (e.g., 'Review sprint goals tomorrow !high #work')"
          className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] font-medium"
          id="task-quick-add-input"
        />

        {/* Live Detected Modifiers Badges */}
        {hasModifiers && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {parsed.priority !== 'none' && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${PRIORITY_CONFIG[parsed.priority].bg} ${PRIORITY_CONFIG[parsed.priority].color} border ${PRIORITY_CONFIG[parsed.priority].border}`}>
                {parsed.priority}
              </span>
            )}
            {parsed.dueDate && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Calendar className="w-3 h-3" /> {parsed.dueDate}
              </span>
            )}
            {parsed.category !== 'Inbox' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Tag className="w-3 h-3" /> {parsed.category}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!parsed.title.trim()}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
            parsed.title.trim()
              ? 'bg-[var(--color-accent)] text-white hover:opacity-90 shadow-sm cursor-pointer'
              : 'bg-white/[0.04] text-[var(--color-text-muted)] border border-white/[0.05] cursor-not-allowed opacity-50'
          }`}
          id="task-quick-add-submit"
        >
          <span>Add</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Keyboard Hint Ribbon when focused */}
      {isFocused && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)]/60 text-[11px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface)]/50 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <span><strong className="text-[var(--color-text-secondary)]">!priority</strong> (!urgent, !high)</span>
            <span><strong className="text-[var(--color-text-secondary)]">#category</strong> (#work, #fitness)</span>
            <span><strong className="text-[var(--color-text-secondary)]">today / tomorrow</strong> (@YYYY-MM-DD)</span>
          </div>
          <span className="text-[10px] text-[var(--color-text-muted)]">↵ Enter to create</span>
        </div>
      )}
    </form>
  );
};
