import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Clock, Trash2 } from "lucide-react";
import type { Todo } from "@/hooks/useHabits";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onAdd: (title: string, time?: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onAdd, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-card group"
          >
            <button
              onClick={() => onToggle(todo.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                todo.completed ? "bg-accent border-accent" : "border-muted-foreground/30 hover:border-primary"
              }`}
            >
              {todo.completed && <Check className="w-3 h-3 text-accent-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {todo.title}
              </p>
              {todo.time && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {todo.time}
                </p>
              )}
            </div>
            <button
              onClick={() => onDelete(todo.id)}
              className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {adding ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Task name..."
            className="flex-1 bg-card rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
          />
          <button onClick={handleAdd} className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
            Add
          </button>
          <button onClick={() => setAdding(false)} className="px-3 py-2 bg-muted text-muted-foreground rounded-xl text-sm">
            Cancel
          </button>
        </motion.div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
        >
          <Plus className="w-4 h-4" /> Add task
        </button>
      )}
    </div>
  );
}
