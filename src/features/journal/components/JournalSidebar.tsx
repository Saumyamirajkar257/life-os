/**
 * @file JournalSidebar.tsx
 * @description Second Brain navigation sidebar with Smart Collections, Folders tree, and Tag filters.
 * @module Features/Journal/Components
 */

import React, { useState } from 'react';
import {
  Folder,
  FolderPlus,
  Star,
  Clock,
  Pin,
  Archive,
  Lock,
  Tag,
  Hash,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { useJournalStore } from '../stores/useJournalStore';
import { useJournal } from '../hooks/useJournal';

export const JournalSidebar: React.FC = () => {
  const {
    activeFolderId,
    setActiveFolder,
    selectedTag,
    setSelectedTag,
    smartCollection,
    setSmartCollection,
  } = useJournalUIStore();

  const { createFolder, folders, tags } = useJournalStore();
  const { folderCounts } = useJournal();

  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#8B5CF6');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim(), '', newFolderColor);
    setNewFolderName('');
    setIsNewFolderOpen(false);
  };

  const smartCollections = [
    { id: 'all', label: 'All Entries & Notes', icon: <Layers className="w-4 h-4 text-purple-400" /> },
    { id: 'favorites', label: 'Favorites', icon: <Star className="w-4 h-4 text-amber-400" /> },
    { id: 'recent', label: 'Recent Memory', icon: <Clock className="w-4 h-4 text-blue-400" /> },
    { id: 'pinned', label: 'Pinned Notes', icon: <Pin className="w-4 h-4 text-emerald-400" /> },
    { id: 'locked', label: 'Private / Locked', icon: <Lock className="w-4 h-4 text-rose-400" /> },
    { id: 'archived', label: 'Archive', icon: <Archive className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md">
      {/* Smart Collections Section */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
          Smart Views
        </span>
        {smartCollections.map((col) => (
          <button
            key={col.id}
            onClick={() => setSmartCollection(col.id)}
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
              smartCollection === col.id
                ? 'bg-purple-500/20 text-slate-100 font-bold border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            )}
          >
            <div className="flex items-center gap-2.5">
              {col.icon}
              <span>{col.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Folders Tree Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-blue-400" />
            Knowledge Folders
          </span>
          <button
            type="button"
            onClick={() => setIsNewFolderOpen(true)}
            className="text-slate-400 hover:text-purple-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Create Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal/Input to Add Folder */}
        {isNewFolderOpen && (
          <form onSubmit={handleCreateFolder} className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder Name..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                {['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewFolderColor(c)}
                    className={cn('w-4 h-4 rounded-full transition-transform', newFolderColor === c && 'scale-125 ring-2 ring-white')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-0.5 rounded bg-purple-600 hover:bg-purple-500 text-[11px] font-bold text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
          {folders.map((f) => {
            const count = folderCounts[f.id] || 0;
            const isActive = activeFolderId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
                  isActive
                    ? 'bg-slate-800 text-slate-100 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color || '#8B5CF6' }} />
                  <span className="truncate">{f.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag Index Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          Tags Index
        </span>
        <div className="flex flex-wrap gap-1.5 p-1 max-h-36 overflow-y-auto no-scrollbar">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag.name;
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(isSelected ? null : tag.name)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
                  isSelected
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-950/50 font-bold'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                )}
              >
                <Hash className="w-3 h-3" />
                <span>{tag.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
