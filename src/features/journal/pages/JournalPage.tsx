/**
 * @file JournalPage.tsx
 * @description Primary Page component for Milestone 16 — Journal, Notes & Second Brain (3-pane layout).
 * @module Features/Journal/Pages
 */

import React, { useEffect, useState } from 'react';
import { BookOpen, FileText, Plus, BrainCircuit, Search, Menu } from 'lucide-react';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { useJournalStore } from '../stores/useJournalStore';
import { useJournal } from '../hooks/useJournal';

import { JournalHeader } from '../components/JournalHeader';
import { JournalSidebar } from '../components/JournalSidebar';
import { JournalCard } from '../components/JournalCard';
import { NoteCard } from '../components/NoteCard';
import { TimelineView } from '../components/TimelineView';
import { SecondBrainGraphView } from '../components/SecondBrainGraphView';
import { AnalyticsView } from '../components/AnalyticsView';

// We will repurpose JournalDetailModal to be the Editor Pane
import { JournalDetailModal as JournalEditorPane } from '../components/JournalDetailModal';
import { VoiceNoteRecorderModal } from '../components/VoiceNoteRecorderModal';
import { LockPromptModal } from '../components/LockPromptModal';
import { ExportModal } from '../components/ExportModal';

export const JournalPage: React.FC = () => {
  const { viewMode, selectedEntryId, openEntryDetail } = useJournalUIStore();
  const { loadModuleData, createJournal, createNote } = useJournalStore();
  const { journals, notes, isLoading } = useJournal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadModuleData('default_user');
  }, [loadModuleData]);

  const renderNoteList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-16 text-[var(--color-text-secondary)] gap-4 h-full">
          <BrainCircuit className="w-8 h-8 text-purple-400 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider">Syncing Second Brain...</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'journal':
        return journals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Start Writing</h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Capture an idea, reflection, plan, or anything worth remembering.
              </p>
            </div>
            <button
              onClick={() => {
                const newJ = createJournal({ title: '' });
                openEntryDetail(newJ.id, 'journal');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-accent)] text-white text-xs font-bold transition-colors border border-[var(--color-border)]"
            >
              <Plus className="w-4 h-4" />
              <span>Start Journal Entry</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto p-4 max-h-full no-scrollbar">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{journals.length} Entries</span>
            </div>
            {journals.map((j) => (
              <JournalCard key={j.id} journal={j} />
            ))}
          </div>
        );

      case 'notes':
      case 'second-brain':
        const allItems = viewMode === 'second-brain' ? [...journals, ...notes] : notes;
        
        return allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-8">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
              <FileText className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Start Writing</h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Capture an idea, reflection, plan, or anything worth remembering.
              </p>
            </div>
            <button
              onClick={() => {
                const newN = createNote({ title: '' });
                openEntryDetail(newN.id, 'note');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-xs font-bold transition-colors border border-[var(--color-border)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Note</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto p-4 max-h-full no-scrollbar">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{allItems.length} Notes</span>
            </div>
            {allItems.map((item) => (
              'mood' in item 
                ? <JournalCard key={item.id} journal={item as any} /> 
                : <NoteCard key={item.id} note={item as any} />
            ))}
          </div>
        );

      case 'graph':
        return <SecondBrainGraphView />;
      case 'timeline':
        return <TimelineView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* Top Header - Kept minimal */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--color-border)] shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 -ml-2 text-[var(--color-text-secondary)]">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">JOURNAL</h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)]">My personal thinking space</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const newN = createNote({ title: '' });
              openEntryDetail(newN.id, 'note');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">New Note</span>
          </button>
        </div>
      </div>

      {/* 3-Pane Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT PANE: Library / Navigation */}
        <div className={`absolute inset-y-0 left-0 z-20 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform lg:relative lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <JournalSidebar />
        </div>

        {/* CENTER PANE: Note List */}
        <div className={`flex-1 lg:max-w-md lg:border-r border-[var(--color-border)] bg-[var(--color-bg)] transition-all flex flex-col ${selectedEntryId ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 pb-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input 
                type="text" 
                placeholder="Search notes..." 
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
          </div>
          {renderNoteList()}
        </div>

        {/* RIGHT PANE: Editor & Details (Combines Editor and Details conditionally) */}
        <div className={`flex-1 bg-[var(--color-bg)] transition-all h-full ${selectedEntryId ? 'flex' : 'hidden lg:flex lg:items-center lg:justify-center'}`}>
          {selectedEntryId ? (
            <JournalEditorPane />
          ) : (
            <div className="text-center p-8 text-[var(--color-text-secondary)]">
              <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-wider">Select a note to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Global Overlays */}
      <VoiceNoteRecorderModal />
      <LockPromptModal />
      <ExportModal />
    </div>
  );
};
