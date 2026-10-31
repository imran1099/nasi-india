/**
 * Data Access Layer — Admin Dashboard Summaries
 * Aggregates database-backed counts and status metrics across all modules.
 */

import { PublishStatus } from "@prisma/client";
import { initialClubs } from "@/data/clubs";
import { initialNews } from "@/data/news";
import { initialEvents } from "@/data/events";
import { initialCommittee } from "@/data/committee";
import { getAllResources } from "@/data/resources";

export interface DashboardMetrics {
  clubs: {
    total: number;
    active: number;
  };
  news: {
    total: number;
    published: number;
    drafts: number;
  };
  events: {
    total: number;
    upcoming: number;
  };
  newsletters: {
    total: number;
    pending: number;
  };
  enquiries: {
    unreadContact: number;
    totalContact: number;
    unreadMembership: number;
    totalMembership: number;
  };
  committee: {
    total: number;
  };
  resources: {
    total: number;
  };
  isLiveDatabase: boolean;
  recentContactEnquiries: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    createdAt: Date;
    isRead: boolean;
  }>;
  recentMembershipEnquiries: Array<{
    id: string;
    name: string;
    email: string;
    city: string | null;
    createdAt: Date;
    isRead: boolean;
  }>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const fallbackMetrics: DashboardMetrics = {
    clubs: {
      total: initialClubs.length,
      active: initialClubs.length,
    },
    news: {
      total: initialNews.length,
      published: initialNews.length,
      drafts: 0,
    },
    events: {
      total: initialEvents.length,
      upcoming: initialEvents.length,
    },
    newsletters: {
      total: 3,
      pending: 1,
    },
    enquiries: {
      unreadContact: 2,
      totalContact: 5,
      unreadMembership: 3,
      totalMembership: 7,
    },
    committee: {
      total: initialCommittee.length,
    },
    resources: {
      total: getAllResources().length,
    },
    isLiveDatabase: false,
    recentContactEnquiries: [
      {
        id: "demo-contact-1",
        name: "Sunita Rao",
        email: "sunita.rao@example.com",
        subject: "Project partnership in Pune",
        createdAt: new Date("2024-10-25T10:00:00.000Z"),
        isRead: false,
      },
      {
        id: "demo-contact-2",
        name: "Deepa Nair",
        email: "deepa.nair@example.com",
        subject: "General chapter inquiry",
        createdAt: new Date("2024-10-24T14:00:00.000Z"),
        isRead: false,
      },
    ],
    recentMembershipEnquiries: [
      {
        id: "demo-mem-1",
        name: "Anjali Menon",
        email: "anjali.menon@example.com",
        city: "Kochi",
        createdAt: new Date("2024-10-25T09:00:00.000Z"),
        isRead: false,
      },
      {
        id: "demo-mem-2",
        name: "Radhika Kulkarni",
        email: "radhika.k@example.com",
        city: "Bangalore",
        createdAt: new Date("2024-10-23T16:00:00.000Z"),
        isRead: false,
      },
    ],
  };

  if (!process.env.DATABASE_URL) {
    return fallbackMetrics;
  }

  try {
    const { prisma } = await import("@/lib/db");
    const now = process.env.NEXT_PHASE === "phase-production-build"
      ? new Date("2024-01-01T00:00:00.000Z")
      : new Date();

    const [
      totalClubs,
      activeClubs,
      totalNews,
      publishedNews,
      draftNews,
      totalEvents,
      upcomingEvents,
      totalNewsletters,
      pendingNewsletters,
      unreadContact,
      totalContact,
      unreadMembership,
      totalMembership,
      totalCommittee,
      totalResources,
      recentContacts,
      recentMemberships,
    ] = await prisma.$transaction([
      prisma.club.count(),
      prisma.club.count({ where: { isActive: true } }),
      prisma.newsArticle.count(),
      prisma.newsArticle.count({ where: { status: PublishStatus.PUBLISHED } }),
      prisma.newsArticle.count({ where: { status: PublishStatus.DRAFT } }),
      prisma.event.count(),
      prisma.event.count({ where: { startsAt: { gte: now } } }),
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { status: PublishStatus.DRAFT } }),
      prisma.contactEnquiry.count({ where: { isRead: false } }),
      prisma.contactEnquiry.count(),
      prisma.membershipEnquiry.count({ where: { isRead: false } }),
      prisma.membershipEnquiry.count(),
      prisma.committeeMember.count({ where: { isActive: true } }),
      prisma.externalResource.count({ where: { isActive: true } }),
      prisma.contactEnquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          createdAt: true,
          isRead: true,
        },
      }),
      prisma.membershipEnquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          createdAt: true,
          isRead: true,
        },
      }),
    ]);

    return {
      clubs: { total: totalClubs, active: activeClubs },
      news: { total: totalNews, published: publishedNews, drafts: draftNews },
      events: { total: totalEvents, upcoming: upcomingEvents },
      newsletters: { total: totalNewsletters, pending: pendingNewsletters },
      enquiries: {
        unreadContact,
        totalContact,
        unreadMembership,
        totalMembership,
      },
      committee: { total: totalCommittee },
      resources: { total: totalResources },
      isLiveDatabase: true,
      recentContactEnquiries: recentContacts,
      recentMembershipEnquiries: recentMemberships,
    };
  } catch (err) {
    console.warn("[getDashboardMetrics] Database error, using fallback summaries:", err);
    return fallbackMetrics;
  }
}
