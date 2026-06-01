'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-specific error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [generalError, setGeneralError] = useState('');
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

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Weak', color: 'bg-zinc-800', textColor: 'text-zinc-500' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
      case 4:
      default:
        return { score: 4, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' };
    }
  };

  const getFriendlyError = (code: string, fallbackMessage: string) => {
    switch (code) {
      case 'auth/wrong-password':
        return "Incorrect password. Try again.";
      case 'auth/user-not-found':
        return "No account with this email.";
      case 'auth/too-many-requests':
        return "Too many attempts. Try later.";
      case 'auth/invalid-email':
        return "Please enter a valid email.";
      case 'auth/email-already-in-use':
        return "Email already registered. Sign in instead.";
      case 'auth/weak-password':
        return "Password is too weak. Please use at least 6 characters.";
      case 'auth/invalid-credential':
        return "Incorrect email or password. Try again.";
      default:
        return fallbackMessage || "Authentication failed. Please try again.";
    }
  };

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setFullNameError('');
    setGeneralError('');
    setInfoMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!isLogin && !fullName.trim()) {
      setFullNameError("Full Name is required.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
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
      const message = getFriendlyError(code, err.message);

      if (code === 'auth/invalid-email' || code === 'auth/user-not-found' || code === 'auth/email-already-in-use') {
        setEmailError(message);
      } else if (code === 'auth/wrong-password' || code === 'auth/weak-password') {
        setPasswordError(message);
      } else {
        setGeneralError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearErrors();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setGeneralError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError("Please enter your email address to reset your password.");
      setInfoMsg('');
      return;
    }
    clearErrors();
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMsg("Reset link sent to your email ✅");
    } catch (err: any) {
      console.error(err);
      const code = err?.code || '';
      const message = getFriendlyError(code, err.message);
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setEmailError(message);
      } else {
        setGeneralError(message);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0f]"
      style={{ background: 'radial-gradient(circle at center, #7c3aed15 0%, #0a0a0f 100%)' }}
    >
      {/* Constellation Particle Background */}
      <HeroParticles />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[440px] backdrop-blur-xl rounded-[24px] p-6 md:p-12 relative z-10 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 60px rgba(0, 212, 255, 0.08)'
        }}
      >
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          {isLogin ? (
            <Logo layout="vertical" showSubtitle={true} size={64} className="mb-4" />
          ) : (
            <>
              <Logo showText={false} size={48} className="mb-4" />
              <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">
                Create your free account
              </h1>
            </>
          )}
          <p className="text-white/60 text-sm">
            {isLogin ? 'Welcome back 👋' : 'Start your journey today 🚀'}
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
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fullNameError) setFullNameError('');
                  }}
                  className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff40] focus:border-[#00d4ff] transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>
              {fullNameError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {fullNameError}
                </motion.p>
              )}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff40] focus:border-[#00d4ff] transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
            {emailError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {emailError}
              </motion.p>
            )}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-xl pl-11 pr-11 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff40] focus:border-[#00d4ff] transition-all duration-300"
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

            {/* Password strength indicator (Signup only) */}
            {!isLogin && password && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2.5"
              >
                <div className="flex gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                  {[1, 2, 3, 4].map((bar) => {
                    const strength = getPasswordStrength(password);
                    const isActive = bar <= strength.score;
                    return (
                      <div 
                        key={bar} 
                        className={`h-full flex-1 transition-all duration-300 ${isActive ? strength.color : 'bg-white/10'}`} 
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-white/40 text-right font-medium tracking-wide">
                  Strength: <span className={getPasswordStrength(password).textColor}>{getPasswordStrength(password).label}</span>
                </p>
              </motion.div>
            )}

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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className="w-full bg-[#ffffff08] border border-[#ffffff15] rounded-xl pl-11 pr-11 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff40] focus:border-[#00d4ff] transition-all duration-300"
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
          {(passwordError || generalError || infoMsg) && (
            <div className="mt-2">
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium flex items-start gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </motion.p>
              )}
              {generalError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-medium flex items-start gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{generalError}</span>
                </motion.p>
              )}
              {infoMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-400 font-medium flex items-start gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </motion.p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-[#00d4ff] text-black font-bold rounded-[12px] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : isLogin ? (
              'Sign In →'
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

        {/* Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 mt-4 bg-white/5 border border-white/10 text-white font-medium rounded-[12px] hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.02)]"
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

        {/* Offline Bypass */}
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

        {/* Navigation Switch */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              clearErrors();
            }}
            className="text-sm text-[#00d4ff] hover:underline transition-colors cursor-pointer font-medium"
          >
            {isLogin ? "New to LIFE OS? Create free account →" : "Already have an account? Sign in →"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
