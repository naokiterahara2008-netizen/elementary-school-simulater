"use client";

import Link from "next/link";
import { SCHOOLS, type School } from "@/data/schools";
import { useState } from "react";

function dotColor(s: School): string {
  if (s.elite) return "#f5b301";
  if (s.students2024 >= 850) return "#ef4444";
  if (s.students2024 >= 600) return "#f97316";
  if (s.students2024 >= 400) return "#22c55e";
  if (s.students2024 >= 250) return "#3b82f6";
  return "#a855f7";
}

function dotSize(s: School): number {
  if (s.elite) return 15;
  if (s.students2024 >= 850) return 13;
  if (s.students2024 >= 600) return 11;
  if (s.students2024 >= 400) return 9;
  if (s.students2024 >= 250) return 8;
  return 7;
}

export default function KawaguchiMap({ highlight }: { highlight?: string }) {
  const [hover, setHover] = useState<School | null>(null);
  const active = hover ?? (highlight ? (SCHOOLS.find((s) => s.slug === highlight) ?? null) : null);

  return (
    <div className="overflow-hidden rounded-2xl border-[3px] border-slate-900 bg-[#e8f4e5] shadow-[4px_4px_0_#0f172a]">
      <div className="flex items-center justify-between border-b-[3px] border-slate-900 bg-white px-4 py-2">
        <p className="text-sm font-black">🗺️ 川口市52校マップ（イメージ図）</p>
        <div className="hidden items-center gap-2 text-[10px] font-bold text-slate-500 sm:flex">
          <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />マンモス</span>
          <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />中規模</span>
          <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-purple-500" />少人数</span>
          <span className="flex items-center gap-1"><i className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500" />👑並木</span>
        </div>
      </div>
      <div className="relative">
        {/* 川口市の雰囲気を表現した背景 */}
        <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label="川口市52校イメージ地図">
          {/* 荒川（南） */}
          <path d="M0,92 Q25,86 50,90 T100,88 L100,100 L0,100 Z" fill="#bae6fd" opacity="0.9" />
          <text x="4" y="96.5" fontSize="3.4" fill="#0369a1" fontWeight="bold">荒川</text>
          {/* 綾瀬川（東） */}
          <path d="M86,0 Q84,30 88,55 Q90,75 86,90" stroke="#7dd3fc" strokeWidth="2.4" fill="none" opacity="0.9" />
          <text x="89" y="60" fontSize="2.8" fill="#0369a1" fontWeight="bold" transform="rotate(90 89 60)">綾瀬川</text>
          {/* 芝川（中央南） */}
          <path d="M34,52 Q32,65 36,78 Q38,85 36,90" stroke="#7dd3fc" strokeWidth="1.8" fill="none" opacity="0.9" />
          {/* 見沼代用水（西） */}
          <path d="M18,40 Q16,60 20,85" stroke="#7dd3fc" strokeWidth="1.2" fill="none" strokeDasharray="2 1" opacity="0.9" />
          {/* 鉄道路線イメージ */}
          <path d="M38,100 L44,55 L46,40" stroke="#94a3b8" strokeWidth="1.4" fill="none" />
          <path d="M30,100 L34,60 L40,35" stroke="#cbd5e1" strokeWidth="1" fill="none" />
          <path d="M55,0 L70,25 L85,45" stroke="#cbd5e1" strokeWidth="1" fill="none" />
          {/* 駅 */}
          {[
            { x: 43.5, y: 63, t: "川口" },
            { x: 40.5, y: 61, t: "西川口" },
            { x: 33, y: 79, t: "蕨" },
            { x: 72, y: 18, t: "東川口" },
            { x: 63, y: 27, t: "戸塚安行" },
            { x: 44, y: 42, t: "鳩ヶ谷" },
          ].map((st) => (
            <g key={st.t}>
              <rect x={st.x - 1.6} y={st.y - 1.6} width="3.2" height="3.2" rx="0.6" fill="#0f172a" />
              <text x={st.x + 2.4} y={st.y + 1} fontSize="2.6" fill="#0f172a" fontWeight="bold">{st.t}</text>
            </g>
          ))}
          {/* 地区ラベル */}
          <text x="70" y="10" fontSize="3" fill="#64748b" fontWeight="bold">戸塚・安行</text>
          <text x="78" y="52" fontSize="3" fill="#64748b" fontWeight="bold">新郷</text>
          <text x="42" y="34" fontSize="3" fill="#64748b" fontWeight="bold">鳩ヶ谷</text>
          <text x="22" y="70" fontSize="3" fill="#64748b" fontWeight="bold">芝</text>
          <text x="50" y="70" fontSize="3" fill="#64748b" fontWeight="bold">中央・南平</text>
        </svg>

        {/* 学校ピン */}
        <div className="absolute inset-0">
          {SCHOOLS.map((s) => (
            <Link
              key={s.slug}
              href={`/schools/${s.slug}`}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s)}
              onBlur={() => setHover(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150"
              style={{
                left: `${s.mapX}%`,
                top: `${s.mapY}%`,
                width: dotSize(s),
                height: dotSize(s),
                background: dotColor(s),
                border: s.slug === highlight || s.slug === hover?.slug ? "2.5px solid #0f172a" : "2px solid white",
                boxShadow: s.elite ? "0 0 10px 3px rgba(245,179,1,.9)" : "0 1px 4px rgba(0,0,0,.3)",
                zIndex: s.elite ? 20 : s.slug === hover?.slug ? 30 : 10,
              }}
              aria-label={s.name}
            >
              {s.elite && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px]">👑</span>
              )}
            </Link>
          ))}
        </div>

        {/* ホバー情報 */}
        {active && (
          <div className="absolute bottom-2 left-2 right-2 rounded-xl border-2 border-slate-900 bg-white/95 px-3 py-2 text-xs shadow-lg sm:left-auto sm:right-2 sm:w-72">
            <p className="font-black">
              {active.elite ? "👑 " : ""}
              {active.name}
            </p>
            <p className="mt-0.5 font-bold text-slate-500">
              {active.area} ・ {active.students2024}人 ・ {active.station}
            </p>
            <p className="mt-0.5 font-black text-pink-500">タップで学校ページへ →</p>
          </div>
        )}
      </div>
    </div>
  );
}
