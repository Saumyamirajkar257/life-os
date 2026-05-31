'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Target, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveAiDemo() {
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [planText, setPlanText] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Typing effect
  useEffect(() => {
    if (!planText) {
      setDisplayedText('');
      return;
    }
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(planText.slice(0, i));
      i++;
      if (i > planText.length) {
        clearInterval(interval);
      }
    }, 20); // 20ms per character

    return () => clearInterval(interval);
  }, [planText]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setPlanText(null);
    setDisplayedText('');
    
    try {
      const response = await fetch('/.netlify/functions/ai-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }
      
      setPlanText(data.text);
    } catch (err: any) {
      setError(err.message || 'Something went wrong connecting to the AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel p-8 rounded-3xl relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px]" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">See the AI in action</h3>
            <p className="text-xs text-white/50 font-mono">Type any life goal and get an instant AI-generated action plan</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="relative flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. I want to wake up at 6am every day..."
            className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder:text-white/30"
          />
          <button 
            type="submit"
            disabled={isGenerating || !goal.trim()}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500 shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)]"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Generate Plan →'}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 mb-4"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {(isGenerating || planText) && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-[#0a0a0f] border border-white/10 shadow-inner relative"
            >
              <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2 mb-4">
                <Target className="w-4 h-4" /> AI Action Plan
              </h4>
              {isGenerating && !planText ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                  <span className="ml-3 text-sm text-white/50 animate-pulse">Analyzing your goal...</span>
                </div>
              ) : (
                <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-mono">
                  {displayedText}
                  <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
