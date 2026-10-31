import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAllClubs } from "@/data/clubs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Clubs Directory Module | NASI India Admin",
};

async function getClubsAdminList() {
  if (!process.env.DATABASE_URL) {
    return getAllClubs().map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      region: c.region,
      charterYear: c.charterYear ?? "Chartered",
      isActive: true,
      projectsCount: c.sampleProjects.length,
    }));
  }

  try {
    const { prisma } = await import("@/lib/db");
    const clubs = await prisma.club.findMany({
      orderBy: [{ region: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: { projects: true, officers: true },
        },
      },
    });

    return clubs.map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      region: c.region.replace(/_/g, " "),
      charterYear: c.charterYear ?? "Chartered",
      isActive: c.isActive,
      projectsCount: c._count.projects,
    }));
  } catch {
    return getAllClubs().map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      region: c.region,
      charterYear: c.charterYear ?? "Chartered",
      isActive: true,
      projectsCount: c.sampleProjects.length,
    }));
  }
}

export default async function AdminClubsPage() {
  await connection();
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const clubs = await getClubsAdminList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Regional Chapters
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Clubs Directory Management
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Overview of all 19 chartered Soroptimist International clubs across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/clubs" variant="outline" size="sm" isExternal>
            View Public Directory
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              Chartered Chapters Roster
            </CardTitle>
            <p className="text-xs text-forest-600">Showing {clubs.length} total club profiles</p>
          </div>
          <Badge variant="forest" size="sm">{clubs.length} Active Clubs</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
                  <th className="py-3 px-4">Club Name</th>
                  <th className="py-3 px-4">City & State</th>
                  <th className="py-3 px-4">Regional Zone</th>
                  <th className="py-3 px-4">Charter Period</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {clubs.map((club) => (
                  <tr key={club.slug} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-forest-950">
                      {club.name}
                    </td>
                    <td className="py-3.5 px-4 text-forest-700">
                      {club.city}, {club.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {club.region}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-forest-600">
                      {club.charterYear}
                    </td>
                    <td className="py-3.5 px-4 text-forest-700 font-mono">
                      {club.projectsCount} initiatives
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/clubs/${club.slug}`}
                        target="_blank"
                        className="text-xs text-teal-800 hover:text-forest-950 font-semibold inline-flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ArrowRightIcon size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
