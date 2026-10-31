import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ExternalLinkIcon,
} from "@/components/icons";
import { getPublishedEventBySlug, getAllPublishedEventSlugs } from "@/lib/dal/events";
import { getAllEvents, getEventBySlug } from "@/data/events";
import { EventJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (process.env.DATABASE_URL) {
    try {
      const dbSlugs = await getAllPublishedEventSlugs();
      if (dbSlugs.length > 0) {
        return dbSlugs.map((slug) => ({ slug }));
      }
    } catch {}
  }
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (process.env.DATABASE_URL) {
    try {
      const dbEvent = await getPublishedEventBySlug(slug);
      if (dbEvent) {
        return {
          title: `${dbEvent.title} | NASI India Events`,
          description: dbEvent.description || undefined,
          alternates: {
            canonical: `/events/${slug}`,
          },
          openGraph: {
            title: dbEvent.title,
            description: dbEvent.description || undefined,
            url: `/events/${slug}`,
            type: "website",
            images: dbEvent.coverImage ? [{ url: dbEvent.coverImage }] : undefined,
          },
        };
      }
    } catch {}
  }

  const staticEvent = getEventBySlug(slug);
  if (!staticEvent) {
    return {
      title: "Event Not Found | NASI India",
    };
  }

  return {
    title: `${staticEvent.title} | NASI India Events`,
    description: staticEvent.shortDescription,
    alternates: {
      canonical: `/events/${slug}`,
    },
    openGraph: {
      title: staticEvent.title,
      description: staticEvent.shortDescription,
      url: `/events/${slug}`,
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  await connection();
  const { slug } = await params;

  let eventData: {
    title: string;
    slug: string;
    description: string;
    content?: string | null;
    eventType: string;
    startsAt: Date;
    endsAt?: Date | null;
    timezone: string;
    venue?: string | null;
    city?: string | null;
    state?: string | null;
    onlineLink?: string | null;
    registrationLink?: string | null;
    isCancelled: boolean;
    coverImage?: string | null;
    clubName?: string;
    tags: string[];
    isSample?: boolean;
  } | null = null;

  if (process.env.DATABASE_URL) {
    try {
      const dbEvent = await getPublishedEventBySlug(slug);
      if (dbEvent) {
        eventData = {
          title: dbEvent.title,
          slug: dbEvent.slug,
          description: dbEvent.description || "",
          content: dbEvent.content,
          eventType: dbEvent.eventType,
          startsAt: new Date(dbEvent.startsAt),
          endsAt: dbEvent.endsAt ? new Date(dbEvent.endsAt) : null,
          timezone: dbEvent.timezone || "Asia/Kolkata",
          venue: dbEvent.venue,
          city: dbEvent.city,
          state: dbEvent.state,
          onlineLink: dbEvent.onlineLink,
          registrationLink: dbEvent.registrationLink,
          isCancelled: dbEvent.isCancelled,
          coverImage: dbEvent.coverImage,
          clubName: dbEvent.club?.name,
          tags: dbEvent.tags || [],
          isSample: false,
        };
      }
    } catch (err) {
      console.warn("[events/[slug]] DB query error:", err);
    }
  }

  if (!eventData) {
    const staticEvent = getEventBySlug(slug);
    if (!staticEvent) {
      notFound();
    }
    const parsedDate = new Date(`${staticEvent.isoDate}T10:00:00Z`);
    eventData = {
      title: staticEvent.title,
      slug: staticEvent.slug,
      description: staticEvent.shortDescription,
      content: staticEvent.detailedDescription.join("\n\n"),
      eventType: staticEvent.format.toUpperCase().replace("-", "_"),
      startsAt: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
      timezone: "Asia/Kolkata",
      venue: staticEvent.location,
      city: staticEvent.city,
      state: staticEvent.state,
      isCancelled: false,
      clubName: staticEvent.clubAttribution,
      tags: [],
      isSample: true,
    };
  }

  const formatDisplay = eventData.eventType.replace("_", "-");
  const locationDisplay = [eventData.venue, eventData.city, eventData.state]
    .filter(Boolean)
    .join(", ") || (eventData.eventType === "ONLINE" ? "Online Virtual Meeting" : "India");

  const formattedDate = eventData.startsAt.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = eventData.startsAt.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: eventData.timezone || "Asia/Kolkata",
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nasiindia.org";

  return (
    <>
      <EventJsonLd
        name={eventData.title}
        description={eventData.description}
        url={`${siteUrl}/events/${eventData.slug}`}
        startDate={eventData.startsAt.toISOString()}
        locationName={eventData.venue || locationDisplay}
        locationAddress={locationDisplay}
        isOnline={eventData.eventType === "ONLINE"}
        isCancelled={eventData.isCancelled}
        imageUrl={eventData.coverImage || undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteUrl}` },
          { name: "Events & Calendar", url: `${siteUrl}/events` },
          { name: eventData.title, url: `${siteUrl}/events/${eventData.slug}` },
        ]}
      />

      <PageHeading
        title={eventData.title}
        kicker={`${formatDisplay} Gathering`}
        description={eventData.description}
        breadcrumbs={[
          { label: "Events & Calendar", href: "/events" },
          { label: eventData.title },
        ]}
        badge={
          eventData.isCancelled ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded bg-red-100 text-red-900 border border-red-300">
              EVENT CANCELLED
            </span>
          ) : (
            <Badge variant="forest">{formatDisplay}</Badge>
          )
        }
        action={
          <Button
            href="/events"
            variant="outline"
            size="sm"
            leftIcon={<span className="font-bold">&larr;</span>}
          >
            All Events
          </Button>
        }
      />

      <article className="py-12 md:py-16 bg-white">
        <Container>
          {/* Prominent Cancellation Notice if Cancelled */}
          {eventData.isCancelled && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg text-red-900">
              <h3 className="font-serif font-bold text-base">Important Notice: Event Cancelled</h3>
              <p className="text-sm mt-1 text-red-800">
                This event has been marked as cancelled by the organizers. Please contact the host club or national secretariat for questions regarding rescheduled dates or delegate queries.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Cover Image or Banner */}
              {eventData.coverImage ? (
                <div className="rounded-2xl overflow-hidden shadow-xs border border-sand-200 max-h-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={eventData.coverImage}
                    alt={eventData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-teal-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="teal" size="sm" className="bg-teal-900/80 text-teal-200 border-teal-700">
                      {formatDisplay}
                    </Badge>
                    <span className="text-xs font-mono text-sand-300">
                      Host: {eventData.clubName || "NASI India"}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block mb-1">
                      Soroptimist International of India
                    </span>
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                      {eventData.title}
                    </h1>
                  </div>
                </div>
              )}

              {/* Event Detailed Description */}
              <div className="space-y-4 text-forest-900 leading-relaxed text-base sm:text-lg">
                <h2 className="text-xl font-serif font-bold text-forest-950">
                  About This Event
                </h2>
                <div className="text-forest-800/90 leading-relaxed whitespace-pre-wrap font-sans">
                  {eventData.content || eventData.description}
                </div>
              </div>

              {/* Back to Events directory */}
              <div className="pt-6 border-t border-sand-200">
                <Button
                  href="/events"
                  variant="outline"
                  size="md"
                  leftIcon={<span className="font-bold">&larr;</span>}
                >
                  Return to Events Calendar
                </Button>
              </div>
            </div>

            {/* Sidebar Details Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card variant="elevated" className="bg-white p-6 space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-forest-950 text-lg pb-3 border-b border-sand-200">
                    Event Logistics
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-forest-800">
                  <div className="flex items-start gap-3">
                    <CalendarIcon size={18} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-forest-600 block uppercase">
                        Date
                      </span>
                      <span className="font-semibold text-forest-950">{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ClockIcon size={18} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-forest-600 block uppercase">
                        Time & Zone
                      </span>
                      <span className="font-semibold text-forest-950">
                        {formattedTime} ({eventData.timezone})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPinIcon size={18} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-forest-600 block uppercase">
                        Location / Venue
                      </span>
                      <span className="font-medium text-forest-950">{locationDisplay}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <UsersIcon size={18} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-forest-600 block uppercase">
                        Host Organisation
                      </span>
                      <span className="font-medium text-forest-950">
                        {eventData.clubName || "NASI India Secretariat"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RSVP / Registration Link */}
                {!eventData.isCancelled && (
                  <div className="pt-4 border-t border-sand-200 space-y-3">
                    {eventData.registrationLink ? (
                      <Button
                        href={eventData.registrationLink}
                        isExternal
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        rightIcon={<ExternalLinkIcon size={14} />}
                      >
                        Register / RSVP Online
                      </Button>
                    ) : (
                      <Button
                        href="/contact"
                        variant="secondary"
                        size="md"
                        className="w-full justify-center"
                      >
                        Enquire With Secretariat
                      </Button>
                    )}

                    {eventData.onlineLink && (
                      <Button
                        href={eventData.onlineLink}
                        isExternal
                        variant="outline"
                        size="sm"
                        className="w-full justify-center"
                        rightIcon={<ExternalLinkIcon size={13} />}
                      >
                        Join Virtual Room
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
