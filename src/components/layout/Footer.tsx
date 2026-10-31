"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { MailIcon, PhoneIcon, MapPinIcon, ExternalLinkIcon } from "../icons";

export function Footer() {
  const pathname = usePathname();
  const currentYear = siteConfig.copyrightYear;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-forest-950 text-sand-100 border-t border-forest-900 mt-auto">
      {/* Upper Footer: Branding, Navigation Columns, Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Organization Branding (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo isFooter />
            <p className="text-sm text-sand-300 leading-relaxed max-w-sm pt-2">
              {siteConfig.description}
            </p>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-300 block mb-2">
                Affiliation
              </span>
              <p className="text-xs text-sand-300/80 leading-relaxed">
                National Association of Soroptimist International of India.
                Chartered under{" "}
                <a
                  href={siteConfig.internationalAffiliation.globalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-200 hover:text-white underline inline-flex items-center gap-1"
                >
                  Soroptimist International
                  <ExternalLinkIcon size={12} />
                </a>
                .
              </p>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-300 font-sans">
              Organization
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  About NASI India
                </Link>
              </li>
              <li>
                <Link
                  href="/committee"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  National Committee
                </Link>
              </li>
              <li>
                <Link
                  href="/clubs"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  NASI India Clubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Resources (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-300 font-sans">
              Engage & Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/news"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  News & Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  National Events
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  Soroptimist Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-sand-300 hover:text-white transition-colors font-medium text-teal-300"
                >
                  Join SI Today
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sand-300 hover:text-white transition-colors"
                >
                  Contact Secretariat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Placeholder & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-300 font-sans">
              Secretariat Contact
            </h3>
            <p className="text-xs text-sand-400">
              Configurable placeholder contact info:
            </p>

            <div className="space-y-2.5 text-xs text-sand-300">
              <div className="flex items-start gap-2.5">
                <MapPinIcon size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {siteConfig.contact.addressLines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <MailIcon size={16} className="text-teal-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sand-200 hover:text-white underline"
                >
                  {siteConfig.contact.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <PhoneIcon size={16} className="text-teal-400 shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </div>
            </div>

            {/* Social link placeholders */}
            <div className="pt-3">
              <span className="text-xs uppercase tracking-wider text-teal-300 block mb-2">
                Connect With Us
              </span>
              <div className="flex flex-wrap gap-2">
                {siteConfig.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    aria-label={social.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 text-xs rounded-md bg-forest-900 border border-forest-800 text-sand-200 hover:text-white hover:bg-forest-800 transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer: Legal & Phase 2 Info */}
      <div className="border-t border-forest-900/80 bg-forest-950/90 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-400 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>
              &copy; {currentYear} {siteConfig.name} ({siteConfig.contact.organizationName}). All rights reserved.
            </p>
            <span aria-hidden="true" className="hidden sm:inline text-forest-700">•</span>
            <Link href="/privacy" className="text-sand-300 hover:text-white underline">
              Privacy Policy
            </Link>
          </div>

          <p className="text-[11px] text-sand-500">
            Phase 2: Complete Public Website UI • Sample Content & Functional Layouts
          </p>
        </div>
      </div>
    </footer>
  );
}
