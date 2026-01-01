import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Phone, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  setupRecaptcha, 
  sendPhoneVerificationCode, 
  verifyPhoneCode,
  clearRecaptcha,
} from '../../lib/firebase';
import type { ConfirmationResult } from 'firebase/auth';
import Logo from '../../components/common/Logo';

type Step = 'phone' | 'code';

const PhoneAuth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const recaptchaInitialized = useRef(false);
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      clearRecaptcha();
    };
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError(null);
  };

  const getE164PhoneNumber = () => {
    const digits = phoneNumber.replace(/\D/g, '');
    // Assuming US number, add +1 prefix
    return `+1${digits}`;
  };

  const handleSendCode = async () => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initialize reCAPTCHA if not already done
      if (!recaptchaInitialized.current) {
        setupRecaptcha('send-code-button');
        recaptchaInitialized.current = true;
      }

      const appVerifier = setupRecaptcha('send-code-button');
      const result = await sendPhoneVerificationCode(getE164PhoneNumber(), appVerifier);
      setConfirmationResult(result);
      setStep('code');
      setResendCooldown(60); // 60 second cooldown
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      let errorMessage = 'Failed to send verification code';
      
      if (firebaseError.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number. Please check and try again.';
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (firebaseError.code === 'auth/captcha-check-failed') {
        errorMessage = 'Verification failed. Please refresh and try again.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }
      
      setError(errorMessage);
      // Reset reCAPTCHA on error
      clearRecaptcha();
      recaptchaInitialized.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6);
      setVerificationCode(digits);
      // Focus last filled input or next empty one
      const focusIndex = Math.min(digits.length, 5);
      codeInputsRef.current[focusIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newCode = verificationCode.split('');
    newCode[index] = digit;
    setVerificationCode(newCode.join(''));
    setError(null);

    // Auto-focus next input
    if (digit && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await verifyPhoneCode(verificationCode);
      // Success - auth listener will handle navigation
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      let errorMessage = 'Invalid verification code';
      
      if (firebaseError.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid code. Please check and try again.';
      } else if (firebaseError.code === 'auth/code-expired') {
        errorMessage = 'Code expired. Please request a new one.';
      } else if (firebaseError.message) {
        errorMessage = firebaseError.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setVerificationCode('');
    clearRecaptcha();
    recaptchaInitialized.current = false;
    await handleSendCode();
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('phone');
      setVerificationCode('');
      setError(null);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-obsidian-800 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 safe-top safe-x">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-obsidian-400 dark:text-obsidian-300 hover:text-obsidian dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === 'code' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <Logo size="lg" className="mb-4" />
            <h1 className="text-xl font-bold text-obsidian dark:text-white">
              {step === 'phone' ? 'Enter your phone number' : 'Enter verification code'}
            </h1>
            <p className="text-obsidian-400 dark:text-obsidian-300 mt-2 text-center">
              {step === 'phone' 
                ? "We'll send you a code to verify your number"
                : `Code sent to ${phoneNumber}`
              }
            </p>
          </div>

          {step === 'phone' ? (
            /* Step 1: Phone Number Input */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-obsidian-600 dark:text-obsidian-200 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-obsidian-400 dark:text-obsidian-300">
                    <Phone className="w-5 h-5" />
                    <span className="text-obsidian-600 dark:text-obsidian-200 font-medium">+1</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="(555) 555-5555"
                    className="w-full pl-20 pr-4 py-4 rounded-2xl 
                             bg-white dark:bg-obsidian-700
                             border border-obsidian-200 dark:border-obsidian-500
                             text-obsidian dark:text-white
                             placeholder-obsidian-400 dark:placeholder-obsidian-400
                             focus:border-cyan focus:ring-2 focus:ring-cyan/20 
                             outline-none transition-all text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <button
                id="send-code-button"
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.replace(/\D/g, '').length !== 10}
                className="w-full py-4 rounded-full bg-obsidian dark:bg-obsidian-600 text-white font-medium
                         hover:bg-obsidian-600 dark:hover:bg-obsidian-500 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  'Send Code'
                )}
              </button>
            </div>
          ) : (
            /* Step 2: Verification Code Input */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-obsidian-600 dark:text-obsidian-200 mb-4 text-center">
                  6-digit code
                </label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => { codeInputsRef.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={verificationCode[index] || ''}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text');
                        handleCodeChange(0, pastedData);
                      }}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl 
                               bg-white dark:bg-obsidian-700
                               border border-obsidian-200 dark:border-obsidian-500
                               text-obsidian dark:text-white
                               focus:border-cyan focus:ring-2 focus:ring-cyan/20 
                               outline-none transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full py-4 rounded-full bg-obsidian dark:bg-obsidian-600 text-white font-medium
                         hover:bg-obsidian-600 dark:hover:bg-obsidian-500 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-cyan-600 dark:text-cyan hover:text-cyan-700 dark:hover:text-cyan-400 font-medium inline-flex items-center gap-2
                           disabled:text-obsidian-300 dark:disabled:text-obsidian-400 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

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

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default PhoneAuth;
