'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  text: string | string[];
  delay?: number;
  className?: string;
}

export function TypewriterText({ text, delay = 0, className = "" }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const textArray = Array.isArray(text) ? text : [text];
  const [currentLine, setCurrentLine] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView && !started) {
      setTimeout(() => {
        setIsTyping(true);
        setStarted(true);
      }, delay * 1000);
    }
  }, [isInView, delay, started]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentLine < textArray.length) {
      if (currentIndex < textArray[currentLine].length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + textArray[currentLine][currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 50 + Math.random() * 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
            if(currentLine < textArray.length - 1) {
                setDisplayText(prev => prev + '\n');
            }
            setCurrentLine(prev => prev + 1);
            setCurrentIndex(0);
        }, 500);
        return () => clearTimeout(timeout);
      }
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, currentLine, isTyping, textArray]);

  return (
    <div ref={ref} className={className}>
      <span className="whitespace-pre-line">{displayText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-current align-middle ml-1"
      />
    </div>
  );
}
