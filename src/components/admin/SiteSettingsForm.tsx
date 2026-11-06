"use client";

import React, { useActionState, useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CheckCircleIcon } from "@/components/icons";
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
  const [activeTab, setActiveTab] = useState<"branding" | "contact" | "social" | "home" | "footer">("branding");

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

  const isSuccess = state?.success === true;

  const tabs = [
    { id: "branding", label: "Branding & Identity" },
    { id: "contact", label: "Secretariat Contact" },
    { id: "social", label: "Social Media Links" },
    { id: "home", label: "Homepage Banner & Copy" },
    { id: "footer", label: "Footer & Legal" },
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
      <div className="border-b border-sand-200 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.id
                ? "border-forest-900 text-forest-950 bg-white"
                : "border-transparent text-forest-600 hover:text-forest-950 hover:bg-sand-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 rounded-xl border border-sand-200 space-y-6 shadow-xs">
        {/* Tab: Branding */}
        {activeTab === "branding" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
                Brand Identity & Logo Configuration
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
                    Website Logo (Header & Footer)
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
        )}

        {/* Tab: Secretariat Contact */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-800">
              Secretariat Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Secretariat Official Email"
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
        )}

        {/* Tab: Social Links */}
        {activeTab === "social" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-800">
              Federation & Social Portals
            </h3>
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
          </div>
        )}

        {/* Tab: Homepage Banner & Copy */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
                Homepage Main Banner (Reference Design)
              </h3>
              <p className="text-xs text-[#61758A] mt-1">
                Customize the banner headline, subtext, call-to-action buttons, and images displayed on the homepage.
              </p>
            </div>

            {/* Banner Text Fields */}
            <div className="space-y-4 p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
                Banner Copy & Typography
              </h4>

              <FormField
                label="Hero Main Headline"
                id="home-title"
                name="home.heroTitle"
                defaultValue={initialSettings["home.heroTitle"] || "Standing up for women and girls"}
                helperText="Bold title displayed in the primary blue banner section."
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
                  "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and unshakeably committed to change."
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
                  helperText="Prominent pill-shaped button (e.g. 'Our Impact')."
                />

                <FormField
                  label="Primary CTA Destination Link"
                  id="home-cta-url"
                  name="home.heroCtaUrl"
                  defaultValue={initialSettings["home.heroCtaUrl"] || "/about"}
                  helperText="Path or external link (e.g. /about, /clubs)."
                />

                <FormField
                  label="Secondary CTA Button Label"
                  id="home-sec-cta-text"
                  name="home.heroSecondaryCtaText"
                  defaultValue={initialSettings["home.heroSecondaryCtaText"] || "Become a member"}
                  helperText="Secondary button (e.g. 'Become a member' or 'Explore Our Clubs')."
                />

                <FormField
                  label="Secondary CTA Destination Link"
                  id="home-sec-cta-url"
                  name="home.heroSecondaryCtaUrl"
                  defaultValue={initialSettings["home.heroSecondaryCtaUrl"] || "/join"}
                  helperText="Destination link for secondary action."
                />
              </div>

              <FormField
                label="Top Banner Announcement Bar (Optional)"
                id="home-ann"
                name="home.announcement"
                defaultValue={initialSettings["home.announcement"] || ""}
                helperText="Optional announcement text displayed in the header banner."
              />
            </div>

            {/* Banner Images Management */}
            <div className="space-y-5 p-5 rounded-xl bg-white border border-[#D7E8F5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17324D]">
                    Homepage Banner Photography
                  </h4>
                  <p className="text-xs text-[#61758A] mt-0.5">
                    Upload, replace, or preview the photographs featured on the right side of the homepage banner.
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

              {/* Image 1: Left-Facing Portrait */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5]">
                <div className="md:col-span-3">
                  <span className="block text-xs font-semibold text-[#17324D] mb-1.5">
                    Image 1 (Left-Facing Portrait)
                  </span>
                  <div className="relative aspect-3/4 rounded-lg overflow-hidden border border-[#D7E8F5] bg-white shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageLeft}
                      alt="Left-facing banner preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="md:col-span-9 flex flex-col justify-between space-y-3">
                  <div>
                    <FileUploadWidget
                      label="Upload New Image 1"
                      category="general"
                      accept="image/jpeg,image/png,image/webp"
                      value={imageLeft}
                      onChange={(url) => setImageLeft(url)}
                      helperText="Upload a high-resolution JPG or WebP photograph. File is safely stored and optimized."
                    />
                    <input type="hidden" name="home.heroImageLeft" value={imageLeft} />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageLeft("/images/banner/hero-woman-facing-left.jpg")}
                      className="text-[#005596] hover:underline cursor-pointer"
                    >
                      Reset to provided left-facing image
                    </button>
                  </div>
                </div>
              </div>

              {/* Image 2: Right-Facing Portrait */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5]">
                <div className="md:col-span-3">
                  <span className="block text-xs font-semibold text-[#17324D] mb-1.5">
                    Image 2 (Right-Facing Portrait)
                  </span>
                  <div className="relative aspect-3/4 rounded-lg overflow-hidden border border-[#D7E8F5] bg-white shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageRight}
                      alt="Right-facing banner preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="md:col-span-9 flex flex-col justify-between space-y-3">
                  <div>
                    <FileUploadWidget
                      label="Upload New Image 2"
                      category="general"
                      accept="image/jpeg,image/png,image/webp"
                      value={imageRight}
                      onChange={(url) => setImageRight(url)}
                      helperText="Upload a high-resolution JPG or WebP photograph."
                    />
                    <input type="hidden" name="home.heroImageRight" value={imageRight} />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setImageRight("/images/banner/hero-woman-facing-right.jpg")}
                      className="text-[#005596] hover:underline cursor-pointer"
                    >
                      Reset to provided right-facing image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Footer & Legal */}
        {activeTab === "footer" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-800">
              Footer & Compliance Information
            </h3>
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
        )}

        {/* Hidden inputs to preserve other tabs values on submission */}
        {activeTab !== "branding" && (
          <>
            <input type="hidden" name="site.name" value={initialSettings["site.name"]} />
            <input type="hidden" name="site.shortName" value={initialSettings["site.shortName"]} />
            <input type="hidden" name="site.tagline" value={initialSettings["site.tagline"]} />
            <input type="hidden" name="site.logoUrl" value={initialSettings["site.logoUrl"]} />
          </>
        )}
        {activeTab !== "contact" && (
          <>
            <input type="hidden" name="contact.email" value={initialSettings["contact.email"]} />
            <input type="hidden" name="contact.phone" value={initialSettings["contact.phone"]} />
            <input type="hidden" name="contact.address" value={initialSettings["contact.address"]} />
          </>
        )}
        {activeTab !== "social" && (
          <>
            <input type="hidden" name="social.facebook" value={initialSettings["social.facebook"]} />
            <input type="hidden" name="social.twitter" value={initialSettings["social.twitter"]} />
            <input type="hidden" name="social.instagram" value={initialSettings["social.instagram"]} />
            <input type="hidden" name="social.linkedin" value={initialSettings["social.linkedin"]} />
            <input type="hidden" name="social.youtube" value={initialSettings["social.youtube"]} />
          </>
        )}
        {activeTab !== "home" && (
          <>
            <input type="hidden" name="home.heroTitle" value={initialSettings["home.heroTitle"]} />
            <input type="hidden" name="home.heroSubtitle" value={initialSettings["home.heroSubtitle"]} />
            <input type="hidden" name="home.announcement" value={initialSettings["home.announcement"]} />
          </>
        )}
        {activeTab !== "footer" && (
          <>
            <input type="hidden" name="footer.copyright" value={initialSettings["footer.copyright"]} />
            <input type="hidden" name="footer.registration" value={initialSettings["footer.registration"]} />
          </>
        )}

        <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
          <span className="text-xs text-forest-600">
            All modifications will immediately synchronize to the national portal.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
          >
            {isPending ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </form>
  );
}
