import { motion } from 'framer-motion';

export function RiskMeter({ score }: { score: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'text-success';
  let stroke = 'stroke-success';
  let label = 'Safe';
  if (score > 40) {
    color = 'text-warning';
    stroke = 'stroke-warning';
    label = 'Medium Risk';
  }
  if (score > 75) {
    color = 'text-danger';
    stroke = 'stroke-danger';
    label = 'High Risk';
  }

  return (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-surfaceLight fill-none"
          strokeWidth="12"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          className={`${stroke} fill-none`}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className={`text-4xl font-bold ${color}`}
        >
          {score}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1"
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
