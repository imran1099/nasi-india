"use client";

import React, { useState } from "react";

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minHeight?: string;
}

export function RichMarkdownEditor({
  value,
  onChange,
  label = "Content (Markdown & Rich Text)",
  placeholder = "Write your content here...",
  error,
  minHeight = "min-h-[280px]",
}: RichMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("rich-markdown-textarea") as HTMLTextAreaElement | null;
    if (!textarea) {
      onChange(`${value}${before}${after}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${before}${selected || "text"}${after}`;
    const nextVal = value.substring(0, start) + replacement + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 4));
    }, 10);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-forest-900">
          {label}
        </label>
        <div className="flex items-center bg-sand-200/70 p-0.5 rounded text-xs font-medium text-forest-700">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === "write"
                ? "bg-white text-forest-950 shadow-sm"
                : "hover:text-forest-950"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === "preview"
                ? "bg-white text-forest-950 shadow-sm"
                : "hover:text-forest-950"
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <div className="border border-sand-300 rounded-md overflow-hidden focus-within:border-teal-700 focus-within:ring-1 focus-within:ring-teal-700 bg-white">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-1.5 bg-sand-50/80 border-b border-sand-200 text-xs text-forest-700">
            <button
              type="button"
              onClick={() => insertText("**", "**")}
              title="Bold"
              className="px-2 py-1 rounded hover:bg-sand-200/80 font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertText("*", "*")}
              title="Italic"
              className="px-2 py-1 rounded hover:bg-sand-200/80 italic font-serif"
            >
              I
            </button>
            <span className="h-4 w-px bg-sand-300 mx-0.5" />
            <button
              type="button"
              onClick={() => insertText("## ")}
              title="Heading 2"
              className="px-2 py-1 rounded hover:bg-sand-200/80 font-semibold"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertText("### ")}
              title="Heading 3"
              className="px-2 py-1 rounded hover:bg-sand-200/80 font-semibold"
            >
              H3
            </button>
            <span className="h-4 w-px bg-sand-300 mx-0.5" />
            <button
              type="button"
              onClick={() => insertText("- ")}
              title="Bullet List"
              className="px-2 py-1 rounded hover:bg-sand-200/80"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => insertText("1. ")}
              title="Numbered List"
              className="px-2 py-1 rounded hover:bg-sand-200/80"
            >
              1. List
            </button>
            <button
              type="button"
              onClick={() => insertText("> ")}
              title="Quote"
              className="px-2 py-1 rounded hover:bg-sand-200/80 italic"
            >
              “ Quote
            </button>
            <span className="h-4 w-px bg-sand-300 mx-0.5" />
            <button
              type="button"
              onClick={() => insertText("[", "](https://...)")}
              title="Link"
              className="px-2 py-1 rounded hover:bg-sand-200/80 text-teal-800 underline"
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => insertText("![Alt text](", ")")}
              title="Image Embed"
              className="px-2 py-1 rounded hover:bg-sand-200/80 text-teal-800"
            >
              Image
            </button>
          </div>

          <textarea
            id="rich-markdown-textarea"
            name="content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className={`w-full p-3 text-xs sm:text-sm text-forest-950 bg-white placeholder-forest-400 font-sans focus:outline-none resize-y ${minHeight}`}
          />
        </div>
      ) : (
        <div
          className={`border border-sand-300 rounded-md p-4 bg-sand-50/40 text-forest-900 text-xs sm:text-sm space-y-3 overflow-y-auto ${minHeight}`}
        >
          {value.trim() ? (
            <div className="prose prose-sm max-w-none text-forest-900 leading-relaxed whitespace-pre-wrap font-sans">
              {value}
            </div>
          ) : (
            <p className="text-forest-400 italic">No content to preview.</p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      <p className="text-[11px] text-forest-600">
        Supports standard Markdown formatting, paragraphs, lists, quotes, and links.
      </p>
    </div>
  );
}

