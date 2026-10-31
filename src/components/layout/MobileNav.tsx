"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { XIcon, ChevronRightIcon, MailIcon, PhoneIcon } from "../icons";
import { Button } from "../ui/Button";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close when pathname actually changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Handle ESC key and focus management
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-sand-50 border-l border-sand-300 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-sand-200 flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-forest-950">
              {siteConfig.name}
            </span>
            <span className="text-xs text-forest-700">Navigation Menu</span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg text-forest-800 hover:text-forest-950 hover:bg-sand-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-700"
          >
            <XIcon size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Mobile Navigation" className="p-4 flex-1">
          <ul className="space-y-1.5">
            {siteConfig.navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-forest-800 text-white shadow-xs"
                        : "text-forest-900 hover:bg-sand-200/70"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <ChevronRightIcon
                      size={16}
                      className={isActive ? "text-teal-200" : "text-forest-400"}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-sand-200 flex flex-col gap-2.5">
            <Button
              href="/clubs"
              variant="outline"
              size="md"
              className="w-full justify-center"
            >
              Explore Our Clubs
            </Button>
            <Button
              href="/join"
              variant="primary"
              size="md"
              className="w-full justify-center"
            >
              Join SI Today
            </Button>
          </div>
        </nav>

        {/* Drawer Footer with Quick Contact */}
        <div className="p-5 border-t border-sand-200 bg-white/70 text-xs text-forest-800 space-y-2">
          <p className="font-semibold text-forest-950">NASI India Secretariat</p>
          <div className="flex items-center gap-2 text-forest-700">
            <MailIcon size={14} />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-forest-950 underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-forest-700">
            <PhoneIcon size={14} />
            <span>{siteConfig.contact.phone}</span>
          </div>
          <p className="text-[11px] text-forest-600 pt-2 border-t border-sand-200">
            Phase 1 Foundation • Soroptimist International of India
          </p>
        </div>
      </div>
    </div>
  );
}
