import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { guestbook } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pid = Number(searchParams.get("playthroughId"));
    if (!pid) return NextResponse.json({ ok: true, messages: [] });
    const rows = await db
      .select()
      .from(guestbook)
      .where(eq(guestbook.playthroughId, pid))
      .orderBy(desc(guestbook.createdAt))
      .limit(30);
    return NextResponse.json({ ok: true, messages: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playthroughId, author, message } = body as {
      playthroughId?: number;
      author?: string;
      message?: string;
    };
    if (!playthroughId || !message?.trim()) {
      return NextResponse.json({ error: "メッセージを入力してください" }, { status: 400 });
    }
    const [row] = await db
      .insert(guestbook)
      .values({
        playthroughId: Number(playthroughId),
        author: (author || "同級生").slice(0, 40),
        message: message.slice(0, 200),
      })
      .returning();
    return NextResponse.json({ ok: true, message: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "投稿に失敗しました" }, { status: 500 });
  }
}
