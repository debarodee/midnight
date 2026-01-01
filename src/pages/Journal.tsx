import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Smile,
  Meh,
  Frown,
  Heart,
  Zap,
  X,
  ChevronDown,
  Trash2,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { useDataStore } from '../stores/dataStore';
import type { JournalEntry } from '../types';
import { EXAMPLE_JOURNAL_ENTRIES } from '../constants/exampleContent';

const moodOptions = [
  { value: 'great', icon: Heart, label: 'Great', color: 'text-green-500' },
  { value: 'good', icon: Smile, label: 'Good', color: 'text-emerald-500' },
  { value: 'okay', icon: Meh, label: 'Okay', color: 'text-yellow-500' },
  { value: 'low', icon: Frown, label: 'Low', color: 'text-orange-500' },
  { value: 'rough', icon: Zap, label: 'Rough', color: 'text-red-500' },
];

const Journal = () => {
  const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useDataStore();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Group entries by time period
  const groupedEntries = journal
    .filter((entry: JournalEntry) => 
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: JournalEntry, b: JournalEntry) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .reduce((groups: Record<string, JournalEntry[]>, entry: JournalEntry) => {
      const date = new Date(entry.createdAt);
      let group = 'Older';
      
      if (isToday(date)) group = 'Today';
      else if (isYesterday(date)) group = 'Yesterday';
      else if (isThisWeek(date)) group = 'This Week';
      else if (isThisMonth(date)) group = 'This Month';
      
      if (!groups[group]) groups[group] = [];
      groups[group].push(entry);
      return groups;
    }, {} as Record<string, JournalEntry[]>);

  const getMoodIcon = (mood: string) => {
    const option = moodOptions.find(m => m.value === mood);
    return option || moodOptions[2];
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-obsidian-700 border-b border-obsidian-100 dark:border-obsidian-600 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 lg:px-6 lg:py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender to-cyan flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-obsidian dark:text-white">Journal</h1>
                <p className="text-sm text-obsidian-400 dark:text-obsidian-300">{journal.length} entries</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewEntry(true)}
              className="btn-cyan flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-400 dark:text-obsidian-300" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:px-6">
        {journal.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-lavender/10 dark:bg-lavender/20 rounded-xl text-lavender text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Here's what your journal could look like:</span>
            </div>

            {/* Example entries */}
            <div className="space-y-3 opacity-75 pointer-events-none">
              {EXAMPLE_JOURNAL_ENTRIES.map((entry: JournalEntry) => {
                const mood = getMoodIcon(entry.mood || 'okay');
                const MoodIcon = mood.icon;
                
                return (
                  <div
                    key={entry.id}
                    className="card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-obsidian-100 dark:bg-obsidian-600 flex items-center justify-center ${mood.color}`}>
                        <MoodIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-obsidian dark:text-white truncate">
                            {entry.title || format(new Date(entry.createdAt), 'EEEE, MMM d')}
                          </h3>
                          <span className="text-xs text-obsidian-400 dark:text-obsidian-300">
                            {format(new Date(entry.createdAt), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-obsidian-400 dark:text-obsidian-300 line-clamp-2">
                          {entry.content}
                        </p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {entry.tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-lavender/10 dark:bg-lavender/20 text-lavender text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center pt-2">
              <button
                onClick={() => setShowNewEntry(true)}
                className="btn-cyan"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Entry
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([period, entries]) => (
              <div key={period}>
                <h2 className="text-sm font-medium text-obsidian-400 dark:text-obsidian-300 uppercase tracking-wide mb-3">
                  {period}
                </h2>
                <div className="space-y-3">
                  {(entries as JournalEntry[]).map((entry: JournalEntry) => {
                    const mood = getMoodIcon(entry.mood || 'okay');
                    const MoodIcon = mood.icon;
                    
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-4 cursor-pointer hover:shadow-medium transition-shadow"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-obsidian-100 dark:bg-obsidian-600 flex items-center justify-center ${mood.color}`}>
                            <MoodIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-obsidian dark:text-white truncate">
                                {entry.title || format(new Date(entry.createdAt), 'EEEE, MMM d')}
                              </h3>
                              <span className="text-xs text-obsidian-400 dark:text-obsidian-300">
                                {format(new Date(entry.createdAt), 'h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-obsidian-400 dark:text-obsidian-300 line-clamp-2">
                              {entry.content}
                            </p>
                            {entry.tags && entry.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {entry.tags.slice(0, 3).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-full bg-lavender/10 dark:bg-lavender/20 text-lavender text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <JournalEntryModal
            onClose={() => setShowNewEntry(false)}
            onSave={(entry) => {
              addJournalEntry({
                userId: '',
                date: new Date(),
                content: entry.content || '',
                title: entry.title,
                mood: entry.mood,
                tags: entry.tags,
              });
              setShowNewEntry(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* View Entry Modal */}
      <AnimatePresence>
        {selectedEntry && !editingEntry && (
          <ViewEntryModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onEdit={() => {
              setEditingEntry(selectedEntry);
              setSelectedEntry(null);
            }}
            onDelete={() => {
              deleteJournalEntry(selectedEntry.id);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Entry Modal */}
      <AnimatePresence>
        {editingEntry && (
          <JournalEntryModal
            entry={editingEntry}
            onClose={() => setEditingEntry(null)}
            onSave={(updates) => {
              updateJournalEntry(editingEntry.id, updates);
              setEditingEntry(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// New/Edit Entry Modal
const JournalEntryModal = ({
  entry,
  onClose,
  onSave,
}: {
  entry?: JournalEntry;
  onClose: () => void;
  onSave: (entry: Partial<JournalEntry>) => void;
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'low' | 'bad'>(entry?.mood || 'okay');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(entry?.tags || []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSave({
      title: title.trim() || undefined,
      content: content.trim(),
      mood,
      tags,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-obsidian-700 rounded-t-3xl lg:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-obsidian-100 dark:border-obsidian-600">
          <h2 className="text-lg font-semibold text-obsidian dark:text-white">
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-600 transition-colors"
          >
            <X className="w-5 h-5 text-obsidian-400 dark:text-obsidian-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-medium text-obsidian-400 dark:text-obsidian-300 mb-2">
              How are you feeling?
            </label>
            <div className="flex gap-2">
              {moodOptions.map((option) => {
                const Icon = option.icon;
                return (
                    <button
                      key={option.value}
                      onClick={() => setMood(option.value as 'great' | 'good' | 'okay' | 'low' | 'bad')}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        mood === option.value
                          ? 'border-lavender bg-lavender/5 dark:bg-lavender/10'
                          : 'border-obsidian-200 dark:border-obsidian-500 hover:border-obsidian-300 dark:hover:border-obsidian-400'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto ${option.color}`} />
                      <span className="text-xs text-obsidian-400 dark:text-obsidian-300 mt-1 block">{option.label}</span>
                    </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-obsidian-400 dark:text-obsidian-300 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="input-field"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-obsidian-400 dark:text-obsidian-300 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              rows={6}
              className="input-field resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-obsidian-400 dark:text-obsidian-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="input-field flex-1"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-obsidian-100 dark:bg-obsidian-600 hover:bg-obsidian-200 dark:hover:bg-obsidian-500 transition-colors text-obsidian dark:text-white"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-lavender/10 dark:bg-lavender/20 text-lavender text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-obsidian-100 dark:border-obsidian-600 safe-bottom">
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            {entry ? 'Save Changes' : 'Save Entry'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// View Entry Modal
const ViewEntryModal = ({
  entry,
  onClose,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const mood = moodOptions.find(m => m.value === entry.mood) || moodOptions[2];
  const MoodIcon = mood.icon;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-obsidian-700 rounded-t-3xl lg:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-obsidian-100 dark:border-obsidian-600">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-obsidian-100 dark:bg-obsidian-600 flex items-center justify-center ${mood.color}`}>
              <MoodIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-obsidian dark:text-white">
                {entry.title || format(new Date(entry.createdAt), 'EEEE, MMMM d')}
              </h2>
              <p className="text-sm text-obsidian-400 dark:text-obsidian-300">
                {format(new Date(entry.createdAt), 'h:mm a')} · {mood.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-600 transition-colors"
            >
              <Edit3 className="w-5 h-5 text-obsidian-400 dark:text-obsidian-300" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-obsidian-100 dark:hover:bg-obsidian-600 transition-colors"
            >
              <X className="w-5 h-5 text-obsidian-400 dark:text-obsidian-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p className="text-obsidian dark:text-white whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </p>
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-obsidian-100 dark:border-obsidian-600">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-lavender/10 dark:bg-lavender/20 text-lavender text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-obsidian-700 flex flex-col items-center justify-center p-6"
            >
              <Trash2 className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-obsidian dark:text-white mb-2">Delete Entry?</h3>
              <p className="text-obsidian-400 dark:text-obsidian-300 text-center mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 rounded-xl bg-obsidian-100 dark:bg-obsidian-600 hover:bg-obsidian-200 dark:hover:bg-obsidian-500 transition-colors text-obsidian dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Journal;
