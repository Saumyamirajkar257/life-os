'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Target, Brain, Activity } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to LIFE OS',
    subtitle: 'Your intelligent cognitive operating system.',
    icon: <Sparkles className="w-12 h-12 text-indigo-400 mb-6" />
  },
  {
    id: 'focus',
    title: 'What is your primary focus?',
    subtitle: 'Select the areas you want to optimize first.',
    icon: <Target className="w-12 h-12 text-emerald-400 mb-6" />,
    options: ['Productivity & Deep Work', 'Health & Fitness', 'Financial Independence', 'Learning & Knowledge']
  },
  {
    id: 'ai',
    title: 'Calibrating Neural Engine',
    subtitle: 'How proactive should the AI assistant be?',
    icon: <Brain className="w-12 h-12 text-rose-400 mb-6" />,
    options: ['Passive Observer', 'Balanced Guide', 'Proactive Coach']
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      router.push('/');
    }
  };

  const toggleSelection = (option: string) => {
    const stepId = steps[currentStep].id;
    setSelections(prev => {
      const current = prev[stepId] || [];
      if (current.includes(option)) {
        return { ...prev, [stepId]: current.filter(o => o !== option) };
      }
      // If single choice step (like AI)
      if (stepId === 'ai') {
        return { ...prev, [stepId]: [option] };
      }
      return { ...prev, [stepId]: [...current, option] };
    });
  };

  const current = steps[currentStep];
  const currentSelections = selections[current.id] || [];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-emerald-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep ? 'w-8 bg-white' : i < currentStep ? 'w-4 bg-white/50' : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            {current.icon}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{current.title}</h1>
            <p className="text-lg text-white/50 mb-12">{current.subtitle}</p>

            {current.options && (
              <div className="w-full flex flex-col gap-3 mb-12">
                {current.options.map(option => {
                  const isSelected = currentSelections.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleSelection(option)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        isSelected 
                          ? 'border-white bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                          : 'border-white/10 bg-black/40 text-white/60 hover:bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <span className="font-semibold">{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-white text-black font-semibold rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {currentStep === steps.length - 1 ? 'Initialize System' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
