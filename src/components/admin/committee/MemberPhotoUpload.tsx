"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { TrashIcon, CameraIcon, RefreshCwIcon } from "@/components/icons";

interface MemberPhotoUploadProps {
  label?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_AVATAR = "/images/default-avatar.svg";

export function MemberPhotoUpload({
  label = "Member Photograph",
  value,
  onChange,
  disabled = false,
}: MemberPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Declarative preview: local immediate blob preview or persisted value
  const previewUrl = localPreview || value || null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Client-side file type validation
    const mime = file.type.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isValidMime =
      ALLOWED_MIME_TYPES.includes(mime) ||
      (ext && ["jpg", "jpeg", "png", "webp"].includes(ext));

    if (!isValidMime) {
      setErrorMessage(
        `Unsupported file format (${file.type || ext || "unknown"}). Please select a JPG, PNG, or WebP image.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Client-side file size validation (5 MB max)
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(
        `File is too large (${sizeMb} MB). Maximum allowed upload size is 5 MB.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Instant local preview before network completion
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    // 4. Upload to backend
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "members");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to upload image. Please try again.");
      }

      const uploadedUrl = json.data.url;
      onChange(uploadedUrl);
      setLocalPreview(null);
      setSuccessMessage("Photograph uploaded and optimized successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      setErrorMessage(msg);
      // Revert preview if upload failed
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
    setLocalPreview(null);
    setErrorMessage(null);
    setSuccessMessage("Photograph removed. Default avatar will be displayed.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasPhoto = Boolean(previewUrl && previewUrl !== DEFAULT_AVATAR);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-forest-900">
          {label}
        </label>
        <span className="text-[11px] text-forest-600">JPG, PNG, WebP • Max 5 MB</span>
      </div>

      {/* Upload & Preview Card */}
      <div className="p-4 rounded-xl border border-sand-300 bg-sand-50/60 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Profile Image Preview Box */}
        <div className="relative shrink-0">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-sand-300 flex items-center justify-center">
            {hasPhoto ? (
              <Image
                src={previewUrl!}
                alt="Member preview"
                fill
                sizes="(max-width: 640px) 112px, 128px"
                className="object-cover object-top"
                unoptimized={previewUrl?.startsWith("blob:")}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#E8F3FC] to-[#D7E8F5] p-3 text-center">
                <Image
                  src={DEFAULT_AVATAR}
                  alt="Default profile silhouette"
                  width={64}
                  height={64}
                  className="opacity-80 drop-shadow-sm mb-1"
                />
                <span className="text-[10px] font-semibold text-[#005596] tracking-wide">
                  Default Avatar
                </span>
              </div>
            )}

            {/* Spinner Overlay during upload */}
            {isUploading && (
              <div className="absolute inset-0 bg-forest-950/70 flex flex-col items-center justify-center text-white p-2 text-center backdrop-blur-xs">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1.5" />
                <span className="text-[10px] font-medium leading-tight">Optimizing...</span>
              </div>
            )}
          </div>

          {/* Status Indicator Dot */}
          <span
            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
              hasPhoto ? "bg-emerald-500" : "bg-amber-400"
            }`}
            title={hasPhoto ? "Custom photo active" : "Using default avatar"}
          />
        </div>

        {/* Action Controls & Information */}
        <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
          <div>
            <h4 className="text-sm font-semibold text-forest-950">
              {hasPhoto ? "Uploaded Profile Photograph" : "No Photograph Uploaded"}
            </h4>
            <p className="text-xs text-forest-700 mt-0.5">
              {hasPhoto
                ? "This photograph will appear across the NASI Board page, National President section, and member profiles."
                : "A dignified default avatar silhouette will be displayed automatically on the public website."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || isUploading}
            />

            {!hasPhoto ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#005596] hover:bg-[#004780] rounded-lg shadow-xs hover:shadow transition-all disabled:opacity-50"
              >
                <CameraIcon size={14} />
                <span>Upload Photograph</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#005596] bg-white border border-[#005596]/30 hover:bg-[#E8F3FC] rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCwIcon size={13} />
                  <span>Replace Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <TrashIcon size={13} />
                  <span>Remove Image</span>
                </button>
              </>
            )}
          </div>

          {/* Live Messages */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold shrink-0">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
