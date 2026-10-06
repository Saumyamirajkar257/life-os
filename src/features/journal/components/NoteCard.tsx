/**
 * @file NoteCard.tsx
 * @description Card component for rendering Quick Notes, Code Snippets, Checklists, and Voice Notes.
 * @module Features/Journal/Components
 */

import React from 'react';
import {
  FileText,
  Star,
  Pin,
  Lock,
  Mic,
  Code,
  CheckSquare,
  Play,
  Trash2,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { NoteItem } from '../types/journal.types';
import { useJournalStore } from '../stores/useJournalStore';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { extractSnippet } from '../utils/journalUtils';

interface NoteCardProps {
  note: NoteItem;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { toggleFavouriteNote, togglePinNote, deleteNote } = useJournalStore();
  const { openEntryDetail, promptLock, unlockedItemIds } = useJournalUIStore();

  const isLocked = note.isLocked && !unlockedItemIds[note.id];

  const getTypeIcon = () => {
    switch (note.type) {
      case 'voice':
        return <Mic className="w-4 h-4 text-purple-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'checklist':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleClickCard = () => {
    if (isLocked) {
      promptLock(note.id);
    } else {
      openEntryDetail(note.id, 'note');
    }
  };

  return (
    <div
      onClick={handleClickCard}
      className={cn(
        'group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md overflow-hidden',
        note.isPinned && 'ring-1 ring-amber-500/30'
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            {getTypeIcon()}
          </div>
          <span className="text-xs font-bold capitalize text-slate-300">{note.type} Note</span>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {note.isLocked && <Lock className="w-3.5 h-3.5 text-rose-400" />}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePinNote(note.id);
            }}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-800 transition-colors',
              note.isPinned ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavouriteNote(note.id);
            }}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-800 transition-colors',
              note.isFavourite ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Star className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete note?')) {
                deleteNote(note.id);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex flex-col gap-2 my-1">
        <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
          {note.title || 'Untitled Note'}
        </h3>

        {isLocked ? (
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-rose-300 font-semibold text-center">
            Private Note — Click to Unlock
          </div>
        ) : note.type === 'voice' ? (
          <div className="flex flex-col gap-2 p-3 bg-purple-950/30 border border-purple-900/40 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Playing voice note simulation...');
                }}
                className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
              </button>
              <div className="flex-1 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-purple-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-purple-300">
                {note.audioDurationSeconds || 30}s
              </span>
            </div>
            {note.audioTranscript && (
              <p className="text-[11px] text-slate-300 italic line-clamp-2">
                "{note.audioTranscript}"
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {extractSnippet(note.content)}
          </p>
        )}
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1">
          {note.tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
              #{t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
