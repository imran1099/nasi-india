import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getSiteSettings } from "@/lib/dal/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Site Settings | NASI India Admin",
};

export default async function AdminSettingsPage() {
  // 1. Server-side role enforcement: strictly requires SUPER_ADMIN
  const currentUser = await requireAuth([Role.SUPER_ADMIN]);
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
              Platform Configuration
            </span>
            <Badge variant="gold" size="sm">Super Admin Only</Badge>
          </div>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Site Settings & Brand Configuration
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Configure organization identity, secretariat contacts, social media gateways, and homepage announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-forest-600 font-mono bg-sand-200/80 px-2.5 py-1 rounded">
            Authorized: {currentUser.email}
          </span>
        </div>
      </div>

      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
