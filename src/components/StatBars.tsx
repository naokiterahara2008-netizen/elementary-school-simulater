"use client";

import { STAT_META, type StatKey, type Stats } from "@/data/game";

export default function StatBars({ stats, compact = false }: { stats: Stats; compact?: boolean }) {
  const keys = Object.keys(STAT_META) as StatKey[];
  return (
    <div className={`grid gap-1.5 ${compact ? "grid-cols-5" : "grid-cols-1 sm:grid-cols-5"}`}>
      {keys.map((k) => {
        const meta = STAT_META[k];
        const v = Math.max(0, Math.min(100, stats[k]));
        return (
          <div
            key={k}
            className="rounded-xl border-2 border-slate-900 bg-white px-2.5 py-1.5 shadow-[2px_2px_0_#0f172a]"
          >
            <div className="flex items-center justify-between text-[11px] font-black">
              <span>
                {meta.icon} {meta.label}
              </span>
              <span className="tabular-nums">{stats[k]}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${v}%`, background: meta.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
