"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon, CalendarIcon } from "@/components/icons";
import { initialClubs } from "@/data/clubs";
import indiaMap from "@svg-maps/india";

export interface ClubMarkerData {
  number: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  charterDate: string;
  charterYear: string;
  svgX: number; // coordinate in SVG viewBox (0-612)
  svgY: number; // coordinate in SVG viewBox (0-696)
  pctX: number; // percentage in container (svgX / 612 * 100)
  pctY: number; // percentage in container (svgY / 696 * 100)
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
    svgX: 105,
    svgY: 426,
    pctX: (105 / 612) * 100,
    pctY: (426 / 696) * 100,
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
    svgX: 418,
    svgY: 344,
    pctX: (418 / 612) * 100,
    pctY: (344 / 696) * 100,
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
    svgX: 398,
    svgY: 330,
    pctX: (398 / 612) * 100,
    pctY: (330 / 696) * 100,
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
    svgX: 124,
    svgY: 454,
    pctX: (124 / 612) * 100,
    pctY: (454 / 696) * 100,
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
    svgX: 98,
    svgY: 432,
    pctX: (98 / 612) * 100,
    pctY: (432 / 696) * 100,
    region: "Western Region",
  },
  {
    number: 6,
    slug: "si-bombay-chembur",
    name: "SI Chembur",
    city: "Mumbai",
    state: "Maharashtra",
    charterDate: "1997",
    charterYear: "1997",
    svgX: 110,
    svgY: 436,
    pctX: (110 / 612) * 100,
    pctY: (436 / 696) * 100,
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
    svgX: 242,
    svgY: 562,
    pctX: (242 / 612) * 100,
    pctY: (562 / 696) * 100,
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
    svgX: 248,
    svgY: 572,
    pctX: (248 / 612) * 100,
    pctY: (572 / 696) * 100,
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
    svgX: 180,
    svgY: 550,
    pctX: (180 / 612) * 100,
    pctY: (550 / 696) * 100,
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
    svgX: 424,
    svgY: 352,
    pctX: (424 / 612) * 100,
    pctY: (352 / 696) * 100,
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
    svgX: 132,
    svgY: 460,
    pctX: (132 / 612) * 100,
    pctY: (460 / 696) * 100,
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
    svgX: 202,
    svgY: 632,
    pctX: (202 / 612) * 100,
    pctY: (632 / 696) * 100,
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
    svgX: 190,
    svgY: 554,
    pctX: (190 / 612) * 100,
    pctY: (554 / 696) * 100,
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
    svgX: 178,
    svgY: 614,
    pctX: (178 / 612) * 100,
    pctY: (614 / 696) * 100,
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
    svgX: 158,
    svgY: 624,
    pctX: (158 / 612) * 100,
    pctY: (624 / 696) * 100,
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
    svgX: 186,
    svgY: 210,
    pctX: (186 / 612) * 100,
    pctY: (210 / 696) * 100,
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
    svgX: 196,
    svgY: 54,
    pctX: (196 / 612) * 100,
    pctY: (54 / 696) * 100,
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
    svgX: 142,
    svgY: 68,
    pctX: (142 / 612) * 100,
    pctY: (68 / 696) * 100,
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
    svgX: 482,
    svgY: 274,
    pctX: (482 / 612) * 100,
    pctY: (274 / 696) * 100,
    region: "North Eastern Region",
  },
];

