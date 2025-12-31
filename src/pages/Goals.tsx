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
  health: { bg: 'bg-red-50', text: 'text-red-600' },
  finance: { bg: 'bg-green-50', text: 'text-green-600' },
  career: { bg: 'bg-blue-50', text: 'text-blue-600' },
  relationships: { bg: 'bg-pink-50', text: 'text-pink-600' },
  personal: { bg: 'bg-violet-50', text: 'text-violet-600' },
  learning: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  home: { bg: 'bg-orange-50', text: 'text-orange-600' },
  wellness: { bg: 'bg-teal-50', text: 'text-teal-600' },
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
          <h1 className="text-2xl lg:text-3xl font-bold text-midnight mb-1">Goals</h1>
          <p className="text-midnight-300">
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
                ? 'bg-midnight text-white' 
                : 'bg-slate-100 text-midnight-400 hover:bg-slate-200'
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
            <div className="flex items-center gap-2 px-4 py-2 bg-violet/10 rounded-xl text-violet text-sm">
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
            <Target className="w-16 h-16 text-midnight-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-midnight mb-2">No {filter} goals</h3>
            <p className="text-midnight-300 mb-6">
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
              : 'border-midnight-200 hover:border-sage'
            }`}
        >
          {goal.isCompleted && <CheckCircle2 className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} capitalize`}>
              {goal.category}
            </span>
            {goal.isPinned && <Star className="w-4 h-4 text-champagne fill-champagne" />}
          </div>

          <h3 className={`font-semibold text-midnight mb-2 ${goal.isCompleted ? 'line-through' : ''}`}>
            {goal.title}
          </h3>

          {goal.description && (
            <p className="text-sm text-midnight-300 mb-4">{goal.description}</p>
          )}

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-midnight-400">Progress</span>
              <span className="font-medium text-midnight">{goal.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet to-champagne rounded-full"
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
                      ? 'bg-violet-100 text-violet' 
                      : 'bg-slate-100 text-midnight-400 hover:bg-slate-200'
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
            className="p-2 rounded-lg hover:bg-slate-100 text-midnight-400 hover:text-midnight transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-50 text-midnight-400 hover:text-red-500 transition-colors"
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
        <div className="w-6 h-6 rounded-full border-2 border-midnight-200 flex-shrink-0 mt-1" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} capitalize`}>
              {goal.category}
            </span>
            {goal.isPinned && <Star className="w-4 h-4 text-champagne fill-champagne" />}
          </div>

          <h3 className="font-semibold text-midnight mb-2">{goal.title}</h3>

          {goal.description && (
            <p className="text-sm text-midnight-300 mb-4">{goal.description}</p>
          )}

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-midnight-400">Progress</span>
              <span className="font-medium text-midnight">{goal.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet to-champagne rounded-full"
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
                    ? 'bg-violet-100 text-violet' 
                    : 'bg-slate-100 text-midnight-400'
                  }`}
              >
                {p}%
              </span>
            ))}
          </div>
        </div>

        {/* Actions placeholder */}
        <div className="flex items-center gap-1">
          <div className="p-2 rounded-lg text-midnight-200">
            <Edit2 className="w-4 h-4" />
          </div>
          <div className="p-2 rounded-lg text-midnight-200">
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
        className="fixed inset-0 bg-midnight/30 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
                   bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto
                   lg:w-full lg:max-w-lg"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-midnight mb-6">
            {goal ? 'Edit Goal' : 'New Goal'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Title</label>
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
              <label className="block text-sm font-medium text-midnight mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(categoryColors) as GoalCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-xl text-xs font-medium capitalize transition-all
                      ${category === cat
                        ? `${categoryColors[cat].bg} ${categoryColors[cat].text} ring-2 ring-offset-2 ring-current`
                        : 'bg-slate-100 text-midnight-400 hover:bg-slate-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {goal && (
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">Progress: {progress}%</label>
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
