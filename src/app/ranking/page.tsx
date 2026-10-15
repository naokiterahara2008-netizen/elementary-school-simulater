import RankingClient from "@/components/RankingClient";
import Link from "next/link";

export const metadata = {
  title: "卒業生名簿 | 52分の1ゲーム",
  description: "52分の1ゲームの卒業生名簿と学校別入学人気ランキング。",
};

export default function RankingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="text-center font-[family-name:var(--font-round)] text-3xl font-black sm:text-4xl">
        🎓 卒業生名簿
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-bold text-slate-500">
        このゲームで卒業した先輩たちの記録と、学校別の入学（プレイ）数ランキング。
        あなたの名前もここに刻もう。
      </p>
      <div className="mt-6">
        <RankingClient />
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/play"
          className="inline-block rounded-full border-[3px] border-slate-900 bg-yellow-300 px-8 py-3 font-[family-name:var(--font-round)] text-lg font-black shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5"
        >
          🎒 名簿に名を刻む（入学する）
        </Link>
      </div>
    </div>
  );
}
