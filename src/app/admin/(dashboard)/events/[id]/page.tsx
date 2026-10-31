import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getEventById } from "@/lib/dal/events";
import { getAllClubsForSelect } from "@/lib/dal/news";
import { EventEditorForm } from "@/components/admin/events/EventEditorForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Event | NASI India Admin",
};

export default async function AdminEditEventPage({ params }: PageProps) {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const { id } = await params;

  const [event, clubs] = await Promise.all([
    getEventById(id),
    getAllClubsForSelect(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-sand-300">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
          Calendar & Gatherings
        </span>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Edit Event: {event.title}
        </h1>
        <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
          Modify event dates, update meeting links, or record cancellations.
        </p>
      </div>

      <EventEditorForm
        initialData={event as unknown as Parameters<typeof EventEditorForm>[0]["initialData"]}
        clubs={clubs}
      />
    </div>
  );
}
