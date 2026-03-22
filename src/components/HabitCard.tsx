import { motion } from "framer-motion";
import { Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { Habit, HabitColor } from "@/hooks/useHabits";

const colorMap: Record<HabitColor, string> = {
  water: "bg-habit-water/10 border-habit-water/30",
  steps: "bg-habit-steps/10 border-habit-steps/30",
  read: "bg-habit-read/10 border-habit-read/30",
  meditate: "bg-habit-meditate/10 border-habit-meditate/30",
  exercise: "bg-habit-exercise/10 border-habit-exercise/30",
  sleep: "bg-habit-sleep/10 border-habit-sleep/30",
};

const progressColorMap: Record<HabitColor, string> = {
  water: "bg-habit-water",
  steps: "bg-habit-steps",
  read: "bg-habit-read",
  meditate: "bg-habit-meditate",
  exercise: "bg-habit-exercise",
  sleep: "bg-habit-sleep",
};

interface Props {
  habit: Habit;
  progress: number;
  completed: boolean;
  onIncrement: () => void;
  onReset: () => void;
  onDelete: () => void;
}

export default function HabitCard({ habit, progress, completed, onIncrement, onReset, onDelete }: Props) {
  const pct = Math.min((progress / habit.target) * 100, 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-4 transition-all ${colorMap[habit.color]} ${completed ? "opacity-80" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{habit.icon}</span>
          <span className="font-semibold text-sm text-foreground">{habit.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-accent-foreground" />
            </motion.div>
          ) : (
            <button
              onClick={onIncrement}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4 text-primary" />
            </button>
          )}
          <button
            onClick={onReset}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${progressColorMap[habit.color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">
          {habit.type === "binary"
            ? (completed ? "Done" : "Not done")
            : `${progress}/${habit.target} ${habit.unit}`}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{Math.round(pct)}%</span>
      </div>
    </motion.div>
  );
}
