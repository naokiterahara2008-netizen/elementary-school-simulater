import { Suspense } from "react";
import PlaySetup from "@/components/PlaySetup";

export const metadata = {
  title: "入学手続き | 52分の1ゲーム",
  description: "52校から入学先を決めて、6年間の小学生シミュレーションを始めよう。",
};

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="text-center font-[family-name:var(--font-round)] text-3xl font-black sm:text-4xl">
        🎒 入学手続き
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-bold text-slate-500">
        80億分の1ゲームのように「生まれる場所は選べない」のが本作の流儀。
        まずは「おまかせ入学」で運命の1校を引き当ててみよう。
      </p>
      <div className="mt-6">
        <Suspense fallback={<div className="py-20 text-center font-black text-slate-400">準備中…</div>}>
          <PlaySetup />
        </Suspense>
      </div>
    </div>
  );
}
