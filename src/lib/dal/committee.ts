/**
 * Data Access Layer — Committee Members
 * Supports dual persistence: Prisma database when connected + persistent local JSON storage
 */

import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { type CommitteeMember as PrismaCommitteeMember } from "@prisma/client";
import { initialCommittee, type CommitteeMember } from "@/data/committee";

const COMMITTEE_FILE = path.join(process.cwd(), "src", "data", "committee.json");

export function readLocalCommittee(): CommitteeMember[] {
  try {
    if (fs.existsSync(COMMITTEE_FILE)) {
      const raw = fs.readFileSync(COMMITTEE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[committee DAL] Failed to read committee.json:", e);
  }
  return initialCommittee;
}

export function writeLocalCommittee(members: CommitteeMember[]): void {
  try {
    const dir = path.dirname(COMMITTEE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(COMMITTEE_FILE, JSON.stringify(members, null, 2), "utf-8");
  } catch (e) {
    console.warn("[committee DAL] Failed to write committee.json:", e);
  }
}

export const memberPublicSelect = {
  id: true,
  name: true,
  title: true,
  portfolio: true,
  organization: true,
  city: true,
  state: true,
  bio: true,
  email: true,
  phone: true,
  image: true,
  tenure: true,
  displayOrder: true,
  isActive: true,
} as const;

export type CommitteeMemberPublic = Pick<
  PrismaCommitteeMember,
  keyof typeof memberPublicSelect
>;

function prismaToStatic(m: PrismaCommitteeMember | CommitteeMemberPublic): CommitteeMember {
  const initials =
    m.name
      .split(" ")
      .map((part: string) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SI";

  return {
    id: m.id,
    role: m.portfolio || m.title,
    roleShort: m.portfolio || m.title,
    name: m.name,
    designation: m.title,
    department: m.organization ?? "National Board",
    tenure: m.tenure ?? "Biennium 2026–2028",
    clubAffiliation: m.city ? `${m.city}${m.state ? `, ${m.state}` : ""}` : "NASI India",
    emailPlaceholder: m.email ?? "secretariat@nasi-india.org",
    initials,
    image: m.image ?? null,
    bio: m.bio ?? undefined,
    displayOrder: m.displayOrder ?? 0,
    isActive: m.isActive ?? true,
  };
}

export async function getCommitteeMembersList(): Promise<CommitteeMember[]> {
  if (process.env.DATABASE_URL) {
    try {
      const dbMembers = await prisma.committeeMember.findMany({
        where: { isActive: true },
        select: memberPublicSelect,
        orderBy: { displayOrder: "asc" },
      });

      if (dbMembers.length > 0 && !dbMembers[0].name.startsWith("[Sample]")) {
        return dbMembers.map(prismaToStatic);
      }
    } catch {
      // Fall through to local storage
    }
  }

  return readLocalCommittee().filter((m) => m.isActive !== false);
}

export async function getAllCommitteeMembersAdmin(): Promise<CommitteeMember[]> {
  if (process.env.DATABASE_URL) {
    try {
      const dbMembers = await prisma.committeeMember.findMany({
        select: memberPublicSelect,
        orderBy: { displayOrder: "asc" },
      });

      if (dbMembers.length > 0 && !dbMembers[0].name.startsWith("[Sample]")) {
        return dbMembers.map(prismaToStatic);
      }
    } catch {
      // Fall through to local storage
    }
  }

  return readLocalCommittee();
}

export async function getCommitteeMembers(): Promise<CommitteeMemberPublic[]> {
  if (process.env.DATABASE_URL) {
    try {
      const dbMembers = await prisma.committeeMember.findMany({
        where: { isActive: true },
        select: memberPublicSelect,
        orderBy: { displayOrder: "asc" },
      });
      if (dbMembers.length > 0 && !dbMembers[0].name.startsWith("[Sample]")) {
        return dbMembers;
      }
    } catch {
      // Fall through
    }
  }

  const local = readLocalCommittee().filter((m) => m.isActive !== false);
  return local.map((m, idx) => ({
    id: m.id || `local-${idx}`,
    name: m.name,
    title: m.designation || m.role,
    portfolio: m.roleShort || m.role,
    organization: m.department,
    city: m.clubAffiliation,
    state: null,
    bio: m.bio || null,
    email: m.emailPlaceholder || null,
    phone: null,
    image: m.image || null,
    tenure: m.tenure || "Biennium 2026–2028",
    displayOrder: m.displayOrder ?? idx + 1,
    isActive: m.isActive ?? true,
  }));
}

export async function saveCommitteeMemberInDb(
  data: Partial<CommitteeMember> & { name: string; role: string }
): Promise<CommitteeMember> {
  const localMembers = readLocalCommittee();
  const id = data.id || `member-${Date.now()}`;
  const initials =
    data.initials ||
    data.name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    "SI";

  const memberToSave: CommitteeMember = {
    id,
    role: data.role,
    roleShort: data.roleShort || data.role,
    name: data.name,
    designation: data.designation || `${data.role} – NASI India`,
    department: data.department || "Executive Leadership",
    tenure: data.tenure || "Biennium 2026–2028",
    clubAffiliation: data.clubAffiliation || "NASI India",
    emailPlaceholder: data.emailPlaceholder || "secretariat@nasi-india.org",
    initials,
    image: data.image ?? null,
    bio: data.bio || "",
    displayOrder: data.displayOrder ?? localMembers.length + 1,
    isActive: data.isActive !== false,
  };

  const existingIdx = localMembers.findIndex((m) => m.id === id);
  let updatedList: CommitteeMember[];
  if (existingIdx >= 0) {
    updatedList = [...localMembers];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...memberToSave };
  } else {
    updatedList = [...localMembers, memberToSave];
  }

  writeLocalCommittee(updatedList);

  if (process.env.DATABASE_URL) {
    try {
      await prisma.committeeMember.upsert({
        where: { id },
        create: {
          id,
          name: memberToSave.name,
          title: memberToSave.designation,
          portfolio: memberToSave.role,
          organization: memberToSave.department,
          city: memberToSave.clubAffiliation,
          bio: memberToSave.bio,
          email: memberToSave.emailPlaceholder,
          image: memberToSave.image,
          tenure: memberToSave.tenure,
          displayOrder: memberToSave.displayOrder ?? 0,
          isActive: memberToSave.isActive ?? true,
        },
        update: {
          name: memberToSave.name,
          title: memberToSave.designation,
          portfolio: memberToSave.role,
          organization: memberToSave.department,
          city: memberToSave.clubAffiliation,
          bio: memberToSave.bio,
          email: memberToSave.emailPlaceholder,
          image: memberToSave.image,
          tenure: memberToSave.tenure,
          displayOrder: memberToSave.displayOrder ?? 0,
          isActive: memberToSave.isActive ?? true,
        },
      });
    } catch (e) {
      console.warn("[committee DAL] Failed to persist to Prisma, saved locally:", e);
    }
  }

  return memberToSave;
}

export async function deleteCommitteeMemberInDb(id: string): Promise<boolean> {
  const localMembers = readLocalCommittee();
  const updatedList = localMembers.filter((m) => m.id !== id);
  writeLocalCommittee(updatedList);

  if (process.env.DATABASE_URL) {
    try {
      await prisma.committeeMember.delete({
        where: { id },
      });
    } catch (e) {
      console.warn("[committee DAL] Prisma delete skipped:", e);
    }
  }

  return true;
}
