"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Row = {
  id: number;
  playerName: string;
  schoolSlug: string;
  schoolName: string;
  mode: string;
  status: string;
  endingTitle: string | null;
  stats: { study: number; fitness: number; friend: number; charm: number; memory: number };
  startedAt: string;
};

type SchoolStat = { slug: string; shortName: string; students2024: number; plays: number; elite?: boolean };

export default function RankingClient() {
  const [grads, setGrads] = useState<Row[] | null>(null);
  const [schoolStats, setSchoolStats] = useState<SchoolStat[] | null>(null);

  useEffect(() => {
    fetch("/api/playthroughs?scope=recent&limit=50")
      .then((r) => r.json())
      .then((j) => setGrads((j.playthroughs ?? []).filter((r: Row) => r.status === "graduated")))
      .catch(() => setGrads([]));
    fetch("/api/schools")
      .then((r) => r.json())
      .then((j) => setSchoolStats((j.schools ?? []).map((s: SchoolStat) => s).sort((a: SchoolStat, b: SchoolStat) => b.plays - a.plays)))
      .catch(() => setSchoolStats([]));
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
        <h2 className="font-[family-name:var(--font-round)] text-lg font-black">🎓 卒業生名簿（新着）</h2>
        <div className="mt-3 grid max-h-[480px] gap-2 overflow-y-auto pr-1">
          {grads === null && <p className="py-8 text-center text-sm font-bold text-slate-400">名簿をめくっています…</p>}
          {grads?.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm font-bold text-slate-400">
              まだ卒業生がいません。最初の卒業生になろう！
            </p>
          )}
          {grads?.map((g) => {
            const total = g.stats ? g.stats.study + g.stats.fitness + g.stats.friend + g.stats.charm + g.stats.memory : 0;
            return (
              <div key={g.id} className="rounded-xl border-2 border-slate-100 bg-[#fff9ef] px-4 py-2.5">
                <p className="text-sm font-black">
                  {g.playerName}
                  {g.mode === "random" && <span className="ml-2 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] text-pink-600">🎰おまかせ</span>}
                </p>
                <p className="text-xs font-bold text-slate-500">
                  <Link href={`/schools/${g.schoolSlug}`} className="underline hover:text-slate-800">{g.schoolName}</Link>
                </p>
                {g.endingTitle && <p className="mt-0.5 text-xs font-black text-pink-500">{g.endingTitle}</p>}
                <p className="mt-0.5 text-[11px] font-bold tabular-nums text-slate-400">
                  学{g.stats?.study}・体{g.stats?.fitness}・友{g.stats?.friend}・輝{g.stats?.charm}・思{g.stats?.memory}（計{total}）
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
        <h2 className="font-[family-name:var(--font-round)] text-lg font-black">🏫 入学人気ランキング（プレイ数）</h2>
        <div className="mt-3 grid max-h-[480px] gap-1.5 overflow-y-auto pr-1">
          {schoolStats === null && <p className="py-8 text-center text-sm font-bold text-slate-400">集計中…</p>}
          {schoolStats?.map((s, i) => (
            <Link
              key={s.slug}
              href={`/schools/${s.slug}`}
              className={`flex items-center justify-between rounded-xl border-2 px-3 py-2 text-sm font-black transition hover:-translate-y-0.5 ${
                s.elite ? "border-yellow-500 bg-yellow-50" : "border-slate-100 bg-[#fff9ef] hover:border-slate-300"
              }`}
            >
              <span>
                <span className={`mr-2 inline-grid h-6 w-6 place-items-center rounded-full text-[11px] ${i < 3 ? "bg-yellow-300" : "bg-slate-200"}`}>
                  {i + 1}
                </span>
                {s.elite ? "👑 " : ""}{s.shortName}
                <span className="ml-2 text-[11px] font-bold text-slate-400">実児童数{s.students2024}人</span>
              </span>
              <span className="tabular-nums">{s.plays}入学</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
