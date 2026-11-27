"use client";

import React, { useState } from "react";
import Image from "next/image";
import { type CommitteeMember } from "@/data/committee";
import {
  saveCommitteeMemberAction,
  deleteCommitteeMemberAction,
} from "@/actions/committee";
import { MemberPhotoUpload } from "./MemberPhotoUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  EditIcon,
  TrashIcon,
  PlusIcon,
  CameraIcon,
} from "@/components/icons";

interface CommitteeManagerProps {
  initialMembers: CommitteeMember[];
}

const DEFAULT_AVATAR = "/images/default-avatar.svg";

export function CommitteeManager({ initialMembers }: CommitteeManagerProps) {
  const [members, setMembers] = useState<CommitteeMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formDesignation, setFormDesignation] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formClubAffiliation, setFormClubAffiliation] = useState("");
  const [formTenure, setFormTenure] = useState("Biennium 2026–2028");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formImage, setFormImage] = useState<string | null>(null);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Status & notifications
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Reset form
  const resetForm = () => {
    setEditingMember(null);
    setFormName("");
    setFormRole("");
    setFormDesignation("");
    setFormDepartment("Executive Leadership");
    setFormClubAffiliation("NASI India");
    setFormTenure("Biennium 2026–2028");
    setFormEmail("");
    setFormPhone("");
    setFormBio("");
    setFormImage(null);
    setFormDisplayOrder(members.length + 1);
    setFormIsActive(true);
    setFormError(null);
    setIsModalOpen(false);
  };

  // Open modal for new member
  const handleAddNew = () => {
    resetForm();
    setFormDisplayOrder(members.length + 1);
    setIsModalOpen(true);
  };

  // Open modal to edit member
  const handleEdit = (member: CommitteeMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormDesignation(member.designation || "");
    setFormDepartment(member.department || "");
    setFormClubAffiliation(member.clubAffiliation || "NASI India");
    setFormTenure(member.tenure || "Biennium 2026–2028");
    setFormEmail(member.emailPlaceholder || "");
    setFormBio(member.bio || "");
    setFormImage(member.image || null);
    setFormDisplayOrder(member.displayOrder ?? 0);
    setFormIsActive(member.isActive !== false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle member save (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) {
      setFormError("Member name and portfolio role are required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const formData = new FormData();
    if (editingMember?.id) {
      formData.append("id", editingMember.id);
    }
    formData.append("name", formName.trim());
    formData.append("role", formRole.trim());
    formData.append(
      "designation",
      formDesignation.trim() || `${formRole.trim()} – NASI India`
    );
    formData.append("department", formDepartment.trim() || "Executive Leadership");
    formData.append("clubAffiliation", formClubAffiliation.trim() || "NASI India");
    formData.append("tenure", formTenure.trim() || "Biennium 2026–2028");
    formData.append("email", formEmail.trim());
    formData.append("phone", formPhone.trim());
    formData.append("bio", formBio.trim());
    if (formImage) {
      formData.append("image", formImage);
    } else {
      formData.append("image", "");
    }
    formData.append("displayOrder", String(formDisplayOrder));
    formData.append("isActive", formIsActive ? "true" : "false");

    try {
      const res = await saveCommitteeMemberAction(null, formData);
      if (!res.success) {
        setFormError(res.error?.message || "Failed to save member.");
        return;
      }

      const savedId = res.data?.id || editingMember?.id || `member-${Date.now()}`;
      const initials =
        formName
          .split(" ")
          .map((n) => n[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase() || "SI";

      const updatedMember: CommitteeMember = {
        id: savedId,
        name: formName.trim(),
        role: formRole.trim(),
        roleShort: formRole.trim(),
        designation: formDesignation.trim() || `${formRole.trim()} – NASI India`,
        department: formDepartment.trim() || "Executive Leadership",
        clubAffiliation: formClubAffiliation.trim() || "NASI India",
        tenure: formTenure.trim() || "Biennium 2026–2028",
        emailPlaceholder: formEmail.trim() || "secretariat@nasi-india.org",
        initials,
        image: formImage,
        bio: formBio.trim(),
        displayOrder: formDisplayOrder,
        isActive: formIsActive,
      };

      if (editingMember) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editingMember.id || m.name === editingMember.name
              ? updatedMember
              : m
          )
        );
        setFeedbackMessage({
          type: "success",
          text: `Updated "${updatedMember.name}" successfully.`,
        });
      } else {
        setMembers((prev) => [...prev, updatedMember]);
        setFeedbackMessage({
          type: "success",
          text: `Added new member "${updatedMember.name}" successfully.`,
        });
      }

      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (member: CommitteeMember) => {
    if (
      !confirm(
        `Are you sure you want to remove "${member.name}" (${member.role}) from the committee board?`
      )
    ) {
      return;
    }

    try {
      if (member.id) {
        await deleteCommitteeMemberAction(member.id);
      }
      setMembers((prev) =>
        prev.filter((m) => (m.id ? m.id !== member.id : m.name !== member.name))
      );
      setFeedbackMessage({
        type: "success",
        text: `Removed "${member.name}" from committee roster.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete member.";
      setFeedbackMessage({ type: "error", text: msg });
    }
  };

  // Quick remove photo only
  const handleQuickRemovePhoto = async (member: CommitteeMember) => {
    if (!confirm(`Remove photo for "${member.name}" and revert to default avatar?`)) {
      return;
    }

    const formData = new FormData();
    if (member.id) formData.append("id", member.id);
    formData.append("name", member.name);
    formData.append("role", member.role);
    formData.append("designation", member.designation);
    formData.append("department", member.department);
    formData.append("clubAffiliation", member.clubAffiliation);
    formData.append("tenure", member.tenure);
    formData.append("email", member.emailPlaceholder);
    formData.append("bio", member.bio || "");
    formData.append("image", ""); // Clear photo
    formData.append("displayOrder", String(member.displayOrder ?? 0));
    formData.append("isActive", member.isActive !== false ? "true" : "false");

    try {
      const res = await saveCommitteeMemberAction(null, formData);
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            (m.id && m.id === member.id) || m.name === member.name
              ? { ...m, image: null }
              : m
          )
        );
        setFeedbackMessage({
          type: "success",
          text: `Photo removed for "${member.name}". Default avatar will now be shown.`,
        });
      }
    } catch {
      setFeedbackMessage({ type: "error", text: "Failed to remove photo." });
    }
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.designation.toLowerCase().includes(q) ||
      m.clubAffiliation.toLowerCase().includes(q)
    );
  });

  const photoCount = members.filter((m) => Boolean(m.image)).length;
  const defaultAvatarCount = members.length - photoCount;
  const activeCount = members.filter((m) => m.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            National Association Soroptimist India (NASI-India)
          </span>
          <h1 className="text-2xl font-serif font-bold text-forest-950">
            NASI India Board: 2026–2028 Management
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-0.5">
            Manage board members, executive portfolios, and profile photographs for Biennium 2026–2028.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button href="/committee" variant="outline" size="sm" isExternal>
            View Public Committee
          </Button>
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#005596] hover:bg-[#004780] rounded-lg shadow-sm hover:shadow transition-all"
          >
            <PlusIcon size={15} />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-xs">
          <span className="text-xs text-forest-600 block">Total Board Members</span>
          <span className="text-2xl font-bold font-serif text-forest-950 mt-1 block">
            {members.length}
          </span>
          <span className="text-[11px] text-teal-800 font-medium">Biennium 2026–2028</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-xs">
          <span className="text-xs text-forest-600 block">Uploaded Photographs</span>
          <span className="text-2xl font-bold font-serif text-[#005596] mt-1 block">
            {photoCount}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            {((photoCount / (members.length || 1)) * 100).toFixed(0)}% with custom photo
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-xs">
          <span className="text-xs text-forest-600 block">Using Default Avatar</span>
          <span className="text-2xl font-bold font-serif text-amber-700 mt-1 block">
            {defaultAvatarCount}
          </span>
          <span className="text-[11px] text-amber-800 font-medium">
            Official vector silhouette
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-xs">
          <span className="text-xs text-forest-600 block">Active Status</span>
          <span className="text-2xl font-bold font-serif text-emerald-700 mt-1 block">
            {activeCount}
          </span>
          <span className="text-[11px] text-forest-600 font-medium">Live on website</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs underline hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Roster Card */}
      <Card variant="elevated" className="bg-white overflow-hidden">
        <CardHeader className="bg-sand-50/60 border-b border-sand-200 py-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle as="h2" className="text-base text-forest-950 font-serif">
              National Board Portfolios &amp; Member Photographs
            </CardTitle>
            <p className="text-xs text-forest-600">
              Showing {filteredMembers.length} of {members.length} leaders
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name, role, club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-white focus:outline-none focus:border-[#005596]"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100/50 text-forest-800 font-semibold border-b border-sand-200">
                  <th className="py-3 px-4 w-16 text-center">Photo</th>
                  <th className="py-3 px-4">Officer Name &amp; Role</th>
                  <th className="py-3 px-4">Department / Domain</th>
                  <th className="py-3 px-4">Club Affiliation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredMembers.map((member, idx) => {
                  const hasPhoto = Boolean(member.image);
                  return (
                    <tr
                      key={member.id || `${member.role}-${idx}`}
                      className="hover:bg-sand-50/60 transition-colors"
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4 text-center">
                        <div className="relative w-11 h-11 mx-auto rounded-xl overflow-hidden bg-white border border-sand-300 shadow-2xs flex items-center justify-center">
                          {hasPhoto ? (
                            <Image
                              src={member.image!}
                              alt={member.name}
                              fill
                              sizes="44px"
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#E8F3FC] flex items-center justify-center">
                              <Image
                                src={DEFAULT_AVATAR}
                                alt="Default Avatar"
                                width={28}
                                height={28}
                                className="opacity-80"
                              />
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                              hasPhoto ? "bg-emerald-500" : "bg-amber-400"
                            }`}
                            title={hasPhoto ? "Uploaded photo" : "Default avatar"}
                          />
                        </div>
                      </td>

                      {/* Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-forest-950 text-sm">
                          {member.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-900 font-mono text-[10px] font-semibold">
                            {member.roleShort || member.role}
                          </span>
                          <span className="text-[11px] text-forest-600">
                            {member.designation}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-forest-700">
                        <div>{member.department}</div>
                        <div className="text-[10px] font-mono text-forest-500">
                          {member.tenure}
                        </div>
                      </td>

                      {/* Club Affiliation */}
                      <td className="py-3.5 px-4 font-medium text-teal-900">
                        {member.clubAffiliation}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            variant={member.isActive !== false ? "forest" : "neutral"}
                            size="sm"
                          >
                            {member.isActive !== false ? "Active" : "Inactive"}
                          </Badge>
                          <span
                            className={`text-[10px] font-medium ${
                              hasPhoto ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {hasPhoto ? "● Custom Photo" : "○ Default Avatar"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#005596] bg-[#E8F3FC] hover:bg-[#D7E8F5] border border-[#005596]/20 rounded-md transition-colors"
                            title="Edit member details and photograph"
                          >
                            <EditIcon size={12} />
                            <span>Edit Photo &amp; Info</span>
                          </button>

                          {hasPhoto && (
                            <button
                              type="button"
                              onClick={() => handleQuickRemovePhoto(member)}
                              className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-md transition-colors"
                              title="Remove custom photo (switch to default avatar)"
                            >
                              <CameraIcon size={14} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(member)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete member"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-forest-600 text-xs">
                      No committee members match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Member Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-sand-300 max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-sand-50/80 border-b border-sand-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                  {editingMember ? "Edit Committee Profile" : "New Committee Member"}
                </span>
                <h3 className="text-lg font-serif font-bold text-forest-950">
                  {editingMember ? `Edit ${editingMember.name}` : "Add National Board Member"}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-white border border-sand-300 text-forest-700 hover:bg-sand-100 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              {/* 1. Member Photograph Upload Section */}
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                <MemberPhotoUpload
                  label="Member Profile Photograph"
                  value={formImage}
                  onChange={(url) => setFormImage(url)}
                  disabled={isSubmitting}
                />
              </div>

              {/* 2. Personal & Portfolio Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dr. Anitha Rajarajan"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Portfolio Role <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. President, Secretary, PAC"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Designation Title
                  </label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. President – NASI India"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Department / Leadership Domain
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="e.g. Executive Leadership"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Club Affiliation
                  </label>
                  <input
                    type="text"
                    value={formClubAffiliation}
                    onChange={(e) => setFormClubAffiliation(e.target.value)}
                    placeholder="e.g. SI Madurai, SI Calcutta, NASI India"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Biennium Tenure
                  </label>
                  <input
                    type="text"
                    value={formTenure}
                    onChange={(e) => setFormTenure(e.target.value)}
                    placeholder="e.g. Biennium 2026–2028"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Official Email Liaison
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. president@nasi-india.org"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                  />
                </div>
              </div>

              {/* Bio / Profile summary */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Executive Profile &amp; Bio Summary
                </label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Leadership overview, contributions to Soroptimist International, and regional impact..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-sand-300 rounded-lg bg-white focus:outline-none focus:border-[#005596]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#005596] rounded border-sand-300 focus:ring-[#005596]"
                />
                <label
                  htmlFor="formIsActive"
                  className="text-xs font-semibold text-forest-900 cursor-pointer"
                >
                  Active and displayed on public Board directory
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-forest-700 bg-sand-100 hover:bg-sand-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#005596] hover:bg-[#004780] rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Member...</span>
                    </>
                  ) : (
                    <span>{editingMember ? "Save Changes" : "Create Member"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
