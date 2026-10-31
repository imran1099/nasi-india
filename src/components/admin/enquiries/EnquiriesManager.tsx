"use client";

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  PhoneIcon,
  SearchIcon,
  DownloadIcon,
  CheckCircleIcon,
  XIcon,
} from "@/components/icons";
import { type EnquiryItem } from "@/lib/dal/enquiries";
import {
  updateEnquiryStatusAction,
  exportEnquiriesCsvAction,
} from "@/actions/enquiries";
import { EnquiryStatus, Role } from "@prisma/client";

interface EnquiriesManagerProps {
  initialContacts: EnquiryItem[];
  initialMemberships: EnquiryItem[];
  assignees: { id: string; name: string; role: Role }[];
}

export function EnquiriesManager({
  initialContacts,
  initialMemberships,
  assignees,
}: EnquiriesManagerProps) {
  const [contacts, setContacts] = useState<EnquiryItem[]>(initialContacts);
  const [memberships, setMemberships] = useState<EnquiryItem[]>(initialMemberships);

  const [activeTab, setActiveTab] = useState<"ALL" | "CONTACT" | "MEMBERSHIP">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedItem, setSelectedItem] = useState<EnquiryItem | null>(null);
  const [editStatus, setEditStatus] = useState<EnquiryStatus>(EnquiryStatus.NEW);
  const [editNotes, setEditNotes] = useState<string>("");
  const [editAssignedToId, setEditAssignedToId] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Combine items
  const allItems = [...contacts, ...memberships].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter items
  const filteredItems = allItems.filter((item) => {
    if (activeTab === "CONTACT" && item.type !== "contact") return false;
    if (activeTab === "MEMBERSHIP" && item.type !== "membership") return false;
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchPhone = item.phone?.toLowerCase().includes(q) ?? false;
      const matchSubject = item.subject?.toLowerCase().includes(q) ?? false;
      const matchClub = item.preferredClub?.toLowerCase().includes(q) ?? false;
      const matchMessage = item.message?.toLowerCase().includes(q) ?? false;
      const matchLocation = `${item.city || ""} ${item.state || ""}`.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchSubject || matchClub || matchMessage || matchLocation;
    }

    return true;
  });

  const openManageModal = (item: EnquiryItem) => {
    setSelectedItem(item);
    setEditStatus(item.status);
    setEditNotes(item.internalNotes || "");
    setEditAssignedToId(item.assignedToId || "");
    setActionError(null);
    setActionSuccess(null);
  };

  const handleSaveUpdates = () => {
    if (!selectedItem) return;

    setActionError(null);
    setActionSuccess(null);

    startTransition(async () => {
      const res = await updateEnquiryStatusAction({
        id: selectedItem.id,
        type: selectedItem.type,
        status: editStatus,
        internalNotes: editNotes,
        assignedToId: editAssignedToId ? editAssignedToId : null,
      });

      if (res.success && res.data) {
        const updated = res.data;
        if (updated.type === "contact") {
          setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        } else {
          setMemberships((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        }
        setSelectedItem(updated);
        setActionSuccess("Enquiry updated successfully.");
      } else {
        setActionError(!res.success ? res.error.message : "Failed to update record.");
      }
    });
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const res = await exportEnquiriesCsvAction(activeTab);
      if (res.success && res.data) {
        const { filename, csv } = res.data;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(!res.success ? res.error.message : "Export failed.");
      }
    } catch (err) {
      alert("An error occurred during export.");
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case EnquiryStatus.NEW:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-900 border border-teal-300">
            NEW
          </span>
        );
      case EnquiryStatus.IN_PROGRESS:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            IN PROGRESS
          </span>
        );
      case EnquiryStatus.RESOLVED:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            RESOLVED
          </span>
        );
      case EnquiryStatus.ARCHIVED:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sand-200 text-forest-700 border border-sand-300">
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-sand-300 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-sand-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === "ALL"
                ? "bg-white text-forest-950 shadow-sm"
                : "text-forest-700 hover:text-forest-950"
            }`}
          >
            All ({allItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CONTACT")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === "CONTACT"
                ? "bg-white text-forest-950 shadow-sm"
                : "text-forest-700 hover:text-forest-950"
            }`}
          >
            Contact Inquiries ({contacts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MEMBERSHIP")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === "MEMBERSHIP"
                ? "bg-white text-forest-950 shadow-sm"
                : "text-forest-700 hover:text-forest-950"
            }`}
          >
            Membership Applications ({memberships.length})
          </button>
        </div>

        {/* Search, Status & CSV Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <SearchIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search sender, club, note…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-sand-50/50 text-forest-950 placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-sand-50/50 text-forest-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* CSV Export */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={isExporting || filteredItems.length === 0}
            className="text-xs flex items-center gap-1.5"
          >
            <DownloadIcon size={14} />
            {isExporting ? "Exporting…" : "Export Protected CSV"}
          </Button>
        </div>
      </div>

      {/* 2. Enquiries Table */}
      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-3 px-6 flex flex-row items-center justify-between">
          <CardTitle as="h2" className="text-sm font-semibold text-forest-950">
            {activeTab === "ALL"
              ? "All Inbox Communications"
              : activeTab === "CONTACT"
              ? "Contact Inquiries"
              : "Membership Applications"}{" "}
            <span className="text-forest-500 font-normal">({filteredItems.length} records)</span>
          </CardTitle>
          <span className="text-[11px] text-forest-600 font-medium">
            Confidential Admin Access Only
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-forest-600 text-xs">
              No enquiry records found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Sender / Applicant</th>
                    <th className="py-3 px-4">Subject / Preferred Club</th>
                    <th className="py-3 px-4">Received</th>
                    <th className="py-3 px-4">Delivery</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-sand-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.type === "contact" ? (
                          <Badge variant="teal" size="sm">
                            Contact
                          </Badge>
                        ) : (
                          <Badge variant="forest" size="sm">
                            Membership
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-forest-950">
                        <div>{item.name}</div>
                        <div className="font-mono text-[11px] text-forest-600 font-normal">
                          {item.email}
                        </div>
                        {item.phone && (
                          <div className="text-[11px] text-forest-500 font-mono flex items-center gap-1 mt-0.5">
                            <PhoneIcon size={11} className="text-teal-700" />
                            {item.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-forest-800">
                        <div className="font-medium text-forest-950">
                          {item.type === "contact"
                            ? item.subject || "General Inquiry"
                            : item.preferredClub || "National Assignment"}
                        </div>
                        <div className="text-forest-600 truncate max-w-xs mt-0.5">
                          {item.message || "—"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-forest-600 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.emailDelivered ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Emailed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest-700 bg-sand-100 px-1.5 py-0.5 rounded border border-sand-200" title={item.emailError || "Logged to database portal"}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Portal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-forest-700 whitespace-nowrap">
                        {item.assignedToName ? (
                          <span className="font-medium text-forest-950">
                            {item.assignedToName}
                          </span>
                        ) : (
                          <span className="text-forest-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openManageModal(item)}
                          className="text-xs"
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Manage Detail & Assignment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-forest-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-sand-50/90 backdrop-blur-xs border-b border-sand-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Badge
                  variant={selectedItem.type === "contact" ? "teal" : "forest"}
                  size="sm"
                >
                  {selectedItem.type === "contact" ? "Contact Inquiry" : "Membership Application"}
                </Badge>
                <h3 className="text-base font-serif font-bold text-forest-950">
                  Manage Submission
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-forest-500 hover:text-forest-950 p-1 rounded-md"
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Alert Feedback */}
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-emerald-700" />
                  <span>{actionSuccess}</span>
                </div>
              )}
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs">
                  {actionError}
                </div>
              )}

              {/* Submitter Details Grid */}
              <div className="bg-sand-50/70 p-4 rounded-xl border border-sand-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-forest-500 font-semibold block uppercase tracking-wider text-[10px]">
                      Full Name
                    </span>
                    <span className="font-semibold text-forest-950 text-sm">
                      {selectedItem.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-forest-500 font-semibold block uppercase tracking-wider text-[10px]">
                      Email
                    </span>
                    <a
                      href={`mailto:${selectedItem.email}`}
                      className="text-teal-800 underline font-mono text-xs hover:text-forest-950"
                    >
                      {selectedItem.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-forest-500 font-semibold block uppercase tracking-wider text-[10px]">
                      Telephone / Mobile
                    </span>
                    <span className="font-mono text-forest-900">
                      {selectedItem.phone || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-forest-500 font-semibold block uppercase tracking-wider text-[10px]">
                      Received Timestamp
                    </span>
                    <span className="text-forest-700 font-mono">
                      {new Date(selectedItem.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </span>
                  </div>
                  {selectedItem.type === "membership" && (
                    <>
                      <div>
                        <span className="text-forest-500 font-semibold block uppercase tracking-wider text-[10px]">
                          Preferred Club Chapter
                        </span>
                        <span className="text-teal-900 font-semibold">
                          {selectedItem.preferredClub || "National Assignment"}
                        </span>
                      </div>
                      <div>
                        <span className="text-forest-500 font-semibold block uppercase tracking-wider text-[10px]">
                          Location & Occupation
                        </span>
                        <span className="text-forest-800">
                          {[selectedItem.city, selectedItem.state].filter(Boolean).join(", ") || "—"} • {selectedItem.occupation || "—"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Notification state */}
                <div className="pt-2 border-t border-sand-200 flex items-center justify-between text-[11px]">
                  <span className="text-forest-600">
                    Email Notification Status:
                  </span>
                  {selectedItem.emailDelivered ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircleIcon size={13} />
                      Dispatched successfully
                    </span>
                  ) : (
                    <span className="text-forest-600 font-mono">
                      Not emailed ({selectedItem.emailError || "Safely logged in portal"})
                    </span>
                  )}
                </div>
              </div>

              {/* Message Details */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-800 mb-1.5">
                  {selectedItem.type === "contact" ? "Enquiry Message" : "Motivation & Statement"}
                </h4>
                <div className="p-4 bg-white border border-sand-300 rounded-xl text-xs sm:text-sm text-forest-950 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedItem.message || "No additional text provided."}
                </div>
              </div>

              {/* Editable Fields: Status & Authorized Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-sand-300 bg-white text-forest-950 focus:ring-2 focus:ring-teal-700"
                  >
                    <option value={EnquiryStatus.NEW}>NEW (Unprocessed)</option>
                    <option value={EnquiryStatus.IN_PROGRESS}>IN PROGRESS (Active Review)</option>
                    <option value={EnquiryStatus.RESOLVED}>RESOLVED (Completed)</option>
                    <option value={EnquiryStatus.ARCHIVED}>ARCHIVED (Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Assign Administrator
                  </label>
                  <select
                    value={editAssignedToId}
                    onChange={(e) => setEditAssignedToId(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-sand-300 bg-white text-forest-950 focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="">— Unassigned —</option>
                    {assignees.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Internal Notes &amp; Follow-up History
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record internal notes, telephone outreach details, or club assignment progress..."
                  className="w-full text-xs py-2 px-3 rounded-lg border border-sand-300 bg-white text-forest-950 focus:ring-2 focus:ring-teal-700 placeholder-forest-400"
                />
                <p className="text-[11px] text-forest-500 mt-1">
                  Internal notes are confidential and visible only to authorized national administrators.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-sand-50/90 backdrop-blur-xs border-t border-sand-200 p-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSaveUpdates}
                disabled={isPending}
              >
                {isPending ? "Saving Changes…" : "Save Updates"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
