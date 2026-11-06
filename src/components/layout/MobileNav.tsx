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
        className="fixed inset-0 bg-[#001E38]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#F4FAFF] border-l border-[#D7E8F5] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#D7E8F5] flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-[#17324D]">
              {siteConfig.name}
            </span>
            <span className="text-xs text-[#61758A]">Navigation Menu</span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg text-[#17324D] hover:text-[#005596] hover:bg-[#E8F3FC] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596]"
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
                        ? "bg-[#005596] text-white shadow-xs font-semibold"
                        : "text-[#17324D] hover:bg-[#E8F3FC]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <ChevronRightIcon
                      size={16}
                      className={isActive ? "text-[#E8F3FC]" : "text-[#61758A]"}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-[#D7E8F5] flex flex-col gap-2.5">
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
              className="w-full justify-center bg-[#005596] text-white hover:bg-[#004780]"
            >
              Join SI Today
            </Button>
          </div>
        </nav>

        {/* Drawer Footer with Quick Contact */}
        <div className="p-5 border-t border-[#D7E8F5] bg-white text-xs text-[#17324D] space-y-2">
          <p className="font-semibold text-[#17324D]">NASI India Secretariat</p>
          <div className="flex items-center gap-2 text-[#61758A]">
            <MailIcon size={14} />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-[#005596] underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-[#61758A]">
            <PhoneIcon size={14} />
            <span>{siteConfig.contact.phone}</span>
          </div>
          <p className="text-[11px] text-[#61758A] pt-2 border-t border-[#D7E8F5]">
            Soroptimist International of India • National Association
          </p>
        </div>
      </div>
    </div>
  );
}
