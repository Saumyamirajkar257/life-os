import React from 'react';
import { Volume2, VolumeX, Sparkles, Sun, Sunset, Moon, Sliders } from 'lucide-react';
import { usePolishStore, TimeMode } from '@/stores/usePolishStore';
import { Popover } from '@/components/ui/popover';
import { soundEngine } from '@/lib/sound/sound-engine';

export const AmbientControlsPopover: React.FC = () => {
  const {
    soundEnabled,
    soundVolume,
    ambientMode,
    showParticles,
    intensity,
    toggleSound,
    setSoundVolume,
    setTimeMode,
    setIntensity,
    toggleParticles,
  } = usePolishStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSoundVolume(val);
  };

  const trigger = (
    <button
      type="button"
      aria-label="Aura Ambient & Sound Controls"
      className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer relative"
    >
      <Sparkles className="w-4 h-4 text-teal-400" />
      {soundEnabled && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
      )}
    </button>
  );

  const modeButtons: { mode: TimeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'auto', label: 'Auto Time', icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" /> },
    { mode: 'morning', label: 'Morning', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    { mode: 'afternoon', label: 'Afternoon', icon: <Sun className="w-3.5 h-3.5 text-sky-400" /> },
    { mode: 'evening', label: 'Evening', icon: <Sunset className="w-3.5 h-3.5 text-violet-400" /> },
    { mode: 'night', label: 'Night', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  return (
    <Popover
      trigger={trigger}
      placement="bottom"
      content={
        <div className="w-72 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-slate-100">Ambient & Audio Controls</span>
            </div>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
              Million-Dollar Polish
            </span>
          </div>

          {/* Sound Synthesizer Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Web Audio Synthesizer</span>
              <button
                type="button"
                onClick={toggleSound}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  soundEnabled
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {soundEnabled && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Volume</span>
                  <span className="font-mono">{Math.round(soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <button
                  type="button"
                  onClick={() => soundEngine.playCompletionChime()}
                  className="w-full py-1 text-[10px] font-mono text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded-lg transition-colors cursor-pointer"
                >
                  Test Completion Chime ♫
                </button>
              </div>
            )}
          </div>

          {/* Ambient Lighting Time Mode */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-300 font-medium block">Lighting Palette</span>
            <div className="grid grid-cols-2 gap-1.5">
              {modeButtons.map((btn) => (
                <button
                  key={btn.mode}
                  type="button"
                  onClick={() => setTimeMode(btn.mode)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    ambientMode === btn.mode
                      ? 'bg-teal-500/10 border-teal-500/50 text-teal-300 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {btn.icon}
                  <span className="truncate">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Density */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Ambient Particles</span>
              <button
                type="button"
                onClick={toggleParticles}
                className={`text-xs px-2 py-0.5 rounded-md border ${
                  showParticles
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {showParticles ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex gap-1.5">
              {(['minimal', 'subtle', 'vibrant'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntensity(lvl)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono capitalize border transition-colors cursor-pointer ${
                    intensity === lvl
                      ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
