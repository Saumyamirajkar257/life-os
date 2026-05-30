'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

export default function About() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-white">
      <CustomCursor />
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto pt-32 px-6 pb-20">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl font-bold mb-12"
        >
          About Us.
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <h2 className="text-3xl font-semibold mb-4 text-primary">Our Mission</h2>
            <p className="text-white/70 leading-relaxed text-lg">
              We are pushing the boundaries of web experiences. Our mission is to merge art and technology, creating digital spaces that feel alive, intuitive, and deeply personalized for every user.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-3xl font-semibold mb-4 relative z-10">Our Vision</h2>
            <p className="text-white/70 leading-relaxed text-lg relative z-10">
              To build a seamless operating system for life—where productivity meets beautiful, game-like design. It's not just an app; it's an extension of your mind.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
