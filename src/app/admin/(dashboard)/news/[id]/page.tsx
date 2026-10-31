import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getNewsArticleById, getAllNewsCategories, getAllClubsForSelect } from "@/lib/dal/news";
import { NewsEditorForm } from "@/components/admin/news/NewsEditorForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit News Article | NASI India Admin",
};

export default async function AdminEditNewsArticlePage({ params }: PageProps) {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const { id } = await params;

  const [article, categories, clubs] = await Promise.all([
    getNewsArticleById(id),
    getAllNewsCategories(),
    getAllClubsForSelect(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-sand-300">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
          Editorial Desk
        </span>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Edit Article: {article.title}
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
          Update content, adjust publishing schedule, or modify SEO tags.
        </p>
      </div>

      <NewsEditorForm
        initialData={article as unknown as Parameters<typeof NewsEditorForm>[0]["initialData"]}
        categories={categories}
        clubs={clubs}
      />
    </div>
  );
}
