import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { storeUploadedFile } from "@/lib/storage";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user: only SUPER_ADMIN and NATIONAL_ADMIN can upload
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const formData = await req.formData();
    const file = formData.get("file");
    const category = (formData.get("category") as string) || "general";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No valid file uploaded." },
        { status: 400 }
      );
    }

    const validCategory = ["news", "events", "newsletters", "general"].includes(category)
      ? (category as "news" | "events" | "newsletters" | "general")
      : "general";

    const result = await storeUploadedFile(file, validCategory, user.id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process file upload.";
    console.error("[/api/upload] Error uploading file:", message);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: message.includes("Unauthorized") ? 401 : 400 }
    );
  }
}
