'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ href, children, className = "" }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Link 
        href={href}
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full group ${className}`}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-gray-200"></span>
        <span className="relative flex items-center gap-2 text-black font-semibold text-lg px-8 py-4 mix-blend-normal">
          {children}
        </span>
        <motion.div 
            className="absolute inset-0 border border-white/20 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
      </Link>
    </motion.div>
  );
}
