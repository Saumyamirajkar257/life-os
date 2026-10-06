/**
 * @file JournalCard.tsx
 * @description Card component for rendering Journal Entry items with mood badges, weather, tags, and lock status.
 * @module Features/Journal/Components
 */

import React from 'react';
import {
  Star,
  Pin,
  Lock,
  Calendar,
  Clock,
  Tag,
  MapPin,
  Paperclip,
  Share2,
  Trash2,
  MoreVertical,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { JournalEntry } from '../types/journal.types';
import { MOOD_DEFINITIONS } from '../constants/journalConstants';
import { useJournalStore } from '../stores/useJournalStore';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { extractSnippet } from '../utils/journalUtils';

interface JournalCardProps {
  journal: JournalEntry;
}

export const JournalCard: React.FC<JournalCardProps> = ({ journal }) => {
  const {
    toggleFavouriteJournal,
    togglePinJournal,
    deleteJournal,
    duplicateJournal,
  } = useJournalStore();

  const { openEntryDetail, openExportModal, promptLock, unlockedItemIds } = useJournalUIStore();

  const isLocked = journal.isLocked && !unlockedItemIds[journal.id];
  const mood = MOOD_DEFINITIONS[journal.mood] || MOOD_DEFINITIONS.focused;

  const handleClickCard = () => {
    if (isLocked) {
      promptLock(journal.id);
    } else {
      openEntryDetail(journal.id, 'journal');
    }
  };

  return (
    <div
      onClick={handleClickCard}
      className={cn(
        'group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md overflow-hidden',
        journal.isPinned && 'ring-1 ring-amber-500/30 bg-slate-900/80'
      )}
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mood Badge */}
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm"
            style={{
              backgroundColor: mood.bg,
              borderColor: mood.border,
              color: mood.color,
            }}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </span>

          {/* Energy Level Bolts */}
          <div className="flex items-center gap-0.5 text-amber-400" title={`Energy Level: ${journal.energyLevel}/5`}>
            {Array.from({ length: journal.energyLevel }).map((_, i) => (
              <Zap key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Category Pill */}
          <span className="text-[11px] font-mono font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            {journal.category}
          </span>
        </div>

        {/* Action Quick Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Lock Badge */}
          {journal.isLocked && (
            <div className="p-1 text-rose-400" title="Private & Password Protected">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Pin Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePinJournal(journal.id);
            }}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-800 transition-colors',
              journal.isPinned ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            )}
            title="Pin Journal"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavouriteJournal(journal.id);
            }}
            className={cn(
              'p-1.5 rounded-lg hover:bg-slate-800 transition-colors',
              journal.isFavourite ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-slate-200'
            )}
            title="Favorite"
          >
            <Star className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this journal entry?')) {
                deleteJournal(journal.id);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Journal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Content Snippet */}
      <div className="flex flex-col gap-2 my-1">
        <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
          {journal.title || 'Untitled Entry'}
        </h3>

        {isLocked ? (
          <div className="flex items-center justify-center p-6 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-rose-300 font-semibold gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Content Locked — Click to enter PIN</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
            {journal.summary || extractSnippet(journal.content)}
          </p>
        )}
      </div>

      {/* Footer Tags & Meta Info */}
      <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {journal.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
              #{t}
            </span>
          ))}
          {journal.tags.length > 3 && (
            <span className="text-slate-400">+{journal.tags.length - 3}</span>
          )}
        </div>

        {/* Date, Word Count & Reading Time */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{journal.date}</span>
          </div>
          <span>•</span>
          <span>{journal.wordCount}w</span>
        </div>
      </div>
    </div>
  );
};
