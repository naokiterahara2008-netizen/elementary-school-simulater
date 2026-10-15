import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "52分の1ゲーム | 川口市立小学校52校で入学から卒業まで",
  description:
    "川口市内の公立小学校52校を舞台に、小学校入学から卒業までの6年間をシミュレーション。実際の児童数統計・校区・最寄り駅データをもとに、あなたの小学生時代をもう一度。並木小学校は噂のエリートコース。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#fff9ef] text-slate-800 antialiased">
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
