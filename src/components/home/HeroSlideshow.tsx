"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRightIcon, ArrowRightIcon } from "@/components/icons";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location?: string;
  imageSrc?: string;
  fallbackSvg: React.ReactNode;
}

const slides: HeroSlide[] = [
  {
    id: "education",
    title: "Educating and Mentoring the Next Generation",
    subtitle: "Vidya Jyothi & grassroots literacy scholarships across Indian communities",
    category: "Education & Literacy",
    location: "Bangalore & Pune Chapters",
    fallbackSvg: (
      <svg
        viewBox="0 0 600 420"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Women and girls in education workshop"
      >
        <defs>
          <linearGradient id="bgEdu" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8f3fc" />
            <stop offset="100%" stopColor="#d7e8f5" />
          </linearGradient>
          <linearGradient id="chalk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#005596" />
            <stop offset="100%" stopColor="#003a6b" />
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#bgEdu)" />
        {/* Classroom & Educational Presentation Graphic */}
        <rect x="50" y="45" width="500" height="230" rx="12" fill="#ffffff" stroke="#d7e8f5" strokeWidth="2" />
        <rect x="70" y="65" width="460" height="150" rx="8" fill="url(#chalk)" />
        <circle cx="120" cy="115" r="28" fill="#ffffff" opacity="0.15" />
        <text x="165" y="110" fill="#ffffff" fontSize="16" fontFamily="serif" fontWeight="bold">Project Vidya Jyothi</text>
        <text x="165" y="132" fill="#d7e8f5" fontSize="12" fontFamily="sans-serif">Digital Retention & Merit Scholarships for 200+ Girls</text>
        <rect x="165" y="150" width="120" height="8" rx="4" fill="#aed1ef" />
        <rect x="295" y="150" width="80" height="8" rx="4" fill="#ffffff" opacity="0.6" />
        {/* Figures representing students & mentors */}
        <g fill="#17324d" opacity="0.85">
          <circle cx="130" cy="270" r="22" fill="#005596" />
          <path d="M100 330 C100 295 160 295 160 330 Z" fill="#005596" />
          <circle cx="210" cy="285" r="18" fill="#17324d" />
          <path d="M185 330 C185 300 235 300 235 330 Z" fill="#17324d" />
          <circle cx="280" cy="280" r="19" fill="#17324d" />
          <path d="M255 330 C255 298 305 298 305 330 Z" fill="#17324d" />
          <circle cx="350" cy="285" r="18" fill="#17324d" />
          <path d="M325 330 C325 300 375 300 375 330 Z" fill="#17324d" />
          <circle cx="430" cy="275" r="20" fill="#005596" />
          <path d="M400 330 C400 295 460 295 460 330 Z" fill="#005596" />
        </g>
        {/* Desks line */}
        <rect x="70" y="325" width="460" height="14" rx="4" fill="#ffffff" stroke="#d7e8f5" strokeWidth="2" />
        {/* Books & laptops */}
        <rect x="115" y="315" width="30" height="10" rx="2" fill="#005596" />
        <rect x="265" y="310" width="35" height="15" rx="2" fill="#5ea4df" />
        <rect x="415" y="315" width="30" height="10" rx="2" fill="#005596" />
      </svg>
    ),
  },
  {
    id: "health",
    title: "Community Health & Maternal Wellbeing Camps",
    subtitle: "Delivering preventative screening, maternal care and wellness outreach",
    category: "Healthcare & Nutrition",
    location: "Kochi, Bombay & Madurai",
    fallbackSvg: (
      <svg
        viewBox="0 0 600 420"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Community healthcare camp"
      >
        <defs>
          <linearGradient id="bgHlt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4faff" />
            <stop offset="100%" stopColor="#e8f3fc" />
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#bgHlt)" />
        {/* Clinic tent & health screening visual */}
        <rect x="60" y="40" width="480" height="260" rx="14" fill="#ffffff" stroke="#d7e8f5" strokeWidth="2" />
        {/* Medical cross & banner */}
        <circle cx="120" cy="100" r="32" fill="#e8f3fc" />
        <rect x="115" y="80" width="10" height="40" fill="#005596" rx="2" />
        <rect x="100" y="95" width="40" height="10" fill="#005596" rx="2" />
        <text x="175" y="95" fill="#17324d" fontSize="16" fontFamily="serif" fontWeight="bold">Free Maternal Health Screening Camp</text>
        <text x="175" y="118" fill="#61758a" fontSize="12" fontFamily="sans-serif">Specialist Doctors & Volunteer Members in Coastal & Rural Wards</text>
        {/* Caregiver and mother consultation graphic */}
        <g>
          <circle cx="210" cy="200" r="24" fill="#005596" />
          <path d="M175 270 C175 230 245 230 245 270 Z" fill="#005596" />
          {/* Stethoscope */}
          <path d="M200 225 Q210 245 220 225" fill="none" stroke="#ffffff" strokeWidth="3" />
          <circle cx="360" cy="205" r="22" fill="#17324d" />
          <path d="M325 270 C325 235 395 235 395 270 Z" fill="#17324d" />
          {/* Baby/child in arms */}
          <circle cx="330" cy="235" r="10" fill="#005596" />
          <path d="M315 265 C315 245 345 245 345 265 Z" fill="#005596" />
        </g>
        {/* Diagnostic table */}
        <rect x="80" y="270" width="440" height="12" rx="3" fill="#d7e8f5" />
      </svg>
    ),
  },
  {
    id: "leadership",
    title: "Women in Leadership & National Action",
    subtitle: "Uniting professional women to advocate, mentor, and inspire nationwide",
    category: "Leadership & Advocacy",
    location: "National Conference & Triennial Assembly",
    fallbackSvg: (
      <svg
        viewBox="0 0 600 420"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Women leaders at national conference"
      >
        <defs>
          <linearGradient id="bgLdr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8f3fc" />
            <stop offset="100%" stopColor="#f4faff" />
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#bgLdr)" />
        {/* Assembly Stage & Podium */}
        <rect x="50" y="45" width="500" height="250" rx="12" fill="#ffffff" stroke="#d7e8f5" strokeWidth="2" />
        {/* National Backdrop */}
        <rect x="75" y="65" width="450" height="120" rx="8" fill="#005596" />
        <circle cx="300" cy="115" r="26" fill="#ffffff" opacity="0.2" />
        <text x="300" y="110" fill="#ffffff" fontSize="15" fontFamily="serif" fontWeight="bold" textAnchor="middle">NASI India National Conference</text>
        <text x="300" y="132" fill="#d7e8f5" fontSize="11" fontFamily="sans-serif" textAnchor="middle">19 Chartered Clubs • Transforming Lives of Women & Girls</text>
        {/* Podium */}
        <rect x="270" y="195" width="60" height="65" rx="4" fill="#003a6b" />
        <rect x="260" y="190" width="80" height="8" rx="2" fill="#d4a737" />
        {/* Leader at podium */}
        <circle cx="300" cy="165" r="18" fill="#ffffff" stroke="#005596" strokeWidth="2" />
        <path d="M280 190 C280 175 320 175 320 190 Z" fill="#005596" />
        {/* Panelists */}
        <circle cx="170" cy="175" r="15" fill="#17324d" />
        <path d="M150 205 C150 190 190 190 190 205 Z" fill="#17324d" />
        <circle cx="430" cy="175" r="15" fill="#17324d" />
        <path d="M410 205 C410 190 450 190 450 205 Z" fill="#17324d" />
        {/* Stage edge */}
        <rect x="50" y="260" width="500" height="14" fill="#d7e8f5" />
      </svg>
    ),
  },
];

