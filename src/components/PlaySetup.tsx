"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Dices, School as SchoolIcon, Pencil, Loader2, Crown } from "lucide-react";
import Roulette from "./Roulette";
import { SCHOOLS, getRank, getSchool, type School } from "@/data/schools";

export default function PlaySetup() {
  const params = useSearchParams();
  const router = useRouter();
  const initialMode = params.get("mode") === "random" ? "random" : params.get("school") ? "select" : "random";
  const initialSchool = params.get("school") ? getSchool(params.get("school")!) : undefined;

  const [mode, setMode] = useState<"random" | "select">(initialMode);
  const [school, setSchool] = useState<School | undefined>(initialSchool);
  const [name, setName] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim();
    if (!q) return SCHOOLS;
    return SCHOOLS.filter(
      (s) => s.name.includes(q) || s.shortName.includes(q) || s.kana.includes(q) || s.area.includes(q) || s.station.includes(q)
    );
  }, [filter]);

  const start = async () => {
    if (!school || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/playthroughs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: name.trim() || "ななしの1年生",
          schoolSlug: school.slug,
          mode,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "入学手続きに失敗しました");
      router.push(`/play/${school.slug}?pid=${j.playthrough.id}&name=${encodeURIComponent(j.playthrough.playerName)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "入学手続きに失敗しました");
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {/* モード切替 */}
      <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-2 rounded-2xl border-[3px] border-slate-900 bg-white p-2 shadow-[4px_4px_0_#0f172a]">
        <button
          onClick={() => setMode("random")}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-[family-name:var(--font-round)] font-black transition ${
            mode === "random" ? "bg-pink-400 text-white" : "text-slate-500 hover:bg-pink-50"
          }`}
        >
          <Dices size={19} /> おまかせ入学
        </button>
        <button
          onClick={() => setMode("select")}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-[family-name:var(--font-round)] font-black transition ${
            mode === "select" ? "bg-sky-400 text-white" : "text-slate-500 hover:bg-sky-50"
          }`}
        >
          <SchoolIcon size={19} /> 学校を選ぶ
        </button>
      </div>

      {mode === "random" ? (
        <div className="mx-auto w-full max-w-2xl">
          <Roulette onDone={(s) => setSchool(s)} autoStart={params.get("mode") === "random" && !school} />
          <p className="mt-3 text-center text-xs font-bold text-slate-400">
            ※ 完全ランダム（1/52 ≒ 1.92%）。並木小学校（エリートコース）を引き当てると特別演出が発生します。
          </p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-2xl rounded-3xl border-[3px] border-slate-900 bg-white p-4 shadow-[6px_6px_0_#0f172a] sm:p-6">
          <p className="text-center text-sm font-black text-slate-500">
            入学したい学校を選んでください（52校）
          </p>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="検索（例：並木／戸塚／芝／鳩ヶ谷）"
            className="mt-3 w-full rounded-xl border-2 border-slate-900 bg-[#fff9ef] px-4 py-2.5 text-sm font-bold outline-none"
          />
          <div className="mt-3 grid max-h-72 gap-1.5 overflow-y-auto pr-1">
            {filtered.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSchool(s)}
                className={`flex items-center justify-between rounded-xl border-2 px-3 py-2 text-left text-sm font-black transition ${
                  school?.slug === s.slug
                    ? s.elite
                      ? "elite-glow border-yellow-500 bg-yellow-50"
                      : "border-slate-900 bg-yellow-100"
                    : "border-slate-200 bg-white hover:border-slate-400"
                }`}
              >
                <span>
                  {s.elite && <Crown size={13} className="mr-1 inline text-yellow-500" />}
                  {s.shortName}
                  <span className="ml-2 text-[11px] font-bold text-slate-400">
                    {s.area}・{s.students2024}人（{getRank(s.slug)}位）
                  </span>
                </span>
                {school?.slug === s.slug && <span className="text-pink-500">●</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm font-bold text-slate-400">見つかりませんでした</p>
            )}
          </div>
        </div>
      )}

      {/* 名前 + 決定 */}
      {school && (
        <div
          className={`animate-pop-in mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border-[3px] shadow-[6px_6px_0_#0f172a] ${
            school.elite ? "elite-glow border-yellow-500 bg-gradient-to-b from-yellow-50 to-amber-50" : "border-slate-900 bg-white"
          }`}
        >
          {school.elite && (
            <div className="elite-bg px-4 py-1.5 text-center text-xs font-black tracking-[0.25em] text-white">
              ✨ 👑 NAMIKI ELITE コース 👑 ✨
            </div>
          )}
          <div className="p-5 sm:p-6">
            <p className="text-xs font-black text-slate-400">入学先</p>
            <p className="font-[family-name:var(--font-round)] text-2xl font-black">
              {school.elite && <Crown className="mr-1.5 inline text-yellow-500" size={24} />}
              {school.name}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              {school.area} ・ {school.station} ・ 児童数{school.students2024}人（52校中{getRank(school.slug)}位）
              ・ <Link href={`/schools/${school.slug}`} className="text-pink-500 underline">学校データを見る</Link>
            </p>
            <label className="mt-4 block">
              <span className="flex items-center gap-1.5 text-sm font-black">
                <Pencil size={15} /> 主人公の名前（あだ名OK）
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="例：かわぐち たろう"
                className="mt-1.5 w-full rounded-xl border-2 border-slate-900 bg-[#fff9ef] px-4 py-3 font-[family-name:var(--font-round)] text-lg font-black outline-none focus:bg-white"
              />
            </label>
            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-500">{error}</p>
            )}
            <button
              onClick={start}
              disabled={loading}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 px-6 py-4 font-[family-name:var(--font-round)] text-xl font-black shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 disabled:opacity-60 ${
                school.elite ? "bg-yellow-400 text-yellow-950" : "bg-pink-400 text-white"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={22} /> : "🎒"}
              {loading ? "入学手続き中…" : `${school.shortName}に入学する！`}
            </button>
            <p className="mt-2 text-center text-[11px] font-bold text-slate-400">
              所要時間：約5〜10分 ／ いいえ、6年間です。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
