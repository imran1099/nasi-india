"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CheckCircleIcon, SparklesIcon, ExternalLinkIcon } from "@/components/icons";
import { FileUploadWidget } from "@/components/admin/FileUploadWidget";
import { saveSiteSettingsAction } from "@/actions/settings";
import type { ApiResponse } from "@/lib/api-response";
import type { SiteSettingsMap } from "@/lib/dal/settings";

interface SiteSettingsFormProps {
  initialSettings: SiteSettingsMap;
}

type State = ApiResponse<{ updatedCount: number }> | null;

async function formAction(_prev: State, formData: FormData): Promise<State> {
  return saveSiteSettingsAction(_prev, formData);
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [state, action, isPending] = useActionState(formAction, null);
  const [activeTab, setActiveTab] = useState<
    "branding" | "home" | "president" | "vision-mission" | "events" | "governance" | "contact" | "footer"
  >("branding");

  // State for logo upload
  const [logoUrl, setLogoUrl] = useState(
    initialSettings["site.logoUrl"] || "/images/soroptimist-india-logo.svg"
  );

  // State for banner image uploads
  const [imageLeft, setImageLeft] = useState(
    initialSettings["home.heroImageLeft"] || "/images/banner/hero-woman-facing-left.jpg"
  );
  const [imageRight, setImageRight] = useState(
    initialSettings["home.heroImageRight"] || "/images/banner/hero-woman-facing-right.jpg"
  );
  const [displayMode, setDisplayMode] = useState(
    initialSettings["home.bannerDisplayMode"] || "slideshow"
  );

  // State for President photograph
  const [presidentPhotoUrl, setPresidentPhotoUrl] = useState(
    initialSettings["president.photoUrl"] || ""
  );

  // State for Triad (Educate, Empower, Enable) graphic
  const [triadGraphicUrl, setTriadGraphicUrl] = useState(
    initialSettings["media.triadGraphicUrl"] || ""
  );

  // State for UN SDG circular graphic
  const [sdgGraphicUrl, setSdgGraphicUrl] = useState(
    initialSettings["media.sdgGraphicUrl"] || ""
  );

  // State for Madurai meeting invitation image
  const [maduraiInvitationUrl, setMaduraiInvitationUrl] = useState(
    initialSettings["event.maduraiInvitationUrl"] || ""
  );

  const isSuccess = state?.success === true;

  const tabs = [
    { id: "branding", label: "Branding & Logo" },
    { id: "home", label: "Hero Banner" },
    { id: "president", label: "Meet the President" },
    { id: "vision-mission", label: "Vision, Mission & Graphics" },
    { id: "events", label: "Events & Madurai" },
    { id: "governance", label: "Clubs & Governance" },
    { id: "contact", label: "Secretariat Contact" },
    { id: "footer", label: "Footer & Social" },
  ] as const;

  return (
    <form action={action} className="space-y-6">
      {/* Feedback Messages */}
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-sm">
          <CheckCircleIcon size={20} className="text-teal-700 shrink-0" />
          <div>
            <p className="font-semibold">Site settings successfully updated!</p>
            <p className="text-xs text-teal-800">
              Changes have been saved and public pages refreshed.
            </p>
          </div>
        </div>
      )}

      {state && !state.success && (
        <ErrorMessage
          variant="error"
          title="Failed to Save Settings"
          message={state.error.message}
        />
      )}

      {/* Tabs navigation */}
      <div className="border-b border-sand-200 flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === tab.id
                ? "border-[#005596] text-[#005596] bg-white shadow-2xs font-bold"
                : "border-transparent text-forest-700 hover:text-forest-950 hover:bg-sand-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels Container */}
      <div className="bg-white p-6 rounded-xl border border-sand-200 shadow-xs">
        {/* ================================================================ */}
        {/* TAB 1: Branding & Logo */}
        {/* ================================================================ */}
        <div className={activeTab === "branding" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Brand Identity &amp; Logo Configuration
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Manage the organization name, tagline, and official website logo displayed across headers, footers, and brand touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Organization Name"
              id="site-name"
              name="site.name"
              defaultValue={initialSettings["site.name"]}
              required
            />
            <FormField
              label="Acronym / Short Name"
              id="site-shortname"
              name="site.shortName"
              defaultValue={initialSettings["site.shortName"]}
              required
            />
          </div>

          <FormField
            label="National Tagline"
            id="site-tagline"
            name="site.tagline"
            defaultValue={initialSettings["site.tagline"]}
            required
          />

          {/* Official Website Logo Upload & Live Preview */}
          <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D7E8F5] pb-3">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
                  Website Logo (Header &amp; Footer)
                </h4>
                <p className="text-xs text-[#61758A] mt-0.5">
                  Upload an SVG, PNG, WebP, or JPG image file for the website brand emblem.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLogoUrl("/images/soroptimist-india-logo.svg")}
                className="text-xs font-medium text-[#005596] hover:underline cursor-pointer shrink-0"
              >
                Reset to default vector logo
              </button>
            </div>

            {/* Live Preview Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white border border-[#D7E8F5]">
                <span className="block text-[11px] font-mono text-[#61758A] mb-2 uppercase">
                  Preview on Header (Light Surface):
                </span>
                <div className="h-16 flex items-center px-4 bg-white rounded border border-dashed border-[#D7E8F5]">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt="Logo preview on light"
                      className="h-10 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-[#61758A] italic">No logo image selected</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#001E38] border border-[#002D54]">
                <span className="block text-[11px] font-mono text-[#D7E8F5] mb-2 uppercase">
                  Preview on Footer (Dark Surface):
                </span>
                <div className="h-16 flex items-center px-4 bg-[#001E38] rounded border border-dashed border-white/20">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt="Logo preview on dark"
                      className={
                        logoUrl.endsWith("-white.svg")
                          ? "h-10 w-auto max-w-full object-contain"
                          : "h-10 w-auto max-w-full object-contain bg-white/95 rounded p-1 shadow-2xs"
                      }
                    />
                  ) : (
                    <span className="text-xs text-[#D7E8F5] italic">No logo image selected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Widget & Path Input */}
            <div className="pt-2 space-y-3">
              <FileUploadWidget
                label="Upload Logo File"
                category="general"
                accept="image/svg+xml,image/png,image/jpeg,image/webp"
                value={logoUrl}
                onChange={(url) => setLogoUrl(url)}
                helperText="Recommended: Transparent PNG or SVG vector file with minimum 40px height."
              />
              <input type="hidden" name="site.logoUrl" value={logoUrl} />

              <div>
                <label htmlFor="site-logourl-input" className="block text-xs font-medium text-[#17324D] mb-1">
                  Or Enter Asset URL / Path Directly:
                </label>
                <input
                  id="site-logourl-input"
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/images/soroptimist-india-logo.svg"
                  className="w-full px-3 py-2 text-xs font-mono border border-[#D7E8F5] rounded-lg bg-white text-[#17324D] focus:outline-none focus:border-[#005596]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 2: Homepage Banner & Headings */}
        {/* ================================================================ */}
        <div className={activeTab === "home" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Homepage Main Hero Banner
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Customize the hero headline, supporting subtitle, call-to-action buttons, and featured photographs.
            </p>
          </div>

          {/* Banner Text Fields */}
          <div className="space-y-4 p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              Hero Copy &amp; Typography
            </h4>

            <FormField
              label="Hero Main Headline"
              id="home-title"
              name="home.heroTitle"
              defaultValue={initialSettings["home.heroTitle"] || "National Association of Soroptimist India (NASI-India)"}
              helperText="Main prominent heading displayed in the primary hero banner."
              required
            />

            <FormField
              label="Hero Subtitle / Description"
              id="home-sub"
              name="home.heroSubtitle"
              type="textarea"
              rows={3}
              defaultValue={
                initialSettings["home.heroSubtitle"] ||
                "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change."
              }
              helperText="Supporting text directly beneath the main banner headline."
              required
            />

            {/* CTAs Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <FormField
                label="Primary CTA Button Label"
                id="home-cta-text"
                name="home.heroCtaText"
                defaultValue={initialSettings["home.heroCtaText"] || "Our Impact"}
                helperText="Primary pill button (e.g. 'Our Impact')."
              />

              <FormField
                label="Primary CTA Destination Link"
                id="home-cta-url"
                name="home.heroCtaUrl"
                defaultValue={initialSettings["home.heroCtaUrl"] || "#vision-mission"}
                helperText="Anchor or path (e.g. #vision-mission, /about)."
              />

              <FormField
                label="Secondary CTA Button Label"
                id="home-sec-cta-text"
                name="home.heroSecondaryCtaText"
                defaultValue={initialSettings["home.heroSecondaryCtaText"] || "Contact Us"}
                helperText="Secondary button (e.g. 'Contact Us')."
              />

              <FormField
                label="Secondary CTA Destination Link"
                id="home-sec-cta-url"
                name="home.heroSecondaryCtaUrl"
                defaultValue={initialSettings["home.heroSecondaryCtaUrl"] || "/contact"}
                helperText="Destination link for secondary action."
              />
            </div>

            <FormField
              label="Top Banner Announcement Bar (Optional)"
              id="home-ann"
              name="home.announcement"
              defaultValue={initialSettings["home.announcement"] || ""}
              helperText="Optional announcement text displayed at top of portal."
            />
          </div>

          {/* Banner Images Management */}
          <div className="space-y-5 p-5 rounded-xl bg-white border border-[#D7E8F5]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
                  Hero Banner Photography
                </h4>
                <p className="text-xs text-[#61758A] mt-0.5">
                  Upload, replace, or preview the photographs featured on the hero banner.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="banner-mode" className="text-xs font-medium text-[#17324D] whitespace-nowrap">
                  Display Mode:
                </label>
                <select
                  id="banner-mode"
                  name="home.bannerDisplayMode"
                  value={displayMode}
                  onChange={(e) => setDisplayMode(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-[#D7E8F5] rounded-lg bg-[#F4FAFF] text-[#17324D] focus:outline-none focus:border-[#005596]"
                >
                  <option value="slideshow">Interactive Crossfade (Both Photos)</option>
                  <option value="left">Left-Facing Portrait Only</option>
                  <option value="right">Right-Facing Portrait Only</option>
                  <option value="dual">Dual Side-by-Side Presentation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Image 1 */}
              <div className="p-4 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-3">
                <span className="block text-xs font-semibold text-[#17324D]">
                  Image 1 (Left-Facing Portrait)
                </span>
                <div className="relative aspect-3/4 max-h-56 rounded-lg overflow-hidden border border-[#D7E8F5] bg-white mx-auto shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageLeft}
                    alt="Left-facing banner preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <FileUploadWidget
                  label="Upload New Image 1"
                  category="general"
                  accept="image/jpeg,image/png,image/webp"
                  value={imageLeft}
                  onChange={(url) => setImageLeft(url)}
                />
                <input type="hidden" name="home.heroImageLeft" value={imageLeft} />
              </div>

              {/* Image 2 */}
              <div className="p-4 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-3">
                <span className="block text-xs font-semibold text-[#17324D]">
                  Image 2 (Right-Facing Portrait)
                </span>
                <div className="relative aspect-3/4 max-h-56 rounded-lg overflow-hidden border border-[#D7E8F5] bg-white mx-auto shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageRight}
                    alt="Right-facing banner preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <FileUploadWidget
                  label="Upload New Image 2"
                  category="general"
                  accept="image/jpeg,image/png,image/webp"
                  value={imageRight}
                  onChange={(url) => setImageRight(url)}
                />
                <input type="hidden" name="home.heroImageRight" value={imageRight} />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 3: Meet the President */}
        {/* ================================================================ */}
        <div className={activeTab === "president" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Meet the President Configuration
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Manage the National President&apos;s official photograph, name, designation, tenure, and presidential message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="President Full Name"
              id="president-name"
              name="president.name"
              defaultValue={initialSettings["president.name"] || "Anitha Rajarajan"}
              required
            />
            <FormField
              label="Official Designation"
              id="president-designation"
              name="president.designation"
              defaultValue={initialSettings["president.designation"] || "President, NASI-India"}
              required
            />
            <FormField
              label="Biennium Tenure"
              id="president-tenure"
              name="president.tenure"
              defaultValue={initialSettings["president.tenure"] || "Biennium 2026–2028"}
              required
            />
          </div>

          {/* President Photograph Upload & Live Preview */}
          <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              President Official Portrait
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative w-40 h-48 rounded-2xl bg-[#005596] p-1.5 shadow-md border-2 border-[#D4A737] overflow-hidden flex flex-col items-center justify-center text-white">
                  {presidentPhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={presidentPhotoUrl}
                      alt="President preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-[#003A6B] flex flex-col items-center justify-center p-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-serif text-xl font-bold text-[#D4A737] mb-2 border border-white/20">
                        AR
                      </div>
                      <span className="text-[11px] font-bold text-white uppercase">Official Portrait</span>
                      <span className="text-[10px] text-[#D7E8F5] mt-0.5">[Photo Awaited]</span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-[#61758A] mt-2 font-mono">
                  {presidentPhotoUrl ? "Uploaded Portrait Active" : "Placeholder Active"}
                </span>
              </div>

              <div className="md:col-span-8 space-y-3">
                <FileUploadWidget
                  label="Upload President Photograph"
                  category="general"
                  accept="image/jpeg,image/png,image/webp"
                  value={presidentPhotoUrl}
                  onChange={(url) => setPresidentPhotoUrl(url)}
                  helperText="Recommended: High-resolution vertical portrait in 3:4 or 4:5 aspect ratio."
                />
                <input type="hidden" name="president.photoUrl" value={presidentPhotoUrl} />

                <div>
                  <label htmlFor="president-photo-url-direct" className="block text-xs font-medium text-[#17324D] mb-1">
                    Or Enter Asset URL Directly:
                  </label>
                  <input
                    id="president-photo-url-direct"
                    type="text"
                    value={presidentPhotoUrl}
                    onChange={(e) => setPresidentPhotoUrl(e.target.value)}
                    placeholder="/images/committee/anitha-rajarajan.jpg"
                    className="w-full px-3 py-2 text-xs font-mono border border-[#D7E8F5] rounded-lg bg-white text-[#17324D] focus:outline-none focus:border-[#005596]"
                  />
                </div>

                {presidentPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setPresidentPhotoUrl("")}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Remove uploaded portrait (revert to placeholder)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Presidential Biennium Message */}
          <FormField
            label="President's Biennium Message / Official Address"
            id="president-message"
            name="president.message"
            type="textarea"
            rows={7}
            defaultValue={initialSettings["president.message"]}
            helperText="Separate paragraphs with double line-breaks. This message is featured prominently on the landing page."
            required
          />
        </div>

        {/* ================================================================ */}
        {/* TAB 4: Vision, Mission & Graphics */}
        {/* ================================================================ */}
        <div className={activeTab === "vision-mission" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Vision, Mission &amp; National Graphics
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Manage the two-column Vision and Mission content alongside official 3E and UN SDG graphics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Our Vision Statement"
              id="vision-text"
              name="vision.text"
              type="textarea"
              rows={4}
              defaultValue={initialSettings["vision.text"]}
              helperText="Vision statement displayed in the Left Column."
              required
            />

            <FormField
              label="Our Mission Statement"
              id="mission-text"
              name="mission.text"
              type="textarea"
              rows={4}
              defaultValue={initialSettings["mission.text"]}
              helperText="Mission statement displayed in the Left Column."
              required
            />
          </div>

          {/* Graphic Uploads for Right Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* 3E Graphic */}
            <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#17324D]">
                1. Educate • Empower • Enable Graphic
              </span>
              <p className="text-xs text-[#61758A]">
                The official 3E Triad graphic placeholder on the landing page right column.
              </p>

              {triadGraphicUrl ? (
                <div className="p-3 bg-white rounded-lg border border-[#D7E8F5] flex items-center justify-center max-h-36 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={triadGraphicUrl}
                    alt="3E graphic preview"
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="p-4 bg-[#003A6B] text-white rounded-lg text-center text-xs">
                  <span className="font-bold text-[#D4A737] block">3E Triad Graphic</span>
                  <span className="text-[11px] text-[#D7E8F5]">[Placeholder Active]</span>
                </div>
              )}

              <FileUploadWidget
                label="Upload 3E Graphic"
                category="general"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                value={triadGraphicUrl}
                onChange={(url) => setTriadGraphicUrl(url)}
                helperText="Upload transparent PNG, SVG, or high-res JPG."
              />
              <input type="hidden" name="media.triadGraphicUrl" value={triadGraphicUrl} />
            </div>

            {/* UN SDG Graphic */}
            <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#17324D]">
                2. Circular UN SDGs Graphic
              </span>
              <p className="text-xs text-[#61758A]">
                Official 17 UN Sustainable Development Goals circular color-wheel graphic.
              </p>

              {sdgGraphicUrl ? (
                <div className="p-3 bg-white rounded-lg border border-[#D7E8F5] flex items-center justify-center max-h-36 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sdgGraphicUrl}
                    alt="SDG graphic preview"
                    className="max-h-32 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="p-4 bg-white border border-dashed border-[#005596] rounded-lg text-center text-xs">
                  <span className="font-bold text-[#005596] block">Circular 17 UN SDGs Wheel</span>
                  <span className="text-[11px] text-[#61758A]">[Placeholder Active]</span>
                </div>
              )}

              <FileUploadWidget
                label="Upload SDG Circular Graphic"
                category="general"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                value={sdgGraphicUrl}
                onChange={(url) => setSdgGraphicUrl(url)}
                helperText="Upload transparent PNG or SVG circular wheel."
              />
              <input type="hidden" name="media.sdgGraphicUrl" value={sdgGraphicUrl} />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 5: Events, Madurai Invitation & Council */}
        {/* ================================================================ */}
        <div className={activeTab === "events" ? "space-y-6 block" : "hidden"}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
                Events, Madurai Invitation &amp; Governance Assembly
              </h3>
              <p className="text-xs text-[#61758A] mt-1">
                Manage the Madurai Meeting Invitation artwork, 4 event highlights, and Annual National Council Assembly content.
              </p>
            </div>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E8F3FC] text-[#005596] hover:bg-[#D7E8F5] transition-colors shrink-0"
            >
              <span>Manage All Events (/admin/events)</span>
              <ExternalLinkIcon size={14} />
            </Link>
          </div>

          {/* Madurai Meeting Invitation Section */}
          <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              Madurai Meeting Invitation Artwork (Full Calendar Page)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative w-44 aspect-[3/4] rounded-2xl bg-gradient-to-b from-[#003A6B] to-[#001E38] p-3 shadow-md border-2 border-[#D4A737] overflow-hidden flex flex-col items-center justify-center text-white text-center">
                  {maduraiInvitationUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={maduraiInvitationUrl}
                      alt="Madurai invitation preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-[#D4A737] flex items-center justify-center font-serif text-sm font-bold text-[#D4A737] mx-auto">
                        SI
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A737] block">
                        Madurai Invitation
                      </span>
                      <p className="text-[9px] text-[#D7E8F5]">[Placeholder Active]</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <FileUploadWidget
                  label="Upload Official Madurai Invitation Image"
                  category="events"
                  accept="image/jpeg,image/png,image/webp,image/pdf"
                  value={maduraiInvitationUrl}
                  onChange={(url) => setMaduraiInvitationUrl(url)}
                  helperText="Upload official invitation card or poster. Proportions are preserved without cropping."
                />
                <input type="hidden" name="event.maduraiInvitationUrl" value={maduraiInvitationUrl} />

                <div>
                  <label htmlFor="event-madurai-url-direct" className="block text-xs font-medium text-[#17324D] mb-1">
                    Or Enter Asset URL Directly:
                  </label>
                  <input
                    id="event-madurai-url-direct"
                    type="text"
                    value={maduraiInvitationUrl}
                    onChange={(e) => setMaduraiInvitationUrl(e.target.value)}
                    placeholder="/images/events/madurai-meeting-invitation.jpg"
                    className="w-full px-3 py-2 text-xs font-mono border border-[#D7E8F5] rounded-lg bg-white text-[#17324D] focus:outline-none focus:border-[#005596]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4 Event Highlights */}
          <div className="space-y-3 p-5 rounded-xl bg-white border border-[#D7E8F5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              Event Highlights (Italic Bullet Points)
            </h4>
            <p className="text-xs text-[#61758A]">
              Displayed on the right column of the Madurai Gathering block on the Full Calendar page.
            </p>

            <FormField
              label="Highlight 1 (Installation Ceremony)"
              id="event-h1"
              name="event.maduraiHighlight1"
              defaultValue={initialSettings["event.maduraiHighlight1"]}
              required
            />
            <FormField
              label="Highlight 2 (Executive Deliberations)"
              id="event-h2"
              name="event.maduraiHighlight2"
              defaultValue={initialSettings["event.maduraiHighlight2"]}
              required
            />
            <FormField
              label="Highlight 3 (Programme Action & SDGs)"
              id="event-h3"
              name="event.maduraiHighlight3"
              defaultValue={initialSettings["event.maduraiHighlight3"]}
              required
            />
            <FormField
              label="Highlight 4 (Delegation Fellowship & Banquet)"
              id="event-h4"
              name="event.maduraiHighlight4"
              defaultValue={initialSettings["event.maduraiHighlight4"]}
              required
            />
          </div>

          {/* Annual National Council */}
          <div className="space-y-3 p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              Annual National Council Assembly
            </h4>
            <FormField
              label="Section Heading"
              id="council-title"
              name="council.title"
              defaultValue={initialSettings["council.title"] || "Annual National Council Assembly"}
              required
            />
            <FormField
              label="Governance Forum Description"
              id="council-desc"
              name="council.description"
              type="textarea"
              rows={3}
              defaultValue={initialSettings["council.description"]}
              required
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 6: Clubs & Governance */}
        {/* ================================================================ */}
        <div className={activeTab === "governance" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Clubs Directory, Map Coordinates &amp; National Committee
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Quick access to dedicated modules for managing all 19 SI clubs, map coordinates, board portfolios, and international federation networks.
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-3">
              <span className="text-xs uppercase font-semibold text-[#005596] block">
                SI Clubs &amp; Interactive Map Module
              </span>
              <h4 className="font-serif font-bold text-base text-[#17324D]">
                19 Chartered Clubs Directory &amp; Coordinates
              </h4>
              <p className="text-xs text-[#61758A] leading-relaxed">
                Manage club names, chronological 1–19 numbering, charter dates, executive contacts, and interactive India map coordinates.
              </p>
              <Link
                href="/admin/clubs"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#005596] text-white hover:bg-[#003A6B] transition-colors"
              >
                <span>Open Clubs Management (/admin/clubs)</span>
                <ExternalLinkIcon size={14} />
              </Link>
            </div>

            <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-3">
              <span className="text-xs uppercase font-semibold text-[#005596] block">
                National Board &amp; Leadership Module
              </span>
              <h4 className="font-serif font-bold text-base text-[#17324D]">
                NASI India Board: 2026–2028
              </h4>
              <p className="text-xs text-[#61758A] leading-relaxed">
                Manage board member portfolios, elected volunteer leaders, portrait photographs, official titles, and club affiliations.
              </p>
              <Link
                href="/admin/committee"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#005596] text-white hover:bg-[#003A6B] transition-colors"
              >
                <span>Open Committee Management (/admin/committee)</span>
                <ExternalLinkIcon size={14} />
              </Link>
            </div>
          </div>

          {/* Federation Networks List Configuration */}
          <div className="p-5 rounded-xl bg-white border border-[#D7E8F5] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              Worldwide Federation Networks List
            </h4>
            <p className="text-xs text-[#61758A]">
              Displayed vertically in the Soroptimist International Affiliation block on the homepage. Enter one federation per line.
            </p>
            <FormField
              label="Federations (One per line)"
              id="federation-items"
              name="federation.itemsText"
              type="textarea"
              rows={6}
              defaultValue={initialSettings["federation.itemsText"]}
              helperText="E.g.: Soroptimist International Great Britain & Ireland (SIGBI)"
              required
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* TAB 7: Secretariat Contact & Secretary Email */}
        {/* ================================================================ */}
        <div className={activeTab === "contact" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Secretariat Contact Information
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Configure official Secretariat communication channels including the primary Secretary email address.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
              Official Secretary Email (Footer &amp; Inquiries)
            </h4>
            <FormField
              label="Official Secretary Email Address"
              id="contact-secretary-email"
              name="contact.secretaryEmail"
              type="email"
              defaultValue={initialSettings["contact.secretaryEmail"] || "secretary@nasi-india.org"}
              helperText="Official address rendered in the footer with mailto functionality."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="General Secretariat Email"
              id="contact-email"
              name="contact.email"
              type="email"
              defaultValue={initialSettings["contact.email"]}
              required
            />
            <FormField
              label="Secretariat Helpline Phone"
              id="contact-phone"
              name="contact.phone"
              defaultValue={initialSettings["contact.phone"]}
              required
            />
          </div>

          <FormField
            label="National Office Postal Address"
            id="contact-address"
            name="contact.address"
            type="textarea"
            rows={3}
            defaultValue={initialSettings["contact.address"]}
            required
          />
        </div>

        {/* ================================================================ */}
        {/* TAB 8: Footer, Legal & Social Links */}
        {/* ================================================================ */}
        <div className={activeTab === "footer" ? "space-y-6 block" : "hidden"}>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Footer Compliance &amp; Social Links
            </h3>
            <p className="text-xs text-[#61758A] mt-1">
              Configure social channels, copyright notices, and legal declarations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Facebook URL"
              id="social-fb"
              name="social.facebook"
              type="url"
              defaultValue={initialSettings["social.facebook"]}
            />
            <FormField
              label="Twitter / X URL"
              id="social-tw"
              name="social.twitter"
              type="url"
              defaultValue={initialSettings["social.twitter"]}
            />
            <FormField
              label="Instagram URL"
              id="social-ig"
              name="social.instagram"
              type="url"
              defaultValue={initialSettings["social.instagram"]}
            />
            <FormField
              label="LinkedIn URL"
              id="social-li"
              name="social.linkedin"
              type="url"
              defaultValue={initialSettings["social.linkedin"]}
            />
          </div>
          <FormField
            label="YouTube Channel URL"
            id="social-yt"
            name="social.youtube"
            type="url"
            defaultValue={initialSettings["social.youtube"]}
          />

          <div className="pt-4 border-t border-[#D7E8F5] space-y-4">
            <FormField
              label="Copyright Statement"
              id="footer-copy"
              name="footer.copyright"
              defaultValue={initialSettings["footer.copyright"]}
              required
            />
            <FormField
              label="Legal / Federation Status Note"
              id="footer-reg"
              name="footer.registration"
              defaultValue={initialSettings["footer.registration"]}
              required
            />
          </div>
        </div>

        {/* Submit Controls (Visible across all tabs) */}
        <div className="pt-6 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2 text-xs text-forest-700">
            <SparklesIcon size={16} className="text-[#005596] shrink-0" />
            <span>All modifications synchronize immediately to the public portal.</span>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="w-full sm:w-auto bg-[#005596] hover:bg-[#004780] text-white"
          >
            {isPending ? "Saving All Settings..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}
