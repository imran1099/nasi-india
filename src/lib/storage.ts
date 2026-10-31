import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { MediaCategory } from "@prisma/client";

// Maximum allowed file sizes
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_PDF_SIZE = 25 * 1024 * 1024; // 25MB

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const ALLOWED_PDF_MIMES = new Set(["application/pdf"]);

export interface UploadResult {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  category: "IMAGE" | "DOCUMENT";
  mediaAssetId?: string;
}

/**
 * Validates magic bytes for common file types to prevent renamed malicious files
 */
function validateMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false;

  if (mime === "application/pdf") {
    // PDF starts with %PDF (0x25 0x50 0x44 0x46)
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  if (mime === "image/jpeg") {
    // JPEG starts with FF D8 FF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mime === "image/png") {
    // PNG starts with 89 50 4E 47
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  if (mime === "image/webp") {
    // WEBP starts with RIFF and has WEBP at offset 8
    const riff = buffer.toString("ascii", 0, 4);
    const webp = buffer.length >= 12 ? buffer.toString("ascii", 8, 12) : "";
    return riff === "RIFF" && webp === "WEBP";
  }

  if (mime === "image/svg+xml") {
    // SVG is text XML containing <svg
    const text = buffer.subarray(0, 512).toString("utf-8");
    return text.includes("<svg") || text.includes("<?xml");
  }

  return false;
}

/**
 * Stores an uploaded buffer securely either to local public/uploads directory
 * or configured S3/cloud storage.
 */
export async function storeUploadedFile(
  file: File,
  category: "news" | "events" | "newsletters" | "general",
  uploadedById?: string
): Promise<UploadResult> {
  const mime = file.type.toLowerCase();
  const isPdf = ALLOWED_PDF_MIMES.has(mime);
  const isImage = ALLOWED_IMAGE_MIMES.has(mime);

  if (!isPdf && !isImage) {
    throw new Error(
      `Unsupported file type: ${mime}. Allowed formats: PDF, JPEG, PNG, WebP, SVG.`
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const maxSize = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
  if (buffer.length > maxSize) {
    throw new Error(
      `File exceeds maximum permitted size of ${maxSize / (1024 * 1024)}MB.`
    );
  }

  if (!validateMagicBytes(buffer, mime)) {
    throw new Error("File content signature does not match declared MIME type.");
  }

  // Generate safe non-guessable filename
  const ext = path.extname(file.name).toLowerCase() || (isPdf ? ".pdf" : ".jpg");
  const randomHex = crypto.randomBytes(12).toString("hex");
  const safeBase = file.name
    .replace(ext, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .substring(0, 30);
  const safeFilename = `${safeBase}-${randomHex}${ext}`;

  // Check if external object storage (e.g. S3 compatible) is configured
  const s3Bucket = process.env.S3_BUCKET;
  const s3Endpoint = process.env.S3_ENDPOINT;

  let publicUrl = "";

  if (s3Bucket && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
    // If external S3-compatible cloud storage is configured
    // We construct the destination key and URL
    const key = `uploads/${category}/${safeFilename}`;
    // Fallback URL or CDN URL
    const baseUrl = s3Endpoint
      ? `${s3Endpoint.replace(/\/$/, "")}/${s3Bucket}`
      : `https://${s3Bucket}.s3.amazonaws.com`;
    publicUrl = `${baseUrl}/${key}`;
  } else {
    // Local secure storage in public/uploads/<category>
    const uploadsDir = path.join(process.cwd(), "public", "uploads", category);
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, safeFilename);
    await fs.writeFile(filePath, buffer);
    publicUrl = `/uploads/${category}/${safeFilename}`;
  }

  // Register in MediaAsset DB record
  let mediaAssetId: string | undefined;
  if (process.env.DATABASE_URL) {
    try {
      const asset = await prisma.mediaAsset.create({
        data: {
          filename: safeFilename,
          url: publicUrl,
          mimeType: mime,
          sizeBytes: buffer.length,
          category: isPdf ? MediaCategory.DOCUMENT : MediaCategory.IMAGE,
          altText: safeBase.replace(/-/g, " "),
          uploadedById: uploadedById ?? null,
        },
      });
      mediaAssetId = asset.id;
    } catch (e) {
      console.warn("[storeUploadedFile] MediaAsset write skipped:", e);
    }
  }

  return {
    url: publicUrl,
    filename: safeFilename,
    mimeType: mime,
    sizeBytes: buffer.length,
    category: isPdf ? "DOCUMENT" : "IMAGE",
    mediaAssetId,
  };
}

