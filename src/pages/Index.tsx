import { format } from "date-fns";
import { useHabits } from "@/hooks/useHabits";
import { useAuth } from "@/contexts/AuthContext";
import DateSelector from "@/components/DateSelector";
import ProgressSummary from "@/components/ProgressSummary";
import HabitCard from "@/components/HabitCard";
import TodoList from "@/components/TodoList";
import WeeklyChart from "@/components/WeeklyChart";
import AddHabitDialog from "@/components/AddHabitDialog";
import { LogOut } from "lucide-react";

export default function Index() {
  const { logout } = useAuth();
  const {
    habits, todos, selectedDate, setSelectedDate,
    getProgress, isCompleted, incrementHabit, resetHabit,
    toggleTodo, addTodo, deleteTodo, addHabit, deleteHabit,
    completedCount, totalCount, progressPercent, streak,
    weeklyProgress, weeklyConsistency,
  } = useHabits();

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, "EEEE, MMMM d")}
            </p>
            <h1 className="text-2xl font-display font-bold text-foreground">Today</h1>
          </div>
          <button
            onClick={logout}
            className="mt-1 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />

        <ProgressSummary
          completed={completedCount}
          total={totalCount}
          percent={progressPercent}
          streak={streak}
          weeklyConsistency={weeklyConsistency}
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-semibold text-foreground">Daily Habits</h2>
            <AddHabitDialog onAdd={addHabit} />
          </div>
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                progress={getProgress(habit)}
                completed={isCompleted(habit)}
                onIncrement={() => incrementHabit(habit.id)}
                onReset={() => resetHabit(habit.id)}
                onDelete={() => deleteHabit(habit.id)}
              />
            ))}
          </div>
        </div>

        <WeeklyChart data={weeklyProgress} />

        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">To-Do List</h2>
          <TodoList todos={todos} onToggle={toggleTodo} onAdd={addTodo} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  );
}
