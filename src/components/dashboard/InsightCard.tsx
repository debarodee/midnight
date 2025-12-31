import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardStats } from '../../types';

interface InsightCardProps {
  stats: DashboardStats;
}

const insights = [
  "You're making steady progress! Focus on one goal today.",
  "Great time to review your upcoming tasks and prioritize.",
  "Consider taking a few minutes for a quick mental check-in.",
  "Small consistent actions lead to big results over time.",
  "Remember to celebrate your wins, no matter how small.",
  "Your commitment to growth is inspiring. Keep going!",
  "Today is a fresh opportunity to move closer to your goals.",
  "Balance is key - make time for rest alongside productivity.",
];

const InsightCard = ({ stats }: InsightCardProps) => {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate contextual insight based on stats
    generateInsight();
  }, [stats]);

  const generateInsight = () => {
    setIsLoading(true);
    
    // Contextual insight logic
    let contextualInsight = '';
    
    if (stats.tasksDueToday > 3) {
      contextualInsight = `You have ${stats.tasksDueToday} tasks due today. Start with the most important one!`;
    } else if (stats.yearProgress > 50 && stats.goalsCompleted < stats.goalsTotal / 2) {
      contextualInsight = "The year is half over - great time to reassess and accelerate on your goals!";
    } else if (stats.habitsStreak > 7) {
      contextualInsight = `Amazing ${stats.habitsStreak}-day streak! Consistency is your superpower.`;
    } else if (stats.goalsCompleted === stats.goalsTotal && stats.goalsTotal > 0) {
      contextualInsight = "All goals completed! Time to dream bigger and set new ones.";
    } else {
      // Random motivational insight
      contextualInsight = insights[Math.floor(Math.random() * insights.length)];
    }

    setTimeout(() => {
      setInsight(contextualInsight);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="card h-full bg-gradient-to-br from-violet-50 to-champagne-50 border-violet-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet" />
          </div>
          <h3 className="font-semibold text-midnight">Daily Insight</h3>
        </div>
        <button
          onClick={generateInsight}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-midnight-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <motion.p
        key={insight}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-midnight-600 leading-relaxed mb-6"
      >
        {insight || 'Loading your personalized insight...'}
      </motion.p>

      <Link
        to="/app/assistant"
        className="inline-flex items-center gap-2 text-sm font-medium text-violet hover:text-violet-600 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Ask Midnight for advice
      </Link>
    </div>
  );
};

export default InsightCard;
