'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 w-full z-50 bg-black/40 backdrop-blur-[12px] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo size={28} showText={true} />
        </Link>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-white/70">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:inline-flex px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all duration-300">
            Start Free →
          </Link>
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white/80 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with CSS transitions for peak mobile performance */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/5 bg-black/95 backdrop-blur-[12px] ${
          isOpen ? 'max-h-[400px] opacity-100 py-6 px-6' : 'max-h-0 opacity-0 py-0 px-6 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 text-base font-medium text-white/70">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-1">Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-1">About Us</Link>
          <Link href="/faq" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-1">FAQ</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors py-1">Contact Us</Link>
          <Link href="/login" onClick={() => setIsOpen(false)} className="mt-2 w-full py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-center font-semibold hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all duration-300">
            Start Free →
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
