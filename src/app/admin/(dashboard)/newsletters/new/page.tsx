import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAllClubsForSelect } from "@/lib/dal/news";
import { NewsletterEditorForm } from "@/components/admin/newsletters/NewsletterEditorForm";

export const metadata: Metadata = {
  title: "New Newsletter Issue | NASI India Admin",
};

export default async function AdminNewNewsletterPage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const clubs = await getAllClubsForSelect();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-sand-300">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
          Publications Archive
        </span>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Upload Newsletter Issue
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
          Attach official PDF bulletins, record volume details, and initiate approval.
        </p>
      </div>

      <NewsletterEditorForm clubs={clubs} />
    </div>
  );
}

