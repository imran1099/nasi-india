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
  "contact.secretaryEmail": string;
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

  // Meet the President
  "president.name": string;
  "president.designation": string;
  "president.tenure": string;
  "president.photoUrl": string;
  "president.message": string;

  // Vision, Mission & Graphics
  "vision.text": string;
  "mission.text": string;
  "media.triadGraphicUrl": string;
  "media.sdgGraphicUrl": string;

  // Events & Gatherings
  "event.maduraiInvitationUrl": string;
  "event.maduraiHighlight1": string;
  "event.maduraiHighlight2": string;
  "event.maduraiHighlight3": string;
  "event.maduraiHighlight4": string;
  "council.title": string;
  "council.description": string;

  // Federation & Affiliation
  "federation.itemsText": string;

  // Footer
  "footer.copyright": string;
  "footer.registration": string;

  // Website Launch Curtain Settings
  "curtain.enabled": string;
  "curtain.launchDate": string;
  "curtain.startTime": string;
  "curtain.endTime": string;
  "curtain.timeZone": string;
  "curtain.title": string;
  "curtain.organization": string;
  "curtain.launchHeading": string;
  "curtain.subtitle": string;
  "curtain.showLogo": string;
  "curtain.duration": string;

  [key: string]: string;
}

export function getDefaultSiteSettings(): SiteSettingsMap {
  return {
    "site.name": siteConfig.contact.organizationName,
    "site.shortName": siteConfig.name,
    "site.logoUrl": "/images/soroptimist-india-logo.svg",
    "site.tagline": "Educating, Empowering & Enabling Women and Girls",

    "contact.email": "secretariat@nasi-india.org",
    "contact.secretaryEmail": "secretary@nasi-india.org",
    "contact.phone": "+91 (0) 22 2400 0000",
    "contact.address": "National Secretariat, NASI India",

    "social.facebook": "https://facebook.com/nasiindia",
    "social.twitter": "https://x.com/nasiindia",
    "social.instagram": "https://instagram.com/nasiindia",
    "social.linkedin": "https://linkedin.com/company/nasiindia",
    "social.youtube": "https://youtube.com/@nasiindia",

    "home.heroTitle": "NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India)",
    "home.heroSubtitle":
      "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change.",
    "home.announcement":
      "Official digital portal of NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India).",
    "home.heroCtaText": "Our Impact",
    "home.heroCtaUrl": "#vision-mission",
    "home.heroSecondaryCtaText": "Contact Us",
    "home.heroSecondaryCtaUrl": "/contact",
    "home.heroImageLeft": "/images/banner/hero-nasi-official.jpg",
    "home.heroImageRight": "/images/banner/hero-woman-facing-right.jpg",
    "home.bannerDisplayMode": "slideshow",

    "president.name": "Anitha Rajarajan",
    "president.designation": "President",
    "president.tenure": "2026–2028",
    "president.photoUrl": "/uploads/general/anitha_rajaraj-6b7679a6a393fd01e58027de.jpg",
    "president.theme": "UNITE – ACT – IMPACT",
    "president.message":
      "Dear Soroptimist Sisters and Friends,\n\nIt is with immense humility, gratitude, and a profound sense of purpose that I step into the role of National President of the National Association of Soroptimist International, India (NASI) for the biennium 2026-2028.\n\nSoroptimist International has always stood as a beacon of hope, resilience, and transformation. As women dedicated to uplifting women and girls, our mission is not just relevant—it is vital. In a rapidly evolving world, the challenges faced by women—economic, social, educational, and environmental—demand our collective strength, vision, and unwavering commitment.\n\nOver the next two years, our journey together will be guided by a clear focus: UNITE – ACT – IMPACT.\n\nWe will unite our diverse talents, clubs, and voices across India, strengthening the bonds of sisterhood and collaboration. We will act decisively through targeted programs that foster education, healthcare, economic empowerment, and sustainability. And in doing so, we will create measurable, lasting impact in the lives of the women and girls we serve.\n\nAs we embark on this new biennium, I invite each of you to bring your passion, ideas, and energy to the forefront. Let us celebrate our achievements, learn from our challenges, and strive towards greater milestones. Together, let us continue to inspire, innovate, and ignite change.\n\nWith warm wishes and Soroptimist greetings,\n\nAnitha Rajarajan\nPresident\nNational association of Soroptimist International, India",

    "vision.text":
      "Women and girls will achieve their individual and collective potential, realize aspirations, and have an equal voice in creating strong, peaceful communities.",
    "mission.text":
      "To improve the lives and opportunities of women and girls through education, empowerment, advocacy and community service.",
    "media.triadGraphicUrl": "",
    "media.sdgGraphicUrl": "",

    "event.maduraiInvitationUrl": "",
    "event.maduraiHighlight1":
      "Formal Installation Ceremony of National President Anitha Rajarajan and the newly elected 2026–2028 NASI India Board officers.",
    "event.maduraiHighlight2":
      "National Executive Committee (EC) strategic deliberations establishing the biennial roadmap, governance charters, and national club expansion.",
    "event.maduraiHighlight3":
      "Grassroots Programme Action review showcasing milestone projects in girl education, women's healthcare, and alignment with the United Nations 17 SDGs.",
    "event.maduraiHighlight4":
      "Delegation fellowship banquet, cultural heritage reception, and photographic documentation celebrating 19 chartered clubs nationwide.",
    "council.title": "NASI Annual General Meeting",
    "council.description":
      "The NASI Annual General Meeting is held in the first half of the year. It reviews the Annual Reports, Programme Action, Audited Statements and undertakes constitutional deliberations.",

    "federation.itemsText":
      "Soroptimist International Great Britain & Ireland (SIGBI)\nSoroptimist International of the Americas (SIA)\nSoroptimist International of Europe (SIE)\nSoroptimist International of South East Asia Pacific (SISEAP)\nSoroptimist International African Federation (SIAF)",

    "footer.copyright": `© ${siteConfig.copyrightYear} NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India). All rights reserved.`,
    "footer.registration": "Chartered under Soroptimist International.",

    "curtain.enabled": "false",
    "curtain.launchDate": "2026-11-28",
    "curtain.startTime": "00:00",
    "curtain.endTime": "23:59",
    "curtain.timeZone": "Asia/Kolkata",
    "curtain.title": "NATIONAL ASSOCIATION SOROPTIMIST INDIA",
    "curtain.organization": "NASI-India",
    "curtain.launchHeading": "Website Launch",
    "curtain.subtitle": "UNITE – ACT – IMPACT",
    "curtain.showLogo": "true",
    "curtain.duration": "4",
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
