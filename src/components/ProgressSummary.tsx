import { motion } from "framer-motion";

interface Props {
  completed: number;
  total: number;
  percent: number;
  streak: number;
  weeklyConsistency: number;
}

export default function ProgressSummary({ completed, total, percent, streak, weeklyConsistency }: Props) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card">
      <div className="flex items-center gap-5">
        {/* Circular progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8"
              className="stroke-muted" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none" strokeWidth="8"
              strokeLinecap="round"
              className="stroke-primary"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={percent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-display font-bold text-foreground"
            >
              {percent}%
            </motion.span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="text-lg font-display font-bold text-foreground">
              {completed}/{total} habits
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-sm font-semibold text-streak">{streak} day{streak !== 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">📊</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{weeklyConsistency}%</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {weeklyConsistency > 0 && (
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          You are {weeklyConsistency}% consistent this week {weeklyConsistency >= 80 ? "— amazing! 🎉" : weeklyConsistency >= 50 ? "— keep going! 💪" : "— let's build momentum! 🚀"}
        </p>
      )}
    </div>
  );
}
