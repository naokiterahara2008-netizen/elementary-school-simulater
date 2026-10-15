"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Crown, ChevronRight, RotateCcw, Share2, Send, Loader2, Sparkles, Pause, Play } from "lucide-react";
import StatBars from "./StatBars";
import {
  buildScenes, gradeLabel, judgeEnding, resolve,
  STAT_META, type ChoiceDef, type Stats, type Ending, type StatKey,
} from "@/data/game";
import { getRank, type School } from "@/data/schools";

type Props = {
  school: School;
  playthroughId: number | null;
  playerName: string;
};

const INITIAL: Stats = { study: 10, fitness: 10, friend: 10, charm: 10, memory: 10 };

type GuestMsg = { id: number; author: string; message: string; createdAt: string };

export default function GameClient({ school, playthroughId, playerName }: Props) {
  const rank = getRank(school.slug);
  const elite = !!school.elite;
  const scenes = useMemo(() => buildScenes(school), [school]);
  const ctx = useMemo(() => ({ school, playerName, rank }), [school, playerName, rank]);

  const [idx, setIdx] = useState(0);
  const [stats, setStats] = useState<Stats>(INITIAL);
  const [phase, setPhase] = useState<"play" | "result" | "ending">("play");
  const [picked, setPicked] = useState<ChoiceDef | null>(null);
  const [resultText, setResultText] = useState("");
  const [deltas, setDeltas] = useState<[StatKey, number][]>([]);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [storyLog, setStoryLog] = useState<string[]>([]);
  const [choicesLog, setChoicesLog] = useState<{ grade: number; scene: string; choice: string }[]>([]);
  const [auto, setAuto] = useState(false);
  const [saving, setSaving] = useState(false);

  const [messages, setMessages] = useState<GuestMsg[]>([]);
  const [author, setAuthor] = useState("");
  const [msgText, setMsgText] = useState("");
  const [posting, setPosting] = useState(false);

  const scene = scenes[idx];
  const isLast = idx === scenes.length - 1;
  const progress = Math.round(((idx + (phase === "play" ? 0 : 0.5)) / scenes.length) * 100);

  const save = async (patch: Record<string, unknown>) => {
    if (!playthroughId) return;
    setSaving(true);
    try {
      await fetch(`/api/playthroughs/${playthroughId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      /* オフラインでも遊べる */
    } finally {
      setSaving(false);
    }
  };

  const choose = (choice: ChoiceDef) => {
    if (phase !== "play") return;
    const next: Stats = { ...stats };
    const ds: [StatKey, number][] = [];
    for (const [k, v] of Object.entries(choice.effects) as [StatKey, number][]) {
      next[k] = Math.max(0, Math.min(100, next[k] + v));
      ds.push([k, v]);
    }
    setStats(next);
    setPicked(choice);
    setResultText(resolve(choice.result, ctx));
    setDeltas(ds.sort((a, b) => b[1] - a[1]));
    setPhase("result");
    const correctMark = scene.kind === "quiz" ? (choice.correct ? "⭕" : "❌") : "";
    setStoryLog((l) => [...l, `${gradeLabel(scene.grade)}「${scene.title}」${correctMark} ${choice.label}`]);
    setChoicesLog((l) => [...l, { grade: scene.grade, scene: scene.title, choice: choice.label }]);
    if (choice.correct) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ["#22c55e", "#fde68a", "#ffffff"] });
    }
  };

  const next = () => {
    if (phase !== "result") return;
    if (isLast) {
      const e = judgeEnding(stats, elite);
      setEnding(e);
      setPhase("ending");
      setStoryLog((l) => [...l, `卒業：${e.title}`]);
      save({
        grade: 7,
        stats,
        storyLog: [...storyLog, `卒業：${e.title}`],
        choicesLog,
        status: "graduated",
        endingId: e.id,
        endingTitle: e.title.replace("${shortName}", school.shortName),
      });
      // 卒業演出
      const colors = elite
        ? ["#f5b301", "#fde68a", "#ffffff", "#f472b6"]
        : ["#f472b6", "#93c5fd", "#fde68a", "#86efac", "#ffffff"];
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 }, colors });
      setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0 }, colors }), 300);
      setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1 }, colors }), 550);
    } else {
      const ni = idx + 1;
      setIdx(ni);
      setPicked(null);
      setPhase("play");
      window.scrollTo({ top: 0, behavior: "smooth" });
      save({ grade: Math.max(1, Math.min(6, scenes[ni].grade === 0 ? 1 : scenes[ni].grade === 7 ? 6 : scenes[ni].grade)), stats, storyLog, choicesLog });
    }
  };

  // おまかせモード（1in8bリスペクト）
  const autoRef = useRef(auto);
  autoRef.current = auto;
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(
      () => {
        if (phase === "play") {
          const cs = scenes[idx].choices;
          choose(cs[Math.floor(Math.random() * cs.length)]);
        } else if (phase === "result") {
          next();
        }
      },
      phase === "play" ? 2600 : 3400
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, phase, idx]);

  // 寄せ書き取得
  useEffect(() => {
    if (phase !== "ending" || !playthroughId) return;
    fetch(`/api/guestbook?playthroughId=${playthroughId}`)
      .then((r) => r.json())
      .then((j) => setMessages(j.messages ?? []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const postMessage = async () => {
    if (!playthroughId || !msgText.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playthroughId, author: author.trim() || "同級生", message: msgText.trim() }),
      });
      const j = await res.json();
      if (res.ok) {
        setMessages((m) => [j.message, ...m]);
        setMsgText("");
      }
    } finally {
      setPosting(false);
    }
  };

  const shareText = ending
    ? `【52分の1ゲーム】${playerName}は${school.shortName}を卒業しました🎓\n称号：${ending.title.replace("${shortName}", school.shortName)}\n学力${stats.study}・体力${stats.fitness}・なかよし${stats.friend}・きらめき${stats.charm}・思い出${stats.memory}\n#52分の1ゲーム #${school.shortName}`
    : "";

  // ---------- エンディング画面 ----------
  if (phase === "ending" && ending) {
    const endingTitle = ending.title.replace("${shortName}", school.shortName);
    return (
      <div className="grid gap-4">
        {/* 卒業証書 */}
        <div
          className={`animate-pop-in overflow-hidden rounded-3xl border-[3px] shadow-[6px_6px_0_#0f172a] ${
            elite ? "elite-glow border-yellow-500 bg-gradient-to-b from-amber-50 to-yellow-100" : "border-slate-900 bg-white"
          }`}
        >
          <div className={`px-4 py-2 text-center text-xs font-black tracking-[0.3em] ${elite ? "elite-bg text-white" : "bg-slate-900 text-yellow-300"}`}>
            {elite ? "✨ 👑 NAMIKI ELITE 卒業認定 👑 ✨" : "🎓 卒業証書 🎓"}
          </div>
          <div className="p-6 text-center sm:p-10">
            <p className="text-6xl">{ending.icon}</p>
            <p className="mt-2 text-xs font-black tracking-widest text-slate-400">称号</p>
            <h2 className={`mt-1 font-[family-name:var(--font-round)] text-2xl font-black sm:text-3xl ${elite ? "elite-shine" : "text-pink-500"}`}>
              {endingTitle}
            </h2>
            <div className="mx-auto mt-5 max-w-xl rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 p-5 text-left">
              <p className="text-center font-[family-name:var(--font-round)] text-lg font-black">卒業証書</p>
              <p className="mt-3 text-sm font-bold leading-relaxed">
                {playerName} 殿<br />
                <br />
                あなたは{school.name}における6年間の課程を修了し、
                「{school.motto}」の心を胸に卒業することを認定します。
              </p>
              <p className="mt-3 text-sm font-bold leading-relaxed text-slate-600">{resolve(ending.text, ctx)}</p>
              <p className="mt-4 text-right text-xs font-bold text-slate-400">
                {new Date().getFullYear()}年3月25日　{school.name}長
              </p>
            </div>
            <div className="mx-auto mt-5 max-w-xl">
              <StatBars stats={stats} />
            </div>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#f472b6]"
              >
                <Share2 size={16} /> 結果をポストする
              </a>
              <button
                onClick={() => navigator.clipboard?.writeText(shareText).catch(() => {})}
                className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-6 py-3 text-sm font-black"
              >
                結果をコピー
              </button>
            </div>
          </div>
        </div>

        {/* 6年間のあゆみ */}
        <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
          <h3 className="font-[family-name:var(--font-round)] text-lg font-black">📖 6年間のあゆみ（卒業文集ダイジェスト）</h3>
          <ol className="mt-3 grid max-h-64 gap-1.5 overflow-y-auto text-xs font-bold text-slate-600 sm:text-sm">
            {storyLog.map((s, i) => (
              <li key={i} className="rounded-lg bg-slate-50 px-3 py-1.5">
                {i + 1}. {s}
              </li>
            ))}
          </ol>
        </div>

        {/* 寄せ書き */}
        <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
          <h3 className="font-[family-name:var(--font-round)] text-lg font-black">💌 寄せ書き（みんなからのメッセージ）</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={40}
              placeholder="名前（例：となりの席の子）"
              className="rounded-xl border-2 border-slate-900 bg-[#fff9ef] px-3 py-2 text-sm font-bold outline-none"
            />
            <div className="flex gap-2">
              <input
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                maxLength={200}
                placeholder="お祝いメッセージを書く…"
                className="flex-1 rounded-xl border-2 border-slate-900 bg-[#fff9ef] px-3 py-2 text-sm font-bold outline-none"
              />
              <button
                onClick={postMessage}
                disabled={posting || !msgText.trim()}
                className="flex items-center gap-1 rounded-xl border-2 border-slate-900 bg-pink-400 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
              >
                {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {messages.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-400">
                まだ寄せ書きがありません。最初の1通を書いてあげよう！
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className="rounded-xl bg-yellow-50 px-4 py-2.5">
                <p className="text-sm font-bold">{m.message}</p>
                <p className="mt-0.5 text-right text-[11px] font-black text-slate-400">— {m.author}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Link href="/play?mode=random" className="flex items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-pink-400 px-4 py-3 font-black text-white shadow-[3px_3px_0_#0f172a]">
            <RotateCcw size={17} /> もう一度入学する
          </Link>
          <Link href={`/schools/${school.slug}`} className="flex items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-4 py-3 font-black">
            🏫 {school.shortName}のデータ
          </Link>
          <Link href="/ranking" className="flex items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-4 py-3 font-black">
            🎓 卒業生名簿を見る
          </Link>
        </div>
      </div>
    );
  }

  // ---------- プレイ画面 ----------
  return (
    <div className="grid gap-3">
      {/* ヘッダー情報 */}
      <div
        className={`rounded-2xl border-[3px] p-4 shadow-[4px_4px_0_#0f172a] ${
          elite ? "elite-glow border-yellow-500 bg-gradient-to-r from-amber-50 to-yellow-100" : "border-slate-900 bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-black text-slate-400">
              {elite ? "👑 NAMIKI ELITEコース" : `${school.area}・${school.students2024}人（${rank}位）`}
            </p>
            <h2 className="font-[family-name:var(--font-round)] text-lg font-black leading-tight">
              {elite && <Crown size={16} className="mr-1 inline text-yellow-500" />}
              {school.shortName} ・ {playerName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-[11px] font-black text-slate-400">保存中…</span>}
            <button
              onClick={() => setAuto(!auto)}
              className={`flex items-center gap-1.5 rounded-full border-2 border-slate-900 px-3 py-1.5 text-xs font-black transition ${
                auto ? "bg-slate-900 text-white" : "bg-white text-slate-600"
              }`}
              title="1in8bリスペクト：見守るモード"
            >
              {auto ? <Pause size={13} /> : <Play size={13} />}
              おまかせ {auto ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* 学年タイムライン */}
        <div className="mt-3 flex items-center gap-0.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((g) => {
            const label = g === 0 ? "入" : g === 7 ? "卒" : String(g);
            const active = scene.grade === g;
            const done = scene.grade > g;
            return (
              <div key={g} className="flex flex-1 items-center">
                <div
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-black ${
                    active
                      ? elite
                        ? "elite-bg border-yellow-700 text-white"
                        : "border-slate-900 bg-pink-400 text-white"
                      : done
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-slate-100 text-slate-400"
                  }`}
                >
                  {label}
                </div>
                {g < 7 && <div className={`h-0.5 flex-1 ${done ? "bg-slate-900" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-black text-slate-500">
          <span>
            {gradeLabel(scene.grade)} ・ {scene.season} ・ {idx + 1}/{scenes.length}話
          </span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${elite ? "elite-bg" : "bg-pink-400"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3">
          <StatBars stats={stats} compact />
        </div>
      </div>

      {/* シーンカード */}
      <div
        key={scene.id}
        className={`animate-rise overflow-hidden rounded-3xl border-[3px] bg-white shadow-[6px_6px_0_#0f172a] ${
          scene.eliteOnly ? "border-yellow-500" : scene.kind === "quiz" ? "border-sky-500" : scene.kind === "reflect" ? "border-purple-400" : "border-slate-900"
        }`}
      >
        <div
          className={`flex items-center justify-between px-5 py-2.5 ${
            scene.eliteOnly
              ? "elite-bg text-white"
              : scene.kind === "quiz"
                ? "bg-sky-400 text-white"
                : scene.kind === "reflect"
                  ? "bg-purple-400 text-white"
                  : "bg-slate-900 text-white"
          }`}
        >
          <span className="text-xs font-black tracking-widest">
            {scene.eliteOnly ? "👑 ELITE MISSION" : scene.kind === "quiz" ? "🧪 川口クイズ" : scene.kind === "reflect" ? "💭 ひと息" : `📖 第${idx + 1}話`}
          </span>
          <span className="text-xs font-bold opacity-80">{scene.season}</span>
        </div>
        <div className="p-5 sm:p-7">
          <h3 className="font-[family-name:var(--font-round)] text-2xl font-black">
            <span className="mr-2">{scene.icon}</span>
            {scene.title}
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-loose text-slate-700 sm:text-[15px]">
            {resolve(scene.body, ctx)}
          </p>

          {phase === "play" && (
            <div className="animate-rise-1 mt-5 grid gap-2">
              {scene.choices.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => choose(c)}
                  className={`group flex items-center gap-3 rounded-2xl border-[3px] px-4 py-3.5 text-left transition hover:-translate-y-0.5 ${
                    scene.eliteOnly
                      ? "border-yellow-600 bg-gradient-to-r from-yellow-50 to-amber-50 hover:shadow-[4px_4px_0_#b45309]"
                      : "border-slate-900 bg-[#fff9ef] hover:bg-yellow-100 hover:shadow-[4px_4px_0_#0f172a]"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-black ${
                      scene.eliteOnly ? "border-yellow-600 bg-yellow-400 text-yellow-950" : "border-slate-900 bg-white"
                    }`}
                  >
                    {scene.kind === "quiz" ? ["A", "B", "C"][i] : i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-black sm:text-base">{c.label}</span>
                    <span className="block text-[11px] font-bold text-slate-400">{c.sub}</span>
                  </span>
                  <ChevronRight size={18} className="ml-auto shrink-0 text-slate-300 group-hover:text-slate-900" />
                </button>
              ))}
              {auto && <p className="text-center text-xs font-black text-slate-400">おまかせモード：自動で選択します…</p>}
            </div>
          )}

          {phase === "result" && picked && (
            <div className="animate-pop-in mt-5 rounded-2xl border-[3px] border-slate-900 bg-yellow-50 p-5">
              <p className="text-xs font-black tracking-widest text-slate-400">
                選択：{picked.label}
                {scene.kind === "quiz" && (
                  <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs ${picked.correct ? "bg-green-400 text-white" : "bg-slate-300 text-slate-600"}`}>
                    {picked.correct ? "⭕ 正解！" : "❌ 不正解…"}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm font-bold leading-relaxed sm:text-[15px]">{resultText}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {deltas.map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-full px-3 py-1 text-xs font-black text-white"
                    style={{ background: STAT_META[k].color }}
                  >
                    {STAT_META[k].icon} {STAT_META[k].label} {v > 0 ? `+${v}` : v}
                  </span>
                ))}
              </div>
              <button
                onClick={next}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 px-6 py-3.5 font-[family-name:var(--font-round)] text-lg font-black shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 ${
                  elite ? "bg-yellow-400 text-yellow-950" : "bg-slate-900 text-white"
                }`}
              >
                {isLast ? (
                  <>{elite ? <Sparkles size={20} /> : "🎓"} 卒業式へ進む</>
                ) : (
                  <>次の話へ <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] font-bold text-slate-400">
        選択は自動保存されます ・ ブラウザを閉じても記録は卒業生名簿に残ります
      </p>
    </div>
  );
}
