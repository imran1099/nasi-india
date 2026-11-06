import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export interface LogoProps {
  className?: string;
  isFooter?: boolean;
  imageUrl?: string;
}

/**
 * Configurable Logo Component
 * 
 * Renders the official Soroptimist International of India emblem with
 * support for dynamic logo URLs uploaded via the admin panel, with graceful
 * fallback to typographical brand styling.
 */
export function Logo({ className = "", isFooter = false, imageUrl }: LogoProps) {
  const { logo } = siteConfig;

  // Determine active logo image
  const activeImage =
    imageUrl || (isFooter ? logo.footerImageUrl || logo.imageUrl : logo.imageUrl);

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} - Return to homepage`}
      className={`inline-flex items-center gap-3 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596] rounded-lg p-1 -m-1 transition-opacity hover:opacity-95 ${className}`}
    >
      {activeImage ? (
        <div className="relative h-14 sm:h-16 lg:h-18 w-auto min-w-[140px] max-w-[340px] flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={logo.altText}
            className={
              isFooter && !activeImage.endsWith("-white.svg")
                ? "bg-white/95 rounded-xl p-2 shadow-xs h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                : isFooter
                  ? "h-12 sm:h-14 lg:h-16 w-auto object-contain"
                  : "h-13 sm:h-16 lg:h-18 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
            }
          />
        </div>
      ) : (
        <div className="flex items-center gap-3.5">
          {/* Refined prominent emblem mark */}
          <div
            className={`relative flex items-center justify-center font-serif font-bold text-lg sm:text-xl rounded-2xl transition-all duration-200 group-hover:shadow-md shrink-0 ${isFooter
                ? "w-13 h-13 sm:w-15 sm:h-15 bg-[#004780] text-white border border-white/20 shadow-inner"
                : "w-13 h-13 sm:w-15 sm:h-15 bg-[#005596] text-white border border-[#004780] shadow-xs"
              }`}
            aria-hidden="true"
          >
            <span className="tracking-wider">SI</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#d4a737] border-2 border-white shadow-2xs" />
          </div>

          {/* Typographical Brand Name */}
          <div className="flex flex-col">
            <span
              className={`font-serif font-bold tracking-tight text-xl sm:text-2xl leading-none ${isFooter ? "text-white" : "text-[#17324D]"
                }`}
            >
              {logo.text}
            </span>
            {logo.subtext && (
              <span
                className={`text-xs sm:text-[11.5px] font-semibold tracking-wider uppercase mt-1.5 ${isFooter ? "text-[#E8F3FC]" : "text-[#005596]"
                  }`}
              >
                {logo.subtext}
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
