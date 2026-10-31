/**
 * Data Access Layer — Clubs
 *
 * All functions run exclusively on the server. They enforce:
 * - isActive = true (only live clubs are exposed)
 * - Input validation via Zod schemas
 * - Safe pagination
 * - Typed return values
 *
 * Import only from Server Components, Server Actions, or Route Handlers.
 */

import { prisma } from "@/lib/db";
import { paginate, type PaginatedResult } from "@/lib/api-response";
import { clubFilterSchema, type ClubFilterInput } from "@/lib/validations";
import { type Club, type ClubOfficer, type ClubProject } from "@prisma/client";

// ---------------------------------------------------------------------------
// Public projection — fields safe to send to the browser
// ---------------------------------------------------------------------------

const clubPublicSelect = {
  id: true,
  slug: true,
  name: true,
  city: true,
  state: true,
  region: true,
  charterYear: true,
  description: true,
  meetingSchedule: true,
  focusAreas: true,
  email: true,
} as const;

export type ClubPublic = Pick<Club, keyof typeof clubPublicSelect>;

const officerPublicSelect = {
  id: true,
  title: true,
  name: true,
  bio: true,
  displayOrder: true,
} as const;

export type ClubOfficerPublic = Pick<ClubOfficer, keyof typeof officerPublicSelect>;

const projectPublicSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
} as const;

export type ClubProjectPublic = Pick<ClubProject, keyof typeof projectPublicSelect>;

// ---------------------------------------------------------------------------
// List clubs with optional region filter, search, and pagination
// ---------------------------------------------------------------------------

export async function getClubs(
  input: Partial<ClubFilterInput> = {}
): Promise<PaginatedResult<ClubPublic>> {
  const { region, search, page, perPage } = clubFilterSchema.parse(input);

  const where = {
    isActive: true,
    ...(region ? { region } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
            { state: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.club.findMany({
      where,
      select: clubPublicSelect,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.club.count({ where }),
  ]);

  return paginate(items, total, page, perPage);
}

// ---------------------------------------------------------------------------
// Get a single club by slug (only active clubs)
// ---------------------------------------------------------------------------

export async function getClubBySlug(slug: string): Promise<
  | (ClubPublic & {
      officers: ClubOfficerPublic[];
      projects: ClubProjectPublic[];
    })
  | null
> {
  const club = await prisma.club.findFirst({
    where: { slug, isActive: true },
    select: {
      ...clubPublicSelect,
      officers: {
        where: { isActive: true },
        select: officerPublicSelect,
        orderBy: { displayOrder: "asc" },
      },
      projects: {
        select: projectPublicSelect,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return club ?? null;
}

// ---------------------------------------------------------------------------
// Get all club slugs (for generateStaticParams / ISR)
// ---------------------------------------------------------------------------

export async function getAllClubSlugs(): Promise<string[]> {
  const rows = await prisma.club.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// Featured clubs for the homepage (first 6 active, by displayOrder)
// ---------------------------------------------------------------------------

export async function getFeaturedClubs(): Promise<ClubPublic[]> {
  return prisma.club.findMany({
    where: { isActive: true },
    select: clubPublicSelect,
    orderBy: { displayOrder: "asc" },
    take: 6,
  });
}
