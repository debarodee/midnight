import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithGoogle, signInWithApple } from '../lib/firebase';
import Logo from '../components/common/Logo';

// SVG Icons for auth providers
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading('google');
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Popup succeeded, auth listener will handle navigation
      }
      // If null, redirect flow started - user will return later
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      setIsLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading('apple');
    setError(null);
    try {
      const user = await signInWithApple();
      if (user) {
        // Popup succeeded
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Apple';
      setError(errorMessage);
      setIsLoading(null);
    }
  };

  const handlePhoneSignIn = () => {
    navigate('/login/phone');
  };

  const handleEmailSignIn = () => {
    navigate('/login/email');
  };

  const authButtons = [
    {
      id: 'google',
      label: 'Sign in with Google',
      icon: GoogleIcon,
      onClick: handleGoogleSignIn,
      primary: true,
    },
    {
      id: 'phone',
      label: 'Sign in with Phone',
      icon: PhoneIcon,
      onClick: handlePhoneSignIn,
      primary: false,
    },
    {
      id: 'email',
      label: 'Sign in with Email',
      icon: EmailIcon,
      onClick: handleEmailSignIn,
      primary: false,
    },
    {
      id: 'apple',
      label: 'Sign in with Apple',
      icon: AppleIcon,
      onClick: handleAppleSignIn,
      primary: false,
      comingSoon: false, // Set to true to show "Coming Soon"
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-obsidian-800 flex flex-col">
      {/* Header with back button */}
      <header className="px-6 py-4 safe-top safe-x">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-obsidian-400 dark:text-obsidian-300 hover:text-obsidian dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <Logo size="lg" className="mb-4" />
            <h1 className="text-2xl font-bold text-obsidian dark:text-white">Momentous Year</h1>
            <p className="text-obsidian-400 dark:text-obsidian-300 mt-2">Sign in to continue</p>
          </div>

          {/* Auth buttons */}
          <div className="space-y-3">
            {authButtons.map((button, index) => (
              <motion.button
                key={button.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={button.onClick}
                disabled={isLoading !== null || button.comingSoon}
                className={`
                  w-full flex items-center justify-center gap-3 px-6 py-4
                  rounded-full font-medium transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${button.primary
                    ? 'bg-white dark:bg-obsidian-700 text-obsidian dark:text-white border-2 border-obsidian dark:border-obsidian-500 hover:bg-obsidian hover:text-white dark:hover:bg-obsidian-600'
                    : 'bg-white dark:bg-obsidian-700 text-obsidian dark:text-white border border-obsidian-200 dark:border-obsidian-500 hover:border-obsidian-300 dark:hover:border-obsidian-400 hover:bg-obsidian-50 dark:hover:bg-obsidian-600'
                  }
                `}
              >
                {isLoading === button.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <button.icon />
                )}
                <span>
                  {button.comingSoon ? `${button.label} (Coming Soon)` : button.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
            >
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer with terms */}
      <footer className="px-6 py-8 safe-bottom safe-x">
        <p className="text-center text-sm text-obsidian-400 dark:text-obsidian-300">
          By continuing, I acknowledge that I have read and agree to the{' '}
          <a href="/terms" className="text-cyan-600 dark:text-cyan hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-cyan-600 dark:text-cyan hover:underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Login;
