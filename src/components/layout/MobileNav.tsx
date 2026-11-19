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

        {/* Navigation Links - Lemon Yellow Tabs with Blue Lettering */}
        <nav aria-label="Mobile Navigation" className="p-4 flex-1">
          <ul className="space-y-2">
            {siteConfig.navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors border ${
                      isActive
                        ? "bg-[#FDD835] text-[#002D54] border-2 border-[#005596] shadow-xs"
                        : "bg-[#FAEB57] text-[#003A6B] border-[#F0DC36] hover:bg-[#FDD835] hover:text-[#002D54]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <ChevronRightIcon
                      size={16}
                      className="text-[#003A6B]"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-[#D7E8F5] flex flex-col gap-2.5">
            <Button
              href="/clubs"
              size="md"
              className="w-full justify-center bg-[#FAEB57] text-[#003A6B] hover:bg-[#FDD835] hover:text-[#002D54] border border-[#F0DC36] font-bold shadow-2xs"
            >
              Explore Our Clubs
            </Button>
            <Button
              href="/join"
              size="md"
              className="w-full justify-center bg-[#005596] text-[#FAEB57] hover:bg-[#003A6B] border border-[#FAEB57] font-bold shadow-xs"
            >
              Join SI Today
            </Button>
          </div>
        </nav>

        {/* Drawer Footer with Quick Contact */}
        <div className="p-5 border-t border-[#D7E8F5] bg-white text-xs text-[#17324D] space-y-2">
          <p className="font-semibold text-[#17324D]">NASI-India Secretariat</p>
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
          <p className="text-[11px] text-[#005596] font-semibold pt-2 border-t border-[#D7E8F5]">
            NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India)
          </p>
        </div>
      </div>
    </div>
  );
}
