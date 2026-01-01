import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

const features = [
  {
    title: 'Keep Track of Your Health',
    description: 'Set reminders for checkups, track prescriptions, store doctor info, and jot down personal health notes — all in one secure place.',
  },
  {
    title: 'Never Miss a Deadline',
    description: 'Get reminders for car maintenance, registration renewals, and bills. Stay ahead without the mental load.',
  },
  {
    title: 'Stay on Top of Your Budget',
    description: 'Track bills and upcoming paychecks without connecting your bank. See what\'s due before your next pay.',
  },
  {
    title: 'Your Goals, Your Way',
    description: 'Set meaningful goals, track progress, and get AI-powered suggestions to keep momentum going.',
  },
  {
    title: 'Journal Your Journey',
    description: 'Daily journaling with mood tracking, tags, and prompts. Reflect on wins and work through challenges.',
  },
  {
    title: 'AI Life Assistant',
    description: 'Ask anything — productivity tips, adulting advice, or help prioritizing your day. Context-aware and private.',
  },
];

const mockups = [
  { src: '/mockup-dashboard.png', alt: 'Dashboard view showing tasks and life domains' },
  { src: '/mockup-assistant.png', alt: 'AI Assistant providing personalized guidance' },
  { src: '/mockup-journal.png', alt: 'Journal with mood tracking and tags' },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/login/email');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-obsidian-800 text-white">
      {/* Section 1: Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Logo size="xl" variant="light" className="mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            M.E. Truth
          </h1>
          <p className="text-xl text-cyan font-medium">
            Mindful Evolution
          </p>
        </motion.div>
      </header>

      {/* Section 2: Value Proposition */}
      <section className="px-6 py-12 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl text-white/80 leading-relaxed"
        >
          Finally, an app that is <em className="text-cyan font-medium not-italic">actually</em> all-in-one. 
          AI-powered assistance, no ads, no tracking — your data stays yours.
        </motion.p>
      </section>

      {/* Section 3: Feature Blocks */}
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h3 className="text-xl font-bold text-cyan mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Download CTA */}
      <section className="px-6 py-16 text-center bg-obsidian-700/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide">
            GET MOMENTOUS YEAR
          </h2>
          <p className="text-white/60 mb-6">
            Available on Web • iOS coming soon
          </p>
          
          {/* Pricing */}
          <div className="mb-8">
            <p className="text-3xl font-bold text-white mb-1">
              Just $2.99/year
            </p>
            <p className="text-cyan text-lg">
              or $14.99 Lifetime
            </p>
          </div>

          {/* Buttons */}
          <button
            onClick={handleSignUp}
            className="w-full btn-cyan text-lg py-4 mb-4 group"
          >
            Sign Up — 7 Day FREE Trial
            <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-white/50">
            Already have an account?{' '}
            <button
              onClick={handleSignIn}
              className="text-cyan hover:text-cyan-400 font-medium underline underline-offset-2"
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </section>

      {/* Section 5: App Screenshots */}
      <section className="py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-center text-white/40 text-sm uppercase tracking-widest mb-8">
            See it in action
          </h3>
          
          {/* Horizontal scroll container */}
          <div className="flex gap-6 px-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide justify-center">
            {mockups.map((mockup, index) => (
              <motion.div
                key={mockup.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.15, duration: 0.5 }}
                className="flex-shrink-0 snap-center"
              >
                <img
                  src={mockup.src}
                  alt={mockup.alt}
                  className="h-[500px] md:h-[600px] w-auto rounded-3xl shadow-2xl"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 6: Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/40 mb-4">
            © 2025 M.E. Truth
          </p>
          <nav className="flex items-center justify-center gap-6 text-sm">
            <Link to="/privacy" className="text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/terms" className="text-white/40 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <a href="mailto:hello@metruth.com" className="text-white/40 hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
