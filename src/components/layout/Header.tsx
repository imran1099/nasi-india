"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { MenuIcon } from "../icons";
import { Button } from "../ui/Button";

export interface HeaderProps {
  logoUrl?: string;
}

export function Header({ logoUrl }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Accessible skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Banner / Organization Banner */}
      <div className="bg-[#002D54] text-white text-xs py-2 px-4 border-b border-[#001E38] shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A737] animate-pulse" />
            <p className="text-[#F4FAFF] font-medium tracking-wide">
              Soroptimist International of India • National Association
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#D7E8F5]">
            <span className="text-[11px] uppercase tracking-wider text-[#E8F3FC] font-medium">
              A Global Voice for Women
            </span>
            <span aria-hidden="true" className="text-[#004780]">•</span>
            <a
              href={siteConfig.internationalAffiliation.globalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F4FAFF] hover:text-[#D4A737] transition-colors inline-flex items-center gap-1 font-medium"
            >
              Soroptimist International Global &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D7E8F5] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 py-1.5 sm:py-2">
            {/* Logo Area (Configurable) */}
            <div className="shrink-0">
              <Logo imageUrl={logoUrl} />
            </div>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-1 xl:gap-1.5"
            >
              {siteConfig.navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 text-sm rounded-lg transition-all duration-150 ${
                      isActive
                        ? "text-[#005596] font-semibold bg-[#E8F3FC] border border-[#D7E8F5] shadow-2xs"
                        : "text-[#17324D] font-medium hover:text-[#005596] hover:bg-[#F4FAFF]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#005596] rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs & Mobile Menu Button */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  href="/clubs"
                  variant="ghost"
                  size="sm"
                  className="hidden xl:inline-flex text-[#17324D] hover:text-[#005596] hover:bg-[#E8F3FC]"
                >
                  Find a Club
                </Button>
                <Button
                  href="/join"
                  variant="primary"
                  size="sm"
                  className="hidden md:inline-flex bg-[#005596] hover:bg-[#004780] text-white shadow-xs"
                >
                  Join SI Today
                </Button>
              </div>

              {/* Mobile menu trigger */}
              <button
                id="mobile-menu-trigger"
                type="button"
                onClick={handleOpenMobileMenu}
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className="lg:hidden p-2.5 rounded-lg text-[#005596] hover:bg-[#E8F3FC] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596] transition-colors cursor-pointer border border-transparent hover:border-[#D7E8F5]"
              >
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
      />
    </>
  );
}
