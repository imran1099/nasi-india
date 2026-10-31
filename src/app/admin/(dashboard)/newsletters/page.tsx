import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAdminNewsletters } from "@/lib/dal/newsletters";
import { NewslettersList } from "@/components/admin/newsletters/NewslettersList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Newsletters Management | NASI India Admin",
};

export default async function AdminNewslettersPage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

  const data = await getAdminNewsletters({ perPage: 100 });
  const items = data.items;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Publications Archive
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Newsletters & Bulletins
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Manage official national circulars, PDF bulletins, and federation digests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/admin/newsletters/new" variant="primary" size="sm">
            + New Newsletter Issue
          </Button>
          <Button href="/resources" variant="outline" size="sm" isExternal>
            View Public Archive
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              Circulated Issues Roster
            </CardTitle>
            <p className="text-xs text-forest-600">Showing {items.length} publication issues</p>
          </div>
          <Badge variant="teal" size="sm">{items.length} Issues</Badge>
        </CardHeader>

        <CardContent className="p-6">
          <NewslettersList initialNewsletters={items as unknown as Parameters<typeof NewslettersList>[0]["initialNewsletters"]} />
        </CardContent>
      </Card>
    </div>
  );
}
