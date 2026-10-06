/**
 * @file AIPromptRegistryView.tsx
 * @description System Prompt Registry manager for System, Module, Workflow, Developer, and User prompt templates.
 * @module AuraAI/Components
 */

import React, { useState } from 'react';
import { Terminal, Plus, Edit2, Code2, Tag, Layers } from 'lucide-react';
import { useAIPrompts } from '../hooks/useAIPrompts';
import { AIPromptTemplate } from '../types';

export const AIPromptRegistryView: React.FC = () => {
  const { templates, updateTemplate, addTemplate } = useAIPrompts();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingPrompt, setEditingPrompt] = useState<AIPromptTemplate | null>(null);

  const filteredTemplates = templates.filter((t) => selectedType === 'all' || t.type === selectedType);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <Terminal className="w-4 h-4" /> Prompt System Registry
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Prompt Templates & Versioning</h2>
          <p className="text-xs text-slate-400">
            Manage system prompts, workflow templates, developer directives, and module-specific prompts.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'system', 'module', 'workflow', 'developer', 'user'].map((t) => (
          <button
            key={t}
            id={`prompt-filter-${t}`}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
              selectedType === t
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Prompts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Code2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{tpl.name}</h3>
                  <p className="text-[11px] text-slate-500">{tpl.description}</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
                v{tpl.version}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
              {tpl.template}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <span className="uppercase tracking-wider font-semibold text-emerald-400/80">{tpl.type}</span>
              <button
                id={`edit-prompt-btn-${tpl.id}`}
                onClick={() => setEditingPrompt(tpl)}
                className="hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Prompt Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Edit Prompt Template</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Prompt Name</label>
                <input
                  type="text"
                  value={editingPrompt.name}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Template String</label>
                <textarea
                  rows={6}
                  value={editingPrompt.template}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, template: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingPrompt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateTemplate(editingPrompt.id, {
                    name: editingPrompt.name,
                    template: editingPrompt.template,
                  });
                  setEditingPrompt(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
              >
                Save Changes (Increments Version)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
