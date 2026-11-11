"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon, CalendarIcon } from "@/components/icons";
import { initialClubs } from "@/data/clubs";

interface ClubMarkerData {
  number: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  charterDate: string;
  charterYear: string;
  x: number; // percentage in SVG viewBox
  y: number; // percentage in SVG viewBox
  region: string;
}

export const CLUBS_CHRONOLOGICAL: ClubMarkerData[] = [
  {
    number: 1,
    slug: "si-bombay-north",
    name: "SI Bombay North",
    city: "Mumbai",
    state: "Maharashtra",
    charterDate: "2 September 1974",
    charterYear: "1974",
    x: 25.5,
    y: 57.5,
    region: "Western Region",
  },
  {
    number: 2,
    slug: "si-calcutta",
    name: "SI Calcutta",
    city: "Kolkata",
    state: "West Bengal",
    charterDate: "27 October 1979",
    charterYear: "1979",
    x: 67.5,
    y: 48.5,
    region: "Eastern Region",
  },
  {
    number: 3,
    slug: "si-burdwan",
    name: "SI Burdwan",
    city: "Bardhaman",
    state: "West Bengal",
    charterDate: "August 1987",
    charterYear: "1987",
    x: 64.0,
    y: 45.5,
    region: "Eastern Region",
  },
  {
    number: 4,
    slug: "si-poona",
    name: "SI Poona",
    city: "Pune",
    state: "Maharashtra",
    charterDate: "8 April 1991",
    charterYear: "1991",
    x: 28.5,
    y: 60.5,
    region: "Western Region",
  },
  {
    number: 5,
    slug: "si-bombay-west",
    name: "SI Bombay West",
    city: "Mumbai",
    state: "Maharashtra",
    charterDate: "September 1992",
    charterYear: "1992",
    x: 23.5,
    y: 56.5,
    region: "Western Region",
  },
  {
    number: 6,
    slug: "si-bombay-chembur",
    name: "SI Bombay Chembur",
    city: "Mumbai",
    state: "Maharashtra",
    charterDate: "Date requires confirmation",
    charterYear: "Early 1990s",
    x: 26.5,
    y: 59.0,
    region: "Western Region",
  },
  {
    number: 7,
    slug: "si-chennai",
    name: "SI Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    charterDate: "14 December 1998",
    charterYear: "1998",
    x: 45.0,
    y: 77.0,
    region: "Southern Region",
  },
  {
    number: 8,
    slug: "si-chennai-downtown",
    name: "SI Chennai Downtown",
    city: "Chennai",
    state: "Tamil Nadu",
    charterDate: "September 2002",
    charterYear: "2002",
    x: 47.5,
    y: 79.0,
    region: "Southern Region",
  },
  {
    number: 9,
    slug: "si-bangalore",
    name: "SI Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    charterDate: "10 January 2004",
    charterYear: "2004",
    x: 37.5,
    y: 76.0,
    region: "Southern Region",
  },
  {
    number: 10,
    slug: "si-south-kolkata",
    name: "SI South Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    charterDate: "21 September 2006",
    charterYear: "2006",
    x: 69.5,
    y: 50.5,
    region: "Eastern Region",
  },
  {
    number: 11,
    slug: "si-pune-metro-east",
    name: "SI Pune Metro East",
    city: "Pune",
    state: "Maharashtra",
    charterDate: "31 January 2010",
    charterYear: "2010",
    x: 30.5,
    y: 62.5,
    region: "Western Region",
  },
  {
    number: 12,
    slug: "si-madurai",
    name: "SI Madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    charterDate: "14 September 2010",
    charterYear: "2010",
    x: 40.5,
    y: 88.0,
    region: "Southern Region",
  },
  {
    number: 13,
    slug: "si-whitefield",
    name: "SI Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    charterDate: "August 2015",
    charterYear: "2015",
    x: 40.0,
    y: 74.5,
    region: "Southern Region",
  },
  {
    number: 14,
    slug: "si-coimbatore",
    name: "SI Coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    charterDate: "6 September 2021",
    charterYear: "2021",
    x: 35.5,
    y: 84.0,
    region: "Southern Region",
  },
  {
    number: 15,
    slug: "si-kochi",
    name: "SI Kochi",
    city: "Kochi",
    state: "Kerala",
    charterDate: "9 September 2021",
    charterYear: "2021",
    x: 32.5,
    y: 87.5,
    region: "Southern Region",
  },
  {
    number: 16,
    slug: "si-delhi",
    name: "SI Delhi",
    city: "New Delhi",
    state: "Delhi",
    charterDate: "9 April 2022",
    charterYear: "2022",
    x: 36.0,
    y: 29.0,
    region: "Northern Region",
  },
  {
    number: 17,
    slug: "si-leh",
    name: "SI Leh",
    city: "Leh",
    state: "Ladakh",
    charterDate: "16 July 2022",
    charterYear: "2022",
    x: 38.5,
    y: 11.5,
    region: "Northern Region",
  },
  {
    number: 18,
    slug: "si-srinagar-kashmir",
    name: "SI Srinagar, Kashmir",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    charterDate: "19 August 2023",
    charterYear: "2023",
    x: 29.5,
    y: 13.5,
    region: "Northern Region",
  },
  {
    number: 19,
    slug: "si-guwahati",
    name: "SI Guwahati",
    city: "Guwahati",
    state: "Assam",
    charterDate: "2 October 2024",
    charterYear: "2024",
    x: 81.0,
    y: 38.0,
    region: "North Eastern Region",
  },
];

