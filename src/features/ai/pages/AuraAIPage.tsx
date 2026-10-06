/**
 * @file AuraAIPage.tsx
 * @description Master container page for Milestone 19 — Aura Intelligence (AI Operating System).
 * @module AuraAI/Pages
 */

import React, { useState } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { AuraAIChat } from '../components/AuraAIChat';
import { AIProviderSettings } from '../components/AIProviderSettings';
import { AIMemoryManager } from '../components/AIMemoryManager';

interface AuraAIPageProps {
  onNavigateToSection?: (section: string) => void;
}

export const AuraAIPage: React.FC<AuraAIPageProps> = ({ onNavigateToSection }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'provider' | 'memory'>('provider');

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      {/* Ambient Breathing Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[80%] h-[80%] bg-[var(--color-accent)]/20 blur-[120px] rounded-full animate-pulse duration-1000" style={{ animationDuration: '4s' }} />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AURA
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your personal intelligence layer.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-white'}`}
            title="AI Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSettings ? (
        <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center gap-4 p-4 border-b border-[var(--color-border)]">
            <button
              onClick={() => setSettingsTab('provider')}
              className={`text-sm font-bold pb-2 border-b-2 transition-colors ${settingsTab === 'provider' ? 'border-[var(--color-accent)] text-white' : 'border-transparent text-[var(--color-text-secondary)] hover:text-white'}`}
            >
              AI Provider
            </button>
            <button
              onClick={() => setSettingsTab('memory')}
              className={`text-sm font-bold pb-2 border-b-2 transition-colors ${settingsTab === 'memory' ? 'border-[var(--color-accent)] text-white' : 'border-transparent text-[var(--color-text-secondary)] hover:text-white'}`}
            >
              Aura Memory
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {settingsTab === 'provider' && <AIProviderSettings />}
            {settingsTab === 'memory' && <AIMemoryManager />}
          </div>
        </div>
      ) : (
        <AuraAIChat onNavigateToSection={onNavigateToSection} />
      )}
    </div>
  );
};
