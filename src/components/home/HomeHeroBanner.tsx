"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export interface HomeHeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  imageLeft?: string;
  imageRight?: string;
  displayMode?: string;
}

export function HomeHeroBanner({
  title = "National Association of Soroptimist India (NASI-India)",
  subtitle = "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change.",
  ctaText = "Our Impact",
  ctaUrl = "#vision-mission",
  secondaryCtaText = "Contact Us",
  secondaryCtaUrl = "/contact",
  imageLeft = "/images/banner/hero-woman-facing-left.jpg",
  imageRight = "/images/banner/hero-woman-facing-right.jpg",
  displayMode = "slideshow",
}: HomeHeroBannerProps) {
  // Normalize title and subtitle per Stage 1 requirements
  const displayTitle =
    title && title !== "Standing up for women and girls"
      ? title
      : "National Association of Soroptimist India (NASI-India)";

  const displaySubtitle = (
    subtitle ||
    "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change."
  )
    .replace(/unshakeably/gi, "totally");

  const displaySecondaryCtaText =
    secondaryCtaText === "Become a member" ? "Contact Us" : secondaryCtaText;
  const displaySecondaryCtaUrl =
    secondaryCtaUrl === "/join" ? "/contact" : secondaryCtaUrl;
  const displayCtaUrl = ctaUrl === "/about" ? "#vision-mission" : ctaUrl;
  // Collect available images
  const images = [
    {
      src: imageLeft || "/images/banner/hero-woman-facing-left.jpg",
      label: "Left-Facing Portrait",
      alt: "Soroptimist India Member in traditional golden attire with floral adornment",
    },
    {
      src: imageRight || "/images/banner/hero-woman-facing-right.jpg",
      label: "Right-Facing Portrait",
      alt: "Soroptimist India Member portrait profile",
    },
  ].filter((img) => Boolean(img.src));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Determine images to render based on displayMode
  const displayedImages =
    displayMode === "left"
      ? [images[0]].filter(Boolean)
      : displayMode === "right"
        ? [images[1] || images[0]].filter(Boolean)
        : images;

  // Auto-cycle between images if mode is slideshow
  useEffect(() => {
    if (displayMode !== "slideshow" || isPaused || displayedImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayedImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [displayMode, isPaused, displayedImages.length]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#005596]"
      aria-label="Homepage Main Banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] md:min-h-[580px] lg:min-h-[640px] items-stretch">
          {/* Left Content Area (7 cols on lg) - Solid Rich Primary Blue with Curved Divider */}
          <div className="lg:col-span-7 relative z-10 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12 sm:py-16 lg:py-24 text-white">
            <div className="max-w-2xl space-y-6">
              {/* Organization Tag / Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E8F3FC] text-xs sm:text-sm font-medium w-fit backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#24a0d8] animate-pulse" />
                <span>National Association of Soroptimist International of India</span>
              </div>

              {/* Main Headline (Replicating SIGBI reference design typography) */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                {displayTitle}
              </h1>

              {/* Supporting Description */}
              <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed font-normal max-w-xl">
                {displaySubtitle}
              </p>

              {/* Call to Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                {ctaText && (
                  <Link
                    href={displayCtaUrl || "#vision-mission"}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#24a0d8] hover:bg-[#1a8fc5] text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <span>{ctaText}</span>
                    <ArrowRightIcon size={16} className="ml-2" />
                  </Link>
                )}

                {displaySecondaryCtaText && (
                  <Link
                    href={displaySecondaryCtaUrl || "/contact"}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/40 font-semibold text-sm sm:text-base backdrop-blur-xs transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <span>{displaySecondaryCtaText}</span>
                  </Link>
                )}
              </div>

              {/* Trust credibility indicators */}
              <div className="pt-8 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-[#E8F3FC]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#24a0d8]" />
                  <span>19 Chartered Clubs across India</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#24a0d8]" />
                  <span>Affiliated with SIGBI & SI Global</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#24a0d8]" />
                  <span>UN ECOSOC Consultative Status</span>
                </div>
              </div>
            </div>

            {/* Organic curve shape transition on desktop (matching SIGBI reference) */}
            <div
              className="hidden lg:block absolute -right-16 top-0 bottom-0 w-24 pointer-events-none z-10"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 100 640"
                preserveAspectRatio="none"
                className="w-full h-full fill-[#005596]"
              >
                <path d="M0,0 L10,0 C65,180 85,320 30,480 C10,540 5,600 0,640 Z" />
              </svg>
            </div>
          </div>

          {/* Right Image Display Area (5 cols on lg) - Clean Photography without Color Overlays */}
          <div className="lg:col-span-5 relative bg-[#003A6B] overflow-hidden min-h-[360px] sm:min-h-[440px] lg:min-h-[640px]">
            {displayMode === "dual" ? (
              /* Dual Side-by-Side Presentation */
              <div className="grid grid-cols-2 h-full w-full">
                {images.map((img, i) => (
                  <div key={i} className="relative h-full w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Single / Slideshow Display with Crossfade */
              <div className="relative h-full w-full">
                {displayedImages.map((img, index) => {
                  const isCurrent = index === activeIndex || displayedImages.length === 1;
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isCurrent ? "opacity-100 z-0" : "opacity-0 -z-10"
                        }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Image Switch Controls (Interactive indicator when multiple images exist in slideshow mode) */}
            {displayedImages.length > 1 && displayMode === "slideshow" && (
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {/* <span className="text-[11px] font-medium text-white/90 mr-1">
                  Photos:
                </span> */}
                {displayedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Show ${img.label}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${idx === activeIndex
                        ? "w-6 bg-[#24a0d8]"
                        : "w-2.5 bg-white/60 hover:bg-white"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
