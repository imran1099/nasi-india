"use server";

import { Role, AuditAction, PublishStatus } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { newsletterFormSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function saveNewsletterAction(
  _prevState: ApiResponse<{ id: string; slug: string }> | null,
  formData: FormData
): Promise<ApiResponse<{ id: string; slug: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const raw = {
      id: (formData.get("id") as string) || undefined,
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      issueNumber: formData.get("issueNumber"),
      volumeNumber: formData.get("volumeNumber"),
      fileUrl: formData.get("fileUrl"),
      fileName: formData.get("fileName"),
      fileSize: formData.get("fileSize") ? Number(formData.get("fileSize")) : undefined,
      coverImage: formData.get("coverImage"),
      clubId: formData.get("clubId") || undefined,
      publishedAt: formData.get("publishedAt") || undefined,
      status: formData.get("status") || "DRAFT",
      isApproved: formData.get("isApproved") === "true",
    };

    const parsed = newsletterFormSchema.safeParse(raw);
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
    const existing = await prisma.newsletter.findFirst({
      where: {
        slug: data.slug,
        ...(data.id ? { id: { not: data.id } } : {}),
      },
    });

    if (existing) {
      return fail(
        "CONFLICT",
        `A newsletter with slug "${data.slug}" already exists.`,
        { slug: ["Slug already in use."] }
      );
    }

    let publishedAt: Date | null = data.publishedAt ? new Date(data.publishedAt) : null;
    if (data.status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date();
    }

    let newsletterId = data.id;

    if (data.id) {
      // Update
      const previous = await prisma.newsletter.findUnique({ where: { id: data.id } });
      const updated = await prisma.newsletter.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          issueNumber: data.issueNumber || null,
          volumeNumber: data.volumeNumber || null,
          fileUrl: data.fileUrl || null,
          fileName: data.fileName || null,
          fileSize: data.fileSize || null,
          coverImage: data.coverImage || null,
          clubId: data.clubId || null,
          status: data.status as PublishStatus,
          isApproved: data.isApproved,
          publishedAt,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.UPDATE,
        entityType: "Newsletter",
        entityId: updated.id,
        changes: {
          previousStatus: previous?.status,
          newStatus: updated.status,
          isApproved: updated.isApproved,
          title: updated.title,
        },
      });

      newsletterId = updated.id;
    } else {
      // Create
      const created = await prisma.newsletter.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          issueNumber: data.issueNumber || null,
          volumeNumber: data.volumeNumber || null,
          fileUrl: data.fileUrl || null,
          fileName: data.fileName || null,
          fileSize: data.fileSize || null,
          coverImage: data.coverImage || null,
          clubId: data.clubId || null,
          status: data.status as PublishStatus,
          isApproved: data.isApproved,
          publishedAt,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.CREATE,
        entityType: "Newsletter",
        entityId: created.id,
        changes: { title: created.title, status: created.status },
      });

      newsletterId = created.id;
    }

    revalidatePath("/resources");
    revalidatePath("/admin/newsletters");

    return ok({ id: newsletterId!, slug: data.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save newsletter.";
    console.error("[saveNewsletterAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}

export async function approveNewsletterAction(
  id: string,
  publishImmediately: boolean = false
): Promise<ApiResponse<{ id: string; status: PublishStatus; isApproved: boolean }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const newsletter = await prisma.newsletter.findUnique({ where: { id } });
    if (!newsletter) return fail("NOT_FOUND", "Newsletter not found.");

    const newStatus = publishImmediately ? PublishStatus.PUBLISHED : newsletter.status;
    const publishedAt = publishImmediately && !newsletter.publishedAt ? new Date() : newsletter.publishedAt;

    const updated = await prisma.newsletter.update({
      where: { id },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: user.name,
        status: newStatus,
        publishedAt,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "Newsletter",
      entityId: id,
      changes: {
        approval: "APPROVED",
        approvedBy: user.name,
        newStatus: updated.status,
      },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/newsletters");

    return ok({ id: updated.id, status: updated.status, isApproved: updated.isApproved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to approve newsletter.";
    return fail("INTERNAL_ERROR", message);
  }
}

export async function deleteNewsletterAction(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const item = await prisma.newsletter.findUnique({ where: { id } });
    if (!item) return fail("NOT_FOUND", "Newsletter not found.");

    await prisma.newsletter.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.DELETE,
      entityType: "Newsletter",
      entityId: id,
      changes: { title: item.title, slug: item.slug },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/newsletters");

    return ok({ id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete newsletter.";
    return fail("INTERNAL_ERROR", message);
  }
}
