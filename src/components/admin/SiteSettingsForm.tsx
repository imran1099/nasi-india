"use client";

import React, { useActionState, useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CheckCircleIcon } from "@/components/icons";
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

  const isSuccess = state?.success === true;

  const tabs = [
    { id: "branding", label: "Branding & Identity" },
    { id: "contact", label: "Secretariat Contact" },
    { id: "social", label: "Social Media Links" },
    { id: "home", label: "Homepage Copy" },
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
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-800">
              Brand Identity & Logo
            </h3>
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
            <FormField
              label="Header Logo Asset Path / URL"
              id="site-logourl"
              name="site.logoUrl"
              defaultValue={initialSettings["site.logoUrl"]}
              placeholder="/images/logo.png"
              required
            />
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

        {/* Tab: Homepage Copy */}
        {activeTab === "home" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-800">
              Homepage Content & Announcements
            </h3>
            <FormField
              label="Hero Main Headline"
              id="home-title"
              name="home.heroTitle"
              defaultValue={initialSettings["home.heroTitle"]}
              required
            />
            <FormField
              label="Hero Subtitle / Description"
              id="home-sub"
              name="home.heroSubtitle"
              type="textarea"
              rows={3}
              defaultValue={initialSettings["home.heroSubtitle"]}
              required
            />
            <FormField
              label="Top Banner Announcement"
              id="home-ann"
              name="home.announcement"
              defaultValue={initialSettings["home.announcement"]}
            />
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
