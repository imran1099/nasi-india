/**
 * Data Access Layer — Site Settings
 * Manages configuration for branding, contact info, social links, homepage, and footer.
 */

import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site";

const SETTINGS_FILE = path.join(process.cwd(), "src", "data", "site-settings.json");

function readLocalSettings(): Record<string, string> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("[settings] Failed to read local settings file:", e);
  }
  return {};
}

function writeLocalSettings(settings: Record<string, string>): void {
  try {
    const existing = readLocalSettings();
    const updated = { ...existing, ...settings };
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    console.warn("[settings] Failed to write local settings file:", e);
  }
}

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

  // Homepage & Banner
  "home.heroTitle": string;
  "home.heroSubtitle": string;
  "home.announcement": string;
  "home.heroCtaText": string;
  "home.heroCtaUrl": string;
  "home.heroSecondaryCtaText": string;
  "home.heroSecondaryCtaUrl": string;
  "home.heroImageLeft": string;
  "home.heroImageRight": string;
  "home.bannerDisplayMode": string;

  // Footer
  "footer.copyright": string;
  "footer.registration": string;

  [key: string]: string;
}

export function getDefaultSiteSettings(): SiteSettingsMap {
  return {
    "site.name": siteConfig.contact.organizationName,
    "site.shortName": siteConfig.name,
    "site.logoUrl": "/images/soroptimist-india-logo.svg",
    "site.tagline": "Educating, Empowering & Enabling Women and Girls",

    "contact.email": "secretariat@nasi-india.org",
    "contact.phone": "+91 (0) 22 2400 0000",
    "contact.address": "National Secretariat, NASI India",

    "social.facebook": "https://facebook.com/nasiindia",
    "social.twitter": "https://x.com/nasiindia",
    "social.instagram": "https://instagram.com/nasiindia",
    "social.linkedin": "https://linkedin.com/company/nasiindia",
    "social.youtube": "https://youtube.com/@nasiindia",

    "home.heroTitle": "National Association of Soroptimist India (NASI-India)",
    "home.heroSubtitle":
      "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change.",
    "home.announcement":
      "Official digital portal of the National Association of Soroptimist International of India.",
    "home.heroCtaText": "Our Impact",
    "home.heroCtaUrl": "#vision-mission",
    "home.heroSecondaryCtaText": "Contact Us",
    "home.heroSecondaryCtaUrl": "/contact",
    "home.heroImageLeft": "/images/banner/hero-woman-facing-left.jpg",
    "home.heroImageRight": "/images/banner/hero-woman-facing-right.jpg",
    "home.bannerDisplayMode": "slideshow",

    "footer.copyright": `© ${siteConfig.copyrightYear} National Association of Soroptimist International of India. All rights reserved.`,
    "footer.registration": "Chartered National Association of Soroptimist International.",
  };
}

/**
 * Returns all site settings merged with baseline defaults.
 */
export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const defaults = getDefaultSiteSettings();
  const local = readLocalSettings();
  const merged: SiteSettingsMap = { ...defaults, ...local };

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db");
      const dbSettings = await prisma.siteSetting.findMany();
      for (const item of dbSettings) {
        merged[item.key] = item.value;
      }
    } catch (err) {
      console.warn("[getSiteSettings] DB query failed, using local settings:", err);
    }
  }

  return merged;
}

/**
 * Updates multiple site settings in the database and local persistent storage.
 */
export async function updateSiteSettings(
  settings: Record<string, string>,
  groupMap?: Record<string, string>
): Promise<void> {
  // 1. Always persist to local file store so updates reflect immediately
  writeLocalSettings(settings);

  // 2. Also sync to PostgreSQL if database connection is available
  if (process.env.DATABASE_URL) {
    try {
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
    } catch (err) {
      console.warn("[updateSiteSettings] DB write skipped (persisted locally):", err);
    }
  }
}
