'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { HeroParticles } from '@/components/landing/HeroParticles';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const getFriendlyError = (code: string, fallbackMessage: string) => {
    switch (code) {
      case 'auth/wrong-password':
        return "Incorrect password. Try again.";
      case 'auth/user-not-found':
        return "No account found with this email.";
      case 'auth/too-many-requests':
        return "Too many attempts. Try again later.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/email-already-in-use':
        return "This email is already registered. Please sign in instead.";
      case 'auth/weak-password':
        return "Password is too weak. Please use at least 6 characters.";
      case 'auth/invalid-credential':
        return "Incorrect email or password. Try again.";
      default:
        return fallbackMessage || "Authentication failed. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
      }
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      setError(getFriendlyError(code, err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setInfoMsg('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      setInfoMsg('');
      return;
    }
    setError('');
    setInfoMsg('');
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMsg("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      setError(getFriendlyError(code, err.message));
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0f]"
      style={{ background: 'radial-gradient(circle at center, #7c3aed15 0%, #0a0a0f 100%)' }}
    >
      {/* Constellation Particle Background */}
      <HeroParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[440px] backdrop-blur-xl bg-[#ffffff08] border border-[#ffffff15] rounded-[24px] p-6 md:p-12 relative z-10 shadow-[0_0_40px_#00d4ff10]"
      >
        <div className="text-center mb-8">
          {/* Cyan Hexagon Logo */}
          <div className="flex justify-center mb-4">
            <svg 
              className="w-12 h-12 text-[#00d4ff] drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">
            LIFE OS
          </h1>
          <p className="text-white/60 text-sm">
            {isLogin ? 'Welcome back 👋' : 'Create your free account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.15)] transition-all"
                  placeholder="Your Name"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.15)] transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.15)] transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isLogin && (
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#00d4ff] hover:underline bg-transparent border-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {/* Confirm Password field (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.15)] transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Inline Mapped Error / Success Messages */}
          {(error || infoMsg) && (
            <div className="mt-2">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
              {infoMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-400 font-medium flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </motion.div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-[#00d4ff] text-black font-semibold rounded-full hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account →'
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider px-4 font-mono">Or</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 mt-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.02)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => {
            localStorage.setItem('life-os-bypass-auth', 'true');
            window.location.href = '/';
          }}
          className="py-2 px-4 bg-transparent border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 active:scale-[0.98] transition-all duration-300 text-xs font-semibold rounded-full w-fit mx-auto block mt-4 cursor-pointer"
        >
          ⚡ Try without account
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setInfoMsg('');
            }}
            className="text-sm text-[#00d4ff] hover:underline transition-colors cursor-pointer font-medium"
          >
            {isLogin ? "New to LIFE OS? Create free account →" : "Already have account? Sign in →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

