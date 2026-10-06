/**
 * @file JournalHeader.tsx
 * @description Toolbar header component with View Mode switcher, Search input, Voice note recorder, and New Entry buttons.
 * @module Features/Journal/Components
 */

import React from 'react';
import {
  BookOpen,
  FileText,
  BrainCircuit,
  Calendar,
  BarChart2,
  Network,
  Plus,
  Search,
  Mic,
  Filter,
  X,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { useJournalStore } from '../stores/useJournalStore';
import { ViewMode } from '../types/journal.types';

export const JournalHeader: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    searchFilters,
    setSearchQuery,
    resetFilters,
    openVoiceRecorder,
    openEntryDetail,
  } = useJournalUIStore();

  const { createJournal, createNote } = useJournalStore();

  const handleCreateNewJournal = () => {
    const newEntry = createJournal({
      title: 'Untitled Journal Entry',
      content: '<p>Start typing your reflection...</p>',
    });
    openEntryDetail(newEntry.id, 'journal');
  };

  const handleCreateNewNote = () => {
    const newNote = createNote({
      title: 'New Quick Note',
      content: '<p>Quick thoughts or checklists...</p>',
    });
    openEntryDetail(newNote.id, 'note');
  };

  const viewModes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'second-brain', label: 'Second Brain', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'graph', label: 'Knowledge Graph', icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Module Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">Journal & Second Brain OS</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                M16
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent knowledge graph, daily journals, rich notes, and personal memory system.</p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={openVoiceRecorder}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700/60 text-xs font-semibold transition-all shadow-sm"
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">Voice Note</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNewNote}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            <span>New Note</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNewJournal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950/50"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal</span>
          </button>
        </div>
      </div>

      {/* Navigation & Search Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
                viewMode === mode.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              )}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilters.query}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Full text search entries, tags, notes..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition-all"
            />
            {searchFilters.query && (
              <button
                onClick={resetFilters}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
