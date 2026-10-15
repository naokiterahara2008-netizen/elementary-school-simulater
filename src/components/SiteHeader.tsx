"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Dices, Map, GraduationCap, Trophy, BookOpen } from "lucide-react";

const NAV = [
  { href: "/", label: "トップ", icon: BookOpen },
  { href: "/schools", label: "52校ずかん", icon: Map },
  { href: "/play", label: "入学する", icon: GraduationCap },
  { href: "/ranking", label: "卒業生名簿", icon: Trophy },
  { href: "/about", label: "データ出典", icon: Dices },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-slate-900 bg-[#fff9ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-slate-900 bg-yellow-300 font-black shadow-[3px_3px_0_#0f172a]">
            52
          </span>
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-round)] text-lg font-black tracking-tight">
              52分の1ゲーム
            </span>
            <span className="block text-[10px] font-bold text-slate-500">
              川口市立小学校52校・入学〜卒業シミュレーション
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-slate-900 text-white shadow-[2px_2px_0_#f472b6]"
                    : "text-slate-600 hover:bg-pink-100 hover:text-slate-900"
                }`}
              >
                <n.icon size={15} />
                {n.label}
              </Link>
            );
          })}
          <Link
            href="/play?mode=random"
            className="ml-1 flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-pink-400 px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"
          >
            <Dices size={16} />
            おまかせ入学
          </Link>
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border-2 border-slate-900 bg-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t-2 border-dashed border-slate-300 bg-[#fff9ef] p-3 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-pink-100"
            >
              <n.icon size={17} />
              {n.label}
            </Link>
          ))}
          <Link
            href="/play?mode=random"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-pink-400 px-4 py-3 font-black text-white"
          >
            <Dices size={18} />
            おまかせ入学（52分の1ガチャ）
          </Link>
        </nav>
      )}
    </header>
  );
}
