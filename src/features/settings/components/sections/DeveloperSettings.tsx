/**
 * @file DeveloperSettings.tsx
 * @description Advanced developer utilities, performance HUD toggles, verbose console flags, and API latency simulators.
 * @module Features/Settings/Components/Sections/DeveloperSettings
 */

import React from 'react';
import { Terminal, Cpu, Activity, Bug, Sliders, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const DeveloperSettings: React.FC = () => {
  const { developer, updateDeveloper, playToggleSound } = useSettings();

  const handleDevToggle = () => {
    playToggleSound();
    updateDeveloper({ developerModeEnabled: !developer.developerModeEnabled });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <Terminal className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Developer & Engineering Workspace
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            These low-level tools allow inspectability, latency simulation, and real-time performance telemetry. Intended for systems architects and engineers.
          </p>
        </div>
      </div>

      {/* Master Developer Switch */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <span>Enable Developer Mode</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                developer.developerModeEnabled
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {developer.developerModeEnabled ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Unlocks system inspection overlay, FPS counter, and raw API debugging headers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDevToggle}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            developer.developerModeEnabled ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
              developer.developerModeEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Developer Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance HUD Overlay */}
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">
                  Performance HUD & FPS Counter
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  Displays live memory usage & frame rate overlay.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateDeveloper({ showPerformanceHud: !developer.showPerformanceHud });
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                developer.showPerformanceHud ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  developer.showPerformanceHud ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Verbose Console Logs */}
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bug className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">
                  Verbose Console Diagnostics
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  Outputs detailed Zustand state changes to browser console.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateDeveloper({ verboseConsoleLogs: !developer.verboseConsoleLogs });
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                developer.verboseConsoleLogs ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  developer.verboseConsoleLogs ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* API Debug Inspector */}
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">
                  API Debug Inspector
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  Intercepts outgoing API calls and logs payload buffers.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateDeveloper({ apiDebugInspector: !developer.apiDebugInspector });
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                developer.apiDebugInspector ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  developer.apiDebugInspector ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Experimental Modules Toggle */}
        <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-medium text-[var(--color-text-primary)]">
                  Experimental Modules
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">
                  Enables bleeding-edge preview features and beta labs.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playToggleSound();
                updateDeveloper({ experimentalModules: !developer.experimentalModules });
              }}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                developer.experimentalModules ? 'bg-[var(--color-accent)]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  developer.experimentalModules ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Latency Simulation Slider */}
      <div className="p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[var(--color-accent)]" />
            <div>
              <div className="text-xs font-medium text-[var(--color-text-primary)]">
                Simulated Network Latency Delay
              </div>
              <div className="text-[11px] text-[var(--color-text-secondary)]">
                Inject artificial delay into mock service calls to test skeleton loading states.
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--color-accent)]">
            {developer.networkMockDelayMs} ms
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={2000}
          step={100}
          value={developer.networkMockDelayMs}
          onChange={(e) => updateDeveloper({ networkMockDelayMs: parseInt(e.target.value) })}
          className="w-full accent-[var(--color-accent)] cursor-pointer"
        />
      </div>
    </div>
  );
};
