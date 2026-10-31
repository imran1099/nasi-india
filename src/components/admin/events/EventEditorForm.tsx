"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveEventAction } from "@/actions/events";
import { RichMarkdownEditor } from "@/components/admin/RichMarkdownEditor";
import { FileUploadWidget } from "@/components/admin/FileUploadWidget";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ClubOption {
  id: string;
  name: string;
  slug: string;
  city: string;
}

interface EventEditorFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string | null;
    content?: string | null;
    coverImage?: string | null;
    eventType?: string;
    startsAt?: Date | string;
    endsAt?: Date | string | null;
    timezone?: string;
    venue?: string | null;
    city?: string | null;
    state?: string | null;
    onlineLink?: string | null;
    registrationLink?: string | null;
    status?: string;
    isCancelled?: boolean;
    clubId?: string | null;
    tags?: string[];
  };
  clubs: ClubOption[];
}

export function EventEditorForm({ initialData, clubs }: EventEditorFormProps) {
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
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [eventType, setEventType] = useState(initialData?.eventType || "IN_PERSON");
  const [startsAt, setStartsAt] = useState(formatDatetimeForInput(initialData?.startsAt));
  const [endsAt, setEndsAt] = useState(formatDatetimeForInput(initialData?.endsAt));
  const [timezone, setTimezone] = useState(initialData?.timezone || "Asia/Kolkata");
  const [venue, setVenue] = useState(initialData?.venue || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "");
  const [onlineLink, setOnlineLink] = useState(initialData?.onlineLink || "");
  const [registrationLink, setRegistrationLink] = useState(initialData?.registrationLink || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [isCancelled, setIsCancelled] = useState(initialData?.isCancelled || false);
  const [clubId, setClubId] = useState(initialData?.clubId || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");

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
    formData.append("content", content);
    formData.append("coverImage", coverImage);
    formData.append("eventType", eventType);
    if (startsAt) formData.append("startsAt", new Date(startsAt).toISOString());
    if (endsAt) formData.append("endsAt", new Date(endsAt).toISOString());
    formData.append("timezone", timezone);
    formData.append("venue", venue);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("onlineLink", onlineLink);
    formData.append("registrationLink", registrationLink);
    formData.append("status", status);
    formData.append("isCancelled", isCancelled ? "true" : "false");
    formData.append("clubId", clubId);
    formData.append("tags", tags);

    try {
      const res = await saveEventAction(null, formData);
      if (!res.success) {
        setErrorMessage(res.error.message || "Failed to save event.");
        if (res.error.fieldErrors) {
          setFieldErrors(res.error.fieldErrors);
        }
      } else {
        setSuccessMessage("Event saved successfully!");
        setTimeout(() => {
          router.push("/admin/events");
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
          <p className="font-semibold">Unable to save event:</p>
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
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NASI National Council Meeting 2024"
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
                    /events/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="event-slug-identifier"
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

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Short Description / Overview
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary for listings, cards and social shares..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700 resize-none"
              />
            </div>

            <RichMarkdownEditor
              value={content}
              onChange={setContent}
              label="Detailed Schedule & Program Description (Optional)"
              minHeight="min-h-[220px]"
            />
          </Card>

          {/* Logistics, Venue, Online Links */}
          <Card variant="elevated" className="bg-white p-6 space-y-4">
            <h3 className="text-sm font-semibold text-forest-950 pb-2 border-b border-sand-200">
              Format, Venue & Access Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Format
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                >
                  <option value="IN_PERSON">In-Person Gathering</option>
                  <option value="ONLINE">Online Webinar / Virtual</option>
                  <option value="HYBRID">Hybrid (In-Person + Online)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST — UTC+5:30)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                </select>
              </div>
            </div>

            {eventType !== "ONLINE" && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Venue / Hall Name
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. The Gateway Hall, Marine Drive"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Kochi"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-forest-900 mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Kerala"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Registration / RSVP Link
                </label>
                <input
                  type="url"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  placeholder="https://forms.gle/... or https://..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Virtual Meeting URL (Zoom/Meet)
                </label>
                <input
                  type="url"
                  value={onlineLink}
                  onChange={(e) => setOnlineLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="elevated" className="bg-white p-5 space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-sand-200">
              <CardTitle as="h3" className="text-sm font-semibold text-forest-950">
                Publishing & Schedule
              </CardTitle>
            </CardHeader>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Event Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
              {fieldErrors.startsAt && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.startsAt.join(", ")}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Event End Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published Live</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Cancellation Toggle */}
            <div className="pt-2 p-3 bg-red-50/60 border border-red-200 rounded-md">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCancelled}
                  onChange={(e) => setIsCancelled(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-red-900">
                  Mark as Cancelled
                </span>
              </label>
              <p className="text-[11px] text-red-700 mt-1">
                Displays a prominent cancellation notice on public event pages.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Event" : "Save Event"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                href="/admin/events"
                className="w-full justify-center"
              >
                Cancel & Return
              </Button>
            </div>
          </Card>

          {/* Club & Tags */}
          <Card variant="elevated" className="bg-white p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Host / Associated Club
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              >
                <option value="">National Council / Secretariat</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Council, Biennium, Leadership"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
              />
            </div>
          </Card>

          {/* Cover Image */}
          <Card variant="elevated" className="bg-white p-5">
            <FileUploadWidget
              label="Event Banner Image"
              category="events"
              accept="image/*"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              helperText="Upload event poster or banner."
            />
          </Card>
        </div>
      </div>
    </form>
  );
}
