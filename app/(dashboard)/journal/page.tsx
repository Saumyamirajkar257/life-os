'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Trash2, Calendar, Smile, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations';
import { useJournalStore, type JournalEntry } from '@/store/useJournalStore';
import { GlassCard, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('good');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  const { entries, addEntry, deleteEntry } = useJournalStore();

  const last90Days = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ dateStr, formatted });
    }
    return dates;
  }, []);

  const entriesByDate = useMemo(() => {
    const map: Record<string, JournalEntry> = {};
    entries.forEach(entry => {
      map[entry.date] = entry;
    });
    return map;
  }, [entries]);

  const getMoodHeatmapColor = (m: JournalEntry['mood']) => {
    switch (m) {
      case 'great': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] border border-emerald-400/20';
      case 'good': return 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.3)] border border-teal-400/20';
      case 'neutral': return 'bg-zinc-500 border border-zinc-400/20';
      case 'down': return 'bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.2)] border border-amber-500/20';
      case 'exhausted': return 'bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.3)] border border-rose-500/20';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addEntry(title.trim(), content.trim(), mood);
    setTitle('');
    setContent('');
    setMood('good');
  };

  const moodDetails: Record<JournalEntry['mood'], { emoji: string; label: string; color: string }> = {
    great: { emoji: '😆', label: 'Great', color: 'bg-zinc-800 text-white' },
    good: { emoji: '🙂', label: 'Good', color: 'bg-white/10 text-white/90' },
    neutral: { emoji: '😐', label: 'Neutral', color: 'bg-zinc-900 text-white/50' },
    down: { emoji: '🙁', label: 'Down', color: 'bg-zinc-950 text-white/30 border border-white/5' },
    exhausted: { emoji: '😩', label: 'Exhausted', color: 'bg-zinc-950 text-white/20 border border-white/5' },
  };

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/30 font-display text-lg"
        >
          Opening journal archives...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Daily Journal</h1>
        <p className="text-white/40 text-sm mt-1">Reflect on your day, log your thoughts, and track your emotional energy.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Editor Form - Left / Main */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full">
          <GlassCard className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
              <Book className="w-4 h-4 text-white/50" />
              <span>New Entry</span>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="Daily check-in..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>

              {/* Mood Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Mood</label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(moodDetails) as JournalEntry['mood'][]).map((m) => {
                    const item = moodDetails[m];
                    const isSelected = mood === m;
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMood(m)}
                        className={cn(
                          "py-2 rounded-xl border flex flex-col items-center gap-1 transition-all duration-300",
                          isSelected
                            ? "bg-white border-white text-black"
                            : "border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5"
                        )}
                        title={item.label}
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-[9px] font-mono font-medium hidden sm:inline">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Thoughts & Reflections</label>
                <textarea
                  required
                  placeholder="Write down what went well, what could be improved, and other thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Entry</span>
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Logs List - Right */}
        <div className="lg:col-span-2 flex flex-col gap-4 w-full">
          <h3 className="text-xs font-mono tracking-wider text-white/40 uppercase border-b border-white/5 pb-2">Entry History</h3>
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {entries.map((entry) => {
                const isExpanded = expandedEntry === entry.id;
                const moodObj = moodDetails[entry.mood];
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    key={entry.id}
                    className="glass-panel border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300"
                  >
                    {/* Header Header */}
                    <div
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{entry.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/30 font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{entry.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold",
                            moodObj.color
                          )}
                        >
                          {moodObj.emoji} {moodObj.label}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                      </div>
                    </div>

                    {/* Content Section */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/5 pt-3 flex flex-col gap-4">
                        <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-white/80 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Entry</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {entries.length === 0 && (
              <div className="glass-panel border border-white/10 rounded-2xl p-12 text-center text-white/30 font-mono text-xs">
                No reflections logged yet. Start typing on the left.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mood Heatmap Visualizer */}
      <GlassCard className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-wider uppercase border-b border-white/5 pb-3">
          <Smile className="w-4 h-4 text-white/50 animate-pulse" />
          <span>Emotional Heatmap (Last 90 Days)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center py-2">
          {last90Days.map(({ dateStr, formatted }) => {
            const entry = entriesByDate[dateStr];
            const hasEntry = !!entry;
            const moodColor = hasEntry ? getMoodHeatmapColor(entry.mood) : 'bg-white/5 hover:bg-white/10 border border-white/5';
            return (
              <button
                type="button"
                key={dateStr}
                onClick={() => {
                  if (hasEntry) {
                    setExpandedEntry(expandedEntry === entry.id ? null : entry.id);
                  }
                }}
                className={cn(
                  "w-6 h-6 rounded-md transition-all",
                  moodColor,
                  hasEntry ? "hover:scale-110 active:scale-95 cursor-pointer" : "cursor-default"
                )}
                title={`${formatted}: ${hasEntry ? `Mood: ${entry.mood} - ${entry.title}` : 'No reflection logged'}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[10px] text-white/30 font-mono mt-1 border-t border-white/5 pt-3">
          <span>Older</span>
          <div className="flex items-center gap-1.5">
            <span>Down</span>
            <div className="w-2.5 h-2.5 rounded bg-rose-600" />
            <div className="w-2.5 h-2.5 rounded bg-amber-600" />
            <div className="w-2.5 h-2.5 rounded bg-zinc-500" />
            <div className="w-2.5 h-2.5 rounded bg-teal-500" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>Great</span>
          </div>
          <span>Newer</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}
