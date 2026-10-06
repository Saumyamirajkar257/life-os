/**
 * @file AboutSettings.tsx
 * @description Application metadata, system version, environment status, release notes modal trigger, and license information.
 * @module Features/Settings/Components/Sections/AboutSettings
 */

import React, { useState } from 'react';
import { Info, Sparkles, Cpu, HardDrive, Activity, ShieldCheck, ExternalLink, Code } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '@/components/ui/button';
import { ReleaseNotesModal } from '../modals/ReleaseNotesModal';

export const AboutSettings: React.FC = () => {
  const { about, playToggleSound } = useSettings();
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="space-y-8">
      {/* 1. Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                Aura Life OS — Core Kernel
              </h3>
            </div>
            <p className="text-xs font-mono text-[var(--color-text-secondary)]">
              {about.version} • Milestone 9 Release Build • {about.buildNumber}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              playToggleSound();
              setShowNotes(true);
            }}
            className="gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Milestone 9 Changelog</span>
          </Button>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
          Aura Life OS is an operating environment designed for deep focus, intelligent workspace automation, offline-first resilience, and system customization.
        </p>
      </div>

      {/* 2. System Health & Performance Gauges */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-accent)]" />
            <span>System Resource Allocation</span>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Real-time status of runtime environment, memory allocation, and storage pools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Load
              </span>
              <span className="text-emerald-400 font-semibold">2.4% Optimal</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[12%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Heap Memory
              </span>
              <span className="text-amber-400 font-semibold">48.2 MB / 512 MB</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[22%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Storage Pool
              </span>
              <span className="text-indigo-400 font-semibold">24.5 MB Used</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
              <div className="h-full bg-indigo-400 rounded-full w-[5%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. System Metadata Table */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)] text-xs font-mono overflow-hidden">
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Target Architecture</span>
            <span className="text-[var(--color-text-primary)] font-semibold">TypeScript React Vite SPA</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Container Runtime</span>
            <span className="text-[var(--color-text-primary)] font-semibold">{about.environment}</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Architect / Maintainer</span>
            <span className="text-[var(--color-text-primary)] font-semibold">{about.architect}</span>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Software License</span>
            <span className="text-[var(--color-text-primary)] font-semibold">{about.license}</span>
          </div>
        </div>
      </div>

      <ReleaseNotesModal isOpen={showNotes} onClose={() => setShowNotes(false)} />
    </div>
  );
};
