"use client";

import React, { useState, useMemo } from "react";
import { Club } from "@/data/clubs";
import { ClubCard } from "./ClubCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon, MapPinIcon } from "@/components/icons";

export interface ClubsDirectoryProps {
  clubs: Club[];
}

export function ClubsDirectory({ clubs }: ClubsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  // Distinct states for filter dropdown
  const states = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => set.add(c.state));
    return Array.from(set).sort();
  }, [clubs]);

  // Distinct regions
  const regions = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => set.add(c.region));
    return Array.from(set).sort();
  }, [clubs]);

  // Filtered results
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.focusAreas.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRegion =
        selectedRegion === "all" || club.region === selectedRegion;

      const matchesState =
        selectedState === "all" || club.state === selectedState;

      return matchesSearch && matchesRegion && matchesState;
    });
  }, [clubs, searchTerm, selectedRegion, selectedState]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedRegion("all");
    setSelectedState("all");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200/90 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label htmlFor="club-search" className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              Search by Club Name, City, or Focus
            </label>
            <div className="relative">
              <input
                id="club-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Bangalore, Kochi, Delhi, STEM..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-sm text-forest-950 placeholder:text-forest-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-800 focus-visible:bg-white transition-all shadow-2xs"
              />
              <span className="absolute left-3 top-3 text-forest-400 pointer-events-none">
                <SearchIcon size={16} />
              </span>
            </div>
          </div>

          {/* Region Filter (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="region-filter" className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              Filter by Region
            </label>
            <select
              id="region-filter"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-sm text-forest-950 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-800 focus-visible:bg-white transition-all shadow-2xs"
            >
              <option value="all">All Regions ({regions.length})</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="state-filter" className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              Filter by State / UT
            </label>
            <select
              id="state-filter"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-sm text-forest-950 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-800 focus-visible:bg-white transition-all shadow-2xs"
            >
              <option value="all">All States ({states.length})</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Action (1 col) */}
          <div className="md:col-span-1 flex flex-col justify-end">
            <button
              type="button"
              onClick={handleReset}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                searchTerm || selectedRegion !== "all" || selectedState !== "all"
                  ? "bg-forest-900 text-white border-forest-950 hover:bg-forest-950"
                  : "bg-sand-50 text-forest-700 border-sand-300 hover:bg-sand-100"
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 pt-3.5 border-t border-sand-200/90 flex flex-wrap items-center justify-between text-xs text-forest-700 gap-2">
          <p>
            Showing <strong className="text-forest-950 font-bold">{filteredClubs.length}</strong> of {clubs.length} chartered clubs
          </p>
          {(searchTerm || selectedRegion !== "all" || selectedState !== "all") && (
            <p className="text-teal-800 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Active filters applied
            </p>
          )}
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <ClubCard key={club.slug} club={club} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Clubs Match Your Criteria"
          description="Try clearing your search keyword or switching the region/state filter back to 'All' to see all 19 chartered NASI India clubs."
          icon={<MapPinIcon size={24} />}
          action={
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-forest-800 text-white text-sm font-medium hover:bg-forest-900 transition-colors"
            >
              Clear All Filters
            </button>
          }
        />
      )}
    </div>
  );
}
