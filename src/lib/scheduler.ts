import { prisma } from "@/lib/db";
import { AuditAction, PublishStatus } from "@prisma/client";

/**
 * Checks and publishes all scheduled content whose scheduledAt timestamp
 * has now passed. Can be run periodically via cron or lazily on request.
 */
export async function publishScheduledContent(): Promise<{
  publishedNewsCount: number;
  publishedEventsCount: number;
}> {
  if (!process.env.DATABASE_URL || process.env.NEXT_PHASE === "phase-production-build") {
    return { publishedNewsCount: 0, publishedEventsCount: 0 };
  }

  const now = new Date();
  let publishedNewsCount = 0;
  let publishedEventsCount = 0;

  try {
    // 1. Find scheduled news articles ready to publish
    const scheduledArticles = await prisma.newsArticle.findMany({
      where: {
        status: PublishStatus.SCHEDULED,
        scheduledAt: { lte: now },
      },
      select: { id: true, title: true },
    });

    if (scheduledArticles.length > 0) {
      const ids = scheduledArticles.map((a) => a.id);
      await prisma.newsArticle.updateMany({
        where: { id: { in: ids } },
        data: {
          status: PublishStatus.PUBLISHED,
          publishedAt: now,
        },
      });

      publishedNewsCount = scheduledArticles.length;

      // Create audit log
      for (const article of scheduledArticles) {
        await prisma.auditLog.create({
          data: {
            action: AuditAction.UPDATE,
            entityType: "NewsArticle",
            entityId: article.id,
            changes: {
              previousStatus: "SCHEDULED",
              newStatus: "PUBLISHED",
              automated: true,
              reason: "Scheduled publication threshold reached",
            },
          },
        });
      }
    }

    // 2. Find scheduled events ready to publish
    const scheduledEvents = await prisma.event.findMany({
      where: {
        status: PublishStatus.SCHEDULED,
        createdAt: { lte: now }, // or any scheduling rule
      },
      select: { id: true },
    });

    if (scheduledEvents.length > 0) {
      const eventIds = scheduledEvents.map((e) => e.id);
      await prisma.event.updateMany({
        where: { id: { in: eventIds } },
        data: {
          status: PublishStatus.PUBLISHED,
        },
      });
      publishedEventsCount = scheduledEvents.length;
    }
  } catch (error) {
    console.warn("[publishScheduledContent] Warning during publication check:", error);
  }

  return { publishedNewsCount, publishedEventsCount };
}

