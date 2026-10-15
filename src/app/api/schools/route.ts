import { NextResponse } from "next/server";
import { SCHOOLS, TOTAL_STUDENTS_2024, getRank, sizeLabel } from "@/data/schools";
import { db } from "@/db";
import { playthroughs } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  // 学校ごとの卒業生数（プレイ実績）を集計
  let counts: Record<string, number> = {};
  let totalPlays = 0;
  try {
    const rows = await db
      .select({ slug: playthroughs.schoolSlug, c: count() })
      .from(playthroughs)
      .groupBy(playthroughs.schoolSlug);
    for (const r of rows) counts[r.slug] = Number(r.c);
    const t = await db.select({ c: count() }).from(playthroughs);
    totalPlays = Number(t[0]?.c ?? 0);
    void eq;
  } catch {
    // DB未接続でも学校データは返す
  }

  const list = SCHOOLS.map((s) => ({
    ...s,
    rank: getRank(s.slug),
    size: sizeLabel(s.students2024),
    plays: counts[s.slug] ?? 0,
  })).sort((a, b) => b.students2024 - a.students2024);

  return NextResponse.json({
    total: list.length,
    totalStudents2024: TOTAL_STUDENTS_2024,
    totalPlays,
    schools: list,
  });
}
