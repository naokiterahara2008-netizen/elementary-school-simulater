import Link from "next/link";
import { Dices, Map, GraduationCap, Trophy, Sparkles, Crown, Bus, BookOpen, Heart } from "lucide-react";
import { SCHOOLS, TOTAL_STUDENTS_2024 } from "@/data/schools";
import KawaguchiMap from "@/components/KawaguchiMap";
import CountUp from "@/components/CountUp";
import Sakura from "@/components/Sakura";
import RecentPlays from "@/components/RecentPlays";

export const dynamic = "force-dynamic";

const TOP5 = [...SCHOOLS].sort((a, b) => b.students2024 - a.students2024).slice(0, 5);
const BOTTOM5 = [...SCHOOLS].sort((a, b) => a.students2024 - b.students2024).slice(0, 5);
const MAX = TOP5[0].students2024;

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <Sakura count={16} />

      {/* ============ HERO ============ */}
      <section className="relative border-b-4 border-slate-900 bg-gradient-to-b from-sky-200 via-pink-100 to-[#fff9ef]">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 text-center sm:pt-14">
          <p className="animate-rise inline-block rounded-full border-2 border-slate-900 bg-white px-4 py-1.5 text-xs font-black shadow-[2px_2px_0_#0f172a]">
            🌸 80億分の1ゲーム（1in8b.life）にリスペクトを込めて 🌸
          </p>
          <h1 className="animate-rise-1 mt-5 font-[family-name:var(--font-round)] text-5xl font-black leading-tight tracking-tight sm:text-7xl">
            <span className="text-pink-500">52</span>分の1
            <span className="block text-4xl sm:text-6xl">ゲーム🎒</span>
          </h1>
          <p className="animate-rise-2 mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-slate-600 sm:text-base">
            川口市内の公立小学校は、全部で<span className="text-pink-500">52校</span>。
            あなたはそのうちの1校に「入学」し、入学式から卒業式までの6年間を生き抜く。
            実際の児童数・校区・最寄り駅・学校の特色をもとにした、極限までリアルな小学生シミュレーション。
          </p>
          <div className="animate-rise-3 mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/play?mode=random"
              className="flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-pink-400 px-8 py-4 font-[family-name:var(--font-round)] text-lg font-black text-white shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-1 sm:w-auto"
            >
              <Dices size={22} />
              おまかせ入学（1/52ガチャ）
            </Link>
            <Link
              href="/schools"
              className="flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-8 py-4 font-[family-name:var(--font-round)] text-lg font-black shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-1 sm:w-auto"
            >
              <Map size={22} />
              52校から選んで入学
            </Link>
          </div>

          {/* カウンター */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "市立小学校", value: 52, suffix: "校", icon: "🏫" },
              { label: "総児童数（2024実数）", value: TOTAL_STUDENTS_2024, suffix: "人", icon: "👧👦" },
              { label: "入学確率", value: 1.92, suffix: "%", icon: "🎰", fixed: true },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border-[3px] border-slate-900 bg-white px-2 py-3 shadow-[3px_3px_0_#0f172a]">
                <p className="text-xl sm:text-2xl">{c.icon}</p>
                <p className="font-[family-name:var(--font-round)] text-xl font-black tabular-nums sm:text-3xl">
                  {"fixed" in c && c.fixed ? (
                    <>1.92<small className="text-sm">%</small></>
                  ) : (
                    <CountUp to={c.value} suffix={c.suffix} />
                  )}
                </p>
                <p className="text-[10px] font-black text-slate-500 sm:text-xs">{c.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold text-slate-400">
            総児童数は令和6年度（2024年度）埼玉県学校便覧・52校の実数の合計
          </p>
        </div>

        {/* マーキー */}
        <div className="overflow-hidden border-t-[3px] border-slate-900 bg-slate-900 py-2.5">
          <div className="animate-marquee flex w-max whitespace-nowrap">
            {[0, 1].map((k) => (
              <span key={k} className="text-sm font-black text-white">
                {SCHOOLS.map((s) => (
                  <span key={s.slug} className="mx-3">
                    {s.elite ? "👑" : "🏫"}
                    {s.shortName}
                    <span className="ml-1 text-yellow-300">{s.students2024}人</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 遊び方 ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="text-center font-[family-name:var(--font-round)] text-2xl font-black sm:text-3xl">
          🎮 どうやって遊ぶの？
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-500">
          80億分の1ゲームのように「生まれる場所は選べない」――まずは運命の入学から。
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { icon: <Dices size={28} />, bg: "bg-pink-400", step: "STEP 1", title: "運命の入学", text: "「おまかせ入学」なら52校から完全ランダム。どこに配属されるかは運次第。もちろん好きな学校を選んで入学することもできる。" },
            { icon: <Bus size={28} />, bg: "bg-sky-400", step: "STEP 2", title: "6年間を生きる", text: "給食・運動会・九九・林間学校・修学旅行…各校の実データに沿った30超のイベントと選択肢で、あなただけの小学生時代が紡がれる。" },
            { icon: <GraduationCap size={28} />, bg: "bg-yellow-300", step: "STEP 3", title: "卒業と文集", text: "学力・体力・なかよし・きらめき・思い出の5ステータスで9種のエンディングが分岐。卒業文集と寄せ書きが残る。" },
          ].map((c) => (
            <div key={c.step} className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
              <div className={`inline-grid h-12 w-12 place-items-center rounded-xl border-2 border-slate-900 ${c.bg} text-white`}>
                {c.icon}
              </div>
              <p className="mt-3 text-xs font-black tracking-widest text-pink-500">{c.step}</p>
              <h3 className="font-[family-name:var(--font-round)] text-xl font-black">{c.title}</h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 実データ ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="text-center font-[family-name:var(--font-round)] text-2xl font-black sm:text-3xl">
          📊 実データで見る川口の小学校
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-500">
          令和6年度（2024年度）・埼玉県学校便覧より。マンモスから少人数まで、その差は5倍以上。
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
            <h3 className="font-black">🔥 児童数マンモス TOP5</h3>
            <div className="mt-3 grid gap-2">
              {TOP5.map((s, i) => (
                <Link key={s.slug} href={`/schools/${s.slug}`} className="group">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span>{i + 1}位 {s.shortName}</span>
                    <span className="tabular-nums">{s.students2024}人</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-orange-400 transition group-hover:brightness-110" style={{ width: `${(s.students2024 / MAX) * 100}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
            <h3 className="font-black">🌱 少人数 BOTTOM5（全校が家族）</h3>
            <div className="mt-3 grid gap-2">
              {BOTTOM5.map((s, i) => (
                <Link key={s.slug} href={`/schools/${s.slug}`} className="group">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span>{52 - BOTTOM5.length + 1 + i}位 {s.shortName}</span>
                    <span className="tabular-nums">{s.students2024}人</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-purple-400" style={{ width: `${(s.students2024 / MAX) * 100}%` }} />
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-[11px] font-bold text-slate-400">
              最少タイは神根東小・朝日西小の183人。最多・戸塚南小（985人）の約5.4倍の差がある。
            </p>
          </div>
        </div>
      </section>

      {/* ============ マップ ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <h2 className="text-center font-[family-name:var(--font-round)] text-2xl font-black sm:text-3xl">
          🗺️ 52校マップ
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-500">
          ピンをタップすると各学校のページへ。👑は噂のエリート校。
        </p>
        <div className="mt-6">
          <KawaguchiMap />
        </div>
      </section>

      {/* ============ 並木エリート ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="elite-glow overflow-hidden rounded-3xl border-[3px] border-yellow-600 bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-50">
          <div className="elite-bg px-4 py-2 text-center text-xs font-black tracking-[0.3em] text-white">
            ✨ SPECIAL COURSE ✨
          </div>
          <div className="grid items-center gap-6 p-6 sm:p-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border-2 border-yellow-600 bg-white px-3 py-1 text-xs font-black text-yellow-700">
                <Crown size={14} /> 1/52・確率1.92%の特別演出
              </p>
              <h2 className="elite-shine mt-3 font-[family-name:var(--font-round)] text-3xl font-black leading-tight sm:text-4xl">
                NAMIKI ELITE
                <span className="block text-lg text-yellow-700" style={{ WebkitTextFillColor: "#92400e" }}>
                  並木小学校・エリートコース
                </span>
              </h2>
              <p className="mt-3 text-sm font-bold leading-relaxed text-yellow-900">
                1954年創立・校訓「健康・勤勉・敬愛」。30年以上続く体力づくり研究、ブラスバンドと白百合合唱団、三世代ふれあい活動、電子黒板・自習室・独自検定・夏の運動会――「市内では珍しい」のデパートを、エリートコースとして特別演出でお届け。
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/play?school=namiki"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-yellow-800 bg-yellow-400 px-6 py-3 font-black text-yellow-950 shadow-[4px_4px_0_#92400e] transition hover:-translate-y-0.5"
                >
                  <Sparkles size={18} />
                  エリートコースで入学
                </Link>
                <Link
                  href="/schools/namiki"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-yellow-800 bg-white px-6 py-3 font-black text-yellow-800 transition hover:-translate-y-0.5"
                >
                  並木小のデータを見る
                </Link>
              </div>
            </div>
            <div className="grid gap-2">
              {[
                ["👑", "エリート自習室", "市内では珍しい自習室で毎日特訓"],
                ["🏆", "NAMIKI検定", "県内では珍しい独自検定で金シール"],
                ["🎺", "芸術エリート", "ブラスバンド＆白百合合唱団"],
                ["🔥", "夏の運動会", "市内では珍しい真夏の決戦"],
                ["🤲", "三世代ふれあい", "地域と育つ並木の伝統"],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border-2 border-yellow-600 bg-white/80 px-4 py-2.5">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-sm font-black text-yellow-900">{title}</p>
                    <p className="text-xs font-bold text-yellow-700">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 最近の卒業生 ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-round)] text-2xl font-black">
            🎓 最近の入学生・卒業生
          </h2>
          <Link href="/ranking" className="flex items-center gap-1 text-sm font-black text-pink-500 hover:underline">
            <Trophy size={15} /> 名簿を見る
          </Link>
        </div>
        <div className="mt-4">
          <RecentPlays />
        </div>
      </section>

      {/* ============ リスペクト ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="chalkboard rounded-3xl border-[3px] border-slate-900 p-6 text-white shadow-[6px_6px_0_#0f172a] sm:p-10">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-black tracking-[0.3em] text-yellow-200">HOMAGE</p>
              <h2 className="mt-2 font-[family-name:var(--font-magic)] text-2xl sm:text-3xl">
                「どこで、誰の子として生まれるかは選べない。」
              </h2>
              <p className="mt-3 text-sm font-bold leading-relaxed text-green-50">
                80億分の1ゲーム（1in8b.life）は、世界の実統計をもとに「もう一度の人生」を歩む人生シミュレーション。
                52分の1ゲームは、その精神を受け継ぎ、舞台を川口市の小学校に置き換えたファンメイド作品です。
                生まれる国は選べないように、通う小学校も、最初は選べない――まずは運命に身を委ねてみてください。
              </p>
            </div>
            <div className="grid gap-2">
              {[
                ["📊", "実統計ベース", "172か国の統計にならい、52校の実児童数・校区データを使用"],
                ["💭", "ひと息システム", "1・3・5年の終わりに問いかける内省イベントを再現"],
                ["🎓", "人生の長さ", "平均寿命のかわりに「卒業までの6年間」をフル尺で体験"],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-green-200/40 bg-white/10 px-4 py-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-sm font-black text-yellow-200">{title}</p>
                    <p className="text-xs font-bold text-green-50">{text}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/about" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-green-900">
                  <BookOpen size={14} /> データ出典と仕組み
                </Link>
                <Link href="/play" className="inline-flex items-center gap-1.5 rounded-full bg-yellow-300 px-4 py-2 text-xs font-black text-slate-900">
                  <Heart size={14} /> 人生（6年間）を始める
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
