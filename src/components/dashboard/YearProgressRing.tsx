import { motion } from 'framer-motion';

interface YearProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const YearProgressRing = ({ 
  progress, 
  size = 160, 
  strokeWidth = 10 
}: YearProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-bold text-white"
        >
          {progress}%
        </motion.span>
        <span className="text-white/60 text-sm">complete</span>
      </div>

      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{
          background: `conic-gradient(from 270deg, #D4AF37 ${progress}%, transparent ${progress}%)`,
        }}
      />
    </div>
  );
};

export default YearProgressRing;
