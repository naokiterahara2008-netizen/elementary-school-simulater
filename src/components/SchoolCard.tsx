import Link from "next/link";
import { MapPin, Train, Users, Crown } from "lucide-react";
import { getRank, sizeLabel, type School } from "@/data/schools";

export default function SchoolCard({ school }: { school: School }) {
  const rank = getRank(school.slug);
  const elite = !!school.elite;
  return (
    <Link
      href={`/schools/${school.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border-3 bg-white transition hover:-translate-y-1 ${
        elite
          ? "border-yellow-500 shadow-[4px_4px_0_#b45309]"
          : "border-slate-900 shadow-[4px_4px_0_#0f172a]"
      }`}
      style={{ borderWidth: 3 }}
    >
      {elite && (
        <div className="elite-bg px-3 py-1 text-center text-[11px] font-black tracking-widest text-white">
          ✨ NAMIKI ELITE ・ エリートコース ✨
        </div>
      )}
      <div className={`px-4 pt-3 ${elite ? "" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold text-slate-400">
              {school.area} ・ {school.foundedEra}創立
            </p>
            <h3 className="font-[family-name:var(--font-round)] text-lg font-black leading-tight">
              {elite && <Crown size={16} className="mr-1 inline text-yellow-500" />}
              {school.shortName}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${
              rank <= 3
                ? "bg-yellow-300 text-slate-900"
                : rank >= 50
                  ? "bg-sky-200 text-slate-800"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {rank}位
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-xs font-bold text-pink-500">{school.catchphrase}</p>
        <div className="mt-2 grid gap-1 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <Users size={13} className="text-slate-400" />
            児童数 {school.students2024}人（2024実数）・{sizeLabel(school.students2024)}
          </span>
          <span className="flex items-center gap-1">
            <Train size={13} className="text-slate-400" />
            {school.station} 徒歩{school.walkMin}分
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-slate-400" />
            {school.address}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-slate-200 py-2.5">
          <span className="text-xs font-bold text-slate-400">「{school.motto}」</span>
          <span className="text-xs font-black text-slate-900 group-hover:underline">
            詳しく見る →
          </span>
        </div>
      </div>
    </Link>
  );
}
