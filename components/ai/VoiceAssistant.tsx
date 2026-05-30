'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTasksStore } from '@/store/useTasksStore';
import { GlassCard } from '@/components/ui/GlassCard';

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        
        if (event.results[event.results.length - 1].isFinal) {
          handleCommand(currentTranscript.trim().toLowerCase());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleCommand = (cmd: string) => {
    setAiResponse('Processing command...');
    
    setTimeout(() => {
      if (cmd.includes('navigate to') || cmd.includes('go to')) {
        const routes = ['dashboard', 'tasks', 'habits', 'journal', 'analytics', 'finance', 'focus', 'brain', 'timeline', 'automations'];
        const matchedRoute = routes.find(r => cmd.includes(r));
        if (matchedRoute) {
          setAiResponse(`Navigating to ${matchedRoute}...`);
          router.push(matchedRoute === 'dashboard' ? '/' : `/${matchedRoute}`);
        } else {
          setAiResponse(`Could not find that page.`);
        }
      } 
      else if (cmd.includes('add task')) {
        const taskName = cmd.replace(/add task( to)?/, '').trim();
        if (taskName) {
          useTasksStore.getState().addTask({
            title: taskName.charAt(0).toUpperCase() + taskName.slice(1),
            description: 'Added via Voice Assistant',
            project: 'Inbox',
            priority: 'medium',
            tags: ['Voice'],
            dueDate: new Date().toISOString().split('T')[0]
          });
          setAiResponse(`Added task: "${taskName}"`);
        }
      }
      else if (cmd.includes('start focus')) {
        setAiResponse('Starting a deep focus session...');
        router.push('/focus');
      }
      else if (cmd.includes('summarize today') || cmd.includes('report')) {
        const completed = useTasksStore.getState().tasks.filter(t => t.completed).length;
        setAiResponse(`Today you completed ${completed} tasks. Keep up the good work!`);
      }
      else {
        // Fallback or generic AI response
        setAiResponse(`I heard: "${cmd}". Let me analyze that in the background.`);
      }
      
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      
      // Auto close after 3 seconds of showing response
      setTimeout(() => {
        setIsOpen(false);
        setTranscript('');
        setAiResponse('');
      }, 4000);
      
    }, 1000);
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setAiResponse('');
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80"
          >
            <GlassCard variant="strong" className="p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Voice Assistant
                </div>
                <button onClick={() => { setIsOpen(false); setIsListening(false); recognitionRef.current?.stop(); }} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="h-24 flex flex-col justify-center items-center text-center p-2">
                {aiResponse ? (
                  <p className="text-sm text-indigo-300 font-medium">{aiResponse}</p>
                ) : transcript ? (
                  <p className="text-sm text-white/90 italic">"{transcript}"</p>
                ) : (
                  <p className="text-sm text-white/40">Say "Add task...", "Navigate to Timeline", or "Summarize today".</p>
                )}
              </div>

              <div className="flex justify-center mt-2">
                <button 
                  onClick={toggleListen}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isListening ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center"
        >
          <Mic className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
