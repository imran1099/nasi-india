import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAdminEvents } from "@/lib/dal/events";
import { EventsList } from "@/components/admin/events/EventsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Events Management | NASI India Admin",
};

export default async function AdminEventsPage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

  const eventsData = await getAdminEvents({ perPage: 100 });
  const events = eventsData.items;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Calendar & Gatherings
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Events Management
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Coordinate national council meetings, webinars, and regional club gatherings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/admin/events/new" variant="primary" size="sm">
            + New Event
          </Button>
          <Button href="/events" variant="outline" size="sm" isExternal>
            View Public Calendar
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              Scheduled Calendar Items
            </CardTitle>
            <p className="text-xs text-forest-600">Showing {events.length} events</p>
          </div>
          <Badge variant="teal" size="sm">{events.length} Events</Badge>
        </CardHeader>

        <CardContent className="p-6">
          <EventsList initialEvents={events as unknown as Parameters<typeof EventsList>[0]["initialEvents"]} />
        </CardContent>
      </Card>
    </div>
  );
}
