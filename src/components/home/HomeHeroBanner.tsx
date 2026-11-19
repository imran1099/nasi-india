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
  title = "NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India)",
  subtitle = "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change.",
  ctaText = "Our Impact",
  ctaUrl = "#vision-mission",
  secondaryCtaText = "Contact Us",
  secondaryCtaUrl = "/contact",
  imageLeft = "/images/banner/hero-woman-facing-left.jpg",
  imageRight = "/images/banner/hero-woman-facing-right.jpg",
  displayMode = "slideshow",
}: HomeHeroBannerProps) {
  // Normalize title and subtitle per NASI instructions
  const displayTitle =
    title &&
      title !== "Standing up for women and girls" &&
      !title.includes("National Association of Soroptimist")
      ? title
      : "NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India)";

  const displaySubtitle = (
    subtitle ||
    "Women Supporting Women, Creating Change Together. Purposeful, compassionate, and totally committed to change."
  ).replace(/unshakeably/gi, "totally");

  const displaySecondaryCtaText =
    secondaryCtaText === "Become a member" ? "Contact Us" : secondaryCtaText;
  const displaySecondaryCtaUrl =
    secondaryCtaUrl === "/join" ? "/contact" : secondaryCtaUrl;
  const displayCtaUrl = ctaUrl === "/about" ? "#vision-mission" : ctaUrl;

  // Collect available images for central display
  const images = [
    {
      src: imageLeft || "/images/banner/hero-woman-facing-left.jpg",
      label: "Portrait 1",
      alt: "Soroptimist India Member in traditional golden attire with floral adornment",
    },
    {
      src: imageRight || "/images/banner/hero-woman-facing-right.jpg",
      label: "Portrait 2",
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
      className="relative w-full overflow-hidden bg-[#005596] text-white py-12 sm:py-16 lg:py-20"
      aria-label="Homepage Main Banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Organization Kicker / Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E8F3FC] text-xs sm:text-sm font-semibold mb-5 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#FAEB57] animate-pulse" />
            <span>NATIONAL ASSOCIATION SOROPTIMIST INDIA (NASI-India)</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.14] max-w-4xl mb-4 sm:mb-5">
            {displayTitle}
          </h1>

          {/* Supporting Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-[#F4FAFF]/95 leading-relaxed font-normal max-w-2xl mb-8">
            {displaySubtitle}
          </p>

          {/* Action Buttons following NASI Lemon Yellow & Blue theme */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {ctaText && (
              <Link
                href={displayCtaUrl || "#vision-mission"}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#FAEB57] hover:bg-[#FDD835] text-[#003A6B] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-98 border border-[#F0DC36]"
              >
                <span>{ctaText}</span>
                <ArrowRightIcon size={16} className="ml-2 text-[#003A6B]" />
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

          {/* Centrally Positioned Woman Photograph */}
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto mb-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/25 bg-[#003A6B] p-2 sm:p-2.5">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#002D54]">
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
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-103"
                      />
                    </div>
                  );
                })}

                {/* Placeholder Overlay Pill */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-medium flex items-center gap-2 whitespace-nowrap shadow-md z-10">
                  <span className="w-2 h-2 rounded-full bg-[#FAEB57]" />
                  <span>Official Photograph Placeholder</span>
                </div>
              </div>

              {/* Multiple photo selector controls */}
              {displayedImages.length > 1 && displayMode === "slideshow" && (
                <div className="flex items-center justify-center gap-2 pt-2.5 pb-1">
                  {displayedImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View ${img.label}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${idx === activeIndex
                        ? "w-6 bg-[#FAEB57]"
                        : "w-2 bg-white/40 hover:bg-white"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-[#E8F3FC]/80 mt-2.5 italic text-center">
              [Official woman photograph will be updated once supplied by NASI]
            </p>
          </div>

          {/* Credibility Indicators */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-[#E8F3FC]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FAEB57]" />
              <span>19 Chartered Clubs across India</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FAEB57]" />
              <span>Affiliated with SIGBI &amp; SI Global</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FAEB57]" />
              <span>UN ECOSOC Consultative Status</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
