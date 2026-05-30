'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/features/dashboard/components/DashboardGrid';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isBypassed, setIsBypassed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bypassed = typeof window !== 'undefined' && localStorage.getItem('life-os-bypass-auth') === 'true';
    setIsBypassed(bypassed);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white/50 font-display">Syncing Connection...</div>
      </div>
    );
  }

  // If user is logged in or bypassed, show the actual dashboard
  if (user || isBypassed) {
    return (
      <AppShell>
        <DashboardGrid />
      </AppShell>
    );
  }

  // If user is not logged in, show the beautiful marketing landing page
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background to-black">
      <CustomCursor />
      <Navbar />
      
      {/* 3D Glassmorphic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-6"
        >
          The Future is <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Here Now.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-white/60 max-w-2xl mb-10"
        >
          Experience an AI-driven, highly immersive, and seamlessly interactive digital environment.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <Link href="/login" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform inline-block">
            Enter Dashboard
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
