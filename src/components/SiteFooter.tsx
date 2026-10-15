import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t-4 border-slate-900 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-round)] text-xl font-black text-yellow-300">
            52分の1ゲーム
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            川口市内の公立小学校52校を舞台とした、入学から卒業までの小学生ライフ・シミュレーション。
            令和6年度の実児童数・校区・最寄り駅などの公開情報をもとに、6年間をリアルに追体験できます。
          </p>
          <p className="mt-3 text-xs text-slate-400">
            ※ 本サイトはファンメイドの非公式コンテンツです。各学校・川口市教育委員会とは関係ありません。
            ※ 並木小学校の「エリート」演出はリスペクトを込めた盛りです。
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-pink-300">メニュー</p>
          <ul className="mt-3 grid gap-2 text-sm font-bold">
            <li><Link className="hover:text-yellow-300" href="/">トップ</Link></li>
            <li><Link className="hover:text-yellow-300" href="/schools">52校ずかん</Link></li>
            <li><Link className="hover:text-yellow-300" href="/play">入学する</Link></li>
            <li><Link className="hover:text-yellow-300" href="/ranking">卒業生名簿</Link></li>
            <li><Link className="hover:text-yellow-300" href="/about">データ出典・このゲームについて</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-pink-300">データ出典</p>
          <ul className="mt-3 grid gap-2 text-xs leading-relaxed text-slate-300">
            <li>児童数：令和6年度 埼玉県学校便覧（公立小学校名簿）</li>
            <li>学校概要：川口市公式・各小学校HP・ガッコム等の公開情報</li>
            <li>地図：Google マップ（埋め込み）</li>
            <li>インスピレーション：80億分の1ゲーム（1in8b.life）</li>
          </ul>
          <Link
            href="/about"
            className="mt-4 inline-block rounded-full bg-yellow-300 px-4 py-2 text-xs font-black text-slate-900"
          >
            詳しく見る
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        52分の1ゲーム — あなたの小学生時代は、52通りのどこかで待っている。
      </div>
    </footer>
  );
}
