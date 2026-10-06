/**
 * @file TimelineView.tsx
 * @description Chronological timeline component rendering memory entries grouped by day, week, and month.
 * @module Features/Journal/Components
 */

import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, FileText, ChevronRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '../hooks/useJournal';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { MOOD_DEFINITIONS } from '../constants/journalConstants';
import { extractSnippet } from '../utils/journalUtils';

export const TimelineView: React.FC = () => {
  const { journals, notes } = useJournal();
  const { openEntryDetail } = useJournalUIStore();

  const [timeScale, setTimeScale] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Combine journals & notes into timeline items
  const timelineItems = [
    ...journals.map((j) => ({
      id: j.id,
      title: j.title,
      type: 'journal' as const,
      date: j.date || j.createdAt.split('T')[0],
      time: j.time || '09:00',
      snippet: j.summary || extractSnippet(j.content),
      mood: j.mood,
      category: j.category,
      raw: j,
    })),
    ...notes.map((n) => ({
      id: n.id,
      title: n.title,
      type: 'note' as const,
      date: n.createdAt.split('T')[0],
      time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      snippet: extractSnippet(n.content),
      mood: undefined,
      category: 'Quick Note',
      raw: n,
    })),
  ].sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  // Group by date
  const groupedByDate: Record<string, typeof timelineItems> = {};
  timelineItems.forEach((item) => {
    if (!groupedByDate[item.date]) {
      groupedByDate[item.date] = [];
    }
    groupedByDate[item.date].push(item);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-200">Chronological Memory Timeline</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['daily', 'weekly', 'monthly'] as const).map((scale) => (
            <button
              key={scale}
              onClick={() => setTimeScale(scale)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all',
                timeScale === scale
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {scale}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Feed */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="p-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed text-center space-y-4 max-w-2xl mx-auto my-8 w-full">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center mx-auto mb-2 text-[var(--color-text-secondary)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Timeline is empty</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">No memory entries recorded for this timeframe. Add a journal or note to see it here.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 flex flex-col gap-8 py-2">
          {Object.entries(groupedByDate).map(([dateStr, items]) => (
            <div key={dateStr} className="relative flex flex-col gap-4">
              {/* Timeline Day Dot Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-slate-950 border-2 border-purple-300" />

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-slate-500">({items.length} memories)</span>
              </div>

              {/* Items for this Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => {
                  const moodDef = item.mood ? MOOD_DEFINITIONS[item.mood] : null;
                  return (
                    <div
                      key={item.id}
                      onClick={() => openEntryDetail(item.id, item.type)}
                      className="group p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-900 transition-all cursor-pointer shadow-md flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.type === 'journal' ? (
                            <BookOpen className="w-4 h-4 text-purple-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-xs font-mono text-slate-400">{item.time}</span>
                        </div>

                        {moodDef && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                            style={{ backgroundColor: moodDef.bg, borderColor: moodDef.border, color: moodDef.color }}
                          >
                            {moodDef.emoji} {moodDef.label}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {item.snippet}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
