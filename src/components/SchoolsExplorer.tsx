"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import SchoolCard from "./SchoolCard";
import { AREAS, getRank, type School } from "@/data/schools";

type SortKey = "students" | "name" | "founded" | "walk";

export default function SchoolsExplorer({ schools }: { schools: School[] }) {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("すべて");
  const [sort, setSort] = useState<SortKey>("students");

  const list = useMemo(() => {
    let arr = schools.filter(
      (s) =>
        (area === "すべて" || s.area === area) &&
        (q === "" ||
          s.name.includes(q) ||
          s.shortName.includes(q) ||
          s.kana.includes(q) ||
          s.address.includes(q) ||
          s.station.includes(q))
    );
    switch (sort) {
      case "students":
        arr = [...arr].sort((a, b) => b.students2024 - a.students2024);
        break;
      case "name":
        arr = [...arr].sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
        break;
      case "founded":
        arr = [...arr].sort((a, b) => a.foundedYear - b.foundedYear);
        break;
      case "walk":
        arr = [...arr].sort((a, b) => a.walkMin - b.walkMin);
        break;
    }
    // エリートは検索・フィルタに合致すれば先頭に
    const elite = arr.find((s) => s.elite);
    if (elite && (q !== "" || area !== "すべて")) {
      arr = [elite, ...arr.filter((s) => !s.elite)];
    }
    return arr;
  }, [schools, q, area, sort]);

  return (
    <div>
      <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-4 shadow-[4px_4px_0_#0f172a]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#fff9ef] px-3 py-2">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="学校名・駅・住所で検索（例：並木／東川口／芝）"
              className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-[#fff9ef] px-3 py-2 text-sm font-bold">
            <ArrowUpDown size={16} className="text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent font-bold outline-none"
            >
              <option value="students">児童数順</option>
              <option value="name">五十音順</option>
              <option value="founded">創立年順（古→新）</option>
              <option value="walk">駅チカ順</option>
            </select>
          </label>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {["すべて", ...AREAS].map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`rounded-full px-3 py-1 text-xs font-black transition ${
                area === a
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-pink-100"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm font-black text-slate-500">
        {list.length}校ヒット
        {q && <span>（「{q}」）</span>}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <SchoolCard key={s.slug} school={s} />
        ))}
      </div>
      {list.length === 0 && (
        <div className="mt-6 rounded-2xl border-[3px] border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-[family-name:var(--font-round)] text-lg font-black">
            見つかりませんでした🕵️
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            検索条件を変えてみてください。52校は必ずどこかにいます。
          </p>
        </div>
      )}
      <p className="mt-6 hidden">{getRank("namiki")}</p>
    </div>
  );
}
