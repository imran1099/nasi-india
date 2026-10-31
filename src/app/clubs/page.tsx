import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ClubsDirectory } from "@/components/clubs/ClubsDirectory";
import { getAllClubs as getStaticClubs, type Club } from "@/data/clubs";

// Allow this route to block at prerender when DB data is fetched
export const instant = false;

// ---------------------------------------------------------------------------
// Normalize DB club to static Club shape for the directory component
// ---------------------------------------------------------------------------

function normalizeRegion(region: string): Club["region"] {
  const map: Record<string, Club["region"]> = {
    NORTHERN_REGION: "Northern Region",
    SOUTHERN_REGION: "Southern Region",
    WESTERN_REGION: "Western Region",
    EASTERN_REGION: "Eastern Region",
    NORTH_EASTERN_REGION: "North Eastern Region",
  };
  return (map[region] ?? region) as Club["region"];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbClubToStatic(c: any): Club {
  return {
    slug: c.slug,
    name: c.name,
    city: c.city,
    state: c.state,
    region: normalizeRegion(String(c.region)),
    charterYear: c.charterYear ?? "Chartered Club",
    focusAreas: c.focusAreas ?? [],
    description: c.description ?? "",
    meetingSchedule: c.meetingSchedule ?? "",
    coordinatorPlaceholder: "Club Coordinator (Contact via Secretariat)",
    emailPlaceholder: c.email ?? `si.${c.slug.replace("si-", "")}@nasi-india.org`,
    sampleProjects: (c.projects ?? []).map((p: { title: string; description: string; status: string }) => ({
      title: p.title,
      description: p.description ?? "",
      status: (p.status as "Ongoing" | "Completed" | "Annual") ?? "Ongoing",
    })),
  };
}

// ---------------------------------------------------------------------------
// Data helper — try DB first, fall back to static data
// ---------------------------------------------------------------------------

async function getClubsData(): Promise<Club[]> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return getStaticClubs();
  }
  try {
    const { getClubs } = await import("@/lib/dal/clubs");
    const result = await getClubs({ perPage: 100 });
    if (result.items.length > 0) {
      return result.items.map(dbClubToStatic);
    }
  } catch (err) {
    console.warn("[clubs/page] DB unavailable, falling back to static data:", err);
  }
  return getStaticClubs();
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "NASI India Clubs Directory",
  description:
    "Explore chartered Soroptimist International clubs across cities and regions in India. Discover local community initiatives and women empowerment programmes.",
  alternates: {
    canonical: "/clubs",
  },
  openGraph: {
    title: "NASI India Clubs Directory",
    description:
      "Explore chartered Soroptimist International clubs across cities and regions in India. Discover local community initiatives and women empowerment programmes.",
    url: "/clubs",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ClubsPage() {
  const clubs = await getClubsData();

  return (
    <>
      <PageHeading
        title="NASI India Clubs Directory"
        kicker="Nationwide Network"
        description="Soroptimist International clubs across India bring together women who take action to empower, educate, and enable women and girls in their local communities."
        breadcrumbs={[{ label: "Clubs Directory" }]}
        badge={<Badge variant="forest">{clubs.length} Chartered Clubs</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <ClubsDirectory clubs={clubs} />
        </Container>
      </section>
    </>
  );
}
