import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    title: 'General Questions',
    items: [
      {
        question: 'What is M.E. Truth and Momentous Year?',
        answer: 'M.E. Truth (Mindful Evolution Truth) is our brand philosophy—the Science of Mindful Evolution. It bridges Eastern mindfulness practices with Western productivity and personal development. Momentous Year is our mobile app that puts this philosophy into action, helping you set meaningful goals, build habits, journal, meditate, and track your progress across all areas of life.',
      },
      {
        question: 'What does "M.E." stand for?',
        answer: '"M.E." stands for Mindful Evolution. It represents the integration of mindful awareness (being present, intentional, and conscious) with continuous personal evolution (growth, progress, and development). It\'s also about discovering your own truth—the "M.E." in your journey.',
      },
      {
        question: 'How much does it cost?',
        answer: 'We offer a 7-day free trial, then just $2.99/year or $14.99 for lifetime access. We believe personal development tools should be accessible, so we keep our pricing reasonable.',
      },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      {
        question: 'Is my data safe?',
        answer: 'Absolutely. Your privacy is our top priority. Your journal entries, goals, and personal reflections are encrypted and stored securely. We never sell your data or use it for advertising. You have full control over your information and can delete it at any time.',
      },
      {
        question: 'Can I use the app offline?',
        answer: 'Yes! Core features work offline using local storage. Your data syncs automatically when you\'re back online if you have cloud sync enabled. Meditation timers, journaling, and goal tracking all work without an internet connection.',
      },
      {
        question: 'What happens to my data if I delete the app?',
        answer: 'If you only have local storage enabled, deleting the app will remove your data. If you have cloud sync enabled, your data remains in your account and will restore when you reinstall. To permanently delete all data, use the Delete Account feature in Settings before uninstalling.',
      },
    ],
  },
  {
    title: 'Features & Functionality',
    items: [
      {
        question: 'What are Life Domains?',
        answer: 'Life Domains are the key areas of your life that matter most: Health, Finance, Career, Relationships, Wellness, Home, and more. Instead of scattered to-do lists, Momentous Year organizes your goals and habits within these domains, giving you a holistic view of your life and helping you maintain balance.',
      },
      {
        question: 'How does the AI assistant work?',
        answer: 'Our AI assistant uses Google\'s Gemini technology to provide personalized guidance and support. It can help you break down goals, suggest habits, provide encouragement, and offer insights based on your progress. Think of it as a supportive coach available 24/7. All AI interactions are private and not used for training.',
      },
      {
        question: 'Can I track habits and streaks?',
        answer: 'Yes! Habit tracking with streak counting is a core feature. You can create daily, weekly, or custom habits, track your completion, and watch your streaks grow. Visual progress indicators help you stay motivated, and gentle reminders keep you on track.',
      },
      {
        question: 'What meditation and mindfulness tools are included?',
        answer: 'The app includes breathing exercises, meditation timers, grounding techniques, positive affirmations, and focus timers. These tools are designed to be simple and accessible, whether you\'re new to mindfulness or an experienced practitioner.',
      },
      {
        question: 'Is there a journaling feature?',
        answer: 'Absolutely! Journaling is central to mindful evolution. You can write free-form entries, respond to prompts, track your mood, and reflect on your progress. Your journal is completely private and encrypted.',
      },
      {
        question: 'Can I customize the app?',
        answer: 'Yes! You can customize which Life Domains to display, adjust notification settings, choose your preferred theme (light or dark mode), and configure which features appear on your dashboard. The app adapts to how you work best.',
      },
    ],
  },
  {
    title: 'Technical Questions',
    items: [
      {
        question: 'What devices is the app available on?',
        answer: 'Momentous Year is currently available on the web at metruth.com. An iOS app is coming soon, with Android to follow. You can access all features from any modern web browser.',
      },
      {
        question: 'How do I transfer my data to a new phone?',
        answer: 'If you have cloud sync enabled, simply log into your account on your new device and your data will automatically sync. If you\'re using local storage only, use the Export feature to backup your data before switching devices, then Import on your new device.',
      },
      {
        question: 'Why do I need to create an account?',
        answer: 'An account enables cloud sync across devices, secure data backup, and access to premium features. Your email is only used for authentication and is not linked to your personal content.',
      },
    ],
  },
  {
    title: 'Support & Contact',
    items: [
      {
        question: 'How do I get help or report a bug?',
        answer: 'Email us at support@metruth.com with your question or bug report. Please include your device type and app version to help us assist you faster. We typically respond within 24-48 hours.',
      },
      {
        question: 'Can I request new features?',
        answer: 'Absolutely! We love hearing from our community. Send feature requests to support@metruth.com. User feedback directly shapes our development roadmap.',
      },
      {
        question: 'Is this app made by a big company?',
        answer: 'M.E. Truth is created and maintained by Haro LLC, a small team passionate about personal development and mindful living. We built this because we needed it ourselves and wanted to share it with others on similar journeys.',
      },
    ],
  },
  {
    title: 'Philosophy & Approach',
    items: [
      {
        question: 'What makes this different from other goal-setting apps?',
        answer: 'Most productivity apps focus solely on output—checking boxes and hitting targets. M.E. Truth integrates mindfulness with goal-setting, recognizing that sustainable growth requires both action AND awareness. We help you not just achieve goals, but understand why they matter and how you\'re evolving in the process.',
      },
      {
        question: 'Do I need to be into meditation to use this app?',
        answer: 'Not at all! The mindfulness features are optional. If you just want a beautiful, organized way to track goals and habits, Momentous Year works great for that. The mindfulness tools are there when and if you want to explore them.',
      },
      {
        question: 'What is the "Science of Mindful Evolution"?',
        answer: 'It\'s our approach that combines evidence-based productivity techniques (goal-setting, habit formation, progress tracking) with mindfulness practices (presence, self-awareness, intentional living). The "science" is in the systematic approach; the "mindful" is in the quality of attention you bring to your growth.',
      },
    ],
  },
];

const FAQ = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-obsidian-800 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-obsidian-800/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" variant="light" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-sage" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
              <p className="text-white/60">M.E. Truth & Momentous Year</p>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqData.map((section, sectionIndex) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <h2 className="text-xl font-semibold text-cyan mb-4">{section.title}</h2>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => {
                    const itemId = `${sectionIndex}-${itemIndex}`;
                    const isOpen = openItems.has(itemId);

                    return (
                      <div
                        key={itemId}
                        className="bg-white/5 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="font-medium text-white pr-4">{item.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-white/60 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p className="px-5 pb-4 text-white/70 leading-relaxed">
                                {item.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-white/60 mb-4">Still have questions?</p>
            <a
              href="mailto:support@metruth.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-obsidian font-semibold rounded-xl hover:bg-cyan-400 transition-colors"
            >
              Contact us at support@metruth.com
            </a>
            <p className="text-white/40 text-sm mt-4">
              Visit us at <a href="https://metruth.com" className="text-cyan hover:underline">metruth.com</a>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQ;
