import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAllNewsCategories, getAllClubsForSelect } from "@/lib/dal/news";
import { NewsEditorForm } from "@/components/admin/news/NewsEditorForm";

export const metadata: Metadata = {
  title: "Create News Article | NASI India Admin",
};

export default async function AdminNewNewsArticlePage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

  const [categories, clubs] = await Promise.all([
    getAllNewsCategories(),
    getAllClubsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-sand-300">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
          Editorial Desk
        </span>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Create New Article
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
          Compose and publish press releases, project spotlights, or federation news.
        </p>
      </div>

      <NewsEditorForm categories={categories} clubs={clubs} />
    </div>
  );
}