export function InteractiveIndiaClubsMap() {
  const [activeClubNumber, setActiveClubNumber] = useState<number | null>(null);

  const activeClub = CLUBS_CHRONOLOGICAL.find((c) => c.number === activeClubNumber);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Accurate Geographic India Map Representation with Numbered Pins */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D7E8F5] shadow-xs relative">
        <div className="flex items-center justify-between mb-4 border-b border-[#D7E8F5] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#005596] animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#005596]">
              Interactive India Club Map
            </h3>
          </div>
          <span className="text-xs font-bold text-[#003A6B] bg-[#FAEB57] px-3 py-1 rounded-full border border-[#F0DC36] shadow-2xs">
            19 Chartered Clubs
          </span>
        </div>

        <p className="text-xs text-[#61758A] mb-3">
          Hover or click on any numbered pin to highlight club details. Outline sourced from verified geospatial GIS data.
        </p>

        {/* India Map Graphic Container with precise 612:696 aspect ratio */}
        <div className="relative w-full aspect-[612/696] bg-gradient-to-b from-[#F4FAFF] to-[#E8F3FC] rounded-2xl border border-[#D7E8F5] overflow-hidden p-1 shadow-inner">
          {/* Decorative subtle geographical grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#005596 1px, transparent 1px), linear-gradient(90deg, #005596 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Accurate geographical SVG map of India */}
          <svg
            viewBox={indiaMap.viewBox}
            className="w-full h-full drop-shadow-sm select-none"
            aria-label="Accurate Geographical Map of India showing NASI Clubs"
          >
            {indiaMap.locations.map((loc: { id: string; name: string; path: string }) => (
              <path
                key={loc.id}
                id={loc.id}
                d={loc.path}
                className="fill-white stroke-[#005596]/45 hover:fill-[#FFFBD4] transition-colors"
                strokeWidth="0.85"
                strokeLinejoin="round"
              >
                <title>{loc.name}</title>
              </path>
            ))}
          </svg>

          {/* Numbered Pins directly over the map - Lemon Yellow & Blue theme */}
          {CLUBS_CHRONOLOGICAL.map((club) => {
            const isActive = activeClubNumber === club.number;
            return (
              <button
                key={club.number}
                type="button"
                onClick={() => setActiveClubNumber(club.number)}
                onMouseEnter={() => setActiveClubNumber(club.number)}
                aria-label={`Club #${club.number}: ${club.name} (${club.city}, ${club.state})`}
                style={{
                  left: `${club.pctX}%`,
                  top: `${club.pctY}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute z-20 group flex items-center justify-center transition-all duration-200 cursor-pointer ${isActive ? "scale-130 z-30" : "hover:scale-115"
                  }`}
              >
                {/* Active pulse ring in Lemon Yellow */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-[#FAEB57] animate-ping opacity-80" />
                )}
                {/* Pin Circle with sequential number */}
                <div
                  className={`relative flex items-center justify-center rounded-full text-[11px] font-extrabold shadow-md transition-all duration-150 ${isActive
                    ? "w-7 h-7 bg-[#FAEB57] text-[#002D54] border-2 border-[#005596] shadow-lg ring-2 ring-[#FAEB57]"
                    : "w-5.5 h-5.5 bg-[#005596] text-[#FAEB57] border-1.5 border-[#FAEB57] hover:bg-[#FAEB57] hover:text-[#002D54] hover:border-[#005596]"
                    }`}
                >
                  <span>{club.number}</span>
                </div>
              </button>
            );
          })}

          {/* Active Club Floating Tooltip Overlay */}
          {activeClub && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-30 bg-[#002D54] text-white p-3.5 rounded-xl border border-[#004780] shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAEB57] text-[#002D54] text-[10px] font-bold">
                      Club #{activeClub.number}
                    </span>
                    <span className="text-[11px] text-[#FAEB57] font-mono font-semibold">
                      Chartered: {activeClub.charterYear}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-white leading-tight">
                    {activeClub.name}
                  </h4>
                  <p className="text-xs text-[#E8F3FC] flex items-center gap-1 mt-0.5">
                    <MapPinIcon size={12} className="text-[#FAEB57]" />
                    <span>
                      {activeClub.city}, {activeClub.state}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/clubs/${activeClub.slug}`}
                  className="shrink-0 py-1.5 px-2.5 rounded-lg bg-[#FAEB57] hover:bg-[#FDD835] text-[#002D54] text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
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
            className="text-xs font-bold text-[#005596] hover:text-[#003A6B] inline-flex items-center gap-1 shrink-0 bg-[#E8F3FC] px-3 py-1.5 rounded-lg border border-[#D7E8F5] hover:border-[#005596] transition-colors"
          >
            <span>Full Directory &amp; Projects</span>
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
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${isActive
                  ? "bg-[#FFFBD4] border-[#005596] shadow-sm ring-2 ring-[#005596]"
                  : "bg-[#F4FAFF] border-[#D7E8F5] hover:border-[#005596] hover:bg-white"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${isActive
                        ? "bg-[#005596] text-[#FAEB57]"
                        : "bg-[#FAEB57] text-[#002D54] border border-[#F0DC36]"
                        }`}
                    >
                      #{club.number}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#005596] flex items-center gap-1">
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
                  <span className="text-[11px] font-bold text-[#005596]">
                    {club.region}
                  </span>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="font-bold text-[#005596] hover:text-[#003A6B] inline-flex items-center gap-0.5"
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
