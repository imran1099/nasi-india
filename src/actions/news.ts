"use server";

import { Role, AuditAction, PublishStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { newsArticleFormSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function saveNewsArticleAction(
  _prevState: ApiResponse<{ id: string; slug: string }> | null,
  formData: FormData
): Promise<ApiResponse<{ id: string; slug: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const raw = {
      id: (formData.get("id") as string) || undefined,
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      coverImage: formData.get("coverImage"),
      sourceUrl: formData.get("sourceUrl"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      status: formData.get("status") || "DRAFT",
      categoryId: formData.get("categoryId") || undefined,
      clubId: formData.get("clubId") || undefined,
      authorName: formData.get("authorName") || user.name,
      tags: formData.get("tags") || "",
      publishedAt: formData.get("publishedAt") || undefined,
      scheduledAt: formData.get("scheduledAt") || undefined,
    };

    const parsed = newsArticleFormSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return fail("VALIDATION_ERROR", "Please fix validation errors.", fieldErrors);
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existingWithSlug = await prisma.newsArticle.findFirst({
      where: {
        slug: data.slug,
        ...(data.id ? { id: { not: data.id } } : {}),
      },
    });

    if (existingWithSlug) {
      return fail(
        "CONFLICT",
        `An article with the slug "${data.slug}" already exists. Please choose a unique slug.`,
        { slug: ["Slug already in use."] }
      );
    }

    // Determine publishedAt and scheduledAt
    let publishedAt: Date | null = data.publishedAt ? new Date(data.publishedAt) : null;
    const scheduledAt: Date | null = data.scheduledAt ? new Date(data.scheduledAt) : null;

    if (data.status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date();
    } else if (data.status === "SCHEDULED" && !scheduledAt) {
      return fail(
        "VALIDATION_ERROR",
        "A future scheduled date and time is required for scheduled publication.",
        { scheduledAt: ["Please specify scheduled date/time."] }
      );
    }

    const tagsArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    let articleId = data.id;

    if (data.id) {
      // Update
      const previous = await prisma.newsArticle.findUnique({ where: { id: data.id } });
      const updated = await prisma.newsArticle.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || null,
          content: data.content,
          coverImage: data.coverImage || null,
          sourceUrl: data.sourceUrl || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          status: data.status as PublishStatus,
          publishedAt,
          scheduledAt,
          categoryId: data.categoryId || null,
          clubId: data.clubId || null,
          authorName: data.authorName || null,
          tags: tagsArray,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.UPDATE,
        entityType: "NewsArticle",
        entityId: updated.id,
        changes: {
          previousStatus: previous?.status,
          newStatus: updated.status,
          title: updated.title,
        },
      });

      articleId = updated.id;
    } else {
      // Create
      const created = await prisma.newsArticle.create({
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || null,
          content: data.content,
          coverImage: data.coverImage || null,
          sourceUrl: data.sourceUrl || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          status: data.status as PublishStatus,
          publishedAt,
          scheduledAt,
          categoryId: data.categoryId || null,
          clubId: data.clubId || null,
          authorName: data.authorName || user.name,
          tags: tagsArray,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.CREATE,
        entityType: "NewsArticle",
        entityId: created.id,
        changes: { title: created.title, status: created.status },
      });

      articleId = created.id;
    }

    revalidatePath("/news");
    revalidatePath(`/news/${data.slug}`);
    revalidatePath("/admin/news");
    revalidatePath("/");

    return ok({ id: articleId!, slug: data.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save article.";
    console.error("[saveNewsArticleAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}

export async function setNewsArticleStatusAction(
  id: string,
  newStatus: PublishStatus
): Promise<ApiResponse<{ id: string; status: PublishStatus }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const article = await prisma.newsArticle.findUnique({ where: { id } });
    if (!article) {
      return fail("NOT_FOUND", "News article not found.");
    }

    const updateData: { status: PublishStatus; publishedAt?: Date } = { status: newStatus };
    if (newStatus === PublishStatus.PUBLISHED && !article.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await prisma.newsArticle.update({
      where: { id },
      data: updateData,
    });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "NewsArticle",
      entityId: id,
      changes: {
        previousStatus: article.status,
        newStatus: updated.status,
      },
    });

    revalidatePath("/news");
    revalidatePath(`/news/${article.slug}`);
    revalidatePath("/admin/news");
    revalidatePath("/");

    return ok({ id: updated.id, status: updated.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update article status.";
    return fail("INTERNAL_ERROR", message);
  }
}

export async function deleteNewsArticleAction(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const article = await prisma.newsArticle.findUnique({ where: { id } });
    if (!article) {
      return fail("NOT_FOUND", "Article not found.");
    }

    await prisma.newsArticle.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.DELETE,
      entityType: "NewsArticle",
      entityId: id,
      changes: { title: article.title, slug: article.slug },
    });

    revalidatePath("/news");
    revalidatePath("/admin/news");
    revalidatePath("/");

    return ok({ id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete article.";
    return fail("INTERNAL_ERROR", message);
  }
}

export async function createNewsCategoryAction(
  name: string,
  description?: string
): Promise<ApiResponse<{ id: string; name: string; slug: string }>> {
  try {
    await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await prisma.newsCategory.findUnique({ where: { slug } });
    if (existing) {
      return ok({ id: existing.id, name: existing.name, slug: existing.slug });
    }

    const created = await prisma.newsCategory.create({
      data: { name, slug, description },
    });

    revalidatePath("/admin/news");
    return ok({ id: created.id, name: created.name, slug: created.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category.";
    return fail("INTERNAL_ERROR", message);
  }
}
