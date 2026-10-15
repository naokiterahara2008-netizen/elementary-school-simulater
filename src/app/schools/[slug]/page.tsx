import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Train, Users, Calendar, GraduationCap, ExternalLink,
  Crown, ChevronLeft, ChevronRight, UtensilsCrossed, Sparkles,
} from "lucide-react";
import {
  SCHOOLS, getSchool, getRank, sizeLabel,
  googleMapsEmbedUrl, googleMapsLinkUrl, schoolHpSearchUrl,
} from "@/data/schools";

export async function generateStaticParams() {
  return SCHOOLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSchool(slug);
  if (!s) return {};
  return {
    title: `${s.shortName} | 52校ずかん`,
    description: `${s.name}のデータ。児童数${s.students2024}人・${s.area}・${s.station}。${s.catchphrase}`,
  };
}

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = getSchool(slug);
  if (!school) notFound();
  const rank = getRank(school.slug);
  const elite = !!school.elite;
  const sorted = [...SCHOOLS].sort((a, b) => b.students2024 - a.students2024);
  const idx = sorted.findIndex((s) => s.slug === slug);
  const prev = sorted[idx - 1];
  const next = sorted[idx + 1];
  const max = sorted[0].students2024;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <Link href="/schools" className="inline-flex items-center gap-1 text-sm font-black text-slate-500 hover:text-slate-900">
        <ChevronLeft size={16} /> 52校ずかんに戻る
      </Link>

      {/* ヘッダー */}
      <div
        className={`mt-3 overflow-hidden rounded-3xl border-[3px] shadow-[6px_6px_0_#0f172a] ${
          elite ? "elite-glow border-yellow-500 bg-gradient-to-br from-amber-50 to-yellow-100" : "border-slate-900 bg-white"
        }`}
      >
        {elite && (
          <div className="elite-bg px-4 py-2 text-center text-xs font-black tracking-[0.3em] text-white">
            ✨ 👑 NAMIKI ELITE ・ エリートコース対象校 👑 ✨
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black text-slate-400">
                {school.area} ・ {school.foundedEra}（{school.foundedYear}年）創立
              </p>
              <h1 className={`mt-1 font-[family-name:var(--font-round)] text-3xl font-black sm:text-4xl ${elite ? "elite-shine" : ""}`}>
                {elite && <Crown className="mr-2 inline text-yellow-500" size={32} />}
                {school.name}
              </h1>
              <p className={`mt-2 inline-block rounded-full px-4 py-1 text-sm font-black ${elite ? "bg-yellow-400 text-yellow-950" : "bg-pink-100 text-pink-600"}`}>
                {school.catchphrase}
              </p>
            </div>
            <div className="rounded-2xl border-[3px] border-slate-900 bg-[#fff9ef] px-5 py-3 text-center">
              <p className="text-[11px] font-black text-slate-400">児童数ランキング</p>
              <p className="font-[family-name:var(--font-round)] text-4xl font-black">
                {rank}<span className="text-lg">位</span>
              </p>
              <p className="text-xs font-black text-slate-500">/ 52校中</p>
            </div>
          </div>

          <p className="mt-4 text-sm font-bold leading-relaxed text-slate-600 sm:text-base">
            {school.description}
          </p>

          {/* 児童数バー */}
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm font-black">
              <span className="flex items-center gap-1.5"><Users size={16} /> 児童数 {school.students2024}人（2024年度実数）</span>
              <span className="rounded-full bg-slate-900 px-3 py-0.5 text-xs text-white">{sizeLabel(school.students2024)}</span>
            </div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${elite ? "elite-bg" : "bg-gradient-to-r from-pink-400 to-orange-400"}`}
                style={{ width: `${(school.students2024 / max) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] font-bold text-slate-400">
              最多・戸塚南小985人に対する割合。推定1学年あたり約{Math.round(school.students2024 / 6)}人・{Math.max(1, Math.round(school.students2024 / 6 / 32))}〜{Math.max(2, Math.ceil(school.students2024 / 6 / 28))}クラス規模。
            </p>
          </div>

          {/* 基本データ */}
          <div className="mt-4 grid gap-2 text-sm font-bold sm:grid-cols-2">
            <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <MapPin size={16} className="shrink-0 text-pink-500" /> {school.address}
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <Train size={16} className="shrink-0 text-sky-500" /> {school.station}・徒歩約{school.walkMin}分
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <Calendar size={16} className="shrink-0 text-green-500" /> {school.foundedEra}{school.foundedYear}年創立（築{new Date().getFullYear() - school.foundedYear}年目の歴史）
            </p>
            <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
              <GraduationCap size={16} className="shrink-0 text-purple-500" /> 進学先：{school.juniorHigh}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-[#fff9ef] px-4 py-3">
            <p className="text-xs font-black tracking-widest text-slate-400">校訓・教育目標</p>
            <p className="mt-1 font-[family-name:var(--font-round)] text-lg font-black">「{school.motto}」</p>
            <p className="mt-0.5 text-xs font-bold text-slate-500">{school.goal}</p>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/play?school=${school.slug}`}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 px-6 py-3.5 font-[family-name:var(--font-round)] text-lg font-black shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 ${
                elite ? "bg-yellow-400 text-yellow-950" : "bg-pink-400 text-white"
              }`}
            >
              {elite ? <Sparkles size={20} /> : <GraduationCap size={20} />}
              この学校に入学する
            </Link>
            <Link
              href="/play?mode=random"
              className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-6 py-3.5 font-black transition hover:-translate-y-0.5"
            >
              🎰 運命に任せる
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* 特色 */}
        <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
          <h2 className="font-[family-name:var(--font-round)] text-lg font-black">🌟 学校の特色・うわさ</h2>
          <ul className="mt-3 grid gap-2">
            {school.features.map((f) => (
              <li key={f} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold">
                <span className="mt-0.5 text-pink-500">●</span> {f}
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-sm font-black text-slate-500">部活動・クラブ（例）</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {school.clubs.map((c) => (
              <span key={c} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">{c}</span>
            ))}
          </div>
          <h3 className="mt-4 text-sm font-black text-slate-500">年間行事（例）</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {school.annualEvents.map((c) => (
              <span key={c} className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">{c}</span>
            ))}
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-800">
            <UtensilsCrossed size={15} className="mt-0.5 shrink-0" />
            {school.shortName}っ子の合言葉グルメ：{school.gourmet}
          </p>
        </div>

        {/* マップ */}
        <div className="overflow-hidden rounded-2xl border-[3px] border-slate-900 bg-white shadow-[4px_4px_0_#0f172a]">
          <div className="flex items-center justify-between border-b-[3px] border-slate-900 px-4 py-2.5">
            <h2 className="font-[family-name:var(--font-round)] text-lg font-black">🗺️ Googleマップで見る</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">実地図データ</span>
          </div>
          <iframe
            title={`${school.name}の地図`}
            src={googleMapsEmbedUrl(school)}
            className="h-72 w-full border-0 sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="grid gap-2 border-t-[3px] border-slate-900 p-4 sm:grid-cols-2">
            <a
              href={googleMapsLinkUrl(school)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black transition hover:bg-slate-100"
            >
              <MapPin size={16} /> Googleマップで開く <ExternalLink size={14} />
            </a>
            <a
              href={schoolHpSearchUrl(school)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-700"
            >
              🏫 学校HPを検索する <ExternalLink size={14} />
            </a>
          </div>
          <p className="border-t border-dashed border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-400">
            ※ 通学区域の最新情報は川口市公式サイト・各学校HPで確認してください。校区外からの入学はゲームの中だけのお楽しみです。
          </p>
        </div>
      </div>

      {/* 前後の学校 */}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {prev && (
          <Link href={`/schools/${prev.slug}`} className="flex items-center gap-2 rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3 font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5">
            <ChevronLeft size={18} />
            <span>
              <span className="block text-[10px] text-slate-400">児童数ひとつ上（{rank - 1}位）</span>
              {prev.shortName}・{prev.students2024}人
            </span>
          </Link>
        )}
        {next && (
          <Link href={`/schools/${next.slug}`} className="flex items-center justify-end gap-2 rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3 text-right font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5">
            <span>
              <span className="block text-[10px] text-slate-400">児童数ひとつ下（{rank + 1}位）</span>
              {next.shortName}・{next.students2024}人
            </span>
            <ChevronRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
