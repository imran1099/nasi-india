import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CalendarIcon, ExternalLinkIcon } from "@/components/icons";
import { getPublishedArticleBySlug, getAllPublishedArticleSlugs } from "@/lib/dal/news";
import { getAllNews, getNewsBySlug } from "@/data/news";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (process.env.DATABASE_URL) {
    try {
      const dbSlugs = await getAllPublishedArticleSlugs();
      if (dbSlugs.length > 0) {
        return dbSlugs.map((slug) => ({ slug }));
      }
    } catch {}
  }
  const articles = getAllNews();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (process.env.DATABASE_URL) {
    try {
      const dbArticle = await getPublishedArticleBySlug(slug);
      if (dbArticle) {
        return {
          title: `${dbArticle.metaTitle || dbArticle.title} | NASI India News`,
          description: dbArticle.metaDescription || dbArticle.excerpt || undefined,
          alternates: {
            canonical: `/news/${slug}`,
          },
          openGraph: {
            title: dbArticle.metaTitle || dbArticle.title,
            description: dbArticle.metaDescription || dbArticle.excerpt || undefined,
            url: `/news/${slug}`,
            type: "article",
            images: dbArticle.coverImage ? [{ url: dbArticle.coverImage }] : undefined,
          },
        };
      }
    } catch {}
  }

  const staticArticle = getNewsBySlug(slug);
  if (!staticArticle) {
    return {
      title: "Article Not Found | NASI India",
    };
  }

  return {
    title: `${staticArticle.title} | NASI India News`,
    description: staticArticle.excerpt,
    alternates: {
      canonical: `/news/${slug}`,
    },
    openGraph: {
      title: staticArticle.title,
      description: staticArticle.excerpt,
      url: `/news/${slug}`,
      type: "article",
    },
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  await connection();
  const { slug } = await params;

  let articleData: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    categoryName: string;
    date: string;
    isoDate: string;
    author: string;
    clubName?: string;
    sourceUrl?: string | null;
    coverImage?: string | null;
    tags: string[];
    isSample?: boolean;
  } | null = null;

  if (process.env.DATABASE_URL) {
    try {
      const dbArticle = await getPublishedArticleBySlug(slug);
      if (dbArticle) {
        const pubDate = dbArticle.publishedAt ? new Date(dbArticle.publishedAt) : new Date();
        articleData = {
          title: dbArticle.title,
          slug: dbArticle.slug,
          excerpt: dbArticle.excerpt || "",
          content: dbArticle.content,
          categoryName: dbArticle.category?.name || "National Programme",
          date: pubDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
          isoDate: pubDate.toISOString().split("T")[0],
          author: dbArticle.authorName || "National Secretariat",
          clubName: dbArticle.club?.name,
          sourceUrl: dbArticle.sourceUrl,
          coverImage: dbArticle.coverImage,
          tags: dbArticle.tags || [],
          isSample: false,
        };
      }
    } catch (err) {
      console.warn("[news/[slug]] DB query error:", err);
    }
  }

  // Fallback to static fixture if not found in DB
  if (!articleData) {
    const staticArticle = getNewsBySlug(slug);
    if (!staticArticle) {
      notFound();
    }
    articleData = {
      title: staticArticle.title,
      slug: staticArticle.slug,
      excerpt: staticArticle.excerpt,
      content: staticArticle.content.join("\n\n"),
      categoryName: staticArticle.category,
      date: staticArticle.date,
      isoDate: staticArticle.isoDate,
      author: staticArticle.clubAttribution,
      tags: staticArticle.tags,
      isSample: true,
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nasiindia.org";

  return (
    <>
      <ArticleJsonLd
        title={articleData.title}
        description={articleData.excerpt}
        url={`${siteUrl}/news/${articleData.slug}`}
        datePublished={articleData.isoDate}
        authorName={articleData.author}
        imageUrl={articleData.coverImage || undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteUrl}` },
          { name: "News & Updates", url: `${siteUrl}/news` },
          { name: articleData.title, url: `${siteUrl}/news/${articleData.slug}` },
        ]}
      />

      <PageHeading
        title={articleData.title}
        kicker={`${articleData.categoryName} • Publication`}
        description={articleData.excerpt}
        breadcrumbs={[
          { label: "News & Updates", href: "/news" },
          { label: articleData.title },
        ]}
        badge={<Badge variant="forest">{articleData.categoryName}</Badge>}
        action={
          <Button
            href="/news"
            variant="outline"
            size="sm"
            leftIcon={<span className="font-bold">&larr;</span>}
          >
            All News
          </Button>
        }
      />

      <article className="py-12 md:py-16 bg-white">
        <Container size="lg">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sand-200 text-xs text-forest-700">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 font-medium text-forest-900">
                <CalendarIcon size={14} className="text-teal-700" />
                <time dateTime={articleData.isoDate}>{articleData.date}</time>
              </div>
              <span>•</span>
              <span className="font-medium">
                Author: <strong className="text-forest-950">{articleData.author}</strong>
              </span>
              {articleData.clubName && (
                <>
                  <span>•</span>
                  <span className="font-medium">
                    Club: <strong className="text-teal-900">{articleData.clubName}</strong>
                  </span>
                </>
              )}
            </div>

            {articleData.sourceUrl && (
              <a
                href={articleData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-teal-800 hover:text-teal-950 hover:underline"
              >
                <span>External Source</span>
                <ExternalLinkIcon size={12} />
              </a>
            )}
          </div>

          {/* Featured Image or Visual Header */}
          {articleData.coverImage ? (
            <div className="my-8 rounded-2xl overflow-hidden shadow-xs border border-sand-200 max-h-[460px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={articleData.coverImage}
                alt={articleData.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="my-8 h-64 sm:h-80 md:h-96 w-full rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-teal-950 p-6 sm:p-10 text-white flex flex-col justify-end relative overflow-hidden shadow-xs">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "28px 28px",
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold block mb-2">
                  Soroptimist International of India • {articleData.categoryName}
                </span>
                <p className="font-serif font-bold text-xl sm:text-2xl text-white">
                  {articleData.title}
                </p>
              </div>
            </div>
          )}

          {/* Article Body */}
          <div className="prose max-w-none text-forest-900 leading-relaxed space-y-6 text-base sm:text-lg whitespace-pre-wrap font-sans">
            {articleData.content}
          </div>

          {/* Tags */}
          {articleData.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-sand-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase text-forest-600 mr-2">
                Related Topics:
              </span>
              {articleData.tags.map((tag) => (
                <Badge key={tag} variant="neutral" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer Back Action */}
          <div className="mt-12 pt-8 border-t border-sand-200 flex items-center justify-between">
            <Button
              href="/news"
              variant="outline"
              size="md"
              leftIcon={<span className="font-bold">&larr;</span>}
            >
              Return to News Directory
            </Button>
            <Button href="/join" variant="primary" size="md">
              Join Soroptimist Today
            </Button>
          </div>
        </Container>
      </article>
    </>
  );
}
