import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAllClubs, adminHistoricalChecklist } from "@/data/clubs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Clubs Directory & Historical Checklist | NASI India Admin",
};

async function getClubsAdminList() {
  if (!process.env.DATABASE_URL) {
    return getAllClubs().map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      region: c.region,
      charterYear: c.charterDate || c.charterYear || "Chartered",
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

    return clubs.map((c) => {
      const staticMatch = getAllClubs().find((sc) => sc.slug === c.slug);
      return {
        slug: c.slug,
        name: c.name,
        city: c.city,
        state: c.state,
        region: c.region.replace(/_/g, " "),
        charterYear: staticMatch?.charterDate || c.charterYear || "Chartered",
        isActive: c.isActive,
        projectsCount: c._count.projects,
      };
    });
  } catch {
    return getAllClubs().map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      region: c.region,
      charterYear: c.charterDate || c.charterYear || "Chartered",
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
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Regional Chapters
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            Clubs Directory &amp; Historical Archival
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Overview of all 19 chartered Soroptimist International clubs across India and archival checklist.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/clubs" variant="outline" size="sm" isExternal>
            View Public Directory
          </Button>
          <Button href="/about#timeline" variant="primary" size="sm" isExternal>
            View Interactive Timeline
          </Button>
        </div>
      </div>

      {/* 2. Roster of Chartered Clubs */}
      <Card variant="elevated" className="bg-white overflow-hidden rounded-2xl border border-sand-200">
        <CardHeader className="bg-sand-50/70 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              Chartered Chapters Roster
            </CardTitle>
            <p className="text-xs text-forest-600">Showing {clubs.length} total club profiles</p>
          </div>
          <Badge variant="forest" size="sm">
            {clubs.length} Active Clubs
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
                  <th className="py-3 px-4">Club Name</th>
                  <th className="py-3 px-4">City &amp; State</th>
                  <th className="py-3 px-4">Regional Zone</th>
                  <th className="py-3 px-4">Charter Date</th>
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
                    <td className="py-3.5 px-4 font-mono text-[11px] text-forest-900 font-medium">
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
                        <span>Profile</span>
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

      {/* 3. Administrative Content Checklist: Historical Information Yet to Be Collected */}
      <Card variant="elevated" className="bg-white overflow-hidden rounded-2xl border border-sand-200">
        <CardHeader className="bg-sand-50/70 border-b border-sand-200 py-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <SparklesIcon size={16} className="text-amber-700" />
                <span className="text-xs uppercase font-semibold text-amber-800 tracking-wider">
                  Administrative Content Checklist
                </span>
              </div>
              <CardTitle as="h2" className="text-lg text-forest-950 mt-1">
                Historical Information Yet to Be Collected
              </CardTitle>
              <p className="text-xs text-forest-600 mt-0.5">
                Archival verification tracker for 16 clubs requiring additional historical records.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              16 Pending Verification Items
            </span>
          </div>

          {/* Strict Editorial Policy Alert */}
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
            <CheckCircleIcon size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-amber-950">Editorial Verification Rule:</span>
              <span>
                Historical information must be preserved accurately. Unknown or unverified details must be displayed as pending verification in this administrative console and omitted from public website pages until officially confirmed by the National Secretariat or SIGBI archives.
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Club Name</th>
                  <th className="py-3 px-4">Charter Date</th>
                  <th className="py-3 px-4">Information Still Required</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {adminHistoricalChecklist.map((item, idx) => (
                  <tr key={item.slug} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-forest-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-forest-950">
                      {item.clubName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-forest-700">
                      {item.charterDate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.informationRequired.map((req, rIdx) => (
                          <span
                            key={rIdx}
                            className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-sand-100 text-forest-800 border border-sand-200"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.verificationStatus === "Partially Verified"
                            ? "bg-teal-100 text-teal-900 border border-teal-200"
                            : "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}
                      >
                        {item.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/clubs/${item.slug}`}
                        target="_blank"
                        className="text-xs text-teal-800 hover:text-forest-950 font-semibold inline-flex items-center gap-1"
                      >
                        <span>View Club</span>
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
