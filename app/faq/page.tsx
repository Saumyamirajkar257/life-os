'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

export default function FAQ() {
  const faqs = [
    { q: "What is this platform?", a: "This is a futuristic, AI-powered life command center designed to optimize your workflow and digital experience." },
    { q: "Do you use AI for personalization?", a: "Yes, our systems learn from your interactions to provide a hyper-personalized experience." },
    { q: "Is there a dark mode?", a: "The entire experience is built ground-up with a premium dark mode as the default." },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      <CustomCursor />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto pt-32 px-6 pb-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
              <p className="text-white/60">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
