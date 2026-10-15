import { SCHOOLS } from "@/data/schools";
import SchoolsExplorer from "@/components/SchoolsExplorer";
import KawaguchiMap from "@/components/KawaguchiMap";

export const metadata = {
  title: "52校ずかん | 52分の1ゲーム",
  description: "川口市立小学校52校のデータずかん。児童数・校区・最寄り駅・特色を網羅。",
};

export default function SchoolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="text-center font-[family-name:var(--font-round)] text-3xl font-black sm:text-4xl">
        🏫 52校ずかん
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-bold text-slate-500">
        川口市立小学校52校の完全データ。児童数は令和6年度（2024年度）の実数。
        気になる学校をタップして、Googleマップ・通学区・特色をチェックしよう。
      </p>
      <div className="mt-6">
        <KawaguchiMap />
      </div>
      <div className="mt-6">
        <SchoolsExplorer schools={SCHOOLS} />
      </div>
    </div>
  );
}
