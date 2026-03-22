import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { HabitType, HabitColor } from "@/hooks/useHabits";

const colors: { value: HabitColor; label: string; emoji: string }[] = [
  { value: "water", label: "Blue", emoji: "💧" },
  { value: "steps", label: "Green", emoji: "🚶" },
  { value: "read", label: "Purple", emoji: "📖" },
  { value: "meditate", label: "Orange", emoji: "🧘" },
  { value: "exercise", label: "Pink", emoji: "💪" },
  { value: "sleep", label: "Indigo", emoji: "😴" },
];

const colorBgMap: Record<HabitColor, string> = {
  water: "bg-habit-water",
  steps: "bg-habit-steps",
  read: "bg-habit-read",
  meditate: "bg-habit-meditate",
  exercise: "bg-habit-exercise",
  sleep: "bg-habit-sleep",
};

interface Props {
  onAdd: (name: string, icon: string, type: HabitType, color: HabitColor, target: number, unit: string) => void;
}

export default function AddHabitDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("✨");
  const [type, setType] = useState<HabitType>("binary");
  const [color, setColor] = useState<HabitColor>("water");
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), icon, type, color, target, unit);
    setName(""); setIcon("✨"); setType("binary"); setColor("water"); setTarget(1); setUnit("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">New Habit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex gap-2">
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-12 text-center text-xl bg-muted rounded-xl p-2 border border-border"
              maxLength={2}
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name"
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {(["binary", "count", "time"] as HabitType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); if (t === "binary") { setTarget(1); setUnit(""); } }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t === "binary" ? "Yes/No" : t === "count" ? "Count" : "Time"}
                </button>
              ))}
            </div>
          </div>

          {type !== "binary" && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full bg-muted rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Unit</label>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={type === "time" ? "min" : "times"}
                  className="w-full bg-muted rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${colorBgMap[c.value]} ${
                    color === c.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                >
                  {c.emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Create Habit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
