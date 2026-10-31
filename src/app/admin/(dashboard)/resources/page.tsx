import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAdminResources } from "@/lib/dal/resources";
import { ResourcesManager } from "@/components/admin/resources/ResourcesManager";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Resources Module | NASI India Admin",
};

export default async function AdminResourcesPage() {
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

  const resources = await getAdminResources();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Federation Portals & Gateways
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Resources & External Links
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Oversee designated federation gateways, membership portals, and documentation links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/resources" variant="outline" size="sm" isExternal>
            View Public Resources Page
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              Verified Federation & Network Links
            </CardTitle>
            <p className="text-xs text-forest-600">
              Controls items shown on the public Soroptimist Resources page
            </p>
          </div>
          <Badge variant="teal" size="sm">{resources.length} Links</Badge>
        </CardHeader>

        <CardContent className="p-6">
          <ResourcesManager initialResources={resources as unknown as Parameters<typeof ResourcesManager>[0]["initialResources"]} />
        </CardContent>
      </Card>
    </div>
  );
}
