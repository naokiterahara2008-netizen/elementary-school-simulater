import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// 川口市立小学校52校マスタ（seed用。詳細は src/data/schools.ts が正本）
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 64 }).notNull(),
  shortName: varchar("short_name", { length: 32 }).notNull(),
  address: text("address").notNull(),
  area: varchar("area", { length: 32 }).notNull(),
  station: varchar("station", { length: 64 }).notNull(),
  foundedYear: integer("founded_year").notNull(),
  students2024: integer("students_2024").notNull(),
  motto: text("motto").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// プレイスルー（入学〜卒業の記録）
export const playthroughs = pgTable("playthroughs", {
  id: serial("id").primaryKey(),
  playerName: varchar("player_name", { length: 40 }).notNull().default("ななしの1年生"),
  schoolSlug: varchar("school_slug", { length: 64 }).notNull(),
  schoolName: varchar("school_name", { length: 64 }).notNull(),
  mode: varchar("mode", { length: 16 }).notNull().default("select"), // "random" | "select" | "elite"
  status: varchar("status", { length: 16 }).notNull().default("playing"), // playing | graduated
  grade: integer("grade").notNull().default(1),
  stats: jsonb("stats")
    .$type<{ study: number; fitness: number; friend: number; charm: number; memory: number }>()
    .notNull(),
  endingId: varchar("ending_id", { length: 64 }),
  endingTitle: varchar("ending_title", { length: 80 }),
  storyLog: jsonb("story_log").$type<string[]>().notNull().default([]),
  choicesLog: jsonb("choices_log")
    .$type<{ grade: number; scene: string; choice: string }[]>()
    .notNull()
    .default([]),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  finishedAt: timestamp("finished_at"),
});

// 卒業文集への「いいね」や寄せ書き
export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  playthroughId: integer("playthrough_id").notNull(),
  author: varchar("author", { length: 40 }).notNull().default("同級生"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SchoolRow = typeof schools.$inferSelect;
export type PlaythroughRow = typeof playthroughs.$inferSelect;
