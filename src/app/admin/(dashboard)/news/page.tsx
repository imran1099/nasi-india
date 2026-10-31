import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAdminNewsArticles, getAllNewsCategories } from "@/lib/dal/news";
import { NewsList } from "@/components/admin/news/NewsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "News Management | NASI India Admin",
};

export default async function AdminNewsPage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

  const [articlesData, categories] = await Promise.all([
    getAdminNewsArticles({ perPage: 100 }),
    getAllNewsCategories(),
  ]);

  const articles = articlesData.items;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Editorial Desk
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            News & Press Releases
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Manage articles, federation announcements, and grassroots club spotlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/admin/news/new" variant="primary" size="sm">
            + New Article
          </Button>
          <Button href="/news" variant="outline" size="sm" isExternal>
            View Public News
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              Editorial Directory
            </CardTitle>
            <p className="text-xs text-forest-600">Showing {articles.length} news items</p>
          </div>
          <Badge variant="teal" size="sm">{articles.length} Total Articles</Badge>
        </CardHeader>

        <CardContent className="p-6">
          <NewsList
            initialArticles={articles as unknown as Parameters<typeof NewsList>[0]["initialArticles"]}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
