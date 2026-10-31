import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { NewsDirectory } from "@/components/news/NewsDirectory";
import { getAllNews as getStaticNews, type NewsArticle } from "@/data/news";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;

// ---------------------------------------------------------------------------
// Normalize DB article to static NewsArticle shape
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbArticleToStatic(a: any): NewsArticle {
  const pubDate = a.publishedAt ? new Date(a.publishedAt) : new Date();
  return {
    slug: a.slug,
    title: a.title,
    date: pubDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    isoDate: pubDate.toISOString().split("T")[0],
    category: (a.category?.name ?? "Programme Action") as NewsArticle["category"],
    clubAttribution: a.authorName ?? "NASI India Secretariat",
    readTime: "3 min read",
    isFeatured: false,
    excerpt: a.excerpt ?? "",
    content: (a.content ?? "").split("\n\n").filter(Boolean),
    keyHighlights: [],
    tags: a.tags ?? [],
  };
}

// ---------------------------------------------------------------------------
// Data helper — try DB first, fall back to static data
// ---------------------------------------------------------------------------

async function getArticlesData(): Promise<NewsArticle[]> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return getStaticNews();
  }
  try {
    const { getPublishedArticles } = await import("@/lib/dal/news");
    const result = await getPublishedArticles({ perPage: 50 });
    if (result.items.length > 0) {
      return result.items.map(dbArticleToStatic);
    }
  } catch (err) {
    console.warn("[news/page] DB unavailable, falling back to static data:", err);
  }
  return getStaticNews();
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "National announcements, club project reports, and Soroptimist International updates from across India.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "News & Updates | NASI India",
    description:
      "National announcements, club project reports, and Soroptimist International updates from across India.",
    url: "/news",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function NewsPage() {
  const articles = await getArticlesData();

  return (
    <>
      <PageHeading
        title="News & Updates"
        kicker="National Bulletin & Media"
        description="Stay informed with announcements from the National Secretariat and impact highlights from chartered clubs nationwide."
        breadcrumbs={[{ label: "News & Updates" }]}
        badge={<Badge variant="forest">National Bulletin</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <NewsDirectory articles={articles} />
        </Container>
      </section>
    </>
  );
}
