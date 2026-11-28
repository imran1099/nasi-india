/**
 * Website Launch Curtain-Raiser Logic & Configuration Utilities
 * Evaluates launch schedule against Asia/Kolkata timezone.
 */

export interface CurtainSettings {
  enabled: boolean;
  launchDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timeZone: string; // default "Asia/Kolkata"
  title: string;
  organization: string;
  launchHeading: string;
  subtitle: string;
  showLogo: boolean;
  logoUrl?: string;
  duration: number; // Opening animation duration in seconds (3 to 5)
}

export const DEFAULT_CURTAIN_SETTINGS: CurtainSettings = {
  enabled: false,
  launchDate: "2026-11-28",
  startTime: "00:00",
  endTime: "23:59",
  timeZone: "Asia/Kolkata",
  title: "NATIONAL ASSOCIATION SOROPTIMIST INDIA",
  organization: "NASI-India",
  launchHeading: "Website Launch",
  subtitle: "UNITE – ACT – IMPACT",
  showLogo: true,
  logoUrl: "/uploads/general/img-20261110-wa0080-b3d7704c9b213c51be5bd5a0.jpg",
  duration: 4,
};

/**
 * Extracts normalized curtain settings from the general settings dictionary
 */
export function extractCurtainSettings(
  settings?: Record<string, string | undefined> | null
): CurtainSettings {
  if (!settings) return DEFAULT_CURTAIN_SETTINGS;

  const durationVal = Number(settings["curtain.duration"]);
  const clampedDuration =
    !isNaN(durationVal) && durationVal >= 2 && durationVal <= 8 ? durationVal : 4;

  return {
    enabled: settings["curtain.enabled"] === "true",
    launchDate: settings["curtain.launchDate"] || DEFAULT_CURTAIN_SETTINGS.launchDate,
    startTime: settings["curtain.startTime"] || DEFAULT_CURTAIN_SETTINGS.startTime,
    endTime: settings["curtain.endTime"] || DEFAULT_CURTAIN_SETTINGS.endTime,
    timeZone: settings["curtain.timeZone"] || "Asia/Kolkata",
    title:
      settings["curtain.title"] || DEFAULT_CURTAIN_SETTINGS.title,
    organization:
      settings["curtain.organization"] || DEFAULT_CURTAIN_SETTINGS.organization,
    launchHeading:
      settings["curtain.launchHeading"] || DEFAULT_CURTAIN_SETTINGS.launchHeading,
    subtitle:
      settings["curtain.subtitle"] || DEFAULT_CURTAIN_SETTINGS.subtitle,
    showLogo: settings["curtain.showLogo"] !== "false",
    logoUrl: settings["site.logoUrl"] || DEFAULT_CURTAIN_SETTINGS.logoUrl,
    duration: clampedDuration,
  };
}

/**
 * Evaluates whether the curtain should be active right now according to the configured timezone.
 */
export function isCurtainActiveInKolkata(
  curtain: CurtainSettings,
  currentDateObj: Date = new Date()
): boolean {
  if (!curtain.enabled) return false;
  if (!curtain.launchDate) return true;

  const timeZone = curtain.timeZone || "Asia/Kolkata";
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(currentDateObj);
    const map: Record<string, string> = {};
    for (const p of parts) {
      map[p.type] = p.value;
    }

    const todayStr = `${map.year}-${map.month}-${map.day}`;
    const nowTimeStr = `${map.hour}:${map.minute}`;

    if (todayStr !== curtain.launchDate) {
      return false;
    }

    const start = curtain.startTime || "00:00";
    const end = curtain.endTime || "23:59";

    return nowTimeStr >= start && nowTimeStr <= end;
  } catch (err) {
    console.warn("[isCurtainActiveInKolkata] Timezone calculation error:", err);
    return false;
  }
}
