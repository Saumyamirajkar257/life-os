/**
 * @file AIProviderSettings.tsx
 * @description Provider & Model Configuration Panel supporting Gemini, OpenAI, Anthropic, Ollama, LM Studio, and OpenRouter.
 * @module AuraAI/Components
 */

import React from 'react';
import { Cpu, Check, Sliders, ShieldCheck, Server } from 'lucide-react';
import { useAIProvider } from '../hooks/useAIProvider';
import { AIProviderId } from '../types';

export const AIProviderSettings: React.FC = () => {
  const { providers, activeProvider, activeModel, preferences, setActiveProvider, setActiveModel, updateProviderConfig, updatePreferences } =
    useAIProvider();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
          <Cpu className="w-4 h-4" /> Provider Abstraction Layer
        </div>
        <h2 className="text-2xl font-bold text-slate-100">AI Model Providers & Settings</h2>
        <p className="text-xs text-slate-400">
          Seamlessly switch between Google Gemini, OpenAI, Anthropic, Ollama local models, LM Studio, and OpenRouter.
        </p>
      </div>

      {/* Active Provider Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => {
          const isSelected = p.id === activeProvider.id;

          return (
            <div
              key={p.id}
              onClick={() => setActiveProvider(p.id)}
              className={`p-5 rounded-2xl transition-all cursor-pointer border space-y-3 ${
                isSelected
                  ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/50'
                  : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-[var(--color-background)] text-[var(--color-text-secondary)]'}`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{p.name}</h3>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Available Models:</span>
                  <span className="text-slate-200 font-medium">{p.availableModels.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Model:</span>
                  <span className="text-emerald-400 font-medium truncate max-w-[140px]">{p.activeModelId}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-tertiary)] flex items-center justify-between">
                <span>Status: {p.enabled ? 'Active' : 'Disabled'}</span>
                {p.baseUrl && <span className="font-mono text-slate-400">{p.baseUrl}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Selector & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Selection */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" /> Model Selection for {activeProvider.name}
          </h3>

          <div className="space-y-3">
            {activeProvider.availableModels.map((m) => {
              const isCurrent = m.id === activeModel.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setActiveModel(m.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    isCurrent
                      ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40 text-[var(--color-accent-light)]'
                      : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{(m.contextWindow / 1000).toFixed(0)}k Context</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temperature & Preference Parameters */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Synthesis Parameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span>Temperature (Creativity):</span>
                <span className="font-mono font-semibold text-emerald-400">{preferences.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.temperature}
                onChange={(e) => updatePreferences({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Auto-Include System Context Snapshot</span>
                <input
                  type="checkbox"
                  checked={preferences.autoContextEnabled}
                  onChange={(e) => updatePreferences({ autoContextEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Multi-Step Thought & Reasoning Loop</span>
                <input
                  type="checkbox"
                  checked={preferences.thinkingEnabled}
                  onChange={(e) => updatePreferences({ thinkingEnabled: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
