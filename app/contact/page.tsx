'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

export default function Contact() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      <CustomCursor />
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto pt-32 px-6 pb-20 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-bold mb-6 text-center"
        >
          Get in Touch
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-center max-w-lg mb-12"
        >
          Have questions or want to collaborate? Send us a message and we'll get back to you immediately.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md space-y-6 bg-white/5 p-8 rounded-3xl backdrop-blur-xl border border-white/10"
        >
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-primary outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-primary outline-none transition-colors"
              placeholder="Hello..."
            />
          </div>
          <button 
            type="button"
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </main>
  );
}
