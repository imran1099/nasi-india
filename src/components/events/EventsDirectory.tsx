"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { EventItem } from "@/data/events";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarIcon, MapPinIcon, SearchIcon, ArrowRightIcon } from "@/components/icons";

export interface EventsDirectoryProps {
  events: EventItem[];
}

export function EventsDirectory({ events }: EventsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.category));
    return Array.from(set);
  }, [events]);

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.isFeatured) || events[0];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.clubAttribution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFormat =
        selectedFormat === "all" || ev.format === selectedFormat;

      const matchesCat =
        selectedCategory === "all" || ev.category === selectedCategory;

      return matchesSearch && matchesFormat && matchesCat;
    });
  }, [events, searchTerm, selectedFormat, selectedCategory]);

  return (
    <div className="space-y-12">
      {/* Featured Event Hero Banner */}
      {featuredEvent && !searchTerm && selectedFormat === "all" && selectedCategory === "all" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white shadow-md relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" size="sm" className="bg-teal-900/80 text-teal-200 border-teal-700">
                Featured Gathering
              </Badge>
              <Badge variant="neutral" size="sm" className="bg-white/10 text-sand-100 border-white/20">
                {featuredEvent.format} Format
              </Badge>
              <span className="text-xs font-mono text-sand-300">
                Organizer: {featuredEvent.clubAttribution}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
              {featuredEvent.title}
            </h2>

            <p className="text-sm sm:text-base text-sand-200 leading-relaxed">
              {featuredEvent.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-sand-300">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon size={14} className="text-teal-400" />
                  <span>{featuredEvent.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <MapPinIcon size={14} className="text-teal-400" />
                  <span>{featuredEvent.location}</span>
                </div>
              </div>

              <Link
                href={`/events/${featuredEvent.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-medium hover:bg-teal-600 transition-colors shadow-xs"
              >
                <span>View Event Agenda</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box (6 cols) */}
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label htmlFor="event-search" className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              Search by Event Title, City, or Organizer
            </label>
            <div className="relative">
              <input
                id="event-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. National Council, Kochi, Webinar..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-forest-950 placeholder:text-forest-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-700 transition-colors"
              />
              <span className="absolute left-3 top-3 text-forest-400 pointer-events-none">
                <SearchIcon size={16} />
              </span>
            </div>
          </div>

          {/* Format Filter (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="format-filter" className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              Event Format
            </label>
            <select
              id="format-filter"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-forest-950 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-700 transition-colors"
            >
              <option value="all">All Formats</option>
              <option value="Hybrid">Hybrid</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online / Webinar</option>
            </select>
          </div>

          {/* Category Filter (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="event-cat-filter" className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              Category
            </label>
            <select
              id="event-cat-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sm text-forest-950 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-forest-700 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between text-xs text-forest-600">
          <span>Showing {filteredEvents.length} of {events.length} upcoming events</span>
          {(searchTerm || selectedFormat !== "all" || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedFormat("all");
                setSelectedCategory("all");
              }}
              className="text-teal-800 underline hover:text-forest-950 cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.slug}
              variant="elevated"
              className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6 group hover:border-forest-400 transition-all duration-200"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="forest" size="sm">
                    {event.category}
                  </Badge>
                  <Badge variant="teal" size="sm">
                    {event.format}
                  </Badge>
                  <span className="text-[11px] font-mono text-forest-500">
                    Host: {event.clubAttribution}
                  </span>
                </div>

                <CardTitle as="h3" className="text-xl group-hover:text-forest-800 transition-colors">
                  {event.title}
                </CardTitle>

                <p className="text-sm text-forest-800/80 leading-relaxed max-w-3xl">
                  {event.shortDescription}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-forest-700 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon size={14} className="text-teal-700 shrink-0" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon size={14} className="text-teal-700 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col gap-2.5 justify-end">
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition-colors shadow-2xs"
                >
                  View Details & Agenda
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-sand-300 bg-white text-xs font-medium text-forest-800 hover:bg-sand-50 transition-colors"
                >
                  Register Interest
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Events Found"
          description="Try modifying your search or resetting format filters to view all upcoming national conferences and webinars."
          icon={<CalendarIcon size={24} />}
          action={
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedFormat("all");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-lg bg-forest-800 text-white text-sm font-medium hover:bg-forest-900 transition-colors"
            >
              Reset Filters
            </button>
          }
        />
      )}
    </div>
  );
}
