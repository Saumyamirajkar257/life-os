/**
 * @file AIVoicePlaceholderView.tsx
 * @description Voice Speech-to-Text and Text-to-Speech Control Center.
 * @module AuraAI/Components
 */

import React from 'react';
import { Mic, Volume2, Sparkles } from 'lucide-react';
import { useAIVoice } from '../hooks/useAIVoice';

export const AIVoicePlaceholderView: React.FC = () => {
  const { isListening, isSpeaking, startListening, stopListening, speakText } = useAIVoice();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium uppercase tracking-wider">
          <Mic className="w-4 h-4" /> Voice & Audio Engine
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Speech-To-Text & Dictation</h2>
        <p className="text-xs text-slate-400">
          Hands-free voice interaction and audio synthesis for Aura Intelligence.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-6 max-w-md mx-auto">
        <div
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center transition-all cursor-pointer ${
            isListening ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-950/50' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
          }`}
        >
          <Mic className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-200">
            {isListening ? 'Listening... Speak your prompt' : 'Click microphone to dictate'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Supports hands-free voice commands and daily briefings.</p>
        </div>

        <button
          onClick={() => speakText("Good morning. You have 3 tasks due today and your financial cashflow is healthy.")}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-emerald-400" /> Test Speech Output
        </button>
      </div>
    </div>
  );
};
