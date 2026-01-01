import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  ChevronRight, 
  Edit2, 
  Trash2,
  CheckCircle2,
  Star,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import type { Goal, GoalCategory } from '../types';
import { EXAMPLE_GOALS } from '../constants/exampleContent';

const categoryColors: Record<GoalCategory, { bg: string; text: string }> = {
  health: { bg: 'bg-red-50 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400' },
  finance: { bg: 'bg-green-50 dark:bg-green-500/20', text: 'text-green-600 dark:text-green-400' },
  career: { bg: 'bg-blue-50 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
  relationships: { bg: 'bg-pink-50 dark:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400' },
  personal: { bg: 'bg-lavender-50 dark:bg-lavender/20', text: 'text-lavender-600 dark:text-lavender' },
  learning: { bg: 'bg-yellow-50 dark:bg-yellow-500/20', text: 'text-yellow-600 dark:text-yellow-400' },
  home: { bg: 'bg-orange-50 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400' },
  wellness: { bg: 'bg-teal-50 dark:bg-teal-500/20', text: 'text-teal-600 dark:text-teal-400' },
};

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useDataStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredGoals = goals.filter((g) => {
    if (filter === 'active') return !g.isCompleted;
    if (filter === 'completed') return g.isCompleted;
    return true;
  });

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-obsidian dark:text-white mb-1">Goals</h1>
          <p className="text-obsidian-400 dark:text-obsidian-300">
            {activeGoals.length} active • {completedGoals.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all
              ${filter === f 
                ? 'bg-obsidian dark:bg-cyan text-white dark:text-obsidian' 
                : 'bg-obsidian-100 dark:bg-obsidian-600 text-obsidian-400 dark:text-obsidian-300 hover:bg-obsidian-200 dark:hover:bg-obsidian-500'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        goals.length === 0 ? (
          // Show example goals for brand new users
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-lavender/10 dark:bg-lavender/20 rounded-xl text-lavender text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Here's what your goals could look like:</span>
            </div>
            
            <div className="grid gap-4 opacity-75 pointer-events-none">
              {EXAMPLE_GOALS.map((goal, index) => (
                <ExampleGoalCard key={goal.id} goal={goal} index={index} />
              ))}
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Goal
              </button>
            </div>
          </motion.div>
        ) : (
          // User has goals but filter shows none
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <Target className="w-16 h-16 text-obsidian-200 dark:text-obsidian-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-obsidian dark:text-white mb-2">No {filter} goals</h3>
            <p className="text-obsidian-400 dark:text-obsidian-300 mb-6">
              {filter === 'active' ? 'All your goals are completed!' : 'No completed goals yet.'}
            </p>
            <button onClick={() => setShowAddModal(true)} className="btn-secondary">
              <Plus className="w-5 h-5 mr-2" />
              Create New Goal
            </button>
          </motion.div>
        )
      ) : (
        <div className="grid gap-4">
          {filteredGoals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onEdit={() => setEditingGoal(goal)}
              onDelete={() => deleteGoal(goal.id)}
              onToggleComplete={() => updateGoal(goal.id, { isCompleted: !goal.isCompleted })}
              onUpdateProgress={(progress) => updateGoal(goal.id, { progress })}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <GoalModal
        isOpen={showAddModal || !!editingGoal}
        onClose={() => {
          setShowAddModal(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
        onSave={(data) => {
          if (editingGoal) {
            updateGoal(editingGoal.id, data);
          } else {
            addGoal({
              userId: '',
              title: data.title || '',
              description: data.description,
              category: data.category || 'personal',
              progress: data.progress ?? 0,
              milestones: [],
              isCompleted: false,
              isPinned: false,
            });
          }
          setShowAddModal(false);
          setEditingGoal(null);
        }}
      />
    </div>
  );
};

// Goal Card Component
interface GoalCardProps {
  goal: Goal;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onUpdateProgress: (progress: number) => void;
}

const GoalCard = ({ goal, index, onEdit, onDelete, onToggleComplete, onUpdateProgress }: GoalCardProps) => {
  const colors = categoryColors[goal.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card ${goal.isCompleted ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onToggleComplete}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors
            ${goal.isCompleted 
              ? 'bg-sage border-sage text-white' 
              : 'border-obsidian-200 dark:border-obsidian-400 hover:border-sage'
            }`}
        >
          {goal.isCompleted && <CheckCircle2 className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} capitalize`}>
              {goal.category}
            </span>
            {goal.isPinned && <Star className="w-4 h-4 text-cyan fill-cyan" />}
          </div>

          <h3 className={`font-semibold text-obsidian dark:text-white mb-2 ${goal.isCompleted ? 'line-through' : ''}`}>
            {goal.title}
          </h3>

          {goal.description && (
            <p className="text-sm text-obsidian-400 dark:text-obsidian-300 mb-4">{goal.description}</p>
          )}

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-obsidian-400 dark:text-obsidian-300">Progress</span>
              <span className="font-medium text-obsidian dark:text-white">{goal.progress}%</span>
            </div>
            <div className="w-full h-2 bg-obsidian-100 dark:bg-obsidian-500 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan to-lavender rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Quick progress buttons */}
          {!goal.isCompleted && (
            <div className="flex gap-2">
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => onUpdateProgress(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                    ${goal.progress >= p 
                      ? 'bg-lavender/20 text-lavender' 
                      : 'bg-obsidian-100 dark:bg-obsidian-600 text-obsidian-400 dark:text-obsidian-300 hover:bg-obsidian-200 dark:hover:bg-obsidian-500'
                    }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-600 text-obsidian-400 dark:text-obsidian-300 hover:text-obsidian dark:hover:text-white transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-obsidian-400 dark:text-obsidian-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Example Goal Card Component (for empty state)
const ExampleGoalCard = ({ goal, index }: { goal: Goal; index: number }) => {
  const colors = categoryColors[goal.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card"
    >
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-obsidian-200 dark:border-obsidian-500 flex-shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} capitalize`}>
              {goal.category}
            </span>
            {goal.isPinned && <Star className="w-4 h-4 text-cyan fill-cyan" />}
          </div>

          <h3 className="font-semibold text-obsidian dark:text-white mb-2">{goal.title}</h3>

          {goal.description && (
            <p className="text-sm text-obsidian-400 dark:text-obsidian-300 mb-4">{goal.description}</p>
          )}

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-obsidian-400 dark:text-obsidian-300">Progress</span>
              <span className="font-medium text-obsidian dark:text-white">{goal.progress}%</span>
            </div>
            <div className="w-full h-2 bg-obsidian-100 dark:bg-obsidian-500 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan to-lavender rounded-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>

          {/* Quick progress buttons */}
          <div className="flex gap-2">
            {[25, 50, 75, 100].map((p) => (
              <span
                key={p}
                className={`px-3 py-1 rounded-lg text-xs font-medium
                  ${goal.progress >= p 
                    ? 'bg-lavender/20 text-lavender' 
                    : 'bg-obsidian-100 dark:bg-obsidian-600 text-obsidian-400 dark:text-obsidian-300'
                  }`}
              >
                {p}%
              </span>
            ))}
          </div>
        </div>

        {/* Actions placeholder */}
        <div className="flex items-center gap-1">
          <div className="p-2 rounded-lg text-obsidian-200 dark:text-obsidian-500">
            <Edit2 className="w-4 h-4" />
          </div>
          <div className="p-2 rounded-lg text-obsidian-200 dark:text-obsidian-500">
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Goal Modal Component
interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSave: (data: Partial<Goal>) => void;
}

const GoalModal = ({ isOpen, onClose, goal, onSave }: GoalModalProps) => {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [category, setCategory] = useState<GoalCategory>(goal?.category || 'personal');
  const [progress, setProgress] = useState(goal?.progress || 0);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title, description, category, progress });
    setTitle('');
    setDescription('');
    setCategory('personal');
    setProgress(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-obsidian/30 dark:bg-obsidian/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
                   bg-white dark:bg-obsidian-700 rounded-t-3xl lg:rounded-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto
                   lg:w-full lg:max-w-lg"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-obsidian dark:text-white mb-6">
            {goal ? 'Edit Goal' : 'New Goal'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-obsidian dark:text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-obsidian dark:text-white mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-obsidian dark:text-white mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(categoryColors) as GoalCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-xl text-xs font-medium capitalize transition-all
                      ${category === cat
                        ? `${categoryColors[cat].bg} ${categoryColors[cat].text} ring-2 ring-offset-2 ring-current dark:ring-offset-obsidian-700`
                        : 'bg-obsidian-100 dark:bg-obsidian-600 text-obsidian-400 dark:text-obsidian-300 hover:bg-obsidian-200 dark:hover:bg-obsidian-500'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {goal && (
              <div>
                <label className="block text-sm font-medium text-obsidian dark:text-white mb-2">Progress: {progress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Goals;
