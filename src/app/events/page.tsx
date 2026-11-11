import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { EventsDirectory } from "@/components/events/EventsDirectory";
import { MaduraiMeetingInvitation } from "@/components/events/MaduraiMeetingInvitation";
import { LandingPageStrapline } from "@/components/home/LandingPageStrapline";
import { getAllEvents as getStaticEvents, type EventItem } from "@/data/events";
import { getSiteSettings } from "@/lib/dal/settings";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;

// ---------------------------------------------------------------------------
// Normalize DB event to static EventItem shape
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbEventToStatic(e: any): EventItem {
  const start = new Date(e.startsAt);
  const formatMap: Record<string, EventItem["format"]> = {
    ONLINE: "Online",
    IN_PERSON: "In-Person",
    HYBRID: "Hybrid",
  };
  return {
    slug: e.slug,
    title: e.title,
    date: start.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    isoDate: start.toISOString().split("T")[0],
    time: start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) + " IST",
    location: [e.venue, e.city, e.state].filter(Boolean).join(", ") || "India",
    city: e.city ?? "India",
    state: e.state ?? "",
    format: formatMap[String(e.eventType)] ?? "In-Person",
    category: "National Conference" as EventItem["category"],
    clubAttribution: e.club?.name ?? "NASI India",
    isFeatured: false,
    shortDescription: e.description ?? "",
    detailedDescription: (e.content ?? e.description ?? "").split("\n\n").filter(Boolean),
    agenda: [],
    registrationDeadline: "Contact the secretariat",
    registrationNotes: "Registration details will be shared with member clubs.",
  };
}

// ---------------------------------------------------------------------------
// Data helper — try DB first, fall back to static data
// ---------------------------------------------------------------------------

async function getEventsData(): Promise<EventItem[]> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return getStaticEvents();
  }
  try {
    const { getPublishedEvents } = await import("@/lib/dal/events");
    const result = await getPublishedEvents({ upcoming: false, perPage: 50 });
    if (result.items.length > 0) {
      return result.items.map(dbEventToStatic);
    }
  } catch (err) {
    console.warn("[events/page] DB unavailable, falling back to static data:", err);
  }
  return getStaticEvents();
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "National conferences, leadership training workshops, and Soroptimist action webinars across India.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Events & Calendar | NASI India",
    description:
      "National conferences, leadership training workshops, and Soroptimist action webinars across India.",
    url: "/events",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function EventsPage() {
  const [events, settings] = await Promise.all([
    getEventsData(),
    getSiteSettings().catch(() => null),
  ]);

  const invitationUrl = settings?.["event.maduraiInvitationUrl"];
  const highlights = [
    settings?.["event.maduraiHighlight1"],
    settings?.["event.maduraiHighlight2"],
    settings?.["event.maduraiHighlight3"],
    settings?.["event.maduraiHighlight4"],
  ].filter(Boolean) as string[];

  const councilTitle = settings?.["council.title"] || "Annual National Council Assembly";
  const councilDescription =
    settings?.["council.description"] ||
    "The Annual National Council brings together accredited voting delegates, club presidents, secretaries, and National Board officers from all 19 chartered clubs across India. It serves as the supreme governance forum for constitutional amendments, audited financial reporting, and strategic programme ratification.";

  return (
    <>
      <PageHeading
        title="Events & Calendar"
        kicker="Calendar of Action"
        description="Key national gatherings, training sessions, and collaborative events organized by NASI India and regional chapters."
        breadcrumbs={[{ label: "Events & Calendar" }]}
        badge={<Badge variant="forest">Action Calendar</Badge>}
      />

      {/* Task 3: Madurai Meeting Invitation (Two-Column Layout) */}
      <MaduraiMeetingInvitation invitationUrl={invitationUrl} highlights={highlights} />

      {/* Task 4: Annual National Council Section */}
      <section className="py-12 md:py-16 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <SectionHeading
              kicker="National Governance Forum"
              title={councilTitle}
              description="The supreme decision-making and constitutional body of the National Association of Soroptimist International of India."
            />

            <div className="p-6 sm:p-8 rounded-3xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-4 text-[#17324D] leading-relaxed text-sm sm:text-base">
              <p>
                {councilDescription}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#D7E8F5]">
                  <h4 className="font-serif font-bold text-sm text-[#17324D]">Accredited Representation</h4>
                  <p className="text-xs text-[#61758A] mt-1">Voting delegates appointed by chartered clubs in good standing.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#D7E8F5]">
                  <h4 className="font-serif font-bold text-sm text-[#17324D]">Statutory Audits</h4>
                  <p className="text-xs text-[#61758A] mt-1">Presentation and approval of transparent national financial audits.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#D7E8F5]">
                  <h4 className="font-serif font-bold text-sm text-[#17324D]">Federation Reporting</h4>
                  <p className="text-xs text-[#61758A] mt-1">Direct coordination with SIGBI and international council delegates.</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Full Events Directory & Calendar List */}
      <section className="py-12 md:py-16 bg-[#F4FAFF]">
        <Container>
          <div className="mb-8">
            <SectionHeading
              kicker="Full Schedule"
              title="All National & Regional Gatherings"
              description="Browse hybrid conferences, webinars, and regional project reviews across India."
              className="mb-0"
            />
          </div>
          <EventsDirectory events={events} />
        </Container>
      </section>

      {/* Task 8: Page-wide Strapline */}
      <LandingPageStrapline />
    </>
  );
}
