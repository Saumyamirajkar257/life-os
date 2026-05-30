'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { useAIStore } from '@/store/useAIStore';

export function AIInsightCard() {
  const [mounted, setMounted] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { insights, dailyBriefing } = useAIStore();

  const insightLines = mounted ? [
    '> Initializing behavioral diagnostics...',
    ...(insights?.map((ins) => `> ${ins.text}`) || []),
    dailyBriefing ? `> Focus suggestion: ${dailyBriefing.todayFocusRecommendation}` : '> Keep consistent focus blocks today.',
  ] : [];

  useEffect(() => {
    if (!mounted || !isTyping || currentLine >= insightLines.length) {
      setIsTyping(false);
      return;
    }

    const line = insightLines[currentLine];
    
    if (currentChar < line.length) {
      const timer = setTimeout(() => {
        setCurrentChar((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, isTyping, mounted, insightLines]);

  if (!mounted) {
    return (
      <GlassCard
        icon={<Sparkles className="w-5 h-5" />}
        header="AI Life Coach"
        className="h-full"
        animated={false}
      >
        <div className="h-[120px] flex items-center justify-center text-white/30 text-xs font-mono">
          Booting neural coach...
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      icon={<Sparkles className="w-5 h-5" />}
      header="AI Life Coach"
      className="h-full"
      animated={false}
    >
      <div className="font-mono text-xs sm:text-sm leading-relaxed space-y-1.5">
        {displayedLines.map((line, i) => (
          <p key={i} className="text-white/60">{line}</p>
        ))}
        {isTyping && currentLine < insightLines.length && (
          <p className="text-white/60">
            {insightLines[currentLine].substring(0, currentChar)}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-white/70 ml-0.5 align-middle"
            />
          </p>
        )}
        {!isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-white/40 ml-0.5 align-middle"
          />
        )}
      </div>
    </GlassCard>
  );
}
