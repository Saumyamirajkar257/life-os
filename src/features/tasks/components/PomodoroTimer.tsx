/**
 * @file PomodoroTimer.tsx
 * @description Interactive Pomodoro timer component for productivity sessions.
 * @module Features/Tasks/Components/PomodoroTimer
 */

import React from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle2 } from 'lucide-react';
import { useFocusMode } from '../hooks/useFocusMode';

export const PomodoroTimer: React.FC = () => {
  const {
    isPomodoroActive,
    formattedTime,
    mode,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    setMode,
  } = useFocusMode();

  return (
    <div
      className="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 text-neutral-200 flex flex-col items-center justify-center space-y-3"
      id="pomodoro-timer-widget"
    >
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
        <button
          onClick={() => setMode('work')}
          className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
            mode === 'work' ? 'bg-purple-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => setMode('shortBreak')}
          className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
            mode === 'shortBreak' ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Break (5m)
        </button>
        <button
          onClick={() => setMode('longBreak')}
          className={`px-3 py-1 rounded-lg font-mono font-medium transition-colors ${
            mode === 'longBreak' ? 'bg-blue-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Clock Display */}
      <div className="text-4xl font-extrabold font-mono tracking-widest text-neutral-100 my-2">
        {formattedTime}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTimer}
          className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
            isPomodoroActive
              ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
              : 'bg-purple-500 text-neutral-950 hover:bg-purple-400'
          }`}
          id="pomodoro-toggle-button"
        >
          {isPomodoroActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPomodoroActive ? 'Pause' : 'Start Focus'}
        </button>

        <button
          onClick={resetTimer}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200"
          title="Reset Timer"
          id="pomodoro-reset-button"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Completed Loops Counter */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono pt-1">
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        <span>{sessionsCompleted} Sessions Completed Today</span>
      </div>
    </div>
  );
};
