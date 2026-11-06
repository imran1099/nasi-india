"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { clubHistoricalTimeline } from "@/data/clubs";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
} from "@/components/icons";

export function HistoricalTimeline() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDecade, setSelectedDecade] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const decades = ["all", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  const regions = [
    "all",
    "Western Region",
    "Eastern Region",
    "Southern Region",
    "Northern Region",
    "North Eastern Region",
  ];

  const filteredTimeline = useMemo(() => {
    return clubHistoricalTimeline.filter((item) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        item.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.foundingPresident && item.foundingPresident.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesDecade = true;
      if (selectedDecade !== "all") {
        const startYear = parseInt(selectedDecade.substring(0, 4), 10);
        matchesDecade = item.year >= startYear && item.year < startYear + 10;
      }

      const matchesRegion = selectedRegion === "all" || item.region === selectedRegion;

      return matchesSearch && matchesDecade && matchesRegion;
    });
  }, [searchTerm, selectedDecade, selectedRegion]);

  return (
    <div className="space-y-8">
      {/* Interactive Controls & Filters */}
      <div className="p-6 rounded-2xl bg-white border border-[#D7E8F5] shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input (5 cols) */}
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label
              htmlFor="timeline-search"
              className="text-xs font-semibold text-[#17324D] uppercase tracking-wide"
            >
              Search Timeline by Club, City, or Founder
            </label>
            <div className="relative">
              <input
                id="timeline-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Bombay North, Calcutta, Nalini Subbiah..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D7E8F5] bg-[#F4FAFF] text-sm text-[#17324D] placeholder:text-[#61758A] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596] focus-visible:bg-white transition-all shadow-2xs"
              />
              <span className="absolute left-3 top-3 text-[#61758A] pointer-events-none">
                <SearchIcon size={16} />
              </span>
            </div>
          </div>

          {/* Decade Filter (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label
              htmlFor="decade-filter"
              className="text-xs font-semibold text-[#17324D] uppercase tracking-wide"
            >
              Filter by Era / Decade
            </label>
            <select
              id="decade-filter"
              value={selectedDecade}
              onChange={(e) => setSelectedDecade(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D7E8F5] bg-[#F4FAFF] text-sm text-[#17324D] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596] focus-visible:bg-white transition-all shadow-2xs"
            >
              <option value="all">All Eras (1974 – 2024)</option>
              <option value="1970s">1970s (The Genesis)</option>
              <option value="1980s">1980s (Early Expansion)</option>
              <option value="1990s">1990s (NASI India Formed)</option>
              <option value="2000s">2000s (New Millennium)</option>
              <option value="2010s">2010s (Southern Growth)</option>
              <option value="2020s">2020s (Pan-India Expansion)</option>
            </select>
          </div>

          {/* Region Filter (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label
              htmlFor="region-filter"
              className="text-xs font-semibold text-[#17324D] uppercase tracking-wide"
            >
              Filter by Region
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D7E8F5] bg-[#F4FAFF] text-sm text-[#17324D] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#005596] focus-visible:bg-white transition-all shadow-2xs"
            >
              <option value="all">All 5 Regions</option>
              {regions
                .filter((r) => r !== "all")
                .map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Quick Era Badges */}
        <div className="pt-2 border-t border-[#D7E8F5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-[#17324D] mr-1">Browse Decades:</span>
            {decades.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDecade(d)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedDecade === d
                    ? "bg-[#005596] text-white shadow-2xs font-semibold"
                    : "bg-[#E8F3FC] text-[#005596] hover:bg-[#d7e8f5]"
                }`}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>

          <p className="text-[#61758A]">
            Showing <strong className="text-[#17324D] font-bold">{filteredTimeline.length}</strong> of{" "}
            {clubHistoricalTimeline.length} chartered milestones
          </p>
        </div>
      </div>

      {/* Historical Milestones Callout Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#005596] text-white border border-[#004780] shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 text-[#D4A737] flex items-center justify-center shrink-0 border border-white/20">
            <SparklesIcon size={20} />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4A737] block">
              1974 Milestone
            </span>
            <h4 className="font-serif font-bold text-base text-white mt-0.5">
              The Soroptimist Journey Begins
            </h4>
            <p className="text-xs text-[#E8F3FC] mt-1 leading-relaxed">
              Soroptimist clubs in India began their journey on 2 September 1974 with the establishment of SI Bombay North, chartered before the national association structure existed.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#002D54] text-white border border-[#003A6B] shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/15 text-[#aed1ef] flex items-center justify-center shrink-0 border border-white/20">
            <UsersIcon size={20} />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#aed1ef] block">
              1990 Milestone
            </span>
            <h4 className="font-serif font-bold text-base text-white mt-0.5">
              NASI India Takes Office
            </h4>
            <p className="text-xs text-[#D7E8F5] mt-1 leading-relaxed">
              NASI India took office in 1990, providing a formal national association structure under SIGBI to coordinate the growing movement across India.
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D7E8F5] space-y-8 my-8">
        {filteredTimeline.map((item, index) => {
          return (
            <div key={item.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#005596] group-hover:scale-125 transition-all shadow-xs" />

              {/* Milestone Card */}
              <Card
                variant="elevated"
                className="bg-white border border-[#D7E8F5] hover:border-[#005596] hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#005596] text-white shadow-2xs">
                        {item.year}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-full border border-[#D7E8F5]">
                        <CalendarIcon size={13} className="text-[#005596]" />
                        {item.charterDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.isFirstInIndia && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF9EB] text-[#7B580B] border border-[#F2D79A]">
                          1st Club in India
                        </span>
                      )}
                      <Badge variant="teal" size="sm">
                        {item.region}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <CardTitle as="h3" className="text-xl sm:text-2xl text-[#17324D] group-hover:text-[#005596] transition-colors">
                      {item.clubName}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-[#61758A] font-medium">
                      <MapPinIcon size={14} className="text-[#005596] shrink-0" />
                      <span>
                        {item.city}, {item.state}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-2 space-y-3">
                  {/* Verified Historical Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-[#F4FAFF] p-3.5 rounded-xl border border-[#D7E8F5]">
                    {item.foundingPresident && (
                      <div>
                        <span className="text-[10.5px] uppercase font-semibold text-[#61758A] block">
                          Founding President
                        </span>
                        <p className="font-semibold text-[#17324D] mt-0.5">
                          {item.foundingPresident}
                        </p>
                      </div>
                    )}

                    {item.nasiPresidentAtCharter && (
                      <div>
                        <span className="text-[10.5px] uppercase font-semibold text-[#61758A] block">
                          NASI India President
                        </span>
                        <p className="font-semibold text-[#17324D] mt-0.5">
                          {item.nasiPresidentAtCharter}
                        </p>
                      </div>
                    )}

                    {item.nasiMembershipOfficer && (
                      <div>
                        <span className="text-[10.5px] uppercase font-semibold text-[#61758A] block">
                          NASI Membership Officer
                        </span>
                        <p className="font-semibold text-[#17324D] mt-0.5">
                          {item.nasiMembershipOfficer}
                        </p>
                      </div>
                    )}

                    {item.sigbiOfficer && (
                      <div>
                        <span className="text-[10.5px] uppercase font-semibold text-[#61758A] block">
                          SIGBI Officer / Chartering Pres.
                        </span>
                        <p className="font-semibold text-[#17324D] mt-0.5">
                          {item.sigbiOfficer}
                        </p>
                      </div>
                    )}

                    {item.motherClub && (
                      <div>
                        <span className="text-[10.5px] uppercase font-semibold text-[#61758A] block">
                          Mother Club
                        </span>
                        <p className="font-semibold text-[#005596] mt-0.5">
                          {item.motherClub}
                        </p>
                      </div>
                    )}
                  </div>

                  {item.historicalNotes && (
                    <p className="text-xs text-[#17324D] leading-relaxed italic bg-[#E8F3FC]/50 border-l-2 border-[#005596] pl-3 py-1">
                      {item.historicalNotes}
                    </p>
                  )}

                  {item.charterStatusNote && (
                    <p className="text-[11px] text-[#61758A] leading-relaxed font-mono bg-[#F4FAFF] border border-[#D7E8F5] p-2 rounded-md">
                      Note: {item.charterStatusNote}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="px-5 py-3 border-t border-[#D7E8F5] bg-[#F4FAFF] flex items-center justify-between">
                  <span className="text-xs text-[#61758A]">
                    Milestone #{index + 1} of {filteredTimeline.length}
                  </span>
                  <Link
                    href={`/clubs/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005596] hover:text-[#004780] transition-colors"
                  >
                    <span>View Club Profile</span>
                    <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          );
        })}

        {filteredTimeline.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#D7E8F5]">
            <p className="text-[#17324D] font-serif font-bold text-lg">No charter milestones found</p>
            <p className="text-xs text-[#61758A] mt-1">
              Try adjusting your search keywords or resetting the era and region filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedDecade("all");
                setSelectedRegion("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#005596] text-white text-xs font-semibold hover:bg-[#004780] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

