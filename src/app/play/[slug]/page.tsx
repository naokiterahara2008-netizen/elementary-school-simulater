import { notFound } from "next/navigation";
import GameClient from "@/components/GameClient";
import { SCHOOLS, getSchool } from "@/data/schools";

export async function generateStaticParams() {
  return SCHOOLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSchool(slug);
  if (!s) return {};
  return {
    title: `${s.shortName}で6年間を生きる | 52分の1ゲーム`,
    description: `${s.name}に入学して卒業までの6年間をシミュレーション。`,
  };
}

export default async function PlaySchoolPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pid?: string; name?: string }>;
}) {
  const { slug } = await params;
  const school = getSchool(slug);
  if (!school) notFound();
  const sp = await searchParams;
  const pid = sp.pid ? Number(sp.pid) : null;
  const playerName = sp.name ? decodeURIComponent(sp.name) : "ななしの1年生";

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <GameClient
        school={school}
        playthroughId={Number.isFinite(pid) && pid ? pid : null}
        playerName={playerName}
      />
    </div>
  );
}
