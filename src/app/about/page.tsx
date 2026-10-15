import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SCHOOLS, TOTAL_STUDENTS_2024 } from "@/data/schools";

export const metadata = {
  title: "データ出典・このゲームについて | 52分の1ゲーム",
  description: "52分の1ゲームのデータ出典、使用統計、80億分の1ゲームへのリスペクトについて。",
};

const sorted = [...SCHOOLS].sort((a, b) => b.students2024 - a.students2024);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-8">
      <h1 className="text-center font-[family-name:var(--font-round)] text-3xl font-black sm:text-4xl">
        📚 データ出典・このゲームについて
      </h1>

      <div className="mt-6 grid gap-4">
        <section className="rounded-2xl border-[3px] border-slate-900 bg-white p-6 shadow-[4px_4px_0_#0f172a]">
          <h2 className="font-[family-name:var(--font-round)] text-xl font-black">🎒 52分の1ゲームとは</h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
            川口市内の公立小学校52校を舞台に、小学校入学から卒業までの6年間をシミュレーションするファンメイドのWebゲームです。
            プレイヤーは52校のうち1校に入学し、給食・運動会・九九・社会科見学・林間学校・修学旅行など30超のイベントと選択肢を通じて、
            学力・体力・なかよし・きらめき・思い出の5つのステータスを育て、9種類のエンディング（卒業称号）を目指します。
          </p>
          <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
            「80億分の1ゲーム」（1in8b.life）のように、まずは<span className="text-pink-500">「おまかせ入学」で運命の1校を引き当てる</span>のが本作の推奨スタイル。
            どこに配属されるかは1/52（約1.92%）の運次第です。
          </p>
        </section>

        <section className="chalkboard rounded-2xl border-[3px] border-slate-900 p-6 text-white shadow-[4px_4px_0_#0f172a]">
          <h2 className="font-[family-name:var(--font-round)] text-xl font-black text-yellow-200">
            🌍 80億分の1ゲーム（1in8b.life）へのリスペクト
          </h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-green-50">
            80億分の1ゲームは、172か国の実統計（出生数・平均寿命・教育年数・所得分布など）をもとに「もう一度の人生」を歩む人生シミュレーションです。
            「どこで、誰の子として生まれるかは選べない」というコンセプト、「ひと息」システム、統計から抜け出すことの難しさの表現など、
            多くの要素に感銘を受け、本作では舞台を「川口市の小学校6年間」に置き換えてオマージュしました。
          </p>
          <a
            href="https://1in8b.life/ja/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-300 px-4 py-2 text-xs font-black text-slate-900"
          >
            80億分の1ゲーム公式サイト <ExternalLink size={13} />
          </a>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              ["🎲", "運命の配属", "生まれる国→通う小学校。1/52の運命"],
              ["💭", "ひと息", "5・15・30歳→1・3・5年の終わりに内省"],
              ["📊", "実統計", "172か国の統計→52校の実児童数・校区"],
            ].map(([icon, t, d]) => (
              <div key={t} className="rounded-xl border-2 border-dashed border-green-200/40 bg-white/10 px-3 py-2.5">
                <p className="text-xl">{icon}</p>
                <p className="text-sm font-black text-yellow-200">{t}</p>
                <p className="text-[11px] font-bold text-green-50">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border-[3px] border-slate-900 bg-white p-6 shadow-[4px_4px_0_#0f172a]">
          <h2 className="font-[family-name:var(--font-round)] text-xl font-black">📊 使用しているデータ</h2>
          <ul className="mt-3 grid gap-2 text-sm font-bold text-slate-600">
            <li className="rounded-xl bg-slate-50 px-4 py-2.5">
              <span className="font-black text-slate-900">児童数（全52校・2024年度実数）：</span>
              令和6年度「埼玉県学校便覧」公立小学校名簿より。総計{TOTAL_STUDENTS_2024.toLocaleString()}人。
              最多は戸塚南小985人、最少タイは神根東小・朝日西小183人。
            </li>
            <li className="rounded-xl bg-slate-50 px-4 py-2.5">
              <span className="font-black text-slate-900">住所・最寄り駅・創立年・教育目標：</span>
              川口市公式サイト、各小学校公式HP、ガッコム・ホームメイト等の公開情報をもとに編集。一部、公開情報が確認できない項目は校区の実情に沿った推定値を使用しています。
            </li>
            <li className="rounded-xl bg-slate-50 px-4 py-2.5">
              <span className="font-black text-slate-900">地図：</span>
              各学校ページにGoogleマップの実地図を埋め込み。校区の雰囲気（荒川・綾瀬川・芝川・見沼代用水、駅勢圏など）はイベントの文章にも反映しています。
            </li>
            <li className="rounded-xl bg-slate-50 px-4 py-2.5">
              <span className="font-black text-slate-900">並木小学校の「エリート」演出：</span>
              体力づくり研究・ブラスバンド・白百合合唱団・三世代ふれあい活動・自習室・独自検定・夏の運動会などは公開情報に基づく実在の特色です。「エリート」の呼称と金色の演出はリスペクトを込めた盛りです。
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="https://www.pref.saitama.lg.jp/e2201/binran2024.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border-2 border-slate-900 px-3 py-1.5 text-xs font-black">
              埼玉県学校便覧 <ExternalLink size={12} />
            </a>
            <a href="https://www.city.kawaguchi.lg.jp/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border-2 border-slate-900 px-3 py-1.5 text-xs font-black">
              川口市公式サイト <ExternalLink size={12} />
            </a>
          </div>
        </section>

        <section className="rounded-2xl border-[3px] border-slate-900 bg-white p-6 shadow-[4px_4px_0_#0f172a]">
          <h2 className="font-[family-name:var(--font-round)] text-xl font-black">🏫 52校 児童数一覧（2024年度実数）</h2>
          <div className="mt-3 max-h-96 overflow-y-auto rounded-xl border-2 border-slate-100">
            <table className="w-full text-xs font-bold sm:text-sm">
              <thead className="sticky top-0 bg-slate-900 text-white">
                <tr>
                  <th className="px-3 py-2 text-left">順位</th>
                  <th className="px-3 py-2 text-left">学校</th>
                  <th className="px-3 py-2 text-left">地区</th>
                  <th className="px-3 py-2 text-right">児童数</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s.slug} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-1.5 tabular-nums">{i + 1}</td>
                    <td className="px-3 py-1.5">
                      <Link href={`/schools/${s.slug}`} className="text-pink-600 hover:underline">
                        {s.elite ? "👑 " : ""}{s.shortName}
                      </Link>
                    </td>
                    <td className="px-3 py-1.5 text-slate-500">{s.area}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{s.students2024}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] font-bold text-slate-400">
            出典：令和6年度埼玉県学校便覧（「埼玉県民(仮)のブログ」による集計記事でも同数値を確認）。総計{TOTAL_STUDENTS_2024.toLocaleString()}人・平均約{Math.round(TOTAL_STUDENTS_2024 / 52)}人/校。
          </p>
        </section>

        <section className="rounded-2xl border-[3px] border-dashed border-slate-300 bg-slate-50 p-6">
          <h2 className="text-sm font-black text-slate-500">⚠️ 免責事項</h2>
          <p className="mt-2 text-xs font-bold leading-relaxed text-slate-500">
            本サイトはファンメイドの非公式コンテンツであり、川口市・川口市教育委員会・各小学校とは一切関係ありません。
            掲載情報は公開情報をもとに編集していますが、正確性・最新性を保証するものではありません。入学・通学区域等の手続きは必ず川口市公式サイト・各学校に確認してください。
            ゲーム内の出来事・人物・団体名はフィクションであり、実在のものとは関係ありません。
          </p>
          <Link href="/" className="mt-4 inline-block rounded-full border-2 border-slate-900 bg-white px-5 py-2 text-xs font-black">
            ← トップに戻る
          </Link>
        </section>
      </div>
    </div>
  );
}
