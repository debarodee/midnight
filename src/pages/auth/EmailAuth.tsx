import { motion, AnimatePresence } from 'framer-motion';
import { Moon, ArrowLeft, Loader2, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signUpWithEmail, signInWithEmail, resetPassword } from '../../lib/firebase';

type AuthMode = 'signin' | 'signup' | 'reset';

const EmailAuth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { strength: 1, label: 'Weak', color: 'bg-red-400' };
    if (strength <= 2) return { strength: 2, label: 'Fair', color: 'bg-yellow-400' };
    if (strength <= 3) return { strength: 3, label: 'Good', color: 'bg-blue-400' };
    return { strength: 4, label: 'Strong', color: 'bg-green-400' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (mode === 'reset') {
      setIsLoading(true);
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (err: unknown) {
        const firebaseError = err as { code?: string; message?: string };
        let errorMessage = 'Failed to send reset email';
        
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (firebaseError.message) {
          errorMessage = firebaseError.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      // Success - auth listener will handle navigation
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      let errorMessage = mode === 'signup' ? 'Failed to create account' : 'Failed to sign in';
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (firebaseError.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (firebaseError.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (firebaseError.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters.';
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
    if (newMode === 'reset') {
      setPassword('');
      setConfirmPassword('');
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 safe-top safe-x">
        <button
          onClick={() => {
            if (mode === 'reset' || mode === 'signup') {
              switchMode('signin');
            } else {
              navigate('/login');
            }
          }}
          className="flex items-center gap-2 text-midnight-400 hover:text-midnight transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + (resetSent ? '-sent' : '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-14 h-14 rounded-full bg-midnight flex items-center justify-center mb-4">
                <Moon className="w-7 h-7 text-champagne" />
              </div>
              <h1 className="text-xl font-bold text-midnight">
                {mode === 'signin' && 'Welcome back'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'reset' && (resetSent ? 'Check your email' : 'Reset your password')}
              </h1>
              <p className="text-midnight-400 mt-2 text-center">
                {mode === 'signin' && 'Sign in with your email'}
                {mode === 'signup' && 'Enter your details to get started'}
                {mode === 'reset' && (resetSent 
                  ? 'We sent a password reset link to your email'
                  : "Enter your email and we'll send you a reset link"
                )}
              </p>
            </div>

            {resetSent ? (
              /* Reset Email Sent Confirmation */
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-midnight-600">
                  If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
                </p>
                <button
                  onClick={() => switchMode('signin')}
                  className="text-sky-500 hover:text-sky-600 font-medium"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              /* Auth Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-midnight-600 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 
                               focus:border-champagne focus:ring-2 focus:ring-champagne/20 
                               outline-none transition-all"
                      autoFocus
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Input (not shown for reset mode) */}
                {mode !== 'reset' && (
                  <div>
                    <label className="block text-sm font-medium text-midnight-600 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 
                                 focus:border-champagne focus:ring-2 focus:ring-champagne/20 
                                 outline-none transition-all"
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight-400 hover:text-midnight"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password strength indicator (only for signup) */}
                    {mode === 'signup' && password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.strength
                                  ? passwordStrength.color
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-midnight-400">
                          Password strength: {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Confirm Password (only for signup) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-midnight-600 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder="Confirm your password"
                        className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 
                                 focus:border-champagne focus:ring-2 focus:ring-champagne/20 
                                 outline-none transition-all"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight-400 hover:text-midnight"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                )}

                {/* Forgot password link (only for signin) */}
                {mode === 'signin' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-sm text-sky-500 hover:text-sky-600 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full bg-midnight text-white font-medium
                           hover:bg-midnight-600 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {mode === 'signin' && 'Signing in...'}
                      {mode === 'signup' && 'Creating account...'}
                      {mode === 'reset' && 'Sending...'}
                    </>
                  ) : (
                    <>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'reset' && 'Send Reset Link'}
                    </>
                  )}
                </button>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-100"
                  >
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Mode switch */}
                <div className="text-center pt-4">
                  {mode === 'signin' && (
                    <p className="text-midnight-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="text-sky-500 hover:text-sky-600 font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                  {mode === 'signup' && (
                    <p className="text-midnight-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-sky-500 hover:text-sky-600 font-medium"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default EmailAuth;
