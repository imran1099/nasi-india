"use server";

import { Role, AuditAction } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { updateSiteSettings } from "@/lib/dal/settings";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function saveSiteSettingsAction(
  _prevState: ApiResponse<{ updatedCount: number }> | null,
  formData: FormData
): Promise<ApiResponse<{ updatedCount: number }>> {
  try {
    // 1. Server-side role guard: only SUPER_ADMIN can modify site-wide settings
    const user = await requireAuth([Role.SUPER_ADMIN]);

    const settings: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (!key.startsWith("$ACTION") && typeof value === "string") {
        settings[key] = value.trim();
      }
    });

    const keys = Object.keys(settings);
    if (keys.length === 0) {
      return fail("VALIDATION_ERROR", "No settings provided to update.");
    }

    await updateSiteSettings(settings);

    // Record audit log
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import("@/lib/db");
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: AuditAction.UPDATE,
            entityType: "SiteSetting",
            changes: { updatedKeys: keys },
          },
        });
      } catch (auditErr) {
        console.warn("[saveSiteSettingsAction] Audit log write failed:", auditErr);
      }
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return ok({ updatedCount: keys.length });
  } catch (err) {
    console.error("[saveSiteSettingsAction] Error:", err);
    return fail("INTERNAL_ERROR", "Failed to update site settings. Please try again.");
  }
}
