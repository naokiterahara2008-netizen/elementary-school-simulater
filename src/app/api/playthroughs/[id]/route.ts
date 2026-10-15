import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { playthroughs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const rows = await db.select().from(playthroughs).where(eq(playthroughs.id, Number(id)));
    if (!rows[0]) return NextResponse.json({ error: "記録が見つかりません" }, { status: 404 });
    return NextResponse.json({ ok: true, playthrough: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

// 進捗の保存・卒業
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const patch: Partial<typeof playthroughs.$inferInsert> = {};
    if (body.grade !== undefined) patch.grade = Number(body.grade);
    if (body.stats !== undefined) patch.stats = body.stats;
    if (body.storyLog !== undefined) patch.storyLog = body.storyLog;
    if (body.choicesLog !== undefined) patch.choicesLog = body.choicesLog;
    if (body.endingId !== undefined) patch.endingId = body.endingId;
    if (body.endingTitle !== undefined) patch.endingTitle = body.endingTitle;
    if (body.status === "graduated") {
      patch.status = "graduated";
      patch.finishedAt = new Date();
    }
    const rows = await db
      .update(playthroughs)
      .set(patch)
      .where(eq(playthroughs.id, Number(id)))
      .returning();
    if (!rows[0]) return NextResponse.json({ error: "記録が見つかりません" }, { status: 404 });
    return NextResponse.json({ ok: true, playthrough: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}
