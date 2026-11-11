"use client";

import React from "react";
import Link from "next/link";

export function LandingPageStrapline() {
  return (
    <aside
      aria-label="Standing Up for Girls Campaign"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 pointer-events-auto"
    >
      <Link
        href="/about"
        className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 backdrop-blur-md border border-[#D7E8F5] shadow-lg hover:shadow-xl hover:border-[#005596] transition-all duration-200 cursor-pointer active:scale-98"
      >
        <span className="w-2 h-2 rounded-full bg-[#005596] animate-pulse" />
        <span className="text-xs sm:text-sm font-bold text-[#17324D] tracking-wide">
          Standing Up for Girls
        </span>

        {/* Dedicated Yellow Arrow Graphic */}
        <span
          className="w-6 h-6 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] group-hover:translate-x-1 transition-transform duration-200 shrink-0"
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D97706"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </Link>
    </aside>
  );
}

