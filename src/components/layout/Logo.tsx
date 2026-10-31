import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export interface LogoProps {
  className?: string;
  isFooter?: boolean;
}

/**
 * Configurable Logo Component
 * 
 * IMPORTANT: To update the logo once the official Soroptimist International of India
 * emblem is uploaded through the future admin panel, update the `logo` object in
 * `@/config/site` with `type: "image"` and the image path.
 * 
 * In this foundation phase, a clean typographical brand mark is rendered without
 * fabricating an unauthorized emblem.
 */
export function Logo({ className = "", isFooter = false }: LogoProps) {
  const { logo } = siteConfig;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} - Return to homepage`}
      className={`inline-flex items-center gap-3 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-700 rounded-lg p-1 -m-1 transition-opacity hover:opacity-95 ${className}`}
    >
      {logo.type === "image" && logo.imageUrl ? (
        <div className="relative h-11 w-auto min-w-[120px]">
          <Image
            src={logo.imageUrl}
            alt={logo.altText}
            fill
            className="object-contain"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Refined emblem mark */}
          <div
            className={`relative flex items-center justify-center font-serif font-bold text-base rounded-xl transition-all duration-200 group-hover:shadow-md shrink-0 ${
              isFooter
                ? "w-11 h-11 bg-gradient-to-br from-forest-800 to-forest-900 text-teal-200 border border-teal-500/30 shadow-inner"
                : "w-11 h-11 bg-gradient-to-br from-forest-900 via-forest-950 to-teal-950 text-white border border-forest-800/80 shadow-xs"
            }`}
            aria-hidden="true"
          >
            <span className="tracking-wider">SI</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-500 border border-white/80 shadow-2xs" />
          </div>

          {/* Typographical Brand Name */}
          <div className="flex flex-col">
            <span
              className={`font-serif font-bold tracking-tight text-lg sm:text-xl leading-none ${
                isFooter ? "text-white" : "text-forest-950"
              }`}
            >
              {logo.text}
            </span>
            {logo.subtext && (
              <span
                className={`text-[10.5px] font-semibold tracking-wider uppercase mt-1 ${
                  isFooter ? "text-teal-300" : "text-teal-700"
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
