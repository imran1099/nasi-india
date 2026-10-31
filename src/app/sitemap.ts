import type { MetadataRoute } from "next";
import { getAllClubSlugs } from "@/lib/dal/clubs";
import { getAllPublishedArticleSlugs } from "@/lib/dal/news";
import { getAllPublishedEventSlugs } from "@/lib/dal/events";
import { getAllClubs } from "@/data/clubs";
import { getAllNews } from "@/data/news";
import { getAllEvents } from "@/data/events";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nasi-india.info";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/committee",
    "/clubs",
    "/news",
    "/events",
    "/resources",
    "/join",
    "/contact",
    "/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic published clubs
  let clubSlugs: string[] = [];
  if (process.env.DATABASE_URL) {
    try {
      clubSlugs = await getAllClubSlugs();
    } catch {}
  }
  if (clubSlugs.length === 0) {
    clubSlugs = getAllClubs().map((c) => c.slug);
  }

  const clubRoutes: MetadataRoute.Sitemap = clubSlugs.map((slug) => ({
    url: `${baseUrl}/clubs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic published news (drafts/archived strictly excluded)
  let newsSlugs: string[] = [];
  if (process.env.DATABASE_URL) {
    try {
      newsSlugs = await getAllPublishedArticleSlugs();
    } catch {}
  }
  if (newsSlugs.length === 0) {
    newsSlugs = getAllNews().map((n) => n.slug);
  }

  const newsRoutes: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic published events (cancelled/archived excluded)
  let eventSlugs: string[] = [];
  if (process.env.DATABASE_URL) {
    try {
      eventSlugs = await getAllPublishedEventSlugs();
    } catch {}
  }
  if (eventSlugs.length === 0) {
    eventSlugs = getAllEvents().map((e) => e.slug);
  }

  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${baseUrl}/events/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...clubRoutes, ...newsRoutes, ...eventRoutes];
}

