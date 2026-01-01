import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Calendar, Target, Heart, DollarSign, Home, Car } from 'lucide-react';
import { useAuthStore, createDemoUser } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Landing = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleDemoLogin = () => {
    const demoUser = createDemoUser();
    setUser(demoUser, true); // Pass true for demo mode
    navigate('/app');
  };

  const features = [
    { icon: Target, title: 'Goal Tracking', desc: 'Set and crush your 2025 goals' },
    { icon: Calendar, title: 'Smart Reminders', desc: 'Never miss important dates' },
    { icon: Heart, title: 'Health', desc: 'Appointments & wellness tracking' },
    { icon: DollarSign, title: 'Finances', desc: 'Bills, budgets & subscriptions' },
    { icon: Home, title: 'Home', desc: 'Maintenance schedules & tasks' },
    { icon: Car, title: 'Auto', desc: 'Registration, insurance & upkeep' },
  ];

  const getYearProgress = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const total = endOfYear.getTime() - startOfYear.getTime();
    const elapsed = now.getTime() - startOfYear.getTime();
    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-obsidian-800 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/3 rounded-full blur-3xl" />
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between safe-top safe-x">
          <Logo size="md" variant="light" />
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Year progress indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8"
            >
              <Star className="w-4 h-4 text-cyan" />
              <span className="text-white/80 text-sm">
                {getYearProgress()}% through 2025 — make it count
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              The Science of{' '}
              <span className="gradient-text">Mindful Evolution</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/60 mb-10 max-w-lg mx-auto"
            >
              One beautiful app to manage your goals, habits, health, finances, and life. 
              Designed for fresh starts and meaningful progress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={handleSignIn}
                className="btn-cyan group w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={handleDemoLogin}
                className="px-6 py-3 text-white/80 font-medium hover:text-white transition-colors w-full sm:w-auto"
              >
                Try Demo Mode
              </button>
            </motion.div>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 
                           hover:bg-white/10 hover:border-cyan/30 transition-all duration-300
                           cursor-default group"
              >
                <feature.icon className="w-6 h-6 text-cyan mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-white/40 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-400 to-cyan-400 
                             border-2 border-obsidian-800 flex items-center justify-center text-xs font-medium text-obsidian"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm">
              Join thousands making 2025 their best year yet
            </p>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 text-center safe-bottom safe-x">
          <p className="text-white/30 text-sm">
            Free forever • No ads • Your data stays on your device
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
