import { useState, useCallback, useMemo, useEffect } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type HabitType = "binary" | "count" | "time";
export type HabitColor = "water" | "steps" | "read" | "meditate" | "exercise" | "sleep";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  type: HabitType;
  color: HabitColor;
  target: number;
  unit: string;
  progress: Record<string, number>;
}

export interface Todo {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: "1", name: "Drink Water", icon: "💧", type: "count", color: "water", target: 8, unit: "cups", progress: {} },
  { id: "2", name: "Steps", icon: "🚶", type: "count", color: "steps", target: 10000, unit: "steps", progress: {} },
  { id: "3", name: "Read", icon: "📖", type: "time", color: "read", target: 30, unit: "min", progress: {} },
  { id: "4", name: "Meditate", icon: "🧘", type: "time", color: "meditate", target: 15, unit: "min", progress: {} },
  { id: "5", name: "Exercise", icon: "💪", type: "binary", color: "exercise", target: 1, unit: "", progress: {} },
  { id: "6", name: "Sleep 8h", icon: "😴", type: "binary", color: "sleep", target: 1, unit: "", progress: {} },
];

const defaultTodos: Todo[] = [
  { id: "t1", title: "Morning standup meeting", time: "9:00 AM", completed: false },
  { id: "t2", title: "Review pull requests", time: "11:00 AM", completed: false },
  { id: "t3", title: "Grocery shopping", time: "5:30 PM", completed: true },
  { id: "t4", title: "Prepare presentation", completed: false },
];

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loaded, setLoaded] = useState(false);

  const uid = user?.uid;
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  // Load from Firestore on auth
  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      try {
        const habitsSnap = await getDoc(doc(db, "users", uid, "data", "habits"));
        if (habitsSnap.exists()) setHabits(habitsSnap.data().list as Habit[]);
        const todosSnap = await getDoc(doc(db, "users", uid, "data", "todos"));
        if (todosSnap.exists()) setTodos(todosSnap.data().list as Todo[]);
      } catch (e) {
        console.error("Failed to load data:", e);
      }
      setLoaded(true);
    };
    load();
  }, [uid]);

  const saveHabits = useCallback((h: Habit[]) => {
    setHabits(h);
    if (uid) {
      setDoc(doc(db, "users", uid, "data", "habits"), { list: h })
        .catch((e) => {
          console.error("Failed to save habits:", e);
          toast.error("Failed to save habits. Please check your connection or permissions.");
        });
    }
  }, [uid]);

  const saveTodos = useCallback((t: Todo[]) => {
    setTodos(t);
    if (uid) {
      setDoc(doc(db, "users", uid, "data", "todos"), { list: t })
        .catch((e) => {
          console.error("Failed to save todos:", e);
          toast.error("Failed to save tasks. Please check your connection or permissions.");
        });
    }
  }, [uid]);

  const getProgress = useCallback((habit: Habit) => {
    return habit.progress[dateKey] || 0;
  }, [dateKey]);

  const isCompleted = useCallback((habit: Habit) => {
    return getProgress(habit) >= habit.target;
  }, [getProgress]);

  const updateHabitProgress = useCallback((habitId: string, value: number) => {
    saveHabits(habits.map(h => {
      if (h.id !== habitId) return h;
      const newVal = Math.min(value, h.target);
      return { ...h, progress: { ...h.progress, [dateKey]: newVal } };
    }));
  }, [habits, dateKey, saveHabits]);

  const incrementHabit = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    const current = habit.progress[dateKey] || 0;
    if (habit.type === "binary") {
      updateHabitProgress(habitId, current >= 1 ? 0 : 1);
    } else {
      const step = habit.type === "count" && habit.target >= 1000 ? 1000 : habit.type === "time" ? 5 : 1;
      updateHabitProgress(habitId, Math.min(current + step, habit.target));
    }
  }, [habits, dateKey, updateHabitProgress]);

  const resetHabit = useCallback((habitId: string) => {
    updateHabitProgress(habitId, 0);
  }, [updateHabitProgress]);

  const toggleTodo = useCallback((todoId: string) => {
    saveTodos(todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t));
  }, [todos, saveTodos]);

  const addTodo = useCallback((title: string, time?: string) => {
    const newTodo: Todo = { id: Date.now().toString(), title, time, completed: false };
    saveTodos([...todos, newTodo]);
  }, [todos, saveTodos]);

  const deleteTodo = useCallback((todoId: string) => {
    saveTodos(todos.filter(t => t.id !== todoId));
  }, [todos, saveTodos]);

  const addHabit = useCallback((name: string, icon: string, type: HabitType, color: HabitColor, target: number, unit: string) => {
    const newHabit: Habit = { id: Date.now().toString(), name, icon, type, color, target, unit, progress: {} };
    saveHabits([...habits, newHabit]);
  }, [habits, saveHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    saveHabits(habits.filter(h => h.id !== habitId));
  }, [habits, saveHabits]);

  const completedCount = useMemo(() => habits.filter(h => isCompleted(h)).length, [habits, isCompleted]);
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const streak = useMemo(() => {
    let count = 0;
    const today = startOfDay(new Date());
    for (let i = 0; i < 365; i++) {
      const day = subDays(today, i);
      const key = format(day, "yyyy-MM-dd");
      const allDone = habits.every(h => (h.progress[key] || 0) >= h.target);
      if (allDone && habits.length > 0) count++;
      else if (i > 0) break;
      else if (i === 0 && !allDone) continue;
    }
    return count;
  }, [habits]);

  const weeklyProgress = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const day = subDays(today, 6 - i);
      const key = format(day, "yyyy-MM-dd");
      const done = habits.filter(h => (h.progress[key] || 0) >= h.target).length;
      return { day: format(day, "EEE"), done, total: totalCount, pct: totalCount > 0 ? Math.round((done / totalCount) * 100) : 0 };
    });
  }, [habits, totalCount]);

  const weeklyConsistency = useMemo(() => {
    const total = weeklyProgress.reduce((s, d) => s + d.pct, 0);
    return Math.round(total / 7);
  }, [weeklyProgress]);

  return {
    habits, todos, selectedDate, setSelectedDate, dateKey, loaded,
    getProgress, isCompleted, incrementHabit, resetHabit, updateHabitProgress,
    toggleTodo, addTodo, deleteTodo, addHabit, deleteHabit,
    completedCount, totalCount, progressPercent, streak,
    weeklyProgress, weeklyConsistency,
  };
}
