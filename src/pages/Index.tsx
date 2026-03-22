import { format } from "date-fns";
import { useHabits } from "@/hooks/useHabits";
import DateSelector from "@/components/DateSelector";
import ProgressSummary from "@/components/ProgressSummary";
import HabitCard from "@/components/HabitCard";
import TodoList from "@/components/TodoList";
import WeeklyChart from "@/components/WeeklyChart";
import AddHabitDialog from "@/components/AddHabitDialog";

export default function Index() {
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
        <div>
          <p className="text-sm text-muted-foreground">
            {format(selectedDate, "EEEE, MMMM d")}
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground">Today</h1>
        </div>

        {/* Date Selector */}
        <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />

        {/* Progress Summary */}
        <ProgressSummary
          completed={completedCount}
          total={totalCount}
          percent={progressPercent}
          streak={streak}
          weeklyConsistency={weeklyConsistency}
        />

        {/* Daily Habits */}
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

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyProgress} />

        {/* To-Do List */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">To-Do List</h2>
          <TodoList todos={todos} onToggle={toggleTodo} onAdd={addTodo} onDelete={deleteTodo} />
        </div>
      </div>
    </div>
  );
}
