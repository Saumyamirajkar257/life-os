'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Sparkles, X, Activity, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useTasksStore } from '@/store/useTasksStore';

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const executeCommand = (action: () => void) => {
    action();
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const commands = [
    { 
      id: 'plan-week', 
      label: 'Plan my week', 
      icon: <Terminal className="w-4 h-4 text-white/50" />,
      action: () => router.push('/tasks')
    },
    { 
      id: 'analyze-habits', 
      label: 'Analyze my habits', 
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => router.push('/analytics')
    },
    { 
      id: 'show-focus', 
      label: 'Show focus trends', 
      icon: <Brain className="w-4 h-4 text-indigo-400" />,
      action: () => router.push('/focus')
    },
    { 
      id: 'add-task', 
      label: 'Add a new task', 
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      action: () => {
        useTasksStore.getState().addTask({
          title: query.replace('add task ', '') || 'New Task',
          project: 'Inbox',
          dueDate: new Date().toISOString(),
          tags: [],
          priority: 'medium'
        });
      }
    }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) || 
    cmd.id.includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        >
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-xl bg-[#0f0f11] border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search (e.g. 'Plan my week')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-0 text-sm font-medium"
              />
              <button onClick={() => setCommandPaletteOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
              {filteredCommands.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider px-2 py-1">Suggestions</span>
                  {filteredCommands.map(cmd => (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd.action)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                    >
                      {cmd.icon}
                      <span className="text-sm font-medium text-white/80 group-hover:text-white">{cmd.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-white/40">No commands found for "{query}"</p>
                  <p className="text-xs text-indigo-400/80 mt-1 cursor-pointer" onClick={() => executeCommand(commands[3].action)}>
                    Press Enter to use AI to process your request.
                  </p>
                </div>
              )}
            </div>
            <div className="bg-white/5 px-4 py-2 text-[10px] text-white/30 flex justify-between items-center border-t border-white/10 font-mono">
              <span>Natural Language AI Enabled</span>
              <span className="flex gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10">↑↓</kbd> to navigate
                <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10">↵</kbd> to select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
