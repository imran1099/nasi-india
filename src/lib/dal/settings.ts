/**
 * Data Access Layer — Site Settings
 * Manages configuration for branding, contact info, social links, homepage, and footer.
 */

import { siteConfig } from "@/config/site";

export interface SiteSettingsMap {
  // Branding
  "site.name": string;
  "site.shortName": string;
  "site.logoUrl": string;
  "site.tagline": string;

  // Contact
  "contact.email": string;
  "contact.phone": string;
  "contact.address": string;

  // Social Links
  "social.facebook": string;
  "social.twitter": string;
  "social.instagram": string;
  "social.linkedin": string;
  "social.youtube": string;

  // Homepage
  "home.heroTitle": string;
  "home.heroSubtitle": string;
  "home.announcement": string;

  // Footer
  "footer.copyright": string;
  "footer.registration": string;

  [key: string]: string;
}

export function getDefaultSiteSettings(): SiteSettingsMap {
  return {
    "site.name": siteConfig.contact.organizationName,
    "site.shortName": siteConfig.name,
    "site.logoUrl": "/images/logo.png",
    "site.tagline": "Educating, Empowering & Enabling Women and Girls",

    "contact.email": "secretariat@nasi-india.org",
    "contact.phone": "+91 (0) 22 2400 0000",
    "contact.address": "National Secretariat, NASI India",

    "social.facebook": "https://facebook.com/nasiindia",
    "social.twitter": "https://x.com/nasiindia",
    "social.instagram": "https://instagram.com/nasiindia",
    "social.linkedin": "https://linkedin.com/company/nasiindia",
    "social.youtube": "https://youtube.com/@nasiindia",

    "home.heroTitle": "Empowering Women & Girls Across India",
    "home.heroSubtitle":
      "A nationwide movement of women leaders, educators, and community changemakers across 19 chartered clubs in India.",
    "home.announcement":
      "Official digital portal of the National Association of Soroptimist International of India.",

    "footer.copyright": `© ${new Date().getFullYear()} National Association of Soroptimist International of India. All rights reserved.`,
    "footer.registration": "Chartered National Association of Soroptimist International.",
  };
}

/**
 * Returns all site settings merged with baseline defaults.
 */
export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const defaults = getDefaultSiteSettings();

  if (!process.env.DATABASE_URL) {
    return defaults;
  }

  try {
    const { prisma } = await import("@/lib/db");
    const dbSettings = await prisma.siteSetting.findMany();

    const merged = { ...defaults };
    for (const item of dbSettings) {
      merged[item.key] = item.value;
    }

    return merged;
  } catch (err) {
    console.warn("[getSiteSettings] DB query failed, falling back to defaults:", err);
    return defaults;
  }
}

/**
 * Updates multiple site settings in the database.
 */
export async function updateSiteSettings(
  settings: Record<string, string>,
  groupMap?: Record<string, string>
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.info("[updateSiteSettings] Simulated settings update (no DB connection):", settings);
    return;
  }

  const { prisma } = await import("@/lib/db");

  const operations = Object.entries(settings).map(([key, value]) => {
    const group = groupMap?.[key] || key.split(".")[0] || "general";
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group, label: key },
    });
  });

  await prisma.$transaction(operations);
}
