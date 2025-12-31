import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Flame, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface QuickStatsProps {
  stats: DashboardStats;
}

const QuickStats = ({ stats }: QuickStatsProps) => {
  const statItems = [
    {
      label: 'Goals Progress',
      value: stats.goalsTotal > 0 
        ? `${Math.round((stats.goalsCompleted / stats.goalsTotal) * 100)}%` 
        : '0%',
      subtext: `${stats.goalsCompleted} of ${stats.goalsTotal}`,
      icon: Target,
      color: 'text-violet',
      bg: 'bg-violet-50',
    },
    {
      label: 'Today\'s Tasks',
      value: stats.tasksCompletedToday.toString(),
      subtext: `${stats.tasksDueToday} remaining`,
      icon: CheckCircle2,
      color: 'text-sage',
      bg: 'bg-sage-50',
    },
    {
      label: 'Habit Streak',
      value: `${stats.habitsStreak}`,
      subtext: 'days total',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Days Left',
      value: stats.daysRemaining.toString(),
      subtext: 'in 2025',
      icon: Clock,
      color: 'text-champagne-600',
      bg: 'bg-champagne-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-5"
        >
          <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <p className="text-2xl font-bold text-midnight mb-1">{item.value}</p>
          <p className="text-sm text-midnight-300">{item.label}</p>
          <p className="text-xs text-midnight-200 mt-1">{item.subtext}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;
