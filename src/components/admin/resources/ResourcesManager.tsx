"use client";

import React, { useState } from "react";
import {
  saveExternalResourceAction,
  toggleResourceActiveAction,
  deleteExternalResourceAction,
} from "@/actions/resources";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ResourceItem {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  badge: string | null;
  target: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface ResourcesManagerProps {
  initialResources: ResourceItem[];
}

export function ResourcesManager({ initialResources }: ResourcesManagerProps) {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Federation Gateway");
  const [badge, setBadge] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setCategory("Federation Gateway");
    setBadge("");
    setDisplayOrder(0);
    setIsActive(true);
    setErrorMsg(null);
  };

  const startEdit = (r: ResourceItem) => {
    setEditingId(r.id);
    setTitle(r.title);
    setUrl(r.url);
    setDescription(r.description || "");
    setCategory(r.category || "Federation Gateway");
    setBadge(r.badge || "");
    setDisplayOrder(r.displayOrder);
    setIsActive(r.isActive);
    setIsEditing(true);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    if (editingId) formData.append("id", editingId);
    formData.append("title", title);
    formData.append("url", url);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("badge", badge);
    formData.append("displayOrder", String(displayOrder));
    formData.append("isActive", isActive ? "true" : "false");

    try {
      const res = await saveExternalResourceAction(null, formData);
      if (!res.success) {
        setErrorMsg(res.error?.message || "Failed to save resource.");
      } else {
        const updatedItem: ResourceItem = {
          id: editingId || res.data!.id,
          title,
          url,
          description: description || null,
          category,
          badge: badge || null,
          target: "_blank",
          displayOrder,
          isActive,
        };

        if (editingId) {
          setResources((prev) =>
            prev.map((r) => (r.id === editingId ? updatedItem : r))
          );
        } else {
          setResources((prev) => [...prev, updatedItem]);
        }
        resetForm();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await toggleResourceActiveAction(id);
      if (res.success && res.data) {
        setResources((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isActive: res.data!.isActive } : r))
        );
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to toggle status.");
    }
  };

  const handleDelete = async (id: string, resourceTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${resourceTitle}"?`)) return;
    try {
      const res = await deleteExternalResourceAction(id);
      if (res.success) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete resource.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Modal / Drawer */}
      {isEditing && (
        <div className="p-5 bg-sand-50 border border-teal-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sand-200">
            <h3 className="font-serif font-bold text-forest-950 text-base">
              {editingId ? "Edit Resource Link" : "Add New Official Resource / Gateway"}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs text-forest-600 hover:text-forest-900 font-semibold"
            >
              Cancel
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Resource Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Soroptimist International of Europe"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Destination URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://soroptimisteurope.org or /join"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Federation Gateway / International"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Badge / Tag (Optional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Global Federation, Official"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Description / Context
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of the federation or resource portal..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-md bg-white focus:outline-none focus:border-teal-700 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-teal-700"
                />
                <span className="text-xs font-semibold text-forest-900">
                  Visible on Public Resources Page
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs text-forest-700 hover:text-forest-950 font-medium"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update Resource" : "Create Resource"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Roster & Add Action */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-forest-600">
          Showing {resources.length} configured resources & official links.
        </p>

        {!isEditing && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
          >
            + Add New Resource
          </Button>
        )}
      </div>

      <div className="overflow-x-auto border border-sand-200 rounded-lg bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
              <th className="py-3 px-4">Title & Details</th>
              <th className="py-3 px-4">URL Destination</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {resources.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-forest-500">
                  No resources configured yet.
                </td>
              </tr>
            ) : (
              resources.map((res) => (
                <tr key={res.id} className="hover:bg-sand-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-forest-950 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm">{res.title}</span>
                      {res.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-sand-200 text-forest-800 rounded">
                          {res.badge}
                        </span>
                      )}
                    </div>
                    {res.description && (
                      <p className="text-[11px] text-forest-600 line-clamp-1 mt-0.5">
                        {res.description}
                      </p>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-800 hover:text-teal-950 underline font-mono text-[11px] truncate max-w-xs block"
                    >
                      {res.url} ↗
                    </a>
                  </td>

                  <td className="py-3.5 px-4 text-forest-700">
                    {res.category ?? "General"}
                  </td>

                  <td className="py-3.5 px-4 text-forest-600 font-mono text-center">
                    {res.displayOrder}
                  </td>

                  <td className="py-3.5 px-4">
                    {res.isActive ? (
                      <Badge variant="forest" size="sm">Active</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Disabled</Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => startEdit(res)}
                        className="px-2 py-1 text-[11px] font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggle(res.id)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded border ${
                          res.isActive
                            ? "text-amber-900 bg-amber-50 border-amber-200 hover:bg-amber-100"
                            : "text-emerald-900 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {res.isActive ? "Hide" : "Show"}
                      </button>

                      <button
                        onClick={() => handleDelete(res.id, res.title)}
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
