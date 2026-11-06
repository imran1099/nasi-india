import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { CommitteeCard } from "@/components/committee/CommitteeCard";
import { initialCommittee, type CommitteeMember } from "@/data/committee";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;

// ---------------------------------------------------------------------------
// Normalize DB record to CommitteeMember static shape
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbMemberToStatic(m: any): CommitteeMember {
  const initials =
    m.name
      .split(" ")
      .map((part: string) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SI";

  return {
    role: m.title,
    roleShort: m.title,
    name: m.name,
    designation: m.title,
    department: m.organization ?? "National Committee",
    tenure: "Biennium 2026–2028",
    clubAffiliation: m.city ? `${m.city}${m.state ? `, ${m.state}` : ""}` : "NASI India",
    emailPlaceholder: "secretariat@nasi-india.org",
    initials,
    bio: m.bio ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Data helper — try DB first, fall back to static data
// ---------------------------------------------------------------------------

async function getCommitteeData(): Promise<CommitteeMember[]> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return initialCommittee;
  }
  try {
    const { getCommitteeMembers } = await import("@/lib/dal/committee");
    const members = await getCommitteeMembers();
    if (members.length > 0 && !members[0].name.startsWith("[Sample]")) {
      return members.map(dbMemberToStatic);
    }
  } catch (err) {
    console.warn("[committee/page] DB unavailable, falling back to static data:", err);
  }
  return initialCommittee;
}

export const metadata: Metadata = {
  title: "NASI India Board: 2026-2028 | National Association Soroptimist India",
  description:
    "National Executive Board of the National Association Soroptimist India (NASI-India) for Biennium 2026–2028.",
  alternates: {
    canonical: "/committee",
  },
  openGraph: {
    title: "NASI India Board: 2026-2028 | NASI India",
    description:
      "National Executive Board of the National Association Soroptimist India (NASI-India) for Biennium 2026–2028.",
    url: "/committee",
  },
};

export default async function CommitteePage() {
  const members = await getCommitteeData();

  return (
    <>
      <PageHeading
        title="NASI India Board: 2026–2028"
        kicker="National Association Soroptimist India (NASI-India)"
        description="The National Executive Board coordinates NASI India's countrywide programmes, oversees constitutional governance, supports regional club chapters, and maintains international federation ties with SIGBI."
        breadcrumbs={[{ label: "Board 2026–2028" }]}
        badge={<Badge variant="forest">Biennium 2026–2028</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <div className="mb-10 p-5 rounded-xl bg-sand-50 border border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Executive Governance
              </span>
              <p className="text-sm text-forest-800 mt-0.5">
                Official leadership roster of the National Association Soroptimist India Board for the 2026–2028 Biennium.
              </p>
            </div>
            <span className="shrink-0 text-xs font-mono text-forest-600 bg-sand-200/80 px-2.5 py-1 rounded-md">
              {members.length} Board Members
            </span>
          </div>

          <SectionHeading
            kicker="National Leadership"
            title="Office Bearers & Officers"
            description="Volunteer leaders representing diverse professions across chartered Soroptimist clubs nationwide."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member, idx) => (
              <CommitteeCard key={`${member.role}-${idx}`} member={member} showBio={true} />
            ))}
          </div>

          <div className="mt-14 p-6 sm:p-8 rounded-xl bg-sand-100/70 border border-sand-200 text-center max-w-3xl mx-auto space-y-3">
            <h3 className="font-serif font-bold text-lg text-forest-950">
              Want to get involved in National Leadership or Committees?
            </h3>
            <p className="text-sm text-forest-700 leading-relaxed">
              Soroptimist members with a passion for Programme Action, communications, membership expansion, or youth mentorship can volunteer for national working groups and regional sub-committees.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
