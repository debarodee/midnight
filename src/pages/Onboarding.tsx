import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { saveOnboardingData } from '../lib/firebase';
import Logo from '../components/common/Logo';
import type { OnboardingData } from '../types';
import {
  Sparkles,
  Building2,
  Dumbbell,
  BookOpen,
  Palette,
  ArrowRight,
} from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<OnboardingData>({
    mindfulnessLevel: 50,
    evolutionPath: null,
    displayName: user?.displayName || user?.email?.split('@')[0] || '',
    completedAt: null,
  });

  // Get display name fallback: (1) auth displayName, (2) email prefix, (3) empty string
  useEffect(() => {
    if (user) {
      let displayName = '';
      if (user.displayName) {
        displayName = user.displayName;
      } else if (user.email) {
        displayName = user.email.split('@')[0];
      }
      setUserData((prev) => ({ ...prev, displayName }));
    }
  }, [user]);

  // Auto-advance Step 4 after animation
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setTimeout(() => {
        setCurrentStep(5);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = async () => {
    // Save whatever data we have and mark onboarding as complete
    await saveOnboardingData(user!.id, {
      ...userData,
      completedAt: new Date(),
    });
    
    // Update user store
    const { setUser } = useAuthStore.getState();
    setUser({
      ...user!,
      hasCompletedOnboarding: true,
      onboarding: { ...userData, completedAt: new Date() },
      displayName: userData.displayName || user!.displayName,
    });
    
    navigate('/app');
  };

  const handleComplete = async () => {
    await saveOnboardingData(user!.id, {
      ...userData,
      completedAt: new Date(),
    });
    
    // Update user store
    const { setUser } = useAuthStore.getState();
    setUser({
      ...user!,
      hasCompletedOnboarding: true,
      onboarding: { ...userData, completedAt: new Date() },
      displayName: userData.displayName,
    });
    
    navigate('/app');
  };

  const updateMindfulnessLevel = (value: number) => {
    setUserData((prev) => ({ ...prev, mindfulnessLevel: value }));
  };

  const selectEvolutionPath = (path: string) => {
    setUserData((prev) => ({ ...prev, evolutionPath: path }));
  };

  const updateDisplayName = (name: string) => {
    setUserData((prev) => ({ ...prev, displayName: name }));
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1Hero key="step1" onNext={handleNext} onSkip={handleSkip} />
          )}
          {currentStep === 2 && (
            <Step2MindfulnessSlider
              key="step2"
              value={userData.mindfulnessLevel}
              onChange={updateMindfulnessLevel}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
          {currentStep === 3 && (
            <Step3EvolutionPath
              key="step3"
              selected={userData.evolutionPath}
              onSelect={selectEvolutionPath}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
          {currentStep === 4 && (
            <Step4IntegrationAnimation
              key="step4"
              mindfulnessLevel={userData.mindfulnessLevel}
              evolutionPath={userData.evolutionPath}
            />
          )}
          {currentStep === 5 && (
            <Step5CompleteSetup
              key="step5"
              displayName={userData.displayName}
              onChange={updateDisplayName}
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Step 1: Hero Screen
const Step1Hero = ({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-8 flex justify-center"
      >
        <Logo size="xl" variant="light" />
      </motion.div>

      <h1 className="text-3xl font-bold text-white mb-2">M.E. Truth</h1>
      <p className="text-xl text-[#00F5FF] mb-12">Mindful Evolution</p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full bg-[#00F5FF] text-[#050505] font-semibold py-4 rounded-full mb-6 hover:shadow-[0_0_30px_-5px_rgba(0,245,255,0.5)] transition-shadow"
      >
        Find Your Truth
      </motion.button>

      <SkipLink onSkip={onSkip} />
    </motion.div>
  );
};

// Step 2: Mindfulness Slider
const Step2MindfulnessSlider = ({
  value,
  onChange,
  onNext,
  onSkip,
}: {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onSkip: () => void;
}) => {
  const getLabel = () => {
    if (value < 25) return 'Chaos';
    if (value < 50) return 'Turbulent';
    if (value < 75) return 'Calm';
    return 'Still Water';
  };

  const getIcon = () => {
    if (value < 25) return '🌊';
    if (value < 50) return '🌊';
    if (value < 75) return '🌊';
    return '💧';
  };

  // Calculate gradient position (lavender to cyan)
  const gradientPosition = value / 100;
  const lavenderAmount = 1 - gradientPosition;
  const cyanAmount = gradientPosition;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        How's your mental space right now?
      </h2>
      <p className="text-white/60 text-center mb-12">Move the slider to reflect your current state</p>

      <div className="mb-12">
        {/* Custom Slider */}
        <div className="relative">
          <div className="flex justify-between mb-4">
            <span className="text-white/60 text-sm">Chaos</span>
            <span className="text-white/60 text-sm">Still Water</span>
          </div>

          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, 
                  rgba(138, 43, 226, ${lavenderAmount}), 
                  rgba(0, 245, 255, ${cyanAmount}))`,
              }}
            />

            {/* Slider track */}
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Thumb indicator */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg z-20"
              style={{
                left: `calc(${value}% - 12px)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </div>

          {/* Current state indicator */}
          <div className="mt-6 text-center">
            <div className="text-4xl mb-2">{getIcon()}</div>
            <p className="text-[#00F5FF] font-semibold text-lg">{getLabel()}</p>
            <p className="text-white/40 text-sm mt-1">Internal Noise: {value}%</p>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full bg-[#00F5FF] text-[#050505] font-semibold py-4 rounded-full mb-6 hover:shadow-[0_0_30px_-5px_rgba(0,245,255,0.5)] transition-shadow"
      >
        Continue
      </motion.button>

      <SkipLink onSkip={onSkip} />
    </motion.div>
  );
};

// Step 3: Evolution Path
const Step3EvolutionPath = ({
  selected,
  onSelect,
  onNext,
  onSkip,
}: {
  selected: string | null;
  onSelect: (path: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) => {
  const paths = [
    {
      id: 'architect',
      title: 'Architect',
      description: 'Building systems and structure',
      icon: Building2,
      color: '#00F5FF',
    },
    {
      id: 'athlete',
      title: 'Athlete',
      description: 'Physical health and discipline',
      icon: Dumbbell,
      color: '#00F5FF',
    },
    {
      id: 'sage',
      title: 'Sage',
      description: 'Wisdom and inner peace',
      icon: BookOpen,
      color: '#8A2BE2',
    },
    {
      id: 'creator',
      title: 'Creator',
      description: 'Expression and ideas',
      icon: Palette,
      color: '#8A2BE2',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        What kind of growth are you seeking?
      </h2>
      <p className="text-white/60 text-center mb-8">Choose your evolution path</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {paths.map((path) => {
          const Icon = path.icon;
          const isSelected = selected === path.id;

          return (
            <motion.button
              key={path.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(path.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? `border-[${path.color}] bg-[${path.color}]/10 shadow-[0_0_30px_-5px_rgba(0,245,255,0.4)]`
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              style={
                isSelected
                  ? {
                      borderColor: path.color,
                      backgroundColor: `${path.color}15`,
                      boxShadow: `0 0 30px -5px ${path.color}66`,
                    }
                  : {}
              }
            >
              <Icon
                className={`w-8 h-8 mb-3 ${
                  isSelected ? `text-[${path.color}]` : 'text-white/60'
                }`}
                style={isSelected ? { color: path.color } : {}}
              />
              <h3 className="text-white font-semibold mb-1">{path.title}</h3>
              <p className="text-white/60 text-sm">{path.description}</p>
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full bg-[#00F5FF] text-[#050505] font-semibold py-4 rounded-full mb-6 hover:shadow-[0_0_30px_-5px_rgba(0,245,255,0.5)] transition-shadow"
        >
          Continue
        </motion.button>
      )}

      <SkipLink onSkip={onSkip} />
    </motion.div>
  );
};

// Step 4: Integration Animation
const Step4IntegrationAnimation = ({
  mindfulnessLevel,
  evolutionPath,
}: {
  mindfulnessLevel: number;
  evolutionPath: string | null;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="relative w-64 h-64 mx-auto mb-8">
        {/* Particles converging */}
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 100;
          const startX = Math.cos(angle) * radius;
          const startY = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#00F5FF]"
              initial={{
                x: startX,
                y: startY,
                opacity: 1,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: progress > 50 ? 0.3 : 1,
                scale: progress > 50 ? 0.5 : 1,
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
              }}
              style={{
                left: '50%',
                top: '50%',
                marginLeft: -4,
                marginTop: -4,
              }}
            />
          );
        })}

        {/* Central merging shape */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: progress > 30 ? 1 : 0,
            opacity: progress > 30 ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, 
                rgba(0, 245, 255, ${progress / 100}), 
                rgba(138, 43, 226, ${progress / 100}))`,
              filter: 'blur(20px)',
            }}
          />
        </motion.div>

        {/* Sparkles icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: progress > 70 ? 1 : 0,
            opacity: progress > 70 ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-16 h-16 text-[#00F5FF]" />
        </motion.div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Synthesizing your path...</h2>
      <p className="text-white/60">We're integrating your choices</p>
    </motion.div>
  );
};

// Step 5: Complete Setup
const Step5CompleteSetup = ({
  displayName,
  onChange,
  onComplete,
  onSkip,
}: {
  displayName: string;
  onChange: (name: string) => void;
  onComplete: () => void;
  onSkip: () => void;
}) => {
  const { user } = useAuthStore();
  const fallbackName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2 text-center">One last thing</h2>
      <p className="text-white/60 text-center mb-8">How should we address you?</p>

      <div className="mb-8">
        <input
          type="text"
          value={displayName}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fallbackName}
          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 transition-all"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onComplete}
        disabled={!displayName.trim()}
        className="w-full bg-[#00F5FF] text-[#050505] font-semibold py-4 rounded-full mb-6 hover:shadow-[0_0_30px_-5px_rgba(0,245,255,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Enter Dashboard
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      <SkipLink onSkip={onSkip} />
    </motion.div>
  );
};

// Skip Link Component
const SkipLink = ({ onSkip }: { onSkip: () => void }) => {
  return (
    <button
      onClick={onSkip}
      className="w-full text-white/40 hover:text-white/60 text-sm transition-colors"
    >
      Skip for now
    </button>
  );
};

export default Onboarding;
