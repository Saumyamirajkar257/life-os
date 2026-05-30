'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/animations';
import { useAppStore } from '@/store/useAppStore';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Good Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function GreetingSection() {
  const [mounted, setMounted] = useState(false);
  const { userName } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-2"
    >
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
        {getGreeting()},{' '}
        <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
          {mounted ? userName : 'Commander'}.
        </span>
      </h1>
      <p className="text-white/40 text-lg font-light">
        {getFormattedDate()} · Systems are optimal. You have 3 tasks remaining.
      </p>
    </motion.div>
  );
}
