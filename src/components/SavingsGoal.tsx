import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface SavingsGoalProps {
  current: number;
  target: number;
  title: string;
}

export function SavingsGoal({ current, target, title }: SavingsGoalProps) {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-32 h-32 mx-auto mb-4">
        <CircularProgressbar
          value={percentage}
          text={`${percentage.toFixed(0)}%`}
          styles={buildStyles({
            pathColor: `rgba(14, 165, 233, ${percentage / 100})`,
            textColor: '#0ea5e9',
            trailColor: '#e0f2fe',
          })}
        />
      </div>
      <div className="text-center">
        <p className="text-gray-600 mb-2">Current Savings</p>
        <p className="text-2xl font-bold text-primary-600">
          ₹<CountUp end={current} duration={2} separator="," />
        </p>
        <p className="text-sm text-gray-500 mt-1">
          of ₹{target.toLocaleString()} goal
        </p>
      </div>
    </motion.div>
  );
}