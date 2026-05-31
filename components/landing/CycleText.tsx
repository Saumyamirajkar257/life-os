'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CycleText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (subIndex === words[index].length + 1 && !isDeleting) {
        setTimeout(() => setIsDeleting(true), 1500); // Pause at end of word
        return;
      }

      if (subIndex === 0 && isDeleting) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
        return;
      }

      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, Math.max(isDeleting ? 50 : 100, Math.random() * 50 + (isDeleting ? 30 : 50)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span className="relative inline-block h-[1em]">
      <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 pb-1">{`${words[index].substring(0, subIndex)}`}</span>
      <motion.span
        animate={{ opacity: blink ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="inline-block w-[6px] h-[0.8em] bg-indigo-400 align-middle ml-2"
      />
    </span>
  );
}
