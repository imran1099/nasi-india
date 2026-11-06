import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  MapPinIcon,
  CalendarIcon,
  MailIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/icons";
import {
  getAllClubs as getStaticClubs,
  getClubBySlug as getStaticClubBySlug,
  type Club,
} from "@/data/clubs";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;

interface ClubPageProps {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Region enum → display string
// ---------------------------------------------------------------------------

function normalizeRegion(region: string): string {
  return region
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Normalize DB club record to static Club shape with historical archival data
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbClubToStatic(c: any): Club {
  const staticClub = getStaticClubBySlug(c.slug);

  return {
    slug: c.slug,
    name: c.name,
    city: c.city,
    state: c.state,
    region: normalizeRegion(String(c.region)) as Club["region"],
    charterYear: c.charterYear ?? staticClub?.charterYear ?? "Chartered Club",
    charterDate: staticClub?.charterDate,
    charterStatusNote: staticClub?.charterStatusNote,
    foundingPresident: staticClub?.foundingPresident,
    nasiPresidentAtCharter: staticClub?.nasiPresidentAtCharter,
    nasiMembershipOfficer: staticClub?.nasiMembershipOfficer,
    sigbiOfficer: staticClub?.sigbiOfficer,
    motherClub: staticClub?.motherClub,
    founderMembersCount: staticClub?.founderMembersCount,
    historicalNotes: staticClub?.historicalNotes,
    focusAreas: c.focusAreas && c.focusAreas.length > 0 ? c.focusAreas : (staticClub?.focusAreas ?? []),
    description: c.description ?? staticClub?.description ?? "",
    meetingSchedule: c.meetingSchedule ?? staticClub?.meetingSchedule ?? "",
    coordinatorPlaceholder:
      c.officers && c.officers.length > 0
        ? `${c.officers[0].title}: ${c.officers[0].name}`
        : (staticClub?.coordinatorPlaceholder ?? "Club Coordinator (Contact via Secretariat)"),
    emailPlaceholder: c.email ?? staticClub?.emailPlaceholder ?? `si.${c.slug.replace("si-", "")}@nasi-india.org`,
    sampleProjects: (c.projects && c.projects.length > 0)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? c.projects.map((p: any) => ({
        title: p.title,
        description: p.description ?? "",
        status: p.status ?? "Ongoing",
      }))
      : (staticClub?.sampleProjects ?? []),
  };
}

// ---------------------------------------------------------------------------
// Data helpers
// ---------------------------------------------------------------------------

async function getSlugs(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    return getStaticClubs().map((c) => c.slug);
  }
  try {
    const { getAllClubSlugs } = await import("@/lib/dal/clubs");
    const slugs = await getAllClubSlugs();
    if (slugs.length > 0) return slugs;
  } catch (err) {
    console.warn("[clubs/[slug]] DB unavailable, using static slugs:", err);
  }
  return getStaticClubs().map((c) => c.slug);
}

async function getClub(slug: string): Promise<Club | null> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return getStaticClubBySlug(slug) ?? null;
  }
  try {
    const { getClubBySlug } = await import("@/lib/dal/clubs");
    const dbClub = await getClubBySlug(slug);
    if (dbClub) return dbClubToStatic(dbClub);
  } catch (err) {
    console.warn("[clubs/[slug]] DB unavailable, falling back:", err);
  }
  return getStaticClubBySlug(slug) ?? null;
}

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: ClubPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) return { title: "Club Not Found | NASI India" };
  return {
    title: `${club.name} (${club.city})`,
    description: club.description,
    alternates: {
      canonical: `/clubs/${slug}`,
    },
    openGraph: {
      title: `${club.name} (${club.city}) | NASI India Clubs`,
      description: club.description,
      url: `/clubs/${slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ClubDetailPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = await getClub(slug);

  if (!club) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nasiindia.org";

  const hasHistoricalData =
    club.charterDate ||
    club.foundingPresident ||
    club.nasiPresidentAtCharter ||
    club.nasiMembershipOfficer ||
    club.sigbiOfficer ||
    club.motherClub ||
    club.founderMembersCount ||
    club.historicalNotes;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteUrl}` },
          { name: "Clubs Directory", url: `${siteUrl}/clubs` },
          { name: club.name, url: `${siteUrl}/clubs/${club.slug}` },
        ]}
      />
      <PageHeading
        title={club.name}
        kicker={`${club.region} • Chartered Chapter`}
        description={club.description}
        breadcrumbs={[
          { label: "Our Clubs", href: "/clubs" },
          { label: club.name },
        ]}
        badge={
          <Badge variant="forest">
            {club.city}, {club.state}
          </Badge>
        }
        action={
          <Button
            href="/clubs"
            variant="outline"
            size="sm"
            leftIcon={<span className="font-bold">&larr;</span>}
          >
            Back to Directory
          </Button>
        }
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* 1. Charter & Historical Profile Section */}
              {hasHistoricalData && (
                <div className="p-6 sm:p-7 rounded-2xl bg-sand-50/70 border border-sand-200/90 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                    <div className="flex items-center gap-2">
                      <SparklesIcon size={18} className="text-teal-800" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-forest-950 font-sans">
                        Charter & Historical Profile
                      </h2>
                    </div>
                    {club.charterDate && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        <CalendarIcon size={13} className="text-teal-700" />
                        {club.charterDate}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {club.charterDate && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          Charter Date
                        </span>
                        <p className="font-semibold text-forest-950 mt-0.5 text-sm">
                          {club.charterDate}
                        </p>
                      </div>
                    )}

                    {club.foundingPresident && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          Founding President
                        </span>
                        <p className="font-semibold text-forest-950 mt-0.5 text-sm">
                          {club.foundingPresident}
                        </p>
                      </div>
                    )}

                    {club.motherClub && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          Mother Club
                        </span>
                        <p className="font-semibold text-teal-900 mt-0.5 text-sm">
                          {club.motherClub}
                        </p>
                      </div>
                    )}

                    {club.nasiPresidentAtCharter && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          NASI India President
                        </span>
                        <p className="font-semibold text-forest-950 mt-0.5 text-sm">
                          {club.nasiPresidentAtCharter}
                        </p>
                      </div>
                    )}

                    {club.nasiMembershipOfficer && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          NASI Membership Officer
                        </span>
                        <p className="font-semibold text-forest-950 mt-0.5 text-sm">
                          {club.nasiMembershipOfficer}
                        </p>
                      </div>
                    )}

                    {club.sigbiOfficer && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          SIGBI Chartering Officer
                        </span>
                        <p className="font-semibold text-forest-950 mt-0.5 text-sm">
                          {club.sigbiOfficer}
                        </p>
                      </div>
                    )}

                    {club.founderMembersCount && (
                      <div className="bg-white p-3 rounded-xl border border-sand-200">
                        <span className="text-[10.5px] uppercase font-semibold text-forest-600 block">
                          Charter Members
                        </span>
                        <p className="font-semibold text-forest-950 mt-0.5 text-sm">
                          {club.founderMembersCount} members
                        </p>
                      </div>
                    )}
                  </div>

                  {club.historicalNotes && (
                    <p className="text-xs text-forest-800 leading-relaxed italic bg-amber-50/80 border-l-2 border-amber-600 pl-3 py-1.5 rounded-r">
                      {club.historicalNotes}
                    </p>
                  )}

                  {club.charterStatusNote && (
                    <p className="text-[11px] text-forest-600 font-mono bg-sand-100/60 p-2 rounded-lg">
                      Archival Record: {club.charterStatusNote}
                    </p>
                  )}
                </div>
              )}

              {/* 2. Focus Pillars */}
              {club.focusAreas.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-800 mb-3 font-sans">
                    Core Service Pillars
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {club.focusAreas.map((focus, idx) => (
                      <Badge
                        key={idx}
                        variant="teal"
                        size="md"
                        icon={<CheckCircleIcon size={14} className="text-teal-700" />}
                      >
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Projects Section */}
              {club.sampleProjects.length > 0 && (
                <div className="space-y-6">
                  <SectionHeading
                    kicker="Grassroots Action"
                    title="Current & Signature Projects"
                    description="Representative community projects spearheaded by club members in collaboration with local beneficiaries and civic partners."
                  />

                  <div className="space-y-4">
                    {club.sampleProjects.map((project, idx) => (
                      <Card key={idx} variant="elevated" className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <Badge
                            variant={
                              project.status === "Ongoing"
                                ? "forest"
                                : project.status === "Annual"
                                  ? "gold"
                                  : "neutral"
                            }
                            size="sm"
                          >
                            {project.status} Initiative
                          </Badge>
                          <span className="text-[11px] font-mono text-forest-500">
                            Community Project Profile
                          </span>
                        </div>

                        <CardTitle as="h3" className="text-lg text-forest-950">
                          {project.title}
                        </CardTitle>

                        <p className="text-sm text-forest-800/85 mt-2 leading-relaxed">
                          {project.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Club Contact Form — routes to national contact page */}
              <div className="pt-6 border-t border-sand-200">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle as="h2" className="text-xl">
                      Contact {club.name} Convenors
                    </CardTitle>
                    <p className="text-xs text-forest-600 mt-1">
                      Interested in attending an upcoming club meeting in {club.city} or
                      partnering on a community initiative? Use the national contact page.
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ErrorMessage
                      variant="info"
                      title="Contact the Secretariat"
                      message="Use the national Contact Us page to reach NASI India. Club-specific routing will be available in a future phase."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Your Name"
                        id="club-inquiry-name"
                        name="name"
                        placeholder="e.g. Maya Patel"
                        required
                      />
                      <FormField
                        label="Email Address"
                        id="club-inquiry-email"
                        name="email"
                        type="email"
                        placeholder="e.g. maya@example.com"
                        required
                      />
                    </div>

                    <FormField
                      label="Inquiry Topic"
                      id="club-inquiry-topic"
                      name="topic"
                      type="select"
                      placeholder="Select a reason for contacting"
                      options={[
                        { label: `Join as a member in ${club.city}`, value: "join" },
                        { label: "Community project collaboration", value: "project" },
                        { label: "Student scholarship inquiry", value: "scholarship" },
                        { label: "General chapter inquiry", value: "general" },
                      ]}
                      required
                    />

                    <FormField
                      label="Your Message"
                      id="club-inquiry-msg"
                      name="message"
                      type="textarea"
                      rows={4}
                      placeholder={`Write a message for the ${club.name} coordination team...`}
                      required
                    />

                    <Button href="/contact" variant="primary" size="md">
                      Send via National Contact Page
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar Details (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Meeting Schedule Card */}
              <Card variant="accent">
                <CardHeader>
                  <span className="text-xs font-semibold uppercase text-teal-800">
                    Chapter Logistics
                  </span>
                  <CardTitle as="h3" className="text-lg">
                    Meeting Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-forest-800">
                  {club.meetingSchedule && (
                    <div className="flex items-start gap-2.5">
                      <CalendarIcon size={16} className="text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-forest-950">Regular Meeting</p>
                        <p className="text-forest-700 mt-0.5 leading-relaxed">
                          {club.meetingSchedule}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 pt-3 border-t border-sand-200">
                    <MapPinIcon size={16} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-forest-950">Location Jurisdiction</p>
                      <p className="text-forest-700 mt-0.5">
                        {club.city}, {club.state} ({club.region})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-3 border-t border-sand-200">
                    <UsersIcon size={16} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-forest-950">Chapter Coordinator</p>
                      <p className="text-forest-700 mt-0.5">{club.coordinatorPlaceholder}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-3 border-t border-sand-200">
                    <MailIcon size={16} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-forest-950">Official Email</p>
                      <a
                        href={`mailto:${club.emailPlaceholder}`}
                        className="text-teal-800 hover:text-forest-950 underline font-mono mt-0.5 block"
                      >
                        {club.emailPlaceholder}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Membership Box */}
              <div className="p-6 rounded-xl bg-forest-900 text-white space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
                  Local Sisterhood
                </span>
                <h4 className="font-serif font-bold text-lg">Join {club.name} Today</h4>
                <p className="text-xs text-sand-200 leading-relaxed">
                  Discover how women leaders and professionals in {club.city} come together to
                  enact positive community change.
                </p>
                <div className="pt-2">
                  <Button
                    href="/join"
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    rightIcon={<ArrowRightIcon size={14} />}
                  >
                    Apply for Membership
                  </Button>
                </div>
              </div>

              {/* Back Link */}
              <div className="text-center pt-2">
                <Link
                  href="/clubs"
                  className="text-xs font-semibold text-forest-800 hover:text-forest-950 underline inline-flex items-center gap-1"
                >
                  &larr; Return to All NASI India Clubs
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
