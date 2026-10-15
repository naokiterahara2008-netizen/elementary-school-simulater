"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { SCHOOLS, getRank, type School } from "@/data/schools";
import { Dices, Crown } from "lucide-react";

export default function Roulette({
  onDone,
  autoStart = false,
}: {
  onDone: (school: School) => void;
  autoStart?: boolean;
}) {
  const [spinning, setSpinning] = useState(false);
  const [current, setCurrent] = useState<School>(SCHOOLS[23]);
  const [result, setResult] = useState<School | null>(null);
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const started = useRef(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setTick(0);
    // 52分の1の厳正な抽選（完全ランダム）
    const targetIndex = Math.floor(Math.random() * SCHOOLS.length);
    const totalTicks = 34 + Math.floor(Math.random() * 10);
    let i = 0;
    const startIdx = Math.floor(Math.random() * SCHOOLS.length);

    const step = () => {
      i++;
      // 最後は必ずtargetに着地
      const idx = i >= totalTicks ? targetIndex : (startIdx + i) % SCHOOLS.length;
      setCurrent(SCHOOLS[idx]);
      setTick(i);
      if (i >= totalTicks) {
        const win = SCHOOLS[targetIndex];
        setSpinning(false);
        setResult(win);
        // 演出
        if (win.elite) {
          confetti({ particleCount: 220, spread: 100, origin: { y: 0.6 }, colors: ["#f5b301", "#fde68a", "#ffffff", "#f472b6"] });
          setTimeout(() => confetti({ particleCount: 120, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: ["#f5b301", "#fff7d6"] }), 250);
          setTimeout(() => confetti({ particleCount: 120, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: ["#f5b301", "#fff7d6"] }), 400);
        } else {
          confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 }, colors: ["#f472b6", "#93c5fd", "#fde68a", "#86efac"] });
        }
        onDone(win);
        return;
      }
      // イージング：だんだん遅く
      const p = i / totalTicks;
      const delay = 45 + p * p * 420;
      timer.current = setTimeout(step, delay);
    };
    step();
  };

  useEffect(() => {
    if (autoStart && !started.current) {
      started.current = true;
      const t = setTimeout(spin, 600);
      return () => clearTimeout(t);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const progress = spinning ? Math.min(100, (tick / 40) * 100) : result ? 100 : 0;

  return (
    <div className="overflow-hidden rounded-3xl border-[3px] border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
      <div className="border-b-[3px] border-slate-900 bg-slate-900 px-4 py-2 text-center">
        <p className="text-xs font-black tracking-[0.3em] text-yellow-300">🎰 52分の1ガチャ 🎰</p>
      </div>
      <div className="graph-paper px-4 py-6 text-center sm:px-8">
        <p className="text-xs font-black text-slate-400">
          {spinning ? "抽選中…" : result ? "入学先が決定しました！" : "ボタンを押して入学先を抽選"}
        </p>
        <div
          className={`mx-auto mt-3 max-w-xl rounded-2xl border-[3px] px-4 py-5 transition ${
            result?.elite
              ? "elite-glow border-yellow-500 bg-gradient-to-b from-yellow-50 to-amber-100"
              : "border-slate-900 bg-white"
          } ${spinning ? "scale-[0.99]" : ""}`}
        >
          {result?.elite && (
            <p className="elite-shine font-[family-name:var(--font-round)] text-sm font-black tracking-widest">
              ✨ 👑 NAMIKI ELITE 降臨 👑 ✨
            </p>
          )}
          <p className="mt-1 font-[family-name:var(--font-round)] text-2xl font-black sm:text-3xl">
            {result?.elite && <Crown className="mr-2 inline text-yellow-500" size={28} />}
            {current.shortName}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {current.name} ・ {current.area} ・ 児童数{current.students2024}人（52校中{getRank(current.slug)}位）
          </p>
          {result && !spinning && (
            <p className="animate-pop-in mt-2 inline-block rounded-full bg-pink-100 px-4 py-1 text-sm font-black text-pink-600">
              {result.elite ? "確率1.92%のエリートを引き当てた！" : "1/52 ＝ 確率1.92% を引き当てた！"}
            </p>
          )}
        </div>

        {/* プログレス */}
        <div className="mx-auto mt-4 h-2.5 max-w-xl overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all ${result?.elite ? "elite-bg" : "bg-pink-400"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {!result || spinning ? (
          <button
            onClick={spin}
            disabled={spinning}
            className={`mt-5 inline-flex items-center gap-2 rounded-full border-[3px] border-slate-900 px-8 py-3 font-[family-name:var(--font-round)] text-lg font-black shadow-[4px_4px_0_#0f172a] transition ${
              spinning
                ? "cursor-wait bg-slate-200 text-slate-400"
                : "bg-yellow-300 text-slate-900 hover:-translate-y-0.5 hover:bg-yellow-200"
            }`}
          >
            <Dices size={22} className={spinning ? "animate-spin" : ""} />
            {spinning ? "抽選中…" : "入学ガチャを回す"}
          </button>
        ) : (
          <p className="mt-4 text-sm font-bold text-slate-500">
            👇 このまま下に進んで入学手続きへ 👇
          </p>
        )}
      </div>
    </div>
  );
}
