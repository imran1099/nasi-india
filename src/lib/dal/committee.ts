/**
 * Data Access Layer — Committee Members
 * Only active members are returned.
 */

import { prisma } from "@/lib/db";
import { type CommitteeMember } from "@prisma/client";

const memberPublicSelect = {
  id: true,
  name: true,
  title: true,
  organization: true,
  city: true,
  state: true,
  bio: true,
  displayOrder: true,
} as const;

export type CommitteeMemberPublic = Pick<
  CommitteeMember,
  keyof typeof memberPublicSelect
>;

export async function getCommitteeMembers(): Promise<CommitteeMemberPublic[]> {
  return prisma.committeeMember.findMany({
    where: { isActive: true },
    select: memberPublicSelect,
    orderBy: { displayOrder: "asc" },
  });
}
