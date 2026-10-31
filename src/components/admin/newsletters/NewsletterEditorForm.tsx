"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveNewsletterAction } from "@/actions/newsletters";
import { FileUploadWidget } from "@/components/admin/FileUploadWidget";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ClubOption {
  id: string;
  name: string;
  slug: string;
  city: string;
}

interface NewsletterEditorFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string | null;
    issueNumber?: string | null;
    volumeNumber?: string | null;
    fileUrl?: string | null;
    fileName?: string | null;
    fileSize?: number | null;
    coverImage?: string | null;
    clubId?: string | null;
    publishedAt?: Date | string | null;
    status?: string;
    isApproved?: boolean;
  };
  clubs: ClubOption[];
}

export function NewsletterEditorForm({ initialData, clubs }: NewsletterEditorFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const formatDatetimeForInput = (d?: Date | string | null) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [issueNumber, setIssueNumber] = useState(initialData?.issueNumber || "");
  const [volumeNumber, setVolumeNumber] = useState(initialData?.volumeNumber || "");
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");
  const [fileName, setFileName] = useState(initialData?.fileName || "");
  const [fileSize, setFileSize] = useState<number | undefined>(initialData?.fileSize || undefined);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [clubId, setClubId] = useState(initialData?.clubId || "");
  const [publishedAt, setPublishedAt] = useState(formatDatetimeForInput(initialData?.publishedAt));
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [isApproved, setIsApproved] = useState(initialData?.isApproved || false);

  const generateSlug = () => {
    const s = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(s);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    if (initialData?.id) formData.append("id", initialData.id);
    formData.append("title", title);
    formData.append("slug", slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    formData.append("description", description);
    formData.append("issueNumber", issueNumber);
    formData.append("volumeNumber", volumeNumber);
    formData.append("fileUrl", fileUrl);
    formData.append("fileName", fileName);
    if (fileSize) formData.append("fileSize", String(fileSize));
    formData.append("coverImage", coverImage);
    formData.append("clubId", clubId);
    if (publishedAt) formData.append("publishedAt", new Date(publishedAt).toISOString());
    formData.append("status", status);
    formData.append("isApproved", isApproved ? "true" : "false");

    try {
      const res = await saveNewsletterAction(null, formData);
      if (!res.success) {
        setErrorMessage(res.error.message || "Failed to save newsletter.");
        if (res.error.fieldErrors) {
          setFieldErrors(res.error.fieldErrors);
        }
      } else {
        setSuccessMessage("Newsletter saved successfully!");
        setTimeout(() => {
          router.push("/admin/newsletters");
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          <p className="font-semibold">Unable to save newsletter:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          <p className="font-semibold">✓ {successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated" className="bg-white p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Newsletter Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NASI India Gazette — Autumn Edition 2024"
                className="w-full px-3 py-2 text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700 font-serif"
              />
              {fieldErrors.title && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.title.join(", ")}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="nasi-gazette-q3-2024"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
              <button
                type="button"
                onClick={generateSlug}
                className="mt-5 px-3 py-2 text-xs font-medium text-teal-800 bg-sand-100 hover:bg-sand-200 rounded-md border border-sand-300 whitespace-nowrap"
              >
                Auto-generate
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Issue / Edition Identifier
                </label>
                <input
                  type="text"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  placeholder="e.g. Vol. 14, Issue 3"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Volume (Optional)
                </label>
                <input
                  type="text"
                  value={volumeNumber}
                  onChange={(e) => setVolumeNumber(e.target.value)}
                  placeholder="e.g. Biennium 2024"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Executive Summary / Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight key announcements, president's message, and club contributions..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
            </div>
          </Card>

          {/* Secure Document Attachment */}
          <Card variant="elevated" className="bg-white p-6 space-y-4">
            <h3 className="text-sm font-semibold text-forest-950 pb-2 border-b border-sand-200">
              Publication Document (PDF)
            </h3>

            <FileUploadWidget
              label="Official PDF Document"
              category="newsletters"
              accept="application/pdf"
              value={fileUrl}
              onChange={(url, meta) => {
                setFileUrl(url);
                if (meta?.fileName) setFileName(meta.fileName);
                if (meta?.fileSize) setFileSize(meta.fileSize);
              }}
              helperText="Upload official PDF file (up to 25MB). Verified with magic-byte signature check."
            />

            {fileUrl && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-md text-xs text-emerald-950">
                <span>✓ File verified & attached.</span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-900 underline"
                >
                  Download / View Attached PDF ↗
                </a>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="elevated" className="bg-white p-5 space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-sand-200">
              <CardTitle as="h3" className="text-sm font-semibold text-forest-950">
                Editorial & Approval
              </CardTitle>
            </CardHeader>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="DRAFT">Draft (Under Preparation)</option>
                <option value="PENDING_APPROVAL">Pending Executive Approval</option>
                <option value="PUBLISHED">Published Live</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Approval Workflow Toggle */}
            <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-md space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-600"
                />
                <span className="text-xs font-semibold text-teal-950">
                  Approved by National Executive
                </span>
              </label>
              <p className="text-[11px] text-teal-800">
                Only approved and published newsletters appear in public archives.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Publication Date
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Newsletter" : "Save Newsletter"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                href="/admin/newsletters"
                className="w-full justify-center"
              >
                Cancel & Return
              </Button>
            </div>
          </Card>

          {/* Associated Club */}
          <Card variant="elevated" className="bg-white p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Publishing Entity / Club
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="">National Council / India Federation</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Cover Thumbnail */}
          <Card variant="elevated" className="bg-white p-5">
            <FileUploadWidget
              label="Cover Image (Thumbnail)"
              category="newsletters"
              accept="image/*"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              helperText="Optional cover artwork for issue preview."
            />
          </Card>
        </div>
      </div>
    </form>
  );
}
