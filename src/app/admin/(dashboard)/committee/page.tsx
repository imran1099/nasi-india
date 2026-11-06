import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { initialCommittee } from "@/data/committee";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "National Committee Module | NASI India Admin",
};

async function getCommitteeAdminList() {
  if (!process.env.DATABASE_URL) {
    return initialCommittee;
  }
  try {
    const { prisma } = await import("@/lib/db");
    const members = await prisma.committeeMember.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (members.length > 0 && !members[0].name.startsWith("[Sample]")) {
      return members.map((m) => ({
        role: m.title,
        roleShort: m.title,
        name: m.name,
        designation: m.title,
        department: m.organization ?? "National Board",
        tenure: "Biennium 2026–2028",
        clubAffiliation: m.city ? `${m.city}${m.state ? `, ${m.state}` : ""}` : "NASI India",
        emailPlaceholder: m.email ?? "secretariat@nasi-india.org",
        initials: m.name.split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "SI",
        bio: m.bio ?? undefined,
      }));
    }
  } catch {}
  return initialCommittee;
}

export default async function AdminCommitteePage() {
  await connection();
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const members = await getCommitteeAdminList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            National Association Soroptimist India (NASI-India)
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            NASI India Board: 2026–2028 Management
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Executive board portfolios and designated leaders for Biennium 2026–2028.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/committee" variant="outline" size="sm" isExternal>
            View Public Committee Page
          </Button>
        </div>
      </div>

      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950">
              National Board Portfolios
            </CardTitle>
            <p className="text-xs text-forest-600">Showing {members.length} executive positions</p>
          </div>
          <Badge variant="forest" size="sm">Biennium 2026–2028</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
                  <th className="py-3 px-4">Portfolio / Role</th>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-4">Department / Domain</th>
                  <th className="py-3 px-4">Club Affiliation</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {members.map((member, idx) => (
                  <tr key={`${member.role}-${idx}`} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-teal-900">
                      <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-900 font-mono text-[11px]">
                        {member.roleShort}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-forest-950">
                      {member.name}
                    </td>
                    <td className="py-3.5 px-4 text-forest-700">
                      {member.department}
                    </td>
                    <td className="py-3.5 px-4 text-forest-700">
                      {member.clubAffiliation}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-forest-600 text-[11px]">
                      {member.emailPlaceholder}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
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
