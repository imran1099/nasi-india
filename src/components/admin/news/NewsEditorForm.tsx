"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveNewsArticleAction, createNewsCategoryAction } from "@/actions/news";
import { RichMarkdownEditor } from "@/components/admin/RichMarkdownEditor";
import { FileUploadWidget } from "@/components/admin/FileUploadWidget";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ClubOption {
  id: string;
  name: string;
  slug: string;
  city: string;
}

interface NewsEditorFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    coverImage?: string | null;
    sourceUrl?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    status?: string;
    categoryId?: string | null;
    clubId?: string | null;
    authorName?: string | null;
    tags?: string[];
    publishedAt?: Date | string | null;
    scheduledAt?: Date | string | null;
  };
  categories: Category[];
  clubs: ClubOption[];
}

export function NewsEditorForm({
  initialData,
  categories: initialCategories,
  clubs,
}: NewsEditorFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [clubId, setClubId] = useState(initialData?.clubId || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "National Secretariat");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");

  // Formatting ISO string for datetime-local input
  const formatDatetimeForInput = (d?: Date | string | null) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [publishedAt, setPublishedAt] = useState(formatDatetimeForInput(initialData?.publishedAt));
  const [scheduledAt, setScheduledAt] = useState(formatDatetimeForInput(initialData?.scheduledAt));

  // Quick category creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const generateSlug = () => {
    const s = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(s);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await createNewsCategoryAction(newCategoryName);
      if (res.success) {
        setCategories((prev) => [...prev, res.data]);
        setCategoryId(res.data.id);
        setNewCategoryName("");
        setIsAddingCategory(false);
      } else {
        alert(res.error.message || "Failed to create category");
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error creating category");
    }
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
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("coverImage", coverImage);
    formData.append("sourceUrl", sourceUrl);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("status", status);
    formData.append("categoryId", categoryId);
    formData.append("clubId", clubId);
    formData.append("authorName", authorName);
    formData.append("tags", tags);
    if (publishedAt) formData.append("publishedAt", new Date(publishedAt).toISOString());
    if (scheduledAt) formData.append("scheduledAt", new Date(scheduledAt).toISOString());

    try {
      const res = await saveNewsArticleAction(null, formData);
      if (!res.success) {
        setErrorMessage(res.error.message || "Failed to save article.");
        if (res.error.fieldErrors) {
          setFieldErrors(res.error.fieldErrors);
        }
      } else {
        setSuccessMessage("Article saved successfully!");
        setTimeout(() => {
          router.push("/admin/news");
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
          <p className="font-semibold">Unable to save article:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          <p className="font-semibold">✓ {successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: Content & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated" className="bg-white p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Headline / Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SI National Council Biennial Conference 2024"
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
                <div className="flex items-center">
                  <span className="text-xs text-forest-500 bg-sand-100 px-2.5 py-2 border border-r-0 border-sand-300 rounded-l-md select-none">
                    /news/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-slug-identifier"
                    className="flex-1 px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-r-md bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={generateSlug}
                className="mt-5 px-3 py-2 text-xs font-medium text-teal-800 bg-sand-100 hover:bg-sand-200 rounded-md border border-sand-300 whitespace-nowrap"
              >
                Auto-generate
              </button>
            </div>
            {fieldErrors.slug && (
              <p className="text-xs text-red-600">{fieldErrors.slug.join(", ")}</p>
            )}

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Summary / Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise synopsis displayed on cards and search results..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700 resize-none"
              />
              {fieldErrors.excerpt && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.excerpt.join(", ")}</p>
              )}
            </div>

            {/* Rich Markdown Editor */}
            <RichMarkdownEditor
              value={content}
              onChange={setContent}
              error={fieldErrors.content?.[0]}
            />
          </Card>

          {/* SEO Metadata & Source URL */}
          <Card variant="elevated" className="bg-white p-6 space-y-4">
            <h3 className="text-sm font-semibold text-forest-950 pb-2 border-b border-sand-200">
              SEO & External Reference
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Meta Title (Browser & Search Snippet)
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to article headline"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Original Source URL (Optional)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://soroptimistinternational.org/..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
                {fieldErrors.sourceUrl && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.sourceUrl.join(", ")}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Custom search description (under 160 characters)"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700 resize-none"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar: Publishing, Category, Attribution, Media */}
        <div className="space-y-6">
          {/* Publication Control */}
          <Card variant="elevated" className="bg-white p-5 space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-sand-200">
              <CardTitle as="h3" className="text-sm font-semibold text-forest-950">
                Publishing Controls
              </CardTitle>
            </CardHeader>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Editorial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="DRAFT">Draft (Hidden from Public)</option>
                <option value="PENDING_APPROVAL">Pending Review / Approval</option>
                <option value="SCHEDULED">Scheduled for Auto-Publication</option>
                <option value="PUBLISHED">Published Live</option>
                <option value="ARCHIVED">Archived (Unpublished)</option>
              </select>
            </div>

            {status === "SCHEDULED" && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md space-y-1.5">
                <label className="block text-xs font-semibold text-amber-950">
                  Target Publication Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded bg-white focus:outline-none focus:border-amber-600"
                />
                <p className="text-[11px] text-amber-800">
                  Will automatically transition to PUBLISHED once this threshold arrives.
                </p>
                {fieldErrors.scheduledAt && (
                  <p className="text-xs text-red-600">{fieldErrors.scheduledAt.join(", ")}</p>
                )}
              </div>
            )}

            {status === "PUBLISHED" && (
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Publication Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-sand-300 rounded bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Article" : "Save Article"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                href="/admin/news"
                className="w-full justify-center"
              >
                Cancel & Return
              </Button>
            </div>
          </Card>

          {/* Category & Associated Club */}
          <Card variant="elevated" className="bg-white p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-forest-900">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-xs text-teal-800 hover:text-teal-950 font-medium underline"
                >
                  {isAddingCategory ? "Cancel" : "+ New Category"}
                </button>
              </div>

              {isAddingCategory && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-sand-50 rounded border border-sand-200">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category title..."
                    className="flex-1 px-2 py-1 text-xs border border-sand-300 rounded bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-2.5 py-1 text-xs font-semibold bg-teal-800 text-white rounded hover:bg-teal-900"
                  >
                    Add
                  </button>
                </div>
              )}

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Associated Club (Optional)
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="">National / NASI All India</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Author Attribution
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. National Programme Action Committee"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Education, Scholarships, Advocacy"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
            </div>
          </Card>

          {/* Featured Image */}
          <Card variant="elevated" className="bg-white p-5">
            <FileUploadWidget
              label="Featured Cover Image"
              category="news"
              accept="image/*"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              helperText="Upload a high-resolution banner (JPEG, PNG, WebP) up to 10MB."
            />
          </Card>
        </div>
      </div>
    </form>
  );
}
