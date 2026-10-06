/**
 * @file AIWorkflowManager.tsx
 * @description Workflow Runner & Automation Interface for running Plan My Day, Review My Week, Summarize Journal, and Financial Audits.
 * @module AuraAI/Components
 */

import React, { useState } from 'react';
import { Workflow, Play, CheckCircle2, RefreshCw, Calendar, Activity, CheckSquare, BookOpen, Wallet, Flame, Zap, HeartPulse, Target, Compass, Layers, Sparkles } from 'lucide-react';
import { useAIWorkflows } from '../hooks/useAIWorkflows';
import { WorkflowId } from '../types';

export const AIWorkflowManager: React.FC = () => {
  const { workflows, activeRunningWorkflowId, lastRunResult, runWorkflow, toggleWorkflow, clearLastResult } =
    useAIWorkflows();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customNote, setCustomNote] = useState<string>('');

  const iconsMap: Record<string, React.ReactNode> = {
    Calendar: <Calendar className="w-4 h-4 text-emerald-400" />,
    Activity: <Activity className="w-4 h-4 text-blue-400" />,
    CheckSquare: <CheckSquare className="w-4 h-4 text-amber-400" />,
    BookOpen: <BookOpen className="w-4 h-4 text-violet-400" />,
    Wallet: <Wallet className="w-4 h-4 text-emerald-400" />,
    Flame: <Flame className="w-4 h-4 text-rose-400" />,
    Zap: <Zap className="w-4 h-4 text-yellow-400" />,
    HeartPulse: <HeartPulse className="w-4 h-4 text-rose-400" />,
    Target: <Target className="w-4 h-4 text-indigo-400" />,
    Compass: <Compass className="w-4 h-4 text-indigo-400" />,
    Layers: <Layers className="w-4 h-4 text-cyan-400" />,
    Sparkles: <Sparkles className="w-4 h-4 text-amber-400" />,
  };

  const filteredWorkflows = workflows.filter((w) => selectedCategory === 'all' || w.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <Workflow className="w-4 h-4" /> Workflow Engine
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Automated Life OS Workflows</h2>
          <p className="text-xs text-slate-400">
            Execute multi-step synthesis workflows connecting tasks, habits, goals, calendar, journal, health, and finances.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'productivity', 'wellness', 'finance', 'reflection'].map((cat) => (
          <button
            key={cat}
            id={`wf-cat-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workflow Result Banner */}
      {lastRunResult && (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 relative shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {lastRunResult.title} Execution Output
            </h3>
            <button
              id="clear-wf-result-btn"
              onClick={clearLastResult}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
            {lastRunResult.markdown}
          </div>
        </div>
      )}

      {/* Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkflows.map((wf) => {
          const isRunning = activeRunningWorkflowId === wf.id;

          return (
            <div
              key={wf.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    {iconsMap[wf.icon] || <Workflow className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    {wf.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{wf.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{wf.description}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-500">
                  Steps: <span className="text-slate-300">{wf.steps.map((s) => s.name).join(' → ')}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    id={`toggle-wf-btn-${wf.id}`}
                    onClick={() => toggleWorkflow(wf.id as WorkflowId)}
                    className={`text-xs font-medium cursor-pointer ${wf.enabled ? 'text-emerald-400' : 'text-slate-500'}`}
                  >
                    {wf.enabled ? 'Enabled' : 'Disabled'}
                  </button>

                  <button
                    id={`run-wf-btn-${wf.id}`}
                    onClick={() => runWorkflow(wf.id as WorkflowId, customNote)}
                    disabled={!wf.enabled || isRunning}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/30"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" /> Run Workflow
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
