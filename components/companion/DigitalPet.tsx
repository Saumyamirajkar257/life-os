'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasksStore } from '@/store/useTasksStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { useCompanionStore } from '@/store/useCompanionStore';
import { Sparkles, Heart } from 'lucide-react';
import { RobotPet } from './RobotPet';

export function DigitalPet() {
  const { petLevel, petMood, companionOpen, setCompanionOpen } = useCompanionStore();
  const [message, setMessage] = useState('');
  
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();

  useEffect(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

    if (maxStreak > 5) {
      setMessage('You are on fire! Keep that streak going!');
    } else if (completedTasks > 10) {
      setMessage('Great job getting things done!');
    } else if (completedTasks === 0 && maxStreak === 0) {
      setMessage("Ready when you are. Click to speak to me.");
    } else {
      setMessage('I am tracking your progress. Click to chat!');
    }
  }, [tasks, habits]);

  // SVG representation of the pet based on level/mood from useCompanionStore
  const renderPet = () => {
    return <RobotPet level={petLevel} mood={petMood} size="sm" />;
  };

  return (
    <div 
      onClick={() => setCompanionOpen(!companionOpen)}
      className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group cursor-pointer hover:bg-white/10 transition-all"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono text-white/50 bg-black/20 px-2 py-0.5 rounded-full">
        <Heart className="w-3 h-3 text-rose-500" />
        Lvl {petLevel}
      </div>
      
      <div className="mt-4">
        {renderPet()}
      </div>
      
      <div className="text-center mt-2">
        <h4 className="text-sm font-semibold text-white/90">FA9</h4>
        <p className="text-[10px] text-white/50 mt-1 max-w-[150px] leading-tight">
          {message}
        </p>
      </div>

      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 transition-opacity p-4 text-center backdrop-blur-sm"
        >
          <p className="text-xs text-white/80">Click to open the interactive AI Coach Companion Panel!</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
