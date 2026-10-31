/**
 * Data Access Layer — News Articles
 *
 * Exposes strictly PUBLISHED articles to public visitors.
 * Drafts, pending approvals, scheduled, and archived articles are never
 * exposed to public routes or sitemaps.
 */

import { prisma } from "@/lib/db";
import { paginate, type PaginatedResult } from "@/lib/api-response";
import { newsFilterSchema, type NewsFilterInput } from "@/lib/validations";
import { type NewsArticle, type NewsCategory, PublishStatus, type Prisma } from "@prisma/client";
import { publishScheduledContent } from "@/lib/scheduler";

// ---------------------------------------------------------------------------
// Public projections
// ---------------------------------------------------------------------------

const articleListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  authorName: true,
  tags: true,
  sourceUrl: true,
  category: {
    select: { id: true, slug: true, name: true },
  },
  club: {
    select: { id: true, slug: true, name: true, city: true },
  },
} as const;

const articleDetailSelect = {
  ...articleListSelect,
  content: true,
  metaTitle: true,
  metaDescription: true,
} as const;

export type ArticleListItem = Pick<
  NewsArticle,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "coverImage"
  | "publishedAt"
  | "authorName"
  | "tags"
  | "sourceUrl"
> & {
  category: Pick<NewsCategory, "id" | "slug" | "name"> | null;
  club: { id: string; slug: string; name: string; city: string } | null;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getQueryThreshold = () =>
  process.env.NEXT_PHASE === "phase-production-build"
    ? new Date("2099-01-01T00:00:00.000Z")
    : new Date();

// ---------------------------------------------------------------------------
// List published articles for public /news
// ---------------------------------------------------------------------------

export async function getPublishedArticles(
  input: Partial<NewsFilterInput> = {}
): Promise<PaginatedResult<ArticleListItem>> {
  // Reconcile any scheduled publications whose time has arrived
  await publishScheduledContent().catch(() => {});

  const { categorySlug, search, page, perPage } = newsFilterSchema.parse(input);

  const where = {
    status: PublishStatus.PUBLISHED,
    publishedAt: { lte: getQueryThreshold() },
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.newsArticle.findMany({
      where,
      select: articleListSelect,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return paginate(items as unknown as ArticleListItem[], total, page, perPage);
}

// ---------------------------------------------------------------------------
// Get a single published article by slug
// ---------------------------------------------------------------------------

export async function getPublishedArticleBySlug(
  slug: string
): Promise<ArticleDetail | null> {
  await publishScheduledContent().catch(() => {});

  const article = await prisma.newsArticle.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
      publishedAt: { lte: getQueryThreshold() },
    },
    select: articleDetailSelect,
  });

  return (article as unknown as ArticleDetail | null) ?? null;
}

// ---------------------------------------------------------------------------
// Get all published article slugs (for sitemap / generateStaticParams)
// ---------------------------------------------------------------------------

export async function getAllPublishedArticleSlugs(): Promise<string[]> {
  const rows = await prisma.newsArticle.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      publishedAt: { lte: getQueryThreshold() },
    },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// Admin Queries: list all articles including Draft, Scheduled, Archived
// ---------------------------------------------------------------------------

export interface AdminNewsFilter {
  search?: string;
  categorySlug?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export async function getAdminNewsArticles(filter: AdminNewsFilter = {}) {
  const page = filter.page || 1;
  const perPage = filter.perPage || 20;

  const where: Prisma.NewsArticleWhereInput = {};

  if (filter.status && filter.status !== "ALL") {
    where.status = filter.status as PublishStatus;
  }

  if (filter.categorySlug) {
    where.category = { slug: filter.categorySlug };
  }

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { excerpt: { contains: filter.search, mode: "insensitive" } },
      { authorName: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.newsArticle.findMany({
      where,
      include: {
        category: true,
        club: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

// ---------------------------------------------------------------------------
// Admin Query: single article by ID
// ---------------------------------------------------------------------------

export async function getNewsArticleById(id: string) {
  return prisma.newsArticle.findUnique({
    where: { id },
    include: {
      category: true,
      club: { select: { id: true, name: true, slug: true } },
    },
  });
}

// ---------------------------------------------------------------------------
// Categories helper
// ---------------------------------------------------------------------------

export async function getAllNewsCategories() {
  return prisma.newsCategory.findMany({
    orderBy: { name: "asc" },
  });
}

// ---------------------------------------------------------------------------
// Clubs helper for selects
// ---------------------------------------------------------------------------

export async function getAllClubsForSelect() {
  return prisma.club.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, city: true },
    orderBy: { name: "asc" },
  });
}