export function HeroSlideshow() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div
      className="relative rounded-2xl bg-white border border-[#D7E8F5] shadow-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="NASI India service projects and photography slideshow"
    >
      {/* Visual Slide Display Area - Clear photographic presentation without color tint overlays */}
      <div className="relative aspect-4/3 w-full bg-[#F4FAFF] overflow-hidden flex items-center justify-center">
        {currentSlide.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentSlide.imageSrc}
            alt={currentSlide.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
          />
        ) : (
          <div className="w-full h-full transition-opacity duration-300">
            {currentSlide.fallbackSvg}
          </div>
        )}

        {/* Category Pill on top left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#005596] border border-[#D7E8F5] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#005596]" />
            {currentSlide.category}
          </span>
        </div>

        {/* Counter Pill on top right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white/90 text-[#17324D] border border-[#D7E8F5] shadow-xs">
            {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous photograph slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#005596] border border-[#D7E8F5] flex items-center justify-center shadow-md transition-all duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596]"
        >
          <span className="rotate-180 block">
            <ChevronRightIcon size={16} />
          </span>
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next photograph slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#005596] border border-[#D7E8F5] flex items-center justify-center shadow-md transition-all duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596]"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>

      {/* Caption & Indicator Area */}
      <div className="p-5 bg-white border-t border-[#D7E8F5] space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#17324D] leading-snug">
              {currentSlide.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#61758A] leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>

          <Link
            href="/clubs"
            className="shrink-0 text-xs font-semibold text-[#005596] hover:text-[#004780] inline-flex items-center gap-1 transition-colors pt-0.5"
          >
            <span>Clubs</span>
            <ArrowRightIcon size={12} />
          </Link>
        </div>

        {/* Indicator Dots & Pause Status */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Slideshow slide selectors">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === currentSlideIndex}
                aria-label={`Jump to slide ${idx + 1}: ${slide.title}`}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === currentSlideIndex
                    ? "w-6 bg-[#005596]"
                    : "w-2 bg-[#D7E8F5] hover:bg-[#aed1ef]"
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] text-[#61758A]">
            {isPaused ? "Paused" : "Auto-playing"}
          </span>
        </div>
      </div>
    </div>
  );
}

