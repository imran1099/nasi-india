"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { MailIcon, MapPinIcon } from "../icons";

export interface FooterProps {
  logoUrl?: string;
}

export function Footer({ logoUrl }: FooterProps) {
  const pathname = usePathname();
  const currentYear = siteConfig.copyrightYear;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#001E38] text-white border-t border-[#002D54] mt-auto">
      {/* Upper Footer: Branding, Navigation Columns, Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Organization Branding (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo isFooter imageUrl={logoUrl} />
            <p className="text-sm text-[#D7E8F5] leading-relaxed max-w-sm pt-2">
              {siteConfig.description}
            </p>
          </div>

          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E8F3FC] font-sans">
              Organization
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  About NASI India
                </Link>
              </li>
              <li>
                <Link
                  href="/committee"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  National Committee
                </Link>
              </li>
              <li>
                <Link
                  href="/clubs"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  NASI India Clubs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Resources (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E8F3FC] font-sans">
              Engage & Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/news"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  News & Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  National Events
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  Soroptimist Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-[#E8F3FC] hover:text-white transition-colors font-medium"
                >
                  Join SI Today
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#D7E8F5] hover:text-white transition-colors"
                >
                  Contact Secretariat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Secretariat Contact & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E8F3FC] font-sans">
              Secretariat Contact
            </h3>
            <p className="text-xs text-[#aed1ef]">
              Soroptimist International of India
            </p>

            <div className="space-y-3 text-xs text-[#D7E8F5]">
              {/* Official Secretary Email */}
              <div className="flex items-center gap-2.5">
                <MailIcon size={16} className="text-[#aed1ef] shrink-0" />
                <a
                  href="mailto:secretary@nasi-india.org"
                  className="text-[#E8F3FC] hover:text-white underline font-medium"
                >
                  secretary@nasi-india.org
                </a>
              </div>

              {/* Official Address Placeholder until NASI supplies the address */}
              <div className="flex items-start gap-2.5 pt-1">
                <MapPinIcon size={16} className="text-[#aed1ef] shrink-0 mt-0.5" />
                <span className="text-[#D7E8F5]/80 italic">
                  [Official Secretariat postal address will be updated once supplied by NASI India]
                </span>
              </div>
            </div>

            {/* Social link placeholders */}
            <div className="pt-3">
              <span className="text-xs uppercase tracking-wider text-[#E8F3FC] block mb-2">
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
                    className="px-2.5 py-1 text-xs rounded-md bg-[#002D54] border border-[#003A6B] text-[#D7E8F5] hover:text-white hover:bg-[#003A6B] transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer: Legal & Copyright */}
      <div className="border-t border-[#002D54] bg-[#00172B] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D7E8F5]/80 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <p>
              &copy; {currentYear} {siteConfig.name} ({siteConfig.contact.organizationName}). All rights reserved.
            </p>
            <span aria-hidden="true" className="hidden sm:inline text-[#003A6B]">•</span>
            <Link href="/privacy" className="text-[#D7E8F5] hover:text-white underline">
              Privacy Policy
            </Link>
          </div>

          <p className="text-[11px] text-[#aed1ef]">
            National Association of Soroptimist International of India
          </p>
        </div>
      </div>
    </footer>
  );
}
