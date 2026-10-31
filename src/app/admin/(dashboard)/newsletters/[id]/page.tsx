import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getNewsletterById } from "@/lib/dal/newsletters";
import { getAllClubsForSelect } from "@/lib/dal/news";
import { NewsletterEditorForm } from "@/components/admin/newsletters/NewsletterEditorForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Newsletter Issue | NASI India Admin",
};

export default async function AdminEditNewsletterPage({ params }: PageProps) {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const { id } = await params;

  const [item, clubs] = await Promise.all([
    getNewsletterById(id),
    getAllClubsForSelect(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-sand-300">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
          Publications Archive
        </span>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Edit Issue: {item.title}
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
          Update PDF attachments, revise issue numbers, or approve publication.
        </p>
      </div>

      <NewsletterEditorForm
        initialData={item as unknown as Parameters<typeof NewsletterEditorForm>[0]["initialData"]}
        clubs={clubs}
      />
    </div>
  );
}
