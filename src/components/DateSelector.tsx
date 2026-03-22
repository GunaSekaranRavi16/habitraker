import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { motion } from "framer-motion";

interface Props {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onSelect }: Props) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex gap-2 justify-between px-1">
      {days.map((day) => {
        const selected = isSameDay(day, selectedDate);
        const today = isToday(day);
        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelect(day)}
            className="flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-colors relative"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {format(day, "EEE")}
            </span>
            <span className={`text-sm font-semibold w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              selected ? "bg-primary text-primary-foreground" : today ? "text-primary" : "text-foreground"
            }`}>
              {format(day, "d")}
            </span>
            {today && !selected && (
              <motion.div layoutId="today-dot" className="w-1 h-1 rounded-full bg-primary absolute bottom-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
