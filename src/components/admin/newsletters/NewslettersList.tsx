"use client";

import React, { useState } from "react";
import Link from "next/link";
import { approveNewsletterAction, deleteNewsletterAction } from "@/actions/newsletters";
import { Badge } from "@/components/ui/Badge";

interface NewsletterItem {
  id: string;
  slug: string;
  title: string;
  issueNumber: string | null;
  volumeNumber: string | null;
  fileUrl: string | null;
  status: string;
  isApproved: boolean;
  publishedAt: Date | string | null;
  club: { id: string; name: string; slug: string } | null;
}

interface NewslettersListProps {
  initialNewsletters: NewsletterItem[];
}

export function NewslettersList({ initialNewsletters }: NewslettersListProps) {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>(initialNewsletters);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [operatingId, setOperatingId] = useState<string | null>(null);

  const filtered = newsletters.filter((n) => {
    const matchesSearch =
      !searchTerm ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.issueNumber && n.issueNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.club && n.club.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: string, publishImmediately: boolean) => {
    setOperatingId(id);
    try {
      const res = await approveNewsletterAction(id, publishImmediately);
      if (res.success) {
        setNewsletters((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isApproved: res.data.isApproved,
                  status: res.data.status,
                }
              : item
          )
        );
      } else {
        alert(res.error.message || "Failed to approve newsletter.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error approving newsletter.");
    } finally {
      setOperatingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setOperatingId(id);
    try {
      const res = await deleteNewsletterAction(id);
      if (res.success) {
        setNewsletters((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.error?.message || "Failed to delete newsletter.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting newsletter.");
    } finally {
      setOperatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-sand-50/60 p-3 rounded-lg border border-sand-200">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search newsletters by title or issue number..."
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
            <option value="PENDING_APPROVAL">Pending Review</option>
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
              <th className="py-3 px-4">Publication Title</th>
              <th className="py-3 px-4">Issue / Volume</th>
              <th className="py-3 px-4">Approval</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Document</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-forest-500">
                  No newsletters found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-forest-950 max-w-xs">
                    <Link
                      href={`/admin/newsletters/${item.id}`}
                      className="hover:text-teal-800 font-semibold text-xs sm:text-sm line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    {item.club && (
                      <p className="text-[11px] text-forest-500">{item.club.name}</p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-forest-700 font-mono text-[11px]">
                    {item.issueNumber ?? "—"}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ⏳ Pending Approval
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.status === "PUBLISHED" ? (
                      <Badge variant="forest" size="sm">Published</Badge>
                    ) : item.status === "ARCHIVED" ? (
                      <Badge variant="neutral" size="sm">Archived</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Draft</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-800 hover:text-teal-950 underline font-semibold flex items-center gap-1"
                      >
                        PDF Download ↗
                      </a>
                    ) : (
                      <span className="text-forest-400 italic">No PDF attached</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/newsletters/${item.id}`}
                        className="px-2 py-1 text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100"
                      >
                        Edit
                      </Link>

                      {!item.isApproved && (
                        <button
                          disabled={operatingId === item.id}
                          onClick={() => handleApprove(item.id, true)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
                        >
                          Approve & Publish
                        </button>
                      )}

                      <button
                        disabled={operatingId === item.id}
                        onClick={() => handleDelete(item.id, item.title)}
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
