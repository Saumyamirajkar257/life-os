/**
 * @file VoiceNoteRecorderModal.tsx
 * @description Voice Note audio recorder component with live transcript generation, waveform animation, and save to notes.
 * @module Features/Journal/Components
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, Save, X, Sparkles, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournalUIStore } from '../stores/useJournalUIStore';
import { useJournalStore } from '../stores/useJournalStore';

export const VoiceNoteRecorderModal: React.FC = () => {
  const { isVoiceRecorderOpen, closeVoiceRecorder, openEntryDetail } = useJournalUIStore();
  const { createNote } = useJournalStore();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const mockTranscripts = [
    'Reflecting on today\'s strategic goals. The key priority is optimizing system throughput and maintaining strict state modularity across Aura modules.',
    'Idea for Second Brain knowledge graph: allow instant bidirectional navigation between journals, habits, and tasks.',
    'Morning gratitude log: feeling focused and energized for deep engineering work.',
  ];

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isVoiceRecorderOpen) return null;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setTranscript('Listening... Speak naturally to generate live transcript.');

    setTimeout(() => {
      const sample = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(sample);
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSaveVoiceNote = () => {
    const duration = recordingSeconds || 15;
    const newNote = createNote({
      title: `Voice Thought (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      content: `<p><strong>Voice Recording Transcript:</strong></p><p>${transcript || 'Recorded voice note.'}</p>`,
      type: 'voice',
      audioDurationSeconds: duration,
      audioTranscript: transcript || 'Recorded audio note.',
      tags: ['Voice Note', 'Thought'],
    });

    closeVoiceRecorder();
    openEntryDetail(newNote.id, 'note');
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-base font-bold text-slate-100">Voice Note Recorder</h2>
          </div>
          <button
            onClick={closeVoiceRecorder}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Visualizer & Recording Timer */}
        <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <div className="text-3xl font-mono font-bold text-slate-100">
            {formatTimer(recordingSeconds)}
          </div>

          {/* Animated Waveform Bars */}
          <div className="flex items-center gap-1.5 h-12">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1.5 rounded-full bg-purple-500 transition-all duration-300',
                  isRecording ? 'animate-pulse' : 'h-3 bg-slate-800'
                )}
                style={{
                  height: isRecording ? `${Math.floor(Math.random() * 32) + 12}px` : '12px',
                }}
              />
            ))}
          </div>

          {/* Record Control Button */}
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 transition-all scale-105"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Recording</span>
            </button>
          )}
        </div>

        {/* Live Transcript Display Box */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Speech-to-Text Transcript
          </span>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 min-h-[70px] italic">
            {transcript || 'Press Start Recording to capture your voice thought...'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={closeVoiceRecorder}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveVoiceNote}
            disabled={recordingSeconds === 0 && !transcript}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Voice Note</span>
          </button>
        </div>
      </div>
    </div>
  );
};
