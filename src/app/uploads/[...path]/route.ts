import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Supported MIME types map
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

/**
 * Dynamic File Serving Route Handler for Uploaded Assets
 * --------------------------------------------------------
 * Next.js production builds only serve static files that existed in `public/`
 * at build time. Files uploaded dynamically at runtime into `public/uploads/`
 * would otherwise trigger a 404 error if Nginx does not have an alias block.
 *
 * This route handler serves runtime-uploaded images and documents securely
 * from the `public/uploads` directory.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await context.params;

    if (!segments || segments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Security Guard: Prevent directory traversal attacks
    for (const segment of segments) {
      if (
        segment.includes("..") ||
        segment.includes("/") ||
        segment.includes("\\") ||
        segment.includes("%")
      ) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    const uploadsBaseDir = path.resolve(process.cwd(), "public", "uploads");
    const targetFilePath = path.resolve(uploadsBaseDir, ...segments);

    // Ensure resolved path is strictly inside the public/uploads directory
    if (!targetFilePath.startsWith(uploadsBaseDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Verify file existence
    const fileStat = await fs.stat(targetFilePath);
    if (!fileStat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(targetFilePath);
    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Return 404 if file is missing, unreadable, or not found
    return new NextResponse("Not Found", { status: 404 });
  }
}
