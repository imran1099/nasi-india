/**
 * Data Access Layer — Events
 *
 * Only PUBLISHED events are ever returned to public visitors.
 * Content with DRAFT, ARCHIVED, or PENDING status is never exposed.
 */

import { prisma } from "@/lib/db";
import { paginate, type PaginatedResult } from "@/lib/api-response";
import { eventFilterSchema, type EventFilterInput } from "@/lib/validations";
import { type Event, PublishStatus, type Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Public projection
// ---------------------------------------------------------------------------

const eventListSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  coverImage: true,
  eventType: true,
  startsAt: true,
  endsAt: true,
  timezone: true,
  venue: true,
  city: true,
  state: true,
  onlineLink: true,
  registrationLink: true,
  isCancelled: true,
  tags: true,
  club: {
    select: { id: true, slug: true, name: true, city: true },
  },
} as const;

const eventDetailSelect = {
  ...eventListSelect,
  content: true,
} as const;

export type EventListItem = Pick<
  Event,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "coverImage"
  | "eventType"
  | "startsAt"
  | "endsAt"
  | "timezone"
  | "venue"
  | "city"
  | "state"
  | "onlineLink"
  | "registrationLink"
  | "isCancelled"
  | "tags"
> & {
  club: { id: string; slug: string; name: string; city: string } | null;
};

export type EventDetail = EventListItem & {
  content: string | null;
};

// ---------------------------------------------------------------------------
// List published events for public /events
// ---------------------------------------------------------------------------

export async function getPublishedEvents(
  input: Partial<EventFilterInput> = {}
): Promise<PaginatedResult<EventListItem>> {
  const { upcoming, clubId, search, page, perPage } = eventFilterSchema.parse(input);

  const now = process.env.NEXT_PHASE === "phase-production-build"
    ? new Date("2024-01-01T00:00:00.000Z")
    : new Date();

  const where = {
    status: PublishStatus.PUBLISHED,
    ...(upcoming ? { startsAt: { gte: now } } : {}),
    ...(clubId ? { clubId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
            { venue: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      select: eventListSelect,
      orderBy: { startsAt: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.event.count({ where }),
  ]);

  return paginate(items as unknown as EventListItem[], total, page, perPage);
}

// ---------------------------------------------------------------------------
// Get a single published event by slug
// ---------------------------------------------------------------------------

export async function getPublishedEventBySlug(
  slug: string
): Promise<EventDetail | null> {
  const event = await prisma.event.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
    },
    select: eventDetailSelect,
  });

  return (event as unknown as EventDetail | null) ?? null;
}

// ---------------------------------------------------------------------------
// Get all published event slugs (for sitemap / generateStaticParams)
// ---------------------------------------------------------------------------

export async function getAllPublishedEventSlugs(): Promise<string[]> {
  const rows = await prisma.event.findMany({
    where: { status: PublishStatus.PUBLISHED },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// Upcoming featured events for homepage (first 3)
// ---------------------------------------------------------------------------

export async function getFeaturedEvents(): Promise<EventListItem[]> {
  const now = process.env.NEXT_PHASE === "phase-production-build"
    ? new Date("2024-01-01T00:00:00.000Z")
    : new Date();
  const events = await prisma.event.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      startsAt: { gte: now },
    },
    select: eventListSelect,
    orderBy: { startsAt: "asc" },
    take: 3,
  });
  return events as unknown as EventListItem[];
}

// ---------------------------------------------------------------------------
// Admin Queries: list all events including Draft, Cancelled, Archived
// ---------------------------------------------------------------------------

export interface AdminEventsFilter {
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export async function getAdminEvents(filter: AdminEventsFilter = {}) {
  const page = filter.page || 1;
  const perPage = filter.perPage || 20;

  const where: Prisma.EventWhereInput = {};

  if (filter.status && filter.status !== "ALL") {
    where.status = filter.status as PublishStatus;
  }

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { venue: { contains: filter.search, mode: "insensitive" } },
      { city: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.event.findMany({
      where,
      include: {
        club: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { startsAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.event.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      club: { select: { id: true, name: true, slug: true } },
    },
  });
}
