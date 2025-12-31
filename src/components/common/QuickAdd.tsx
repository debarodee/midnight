import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  CheckCircle2, 
  Bell, 
  BookOpen, 
  Sparkles,
  Send,
} from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
}

type AddType = 'task' | 'goal' | 'reminder' | 'journal' | 'quick';

const QuickAdd = ({ isOpen, onClose }: QuickAddProps) => {
  const [activeType, setActiveType] = useState<AddType>('quick');
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTask, addGoal, addReminder, addJournalEntry } = useDataStore();

  const types = [
    { id: 'quick' as const, icon: Sparkles, label: 'Quick Add' },
    { id: 'task' as const, icon: CheckCircle2, label: 'Task' },
    { id: 'goal' as const, icon: Target, label: 'Goal' },
    { id: 'reminder' as const, icon: Bell, label: 'Reminder' },
    { id: 'journal' as const, icon: BookOpen, label: 'Journal' },
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsSubmitting(true);

    try {
      const now = new Date();
      
      switch (activeType) {
        case 'task':
        case 'quick':
          addTask({
            userId: '',
            title: input,
            isCompleted: false,
            priority: 'medium',
          });
          break;
        case 'goal':
          addGoal({
            userId: '',
            title: input,
            category: 'personal',
            progress: 0,
            milestones: [],
            isCompleted: false,
            isPinned: false,
          });
          break;
        case 'reminder':
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(9, 0, 0, 0);
          addReminder({
            userId: '',
            title: input,
            dueDate: tomorrow,
            isCompleted: false,
            priority: 'medium',
          });
          break;
        case 'journal':
          addJournalEntry({
            userId: '',
            date: now,
            content: input,
          });
          break;
      }

      setInput('');
      onClose();
    } catch (error) {
      console.error('Failed to add:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    switch (activeType) {
      case 'quick': return 'Type anything... "Call dentist tomorrow" or "Run 3x this week"';
      case 'task': return 'What needs to be done?';
      case 'goal': return 'What do you want to achieve?';
      case 'reminder': return 'What should I remind you about?';
      case 'journal': return 'What\'s on your mind?';
      default: return 'Type something...';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-midnight/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 
                       bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl z-50 
                       max-h-[80vh] lg:max-h-none lg:w-full lg:max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-midnight">Add New</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-midnight-400" />
              </button>
            </div>

            {/* Type selector */}
            <div className="flex gap-2 p-4 overflow-x-auto">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${activeType === type.id 
                      ? 'bg-midnight text-white' 
                      : 'bg-slate-100 text-midnight-400 hover:bg-slate-200'
                    }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="p-4">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  rows={activeType === 'journal' ? 4 : 2}
                  className="input-field resize-none pr-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && activeType !== 'journal') {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isSubmitting}
                  className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-champagne hover:bg-champagne-400 
                             disabled:bg-slate-200 disabled:text-slate-400
                             flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-midnight" />
                </button>
              </div>

              {activeType === 'quick' && (
                <p className="text-xs text-midnight-300 mt-3">
                  💡 Try natural language: "Buy groceries by Friday" or "Schedule dentist appointment"
                </p>
              )}
            </div>

            {/* Safe area padding for mobile */}
            <div className="safe-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAdd;
