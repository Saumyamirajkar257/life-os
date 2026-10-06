/**
 * @file JournalDetailModal.tsx
 * @description Inline Editor Pane for Journal entries and Notes (repurposed from Modal).
 * @module Features/Journal/Components
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Lock,
  Tag,
  Folder,
  Calendar,
  Share2,
  Zap,
  CheckSquare,
  Flame,
  Target,
  Download,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { useJournalStore } from '../stores/useJournalStore';
import { useJournalEditorState } from '../stores/useJournalEditorState';
import { useJournalAutosave } from '../hooks/useJournalAutosave';
import { TipTapEditor } from '../editor/TipTapEditor';
import { MOOD_DEFINITIONS, JOURNAL_CATEGORIES } from '../constants/journalConstants';
import { MoodType, EnergyLevel, JournalEntry } from '../types/journal.types';

export const JournalDetailModal: React.FC = () => {
  const { selectedEntryId, selectedEntryType, closeEntryDetail, openExportModal } = useJournalUIStore();
  const { journals, notes, folders, updateJournal, updateNote, deleteJournal, deleteNote } = useJournalStore();
  const { initializeEditor } = useJournalEditorState();

  // Enable autosave
  useJournalAutosave(1500);

  const activeItem = selectedEntryType === 'journal'
    ? journals.find((j) => j.id === selectedEntryId)
    : notes.find((n) => n.id === selectedEntryId);

  const [title, setTitle] = useState('');
  const [mood, setMood] = useState<MoodType>('focused');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(4);
  const [category, setCategory] = useState('Personal');
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [itemTags, setItemTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  
  const [isMetadataOpen, setIsMetadataOpen] = useState(true);

  useEffect(() => {
    if (activeItem) {
      setTitle(activeItem.title || '');
      setItemTags(activeItem.tags || []);
      setFolderId(activeItem.folderId);
      setIsLocked(activeItem.isLocked || false);

      if ('mood' in activeItem) {
        const j = activeItem as JournalEntry;
        setMood(j.mood || 'focused');
        setEnergyLevel(j.energyLevel || 4);
        setCategory(j.category || 'Personal');
      }

      initializeEditor(activeItem.id, selectedEntryType || 'journal', activeItem.content || '', activeItem.contentJson);
    }
  }, [activeItem, selectedEntryId, selectedEntryType, initializeEditor]);

  if (!activeItem) return null;

  const handleSaveTitle = (newTitle: string) => {
    setTitle(newTitle);
    if (selectedEntryType === 'journal') updateJournal(activeItem.id, { title: newTitle });
    else updateNote(activeItem.id, { title: newTitle });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (!itemTags.includes(newTag)) {
        const updated = [...itemTags, newTag];
        setItemTags(updated);
        if (selectedEntryType === 'journal') updateJournal(activeItem.id, { tags: updated });
        else updateNote(activeItem.id, { tags: updated });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = itemTags.filter((t) => t !== tagToRemove);
    setItemTags(updated);
    if (selectedEntryType === 'journal') updateJournal(activeItem.id, { tags: updated });
    else updateNote(activeItem.id, { tags: updated });
  };

  const handleDeleteCurrent = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      if (selectedEntryType === 'journal') deleteJournal(activeItem.id);
      else deleteNote(activeItem.id);
      closeEntryDetail();
    }
  };

  return (
    <div className="flex w-full h-full bg-[var(--color-bg)] overflow-hidden relative">
      {/* Center Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Back Button & Desktop Top Bar */}
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={closeEntryDetail}
              className="lg:hidden p-2 -ml-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => handleSaveTitle(e.target.value)}
              placeholder="Note Title"
              className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] mr-4 hidden sm:block">
              Saving...
            </span>
            <button onClick={() => setIsMetadataOpen(!isMetadataOpen)} className="lg:hidden px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)]">
              Details
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 no-scrollbar relative">
          <div className="max-w-3xl mx-auto">
            <TipTapEditor
              initialContent={activeItem.content || ''}
              onChange={(html) => {
                if (selectedEntryType === 'journal') updateJournal(activeItem.id, { content: html });
                else updateNote(activeItem.id, { content: html });
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Metadata Pane */}
      <div className={`w-72 bg-[var(--color-surface)] border-l border-[var(--color-border)] h-full overflow-y-auto flex-col absolute right-0 top-0 bottom-0 z-30 lg:relative lg:translate-x-0 transition-transform duration-300 ${isMetadataOpen ? 'translate-x-0 flex' : 'translate-x-full lg:hidden hidden'}`}>
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-white">Details</span>
          <button onClick={() => setIsMetadataOpen(false)} className="p-1 text-[var(--color-text-secondary)]"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Base Details */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Metadata</h4>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Updated</span>
                <span className="font-medium text-white">{new Date(activeItem.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> Privacy</span>
                <span className="font-medium text-white">{isLocked ? 'Private 🔒' : 'Standard'}</span>
              </div>
            </div>
          </div>

          {/* Folders */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2"><Folder className="w-3.5 h-3.5" /> Folder</h4>
            <select
              value={folderId || ''}
              onChange={(e) => {
                const val = e.target.value || undefined;
                setFolderId(val);
                if (selectedEntryType === 'journal') updateJournal(activeItem.id, { folderId: val });
                else updateNote(activeItem.id, { folderId: val });
              }}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[var(--color-accent)] w-full"
            >
              <option value="">No Folder (Unorganized)</option>
              {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Tags</h4>
            <div className="flex flex-wrap items-center gap-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2 w-full">
              {itemTags.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-[10px] font-bold">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-white ml-1">×</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent text-xs text-white placeholder-[var(--color-text-secondary)] focus:outline-none flex-1 min-w-[80px]"
              />
            </div>
          </div>

          {/* Journal Specific */}
          {selectedEntryType === 'journal' && (
            <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Journal Reflection</h4>
              
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {(Object.keys(MOOD_DEFINITIONS) as MoodType[]).map((m) => {
                  const def = MOOD_DEFINITIONS[m];
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMood(m); updateJournal(activeItem.id, { mood: m }); }}
                      className={`p-2 rounded-xl text-lg transition-transform ${mood === m ? 'bg-[var(--color-surface-elevated)] ring-1 ring-[var(--color-border)] scale-110' : 'hover:bg-[var(--color-surface-elevated)] opacity-60 hover:opacity-100'}`}
                      title={def.label}
                    >{def.emoji}</button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2 bg-[var(--color-bg)] rounded-lg p-1 border border-[var(--color-border)]">
                {([1, 2, 3, 4, 5] as EnergyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => { setEnergyLevel(lvl); updateJournal(activeItem.id, { energyLevel: lvl }); }}
                    className={`p-1.5 rounded-md transition-colors flex-1 flex justify-center ${energyLevel >= lvl ? 'bg-amber-500/20 text-amber-400' : 'text-[var(--color-text-secondary)]'}`}
                  ><Zap className="w-3.5 h-3.5 fill-current" /></button>
                ))}
              </div>
            </div>
          )}

          {/* Connections */}
          <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2"><Share2 className="w-3.5 h-3.5" /> Connections</h4>
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)] font-medium">
                <CheckSquare className="w-3.5 h-3.5 text-blue-400" /> Linked to Task Engine
              </div>
              <div className="px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)] font-medium">
                <Flame className="w-3.5 h-3.5 text-emerald-400" /> Linked to Habits OS
              </div>
              <div className="px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)] font-medium">
                <Target className="w-3.5 h-3.5 text-purple-400" /> Linked to Goals OS
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-[var(--color-border)] pt-5 flex items-center justify-between">
            <button onClick={openExportModal} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-elevated)] transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={handleDeleteCurrent} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