export function InteractiveIndiaClubsMap() {
  const [activeClubNumber, setActiveClubNumber] = useState<number | null>(null);

  const activeClub = CLUBS_CHRONOLOGICAL.find((c) => c.number === activeClubNumber);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Map Representation with Numbered Pins */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D7E8F5] shadow-xs relative">
        <div className="flex items-center justify-between mb-4 border-b border-[#D7E8F5] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#005596] animate-pulse" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#005596]">
              Interactive India Club Map
            </h3>
          </div>
          <span className="text-xs font-mono text-[#61758A] bg-[#F4FAFF] px-2.5 py-1 rounded-full border border-[#D7E8F5]">
            19 Chartered Clubs
          </span>
        </div>

        <p className="text-xs text-[#61758A] mb-4">
          Hover or click on any numbered pin to highlight the club details.
        </p>

        {/* India Map Graphic Container */}
        <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-[#F4FAFF] to-[#E8F3FC] rounded-2xl border border-[#D7E8F5] overflow-hidden flex items-center justify-center p-2">
          {/* Decorative subtle geographical grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#005596 1px, transparent 1px), linear-gradient(90deg, #005596 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Accurate stylized silhouette path of India */}
          <svg
            viewBox="0 0 400 500"
            className="w-full h-full drop-shadow-sm select-none"
            aria-hidden="true"
          >
            {/* Base landmass outline of India */}
            <path
              d="M 125,75 
                 C 135,50 160,40 180,60 
                 C 195,45 205,70 190,95 
                 L 205,120 
                 C 230,135 270,140 290,140
                 C 320,135 340,150 350,175
                 C 360,195 340,210 325,205
                 C 310,200 295,215 280,210
                 C 265,200 260,230 250,240
                 C 275,250 280,270 270,290
                 C 255,320 230,340 220,370
                 C 205,400 190,440 170,470
                 C 160,450 145,410 140,380
                 C 135,350 120,330 115,300
                 C 110,270 90,260 85,240
                 C 70,230 75,210 95,200
                 C 105,185 100,165 110,145
                 C 120,125 115,95 125,75 Z"
              fill="#FFFFFF"
              stroke="#005596"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="opacity-90"
            />

            {/* Internal regional division indicator lines */}
            <path
              d="M 150,140 Q 200,170 260,175"
              fill="none"
              stroke="#D7E8F5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 115,280 Q 180,290 260,260"
              fill="none"
              stroke="#D7E8F5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M 140,380 Q 180,370 220,370"
              fill="none"
              stroke="#D7E8F5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Numbered Pins directly over the map */}
          {CLUBS_CHRONOLOGICAL.map((club) => {
            const isActive = activeClubNumber === club.number;
            return (
              <button
                key={club.number}
                type="button"
                onClick={() => setActiveClubNumber(club.number)}
                onMouseEnter={() => setActiveClubNumber(club.number)}
                aria-label={`Club #${club.number}: ${club.name} (${club.city})`}
                style={{
                  left: `${club.x}%`,
                  top: `${club.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute z-20 group flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isActive ? "scale-125 z-30" : "hover:scale-115"
                }`}
              >
                {/* Active pulse ring */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-[#D4A737] animate-ping opacity-75" />
                )}
                {/* Pin Circle with sequential number */}
                <div
                  className={`relative flex items-center justify-center rounded-full text-[11px] font-bold shadow-md transition-colors ${
                    isActive
                      ? "w-7 h-7 bg-[#005596] text-white border-2 border-[#D4A737] shadow-lg"
                      : "w-5.5 h-5.5 bg-[#005596] text-white border-1.5 border-white hover:border-[#D4A737]"
                  }`}
                >
                  <span>{club.number}</span>
                </div>
              </button>
            );
          })}

          {/* Active Club Floating Tooltip Overlay */}
          {activeClub && (
            <div className="absolute bottom-3 left-3 right-3 z-30 bg-[#002D54] text-white p-3.5 rounded-xl border border-[#004780] shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#D4A737] text-[#001E38] text-[10px] font-bold">
                      Club #{activeClub.number}
                    </span>
                    <span className="text-[11px] text-[#D7E8F5] font-mono">
                      {activeClub.charterYear}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-white leading-tight">
                    {activeClub.name}
                  </h4>
                  <p className="text-xs text-[#E8F3FC] flex items-center gap-1 mt-0.5">
                    <MapPinIcon size={12} className="text-[#aed1ef]" />
                    <span>
                      {activeClub.city}, {activeClub.state}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/clubs/${activeClub.slug}`}
                  className="shrink-0 p-1.5 rounded-lg bg-[#005596] hover:bg-[#004780] text-white text-xs inline-flex items-center gap-1 border border-white/20 transition-colors"
                >
                  <span>Profile</span>
                  <ArrowRightIcon size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Sequential Chronological List (Clubs 1 to 19) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#D7E8F5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#D7E8F5] pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#17324D]">
              Chronological Charter Roster
            </h3>
            <p className="text-xs sm:text-sm text-[#61758A] mt-1">
              Established in NASI-approved chronological order, numbered 1 through 19.
            </p>
          </div>
          <Link
            href="/clubs"
            className="text-xs font-semibold text-[#005596] hover:text-[#003A6B] inline-flex items-center gap-1 shrink-0"
          >
            <span>Full Directory & Projects</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        {/* Scrollable / Ordered Club Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
          {CLUBS_CHRONOLOGICAL.map((club) => {
            const isActive = activeClubNumber === club.number;
            const fullClub = initialClubs.find((c) => c.slug === club.slug);

            return (
              <div
                key={club.number}
                onMouseEnter={() => setActiveClubNumber(club.number)}
                onClick={() => setActiveClubNumber(club.number)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-[#E8F3FC] border-[#005596] shadow-sm ring-1 ring-[#005596]"
                    : "bg-[#F4FAFF] border-[#D7E8F5] hover:border-[#aed1ef] hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-[#005596] text-white"
                          : "bg-[#005596]/10 text-[#005596]"
                      }`}
                    >
                      #{club.number}
                    </span>
                    <span className="text-[11px] font-mono text-[#61758A] flex items-center gap-1">
                      <CalendarIcon size={12} className="text-[#005596]" />
                      <span>{club.charterYear}</span>
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#17324D] leading-snug">
                    {club.name}
                  </h4>

                  <p className="text-xs text-[#61758A] flex items-center gap-1 mt-1">
                    <MapPinIcon size={12} className="text-[#005596] shrink-0" />
                    <span>
                      {club.city}, {club.state}
                    </span>
                  </p>

                  {fullClub?.foundingPresident && (
                    <p className="text-[11px] text-[#17324D]/80 mt-1.5 italic">
                      Founding Pres: {fullClub.foundingPresident}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-[#D7E8F5] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-[#005596]">
                    {club.region}
                  </span>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="font-semibold text-[#005596] hover:text-[#003A6B] inline-flex items-center gap-0.5"
                  >
                    <span>View</span>
                    <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

