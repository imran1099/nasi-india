"use client";

import React, { useState, useRef } from "react";

interface FileUploadWidgetProps {
  label: string;
  category: "news" | "events" | "newsletters" | "general";
  accept?: string;
  value: string;
  onChange: (url: string, metadata?: { fileName?: string; fileSize?: number }) => void;
  helperText?: string;
}

export function FileUploadWidget({
  label,
  category,
  accept = "image/*",
  value,
  onChange,
  helperText,
}: FileUploadWidgetProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "File upload failed.");
      }

      onChange(json.data.url, {
        fileName: json.data.filename,
        fileSize: json.data.sizeBytes,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload file.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-forest-900">{label}</label>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 text-xs font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-2 py-2 text-xs text-red-600 hover:text-red-800"
              title="Clear"
            >
              Clear
            </button>
          )}
        </div>

        {uploadError && (
          <p className="text-xs text-red-600 font-medium">{uploadError}</p>
        )}

        {/* Thumbnail Preview for Images */}
        {value && accept.includes("image") && (
          <div className="relative w-32 h-20 rounded border border-sand-200 overflow-hidden bg-sand-100/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* PDF Link preview */}
        {value && accept.includes("pdf") && (
          <div className="flex items-center gap-2 text-xs text-forest-800 bg-sand-50 p-2 rounded border border-sand-200">
            <span className="font-semibold text-teal-800">📄 PDF Attached:</span>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-900 underline truncate max-w-xs"
            >
              {value}
            </a>
          </div>
        )}

        {helperText && <p className="text-[11px] text-forest-600">{helperText}</p>}
      </div>
    </div>
  );
}
