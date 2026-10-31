"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  setEventStatusAction,
  toggleEventCancellationAction,
  deleteEventAction,
} from "@/actions/events";
import { Badge } from "@/components/ui/Badge";
import { PublishStatus } from "@prisma/client";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  eventType: string;
  startsAt: Date | string;
  venue: string | null;
  city: string | null;
  state: string | null;
  status: string;
  isCancelled: boolean;
  club: { id: string; name: string; slug: string } | null;
}

interface EventsListProps {
  initialEvents: EventItem[];
}

export function EventsList({ initialEvents }: EventsListProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [operatingId, setOperatingId] = useState<string | null>(null);

  const filteredEvents = events.filter((e) => {
    const locationStr = [e.venue, e.city, e.state].filter(Boolean).join(" ");
    const matchesSearch =
      !searchTerm ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.club && e.club.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: PublishStatus) => {
    setOperatingId(id);
    try {
      const res = await setEventStatusAction(id, newStatus);
      if (res.success) {
        setEvents((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: res.data.status } : item
          )
        );
      } else {
        alert(res.error.message || "Failed to update status.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating event status.");
    } finally {
      setOperatingId(null);
    }
  };

  const handleToggleCancel = async (id: string) => {
    setOperatingId(id);
    try {
      const res = await toggleEventCancellationAction(id);
      if (res.success) {
        setEvents((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isCancelled: res.data.isCancelled } : item
          )
        );
      } else {
        alert(res.error.message || "Failed to toggle cancellation.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error toggling event cancellation.");
    } finally {
      setOperatingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    setOperatingId(id);
    try {
      const res = await deleteEventAction(id);
      if (res.success) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.error?.message || "Failed to delete event.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting event.");
    } finally {
      setOperatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-sand-50/60 p-3 rounded-lg border border-sand-200">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by title, venue, or host..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-sand-300 rounded-md bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-sand-200 rounded-lg bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
              <th className="py-3 px-4">Event Title</th>
              <th className="py-3 px-4">Date & Schedule</th>
              <th className="py-3 px-4">Format & Location</th>
              <th className="py-3 px-4">Host Club</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-forest-500">
                  No events found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-forest-950 max-w-xs">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="hover:text-teal-800 font-semibold text-xs sm:text-sm line-clamp-1"
                      >
                        {event.title}
                      </Link>
                      {event.isCancelled && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 border border-red-200">
                          CANCELLED
                        </span>
                      )}
                      {event.status === "PUBLISHED" && (
                        <a
                          href={`/events/${event.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-teal-800 hover:underline px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-forest-700 font-mono text-[11px]">
                    {new Date(event.startsAt).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-forest-700">
                    <span className="px-2 py-0.5 rounded bg-sand-100 text-forest-800 font-mono text-[11px] uppercase mr-1">
                      {event.eventType.replace("_", "-")}
                    </span>
                    <span className="text-forest-600">
                      {[event.venue, event.city].filter(Boolean).join(", ") || "Virtual"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-forest-700">
                    {event.club?.name ?? "NASI Secretariat"}
                  </td>

                  <td className="py-3.5 px-4">
                    {event.status === "PUBLISHED" ? (
                      <Badge variant="forest" size="sm">Published</Badge>
                    ) : event.status === "ARCHIVED" ? (
                      <Badge variant="neutral" size="sm">Archived</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Draft</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="px-2 py-1 text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100"
                      >
                        Edit
                      </Link>

                      <button
                        disabled={operatingId === event.id}
                        onClick={() => handleToggleCancel(event.id)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded border ${
                          event.isCancelled
                            ? "text-emerald-900 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                            : "text-amber-900 bg-amber-50 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {event.isCancelled ? "Uncancel" : "Cancel"}
                      </button>

                      {event.status !== "PUBLISHED" ? (
                        <button
                          disabled={operatingId === event.id}
                          onClick={() => handleStatusChange(event.id, PublishStatus.PUBLISHED)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          disabled={operatingId === event.id}
                          onClick={() => handleStatusChange(event.id, PublishStatus.ARCHIVED)}
                          className="px-2 py-1 text-[11px] font-semibold text-neutral-800 bg-neutral-100 border border-neutral-300 rounded hover:bg-neutral-200"
                        >
                          Archive
                        </button>
                      )}

                      <button
                        disabled={operatingId === event.id}
                        onClick={() => handleDelete(event.id, event.title)}
                        className="px-2 py-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
