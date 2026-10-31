/**
 * Data Access Layer — Soroptimist Resources
 *
 * Exposes active external resources for public viewing.
 * Provides admin access for configuring official gateways, federations, and newsletters.
 */

import { prisma } from "@/lib/db";
import { type ExternalResource } from "@prisma/client";

const resourcePublicSelect = {
  id: true,
  title: true,
  url: true,
  description: true,
  category: true,
  badge: true,
  target: true,
  displayOrder: true,
} as const;

export type ExternalResourcePublic = Pick<
  ExternalResource,
  keyof typeof resourcePublicSelect
>;

export async function getExternalResources(): Promise<ExternalResourcePublic[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    return await prisma.externalResource.findMany({
      where: { isActive: true },
      select: resourcePublicSelect,
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
  } catch (error) {
    console.warn("[getExternalResources] Error loading resources:", error);
    return [];
  }
}

export async function getAdminResources() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  return prisma.externalResource.findMany({
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
  });
}

export async function getResourceById(id: string) {
  return prisma.externalResource.findUnique({
    where: { id },
  });
}
