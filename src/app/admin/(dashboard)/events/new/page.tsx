import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAllClubsForSelect } from "@/lib/dal/news";
import { EventEditorForm } from "@/components/admin/events/EventEditorForm";

export const metadata: Metadata = {
  title: "Create Event | NASI India Admin",
};

export default async function AdminNewEventPage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const clubs = await getAllClubsForSelect();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-sand-300">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
          Calendar & Gatherings
        </span>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Create New Event
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
          Schedule national assemblies, webinars, or club-hosted seminars.
        </p>
      </div>

      <EventEditorForm clubs={clubs} />
    </div>
  );
}

