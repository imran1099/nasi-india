/**
 * Data Access Layer — Enquiries & Membership Applications
 *
 * Provides database queries, administrative management, authorized assignment,
 * status transitions, internal staff notes, and RFC 4180 protected CSV export.
 */

import { prisma } from "@/lib/db";
import { EnquiryStatus, Role, type Prisma } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

export interface EnquiryItem {
  id: string;
  type: "contact" | "membership";
  name: string;
  email: string;
  phone: string | null;
  subject?: string | null;
  message?: string | null;
  city?: string | null;
  state?: string | null;
  occupation?: string | null;
  preferredClub?: string | null;
  status: EnquiryStatus;
  isRead: boolean;
  repliedAt: Date | null;
  assignedToId: string | null;
  assignedToName: string | null;
  internalNotes: string | null;
  emailDelivered: boolean;
  emailError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnquiriesFilter {
  type?: "ALL" | "CONTACT" | "MEMBERSHIP";
  status?: "ALL" | "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
  search?: string;
}

/**
 * Retrieves all enquiries matching search and status criteria.
 */
export async function getAdminEnquiries(filter: EnquiriesFilter = {}): Promise<{
  contacts: EnquiryItem[];
  memberships: EnquiryItem[];
  combined: EnquiryItem[];
}> {
  const { type = "ALL", status = "ALL", search } = filter;

  const contactWhere: Prisma.ContactEnquiryWhereInput = {};
  const membershipWhere: Prisma.MembershipEnquiryWhereInput = {};

  if (status !== "ALL") {
    contactWhere.status = status as EnquiryStatus;
    membershipWhere.status = status as EnquiryStatus;
  }

  if (search && search.trim().length > 0) {
    const s = search.trim();
    contactWhere.OR = [
      { name: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { phone: { contains: s, mode: "insensitive" } },
      { subject: { contains: s, mode: "insensitive" } },
      { message: { contains: s, mode: "insensitive" } },
    ];

    membershipWhere.OR = [
      { name: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { phone: { contains: s, mode: "insensitive" } },
      { city: { contains: s, mode: "insensitive" } },
      { occupation: { contains: s, mode: "insensitive" } },
      { preferredClub: { contains: s, mode: "insensitive" } },
      { motivation: { contains: s, mode: "insensitive" } },
    ];
  }

  const fetchContacts = type === "ALL" || type === "CONTACT";
  const fetchMemberships = type === "ALL" || type === "MEMBERSHIP";

  const [rawContacts, rawMemberships] = await Promise.all([
    fetchContacts
      ? prisma.contactEnquiry.findMany({
          where: contactWhere,
          include: { assignedTo: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [],
    fetchMemberships
      ? prisma.membershipEnquiry.findMany({
          where: membershipWhere,
          include: { assignedTo: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ]);

  const contacts: EnquiryItem[] = rawContacts.map((c) => ({
    id: c.id,
    type: "contact",
    name: c.name,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    status: c.status,
    isRead: c.isRead,
    repliedAt: c.repliedAt,
    assignedToId: c.assignedToId,
    assignedToName: c.assignedTo?.name || null,
    internalNotes: c.internalNotes,
    emailDelivered: c.emailDelivered,
    emailError: c.emailError,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  const memberships: EnquiryItem[] = rawMemberships.map((m) => ({
    id: m.id,
    type: "membership",
    name: m.name,
    email: m.email,
    phone: m.phone,
    city: m.city,
    state: m.state,
    occupation: m.occupation,
    preferredClub: m.preferredClub,
    message: m.motivation,
    status: m.status,
    isRead: m.isRead,
    repliedAt: m.repliedAt,
    assignedToId: m.assignedToId,
    assignedToName: m.assignedTo?.name || null,
    internalNotes: m.internalNotes,
    emailDelivered: m.emailDelivered,
    emailError: m.emailError,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));

  const combined = [...contacts, ...memberships].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return { contacts, memberships, combined };
}

/**
 * List administrators for assignment selector.
 */
export async function getAssigneeOptions(): Promise<{ id: string; name: string; role: Role }[]> {
  return prisma.user.findMany({
    where: {
      isActive: true,
      role: { in: [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN] },
    },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Updates status, assignment, and internal staff notes for an enquiry.
 */
export async function updateEnquiryRecord(params: {
  id: string;
  type: "contact" | "membership";
  status: EnquiryStatus;
  internalNotes?: string | null;
  assignedToId?: string | null;
  actorUserId?: string | null;
}): Promise<EnquiryItem> {
  const { id, type, status, internalNotes, assignedToId, actorUserId } = params;

  if (type === "contact") {
    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: {
        status,
        isRead: status !== EnquiryStatus.NEW,
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(assignedToId !== undefined ? { assignedToId } : {}),
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    await logAuditEvent({
      userId: actorUserId,
      action: AuditAction.UPDATE,
      entityType: "ContactEnquiry",
      entityId: id,
      changes: { status, assignedToId, internalNotesUpdated: internalNotes !== undefined },
    });

    return {
      id: updated.id,
      type: "contact",
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      subject: updated.subject,
      message: updated.message,
      status: updated.status,
      isRead: updated.isRead,
      repliedAt: updated.repliedAt,
      assignedToId: updated.assignedToId,
      assignedToName: updated.assignedTo?.name || null,
      internalNotes: updated.internalNotes,
      emailDelivered: updated.emailDelivered,
      emailError: updated.emailError,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  } else {
    const updated = await prisma.membershipEnquiry.update({
      where: { id },
      data: {
        status,
        isRead: status !== EnquiryStatus.NEW,
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(assignedToId !== undefined ? { assignedToId } : {}),
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    await logAuditEvent({
      userId: actorUserId,
      action: AuditAction.UPDATE,
      entityType: "MembershipEnquiry",
      entityId: id,
      changes: { status, assignedToId, internalNotesUpdated: internalNotes !== undefined },
    });

    return {
      id: updated.id,
      type: "membership",
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      city: updated.city,
      state: updated.state,
      occupation: updated.occupation,
      preferredClub: updated.preferredClub,
      message: updated.motivation,
      status: updated.status,
      isRead: updated.isRead,
      repliedAt: updated.repliedAt,
      assignedToId: updated.assignedToId,
      assignedToName: updated.assignedTo?.name || null,
      internalNotes: updated.internalNotes,
      emailDelivered: updated.emailDelivered,
      emailError: updated.emailError,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

/**
 * Generates an RFC 4180 compliant CSV export protected against CSV formula injection.
 * Any field starting with '=', '+', '-', '@', '\t', or '\r' is prefixed with an apostrophe.
 */
export async function exportEnquiriesCsv(
  type: "ALL" | "CONTACT" | "MEMBERSHIP",
  actorUserId?: string | null
): Promise<{ filename: string; csv: string }> {
  const { combined } = await getAdminEnquiries({ type });

  const headers = [
    "Enquiry ID",
    "Type",
    "Name",
    "Email",
    "Phone",
    "Subject / Preferred Club",
    "Location",
    "Occupation",
    "Message / Motivation",
    "Status",
    "Assigned To",
    "Email Delivered",
    "Internal Notes",
    "Received Date",
  ];

  const rows = combined.map((item) => [
    item.id,
    item.type === "contact" ? "Contact Inquiry" : "Membership Application",
    item.name,
    item.email,
    item.phone || "",
    item.type === "contact" ? item.subject || "" : item.preferredClub || "",
    [item.city, item.state].filter(Boolean).join(", "),
    item.occupation || "",
    item.message || "",
    item.status,
    item.assignedToName || "Unassigned",
    item.emailDelivered ? "Yes" : "No (Logged to Portal)",
    item.internalNotes || "",
    item.createdAt.toISOString(),
  ]);

  const sanitizeCell = (val: string): string => {
    let str = String(val ?? "");
    // Prevent spreadsheet formula injection (CSV Injection / DDE)
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    // Escape double quotes
    return `"${str.replace(/"/g, '""')}"`;
  };

  const csvContent = [
    headers.map(sanitizeCell).join(","),
    ...rows.map((row) => row.map(sanitizeCell).join(",")),
  ].join("\r\n");

  await logAuditEvent({
    userId: actorUserId,
    action: AuditAction.CREATE,
    entityType: "EnquiryExport",
    entityId: type,
    changes: { exportedRecordsCount: combined.length, format: "CSV" },
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `nasi-india-enquiries-${type.toLowerCase()}-${timestamp}.csv`;

  return { filename, csv: csvContent };
}
