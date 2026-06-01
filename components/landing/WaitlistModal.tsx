'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, AlertCircle, Check } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle auto-close on success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
        // Reset states after animation closes
        setTimeout(() => {
          setSuccess(false);
          setEmail('');
          setErrorMsg('');
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMsg('');
    const trimmedEmail = email.toLowerCase().trim();

    if (!validateEmail(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate emails in waitlist collection
      const q = query(collection(db, 'waitlist'), where('email', '==', trimmedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErrorMsg("You're already on the list! 🎉");
        setIsSubmitting(false);
        return;
      }

      // Save new waitlist entry with auto-generated ID
      await addDoc(collection(db, 'waitlist'), {
        email: trimmedEmail,
        plan: 'pro',
        joinedAt: serverTimestamp(),
        source: 'pricing-section'
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Waitlist error: ", err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-[8px]"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-[480px] p-10 overflow-hidden border border-white/10 rounded-[24px] z-10 shadow-[0_0_60px_#00d4ff10] bg-[#12121a] backdrop-blur-md"
          >
            {/* Close X Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {success ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-6 text-3xl shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white mb-2">
                  You're on the list!
                </h4>
                <p className="text-white/60 text-sm max-w-sm">
                  We'll notify you at <span className="text-[#00d4ff] font-medium">{email}</span> when Pro launches.
                </p>
              </motion.div>
            ) : (
              /* Input Form State */
              <div>
                <div className="text-center mb-8">
                  <span className="text-[40px] block mb-4">🚀</span>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    Join the Pro Waitlist
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Be the first to know when Pro launches. Early birds get 50% off their first month. 🎉
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                        <Mail className="w-5 h-5" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-[12px] bg-white/[0.03] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00d4ff40] focus:border-[#00d4ff] transition-all pl-11"
                      />
                    </div>
                    {errorMsg && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-rose-500 font-medium mt-2 flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errorMsg}
                      </motion.p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-[12px] bg-[#00d4ff] hover:bg-[#00bced] text-black font-bold hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      'Notify Me When It Launches →'
                    )}
                  </button>
                </form>

                <p className="text-center text-white/30 text-xs mt-6">
                  🔒 No spam. Unsubscribe anytime.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
