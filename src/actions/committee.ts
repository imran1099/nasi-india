"use server";

import { Role, AuditAction } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { committeeMemberFormSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { revalidatePath } from "next/cache";
import {
  saveCommitteeMemberInDb,
  deleteCommitteeMemberInDb,
} from "@/lib/dal/committee";
import { storeUploadedFile, MAX_MEMBER_IMAGE_SIZE } from "@/lib/storage";

export async function saveCommitteeMemberAction(
  _prevState: ApiResponse<{ id: string; image?: string | null }> | null,
  formData: FormData
): Promise<ApiResponse<{ id: string; image?: string | null }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const raw = {
      id: (formData.get("id") as string) || undefined,
      name: formData.get("name"),
      role: formData.get("role"),
      designation: formData.get("designation") || undefined,
      department: formData.get("department") || undefined,
      tenure: formData.get("tenure") || "Biennium 2026–2028",
      clubAffiliation: formData.get("clubAffiliation") || undefined,
      email: formData.get("email") || undefined,
      phone: formData.get("phone") || undefined,
      bio: formData.get("bio") || undefined,
      image: (formData.get("image") as string) || undefined,
      displayOrder: formData.get("displayOrder") || 0,
      isActive: formData.get("isActive") !== "false",
    };

    const parsed = committeeMemberFormSchema.safeParse(raw);
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

    const saved = await saveCommitteeMemberInDb({
      id: data.id,
      name: data.name,
      role: data.role,
      roleShort: data.role,
      designation: data.designation || `${data.role} – NASI India`,
      department: data.department || "Executive Leadership",
      tenure: data.tenure || "Biennium 2026–2028",
      clubAffiliation: data.clubAffiliation || "NASI India",
      emailPlaceholder: data.email || "secretariat@nasi-india.org",
      image: data.image || null,
      bio: data.bio || "",
      displayOrder: data.displayOrder,
      isActive: data.isActive,
    });

    try {
      await logAuditEvent({
        userId: user.id,
        action: data.id ? AuditAction.UPDATE : AuditAction.CREATE,
        entityType: "CommitteeMember",
        entityId: saved.id || "unknown",
        changes: {
          name: saved.name,
          role: saved.role,
          image: saved.image,
          isActive: saved.isActive,
        },
      });
    } catch {
      // Non-fatal if audit logging encounters disconnected db
    }

    revalidatePath("/admin/committee");
    revalidatePath("/committee");
    revalidatePath("/");

    return ok({ id: saved.id || "", image: saved.image });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save member";
    console.error("[saveCommitteeMemberAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}

export async function deleteCommitteeMemberAction(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    await deleteCommitteeMemberInDb(id);

    try {
      await logAuditEvent({
        userId: user.id,
        action: AuditAction.DELETE,
        entityType: "CommitteeMember",
        entityId: id,
        changes: { deletedId: id },
      });
    } catch {
      // Non-fatal
    }

    revalidatePath("/admin/committee");
    revalidatePath("/committee");
    revalidatePath("/");

    return ok({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete member";
    console.error("[deleteCommitteeMemberAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}

export async function uploadMemberImageAction(
  formData: FormData
): Promise<ApiResponse<{ url: string; filename: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return fail("VALIDATION_ERROR", "No image file provided.");
    }

    if (file.size > MAX_MEMBER_IMAGE_SIZE) {
      return fail(
        "VALIDATION_ERROR",
        `Image file exceeds 5 MB limit (size: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`
      );
    }

    const result = await storeUploadedFile(file, "members", user.id);

    return ok({
      url: result.url,
      filename: result.filename,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    console.error("[uploadMemberImageAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}
