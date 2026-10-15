"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Row = {
  id: number;
  playerName: string;
  schoolName: string;
  status: string;
  endingTitle: string | null;
  startedAt: string;
};

export default function RecentPlays() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetch("/api/playthroughs?scope=recent&limit=6")
      .then((r) => r.json())
      .then((j) => setRows(j.playthroughs ?? []))
      .catch(() => setRows([]));
  }, []);

  if (rows === null) {
    return (
      <div className="grid gap-2 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border-[3px] border-slate-200 bg-white p-4">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border-[3px] border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="font-[family-name:var(--font-round)] text-lg font-black">まだ卒業生がいません🎒</p>
        <p className="mt-1 text-sm font-bold text-slate-500">
          あなたが最初の入学生になって、名簿のトップを飾ろう！
        </p>
        <Link
          href="/play"
          className="mt-4 inline-block rounded-full border-2 border-slate-900 bg-yellow-300 px-6 py-2.5 text-sm font-black shadow-[3px_3px_0_#0f172a]"
        >
          今すぐ入学する
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {rows.map((r) => (
        <div key={r.id} className="rounded-2xl border-[3px] border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]">
          <p className="font-black">
            {r.playerName}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
              {r.status === "graduated" ? "🎓卒業" : "🏫在学中"}
            </span>
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">{r.schoolName}</p>
          {r.endingTitle && <p className="mt-1 text-xs font-black text-pink-500">{r.endingTitle}</p>}
        </div>
      ))}
    </div>
  );
}
