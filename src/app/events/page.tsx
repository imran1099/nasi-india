import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { EventsDirectory } from "@/components/events/EventsDirectory";
import { getAllEvents as getStaticEvents, type EventItem } from "@/data/events";

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
  const events = await getEventsData();

  return (
    <>
      <PageHeading
        title="Events & Calendar"
        kicker="Calendar of Action"
        description="Key national gatherings, training sessions, and collaborative events organized by NASI India and regional chapters."
        breadcrumbs={[{ label: "Events & Calendar" }]}
        badge={<Badge variant="forest">Action Calendar</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <EventsDirectory events={events} />
        </Container>
      </section>
    </>
  );
}
