"use client";

import React, { useState } from "react";
import Link from "next/link";
import { setNewsArticleStatusAction, deleteNewsArticleAction } from "@/actions/news";
import { Badge } from "@/components/ui/Badge";
import { PublishStatus } from "@prisma/client";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  publishedAt: Date | string | null;
  scheduledAt: Date | string | null;
  authorName: string | null;
  category: { id: string; name: string; slug: string } | null;
  club: { id: string; name: string; slug: string } | null;
}

interface NewsListProps {
  initialArticles: ArticleItem[];
  categories: { id: string; name: string; slug: string }[];
}

export function NewsList({ initialArticles, categories }: NewsListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [operatingId, setOperatingId] = useState<string | null>(null);

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      !searchTerm ||
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.authorName && a.authorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.category && a.category.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || (a.category && a.category.slug === categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = async (id: string, newStatus: PublishStatus) => {
    setOperatingId(id);
    try {
      const res = await setNewsArticleStatusAction(id, newStatus);
      if (res.success) {
        setArticles((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: res.data.status } : item
          )
        );
      } else {
        alert(res.error.message || "Failed to update status.");
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error updating status.");
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
      const res = await deleteNewsArticleAction(id);
      if (res.success) {
        setArticles((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.error?.message || "Failed to delete article.");
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Error deleting article.");
    } finally {
      setOperatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="forest" size="sm">Published</Badge>;
      case "SCHEDULED":
        return <Badge variant="gold" size="sm">Scheduled</Badge>;
      case "PENDING_APPROVAL":
        return <Badge variant="outline" size="sm">Review Pending</Badge>;
      case "ARCHIVED":
        return <Badge variant="neutral" size="sm">Archived</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Draft</Badge>;
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
            placeholder="Search articles by headline or author..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-sand-300 rounded-md bg-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PENDING_APPROVAL">Pending Review</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-sand-300 rounded-md bg-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Roster */}
      <div className="overflow-x-auto border border-sand-200 rounded-lg bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
              <th className="py-3 px-4">Headline / Details</th>
              <th className="py-3 px-4">Category & Club</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Dates</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-forest-500">
                  No articles found matching the current filter.
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-forest-950 max-w-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/news/${article.id}`}
                        className="hover:text-teal-800 font-semibold text-xs sm:text-sm line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      {article.status === "PUBLISHED" && (
                        <a
                          href={`/news/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-teal-800 hover:underline px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                    {article.excerpt && (
                      <p className="text-[11px] text-forest-600 line-clamp-1 mt-0.5">
                        {article.excerpt}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-forest-700">
                    <div>
                      <span className="font-semibold text-teal-900">
                        {article.category?.name ?? "General"}
                      </span>
                      {article.club && (
                        <p className="text-[10px] text-forest-500">{article.club.name}</p>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-forest-700">
                    {article.authorName ?? "National Secretariat"}
                  </td>

                  <td className="py-3.5 px-4 text-forest-600 font-mono text-[11px]">
                    {article.status === "SCHEDULED" && article.scheduledAt ? (
                      <span className="text-amber-800 font-semibold">
                        Sched: {new Date(article.scheduledAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : article.publishedAt ? (
                      new Date(article.publishedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    ) : (
                      "Not published"
                    )}
                  </td>

                  <td className="py-3.5 px-4">{getStatusBadge(article.status)}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/news/${article.id}`}
                        className="px-2 py-1 text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100"
                      >
                        Edit
                      </Link>

                      {article.status !== "PUBLISHED" ? (
                        <button
                          disabled={operatingId === article.id}
                          onClick={() => handleStatusChange(article.id, PublishStatus.PUBLISHED)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          disabled={operatingId === article.id}
                          onClick={() => handleStatusChange(article.id, PublishStatus.ARCHIVED)}
                          className="px-2 py-1 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100"
                        >
                          Archive
                        </button>
                      )}

                      <button
                        disabled={operatingId === article.id}
                        onClick={() => handleDelete(article.id, article.title)}
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
