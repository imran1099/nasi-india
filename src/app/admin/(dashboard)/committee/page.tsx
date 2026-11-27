import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { getAllCommitteeMembersAdmin } from "@/lib/dal/committee";
import { CommitteeManager } from "@/components/admin/committee/CommitteeManager";

export const metadata: Metadata = {
  title: "NASI Board & Member Management | NASI India Admin",
  description: "Manage committee members, executive portfolios, and profile photographs.",
};

export default async function AdminCommitteePage() {
  await connection();
  await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
  const members = await getAllCommitteeMembersAdmin();

  return <CommitteeManager initialMembers={members} />;
}
