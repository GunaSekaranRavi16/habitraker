import { motion } from "framer-motion";

interface DayData {
  day: string;
  pct: number;
}

export default function WeeklyChart({ data }: { data: DayData[] }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Weekly Overview</h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {data.map((d, i) => (
          <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
            <motion.div
              className="w-full rounded-lg bg-primary/20 relative overflow-hidden"
              style={{ height: "100%" }}
            >
              <motion.div
                className="absolute bottom-0 w-full rounded-lg bg-primary"
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(d.pct, 4)}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            </motion.div>
            <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
