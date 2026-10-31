/**
 * Data Access Layer — Newsletters & Bulletins
 *
 * Public access is strictly limited to published and approved newsletters.
 * Draft, pending approval, and archived issues are shielded from public view.
 */

import { prisma } from "@/lib/db";
import { PublishStatus, type Prisma } from "@prisma/client";

const newsletterPublicSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  fileUrl: true,
  fileName: true,
  fileSize: true,
  mimeType: true,
  coverImage: true,
  issueNumber: true,
  volumeNumber: true,
  publishedAt: true,
  club: {
    select: { id: true, slug: true, name: true },
  },
} as const;

export type PublicNewsletterItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  coverImage: string | null;
  issueNumber: string | null;
  volumeNumber: string | null;
  publishedAt: Date | null;
  club: { id: string; slug: string; name: string } | null;
};

export async function getPublishedNewsletters(): Promise<PublicNewsletterItem[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const items = await prisma.newsletter.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        isApproved: true,
      },
      select: newsletterPublicSelect,
      orderBy: { publishedAt: "desc" },
    });
    return items as unknown as PublicNewsletterItem[];
  } catch (error) {
    console.warn("[getPublishedNewsletters] Error loading newsletters:", error);
    return [];
  }
}

export interface AdminNewslettersFilter {
  search?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export async function getAdminNewsletters(filter: AdminNewslettersFilter = {}) {
  const page = filter.page || 1;
  const perPage = filter.perPage || 20;

  const where: Prisma.NewsletterWhereInput = {};

  if (filter.status && filter.status !== "ALL") {
    where.status = filter.status as PublishStatus;
  }

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { issueNumber: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.newsletter.findMany({
      where,
      include: {
        club: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.newsletter.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getNewsletterById(id: string) {
  return prisma.newsletter.findUnique({
    where: { id },
    include: {
      club: { select: { id: true, name: true, slug: true } },
    },
  });
}
