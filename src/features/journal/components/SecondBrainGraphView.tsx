/**
 * @file SecondBrainGraphView.tsx
 * @description Interactive Second Brain Knowledge Graph visualizer mapping relationships across entries, tags, and OS modules.
 * @module Features/Journal/Components
 */

import React, { useState } from 'react';
import { Network, BrainCircuit, BookOpen, FileText, Tag, Folder, Zap, Layers, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '../hooks/useJournal';
import { useJournalUIStore } from '../stores/useJournalUIStore';

export const SecondBrainGraphView: React.FC = () => {
  const { journals, notes, folders, tags } = useJournal();
  const { openEntryDetail } = useJournalUIStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Construct visual graph nodes
  const nodes = [
    ...journals.map((j) => ({
      id: j.id,
      label: j.title,
      type: 'journal' as const,
      color: '#8B5CF6',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      tagCount: j.tags.length,
      raw: j,
    })),
    ...notes.map((n) => ({
      id: n.id,
      label: n.title,
      type: 'note' as const,
      color: '#3B82F6',
      icon: <FileText className="w-3.5 h-3.5" />,
      tagCount: n.tags.length,
      raw: n,
    })),
    ...folders.map((f) => ({
      id: f.id,
      label: f.name,
      type: 'folder' as const,
      color: f.color || '#F59E0B',
      icon: <Folder className="w-3.5 h-3.5" />,
      tagCount: 0,
      raw: f,
    })),
    ...tags.map((t) => ({
      id: t.id,
      label: `#${t.name}`,
      type: 'tag' as const,
      color: '#10B981',
      icon: <Tag className="w-3.5 h-3.5" />,
      tagCount: t.usageCount || 1,
      raw: t,
    })),
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-6">
      {/* Graph Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Interactive Second Brain Graph</h3>
            <p className="text-xs text-slate-400">Visual representation of knowledge clusters, linked notes, and tags.</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Journal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Note</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Tag</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Folder</span>
          </div>
        </div>
      </div>

      {/* Graph Visualizer Canvas Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes Canvas Grid */}
        <div className="lg:col-span-2 relative min-h-[420px] p-8 rounded-3xl bg-slate-950/90 border border-slate-800/80 overflow-hidden flex flex-wrap items-center justify-center gap-4 shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-all duration-300 shadow-md backdrop-blur-md',
                  isSelected
                    ? 'scale-110 ring-2 ring-white shadow-xl z-10'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:scale-105 hover:border-slate-700'
                )}
                style={{
                  borderColor: isSelected ? node.color : undefined,
                  boxShadow: isSelected ? `0 0 20px ${node.color}40` : undefined,
                }}
              >
                <span className="p-1 rounded-lg bg-slate-950" style={{ color: node.color }}>
                  {node.icon}
                </span>
                <span className="truncate max-w-[120px]">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details Side Inspector */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Node Inspector
            </span>

            {activeNode ? (
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800" style={{ color: activeNode.color }}>
                    {activeNode.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-100">{activeNode.label}</h4>
                    <span className="text-xs font-mono capitalize text-slate-400">{activeNode.type} Node</span>
                  </div>
                </div>

                {activeNode.type === 'journal' || activeNode.type === 'note' ? (
                  <button
                    type="button"
                    onClick={() => openEntryDetail(activeNode.id, activeNode.type as any)}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md mt-2"
                  >
                    <span>Open in Editor</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <p className="text-xs text-slate-400 italic">Select a Journal or Note node to open full editor view.</p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Click any node in the graph matrix to inspect its connections and details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
