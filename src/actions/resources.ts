"use server";

import { Role, AuditAction } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { externalResourceFormSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function saveExternalResourceAction(
  _prevState: ApiResponse<{ id: string }> | null,
  formData: FormData
): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const raw = {
      id: (formData.get("id") as string) || undefined,
      title: formData.get("title"),
      url: formData.get("url"),
      description: formData.get("description"),
      category: formData.get("category") || "Soroptimist Network",
      badge: formData.get("badge") || undefined,
      displayOrder: formData.get("displayOrder") || 0,
      isActive: formData.get("isActive") !== "false",
    };

    const parsed = externalResourceFormSchema.safeParse(raw);
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

    let resourceId = data.id;

    if (data.id) {
      const updated = await prisma.externalResource.update({
        where: { id: data.id },
        data: {
          title: data.title,
          url: data.url,
          description: data.description || null,
          category: data.category || "Soroptimist Network",
          badge: data.badge || null,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.UPDATE,
        entityType: "ExternalResource",
        entityId: updated.id,
        changes: { title: updated.title, url: updated.url, isActive: updated.isActive },
      });

      resourceId = updated.id;
    } else {
      const created = await prisma.externalResource.create({
        data: {
          title: data.title,
          url: data.url,
          description: data.description || null,
          category: data.category || "Soroptimist Network",
          badge: data.badge || null,
          displayOrder: data.displayOrder,
          isActive: data.isActive,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.CREATE,
        entityType: "ExternalResource",
        entityId: created.id,
        changes: { title: created.title, url: created.url },
      });

      resourceId = created.id;
    }

    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    return ok({ id: resourceId! });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save external resource.";
    console.error("[saveExternalResourceAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}

export async function toggleResourceActiveAction(
  id: string
): Promise<ApiResponse<{ id: string; isActive: boolean }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const resource = await prisma.externalResource.findUnique({ where: { id } });
    if (!resource) return fail("NOT_FOUND", "Resource not found.");

    const updated = await prisma.externalResource.update({
      where: { id },
      data: { isActive: !resource.isActive },
    });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "ExternalResource",
      entityId: id,
      changes: { isActive: updated.isActive },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    return ok({ id: updated.id, isActive: updated.isActive });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle resource status.";
    return fail("INTERNAL_ERROR", message);
  }
}

export async function deleteExternalResourceAction(
  id: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const resource = await prisma.externalResource.findUnique({ where: { id } });
    if (!resource) return fail("NOT_FOUND", "Resource not found.");

    await prisma.externalResource.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.DELETE,
      entityType: "ExternalResource",
      entityId: id,
      changes: { title: resource.title, url: resource.url },
    });

    revalidatePath("/resources");
    revalidatePath("/admin/resources");

    return ok({ id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete resource.";
    return fail("INTERNAL_ERROR", message);
  }
}
