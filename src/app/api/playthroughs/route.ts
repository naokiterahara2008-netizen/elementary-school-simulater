import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { playthroughs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSchool } from "@/data/schools";
import { INITIAL_STATS } from "@/data/game";

export const dynamic = "force-dynamic";

// 新規入学（プレイスルー開始）
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerName, schoolSlug, mode } = body as {
      playerName?: string;
      schoolSlug?: string;
      mode?: string;
    };
    const school = schoolSlug ? getSchool(schoolSlug) : undefined;
    if (!school) {
      return NextResponse.json({ error: "学校が見つかりません" }, { status: 404 });
    }
    const [row] = await db
      .insert(playthroughs)
      .values({
        playerName: (playerName || "ななしの1年生").slice(0, 40),
        schoolSlug: school.slug,
        schoolName: school.name,
        mode: mode === "random" ? "random" : school.elite ? "elite" : "select",
        status: "playing",
        grade: 1,
        stats: { ...INITIAL_STATS },
        storyLog: [],
        choicesLog: [],
      })
      .returning();
    return NextResponse.json({ ok: true, playthrough: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "入学手続きに失敗しました" }, { status: 500 });
  }
}

// 卒業生名簿（ランキング/新着）
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") ?? "recent";
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
    const rows = await db
      .select()
      .from(playthroughs)
      .orderBy(desc(scope === "recent" ? playthroughs.startedAt : playthroughs.finishedAt))
      .limit(limit);
    return NextResponse.json({ ok: true, playthroughs: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "名簿の取得に失敗しました" }, { status: 500 });
  }
}
