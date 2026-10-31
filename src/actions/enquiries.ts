"use server";

import { headers } from "next/headers";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import {
  contactEnquirySchema,
  membershipEnquirySchema,
  enquiryStatusUpdateSchema,
} from "@/lib/validations";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { checkRateLimit, hashClientIdentifier } from "@/lib/rate-limiter";
import {
  sendContactNotificationEmail,
  sendMembershipNotificationEmail,
} from "@/lib/email";
import {
  updateEnquiryRecord,
  exportEnquiriesCsv,
  type EnquiryItem,
} from "@/lib/dal/enquiries";
import { requireAuth } from "@/lib/auth/session";
import { Role, EnquiryStatus } from "@prisma/client";

// Helper to extract client IP safely
async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch {
    // Headers may be unavailable in some test runners
  }
  return "127.0.0.1";
}

// ---------------------------------------------------------------------------
// Public: Submit a Contact Us enquiry
// ---------------------------------------------------------------------------

export interface PublicEnquiryResult {
  id: string;
  emailDelivered: boolean;
  message: string;
}

export async function submitContactEnquiry(
  formData: FormData
): Promise<ApiResponse<PublicEnquiryResult>> {
  try {
    // 1. Spam Prevention: Honeypot check
    const honeypot = formData.get("hp_national_code");
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn("[submitContactEnquiry] Honeypot triggered; discarding bot submission.");
      return fail("VALIDATION_ERROR", "Unable to process request at this time.");
    }

    // 2. Client Privacy & Rate Limiting
    const clientIp = await getClientIp();
    const hashedIp = hashClientIdentifier(clientIp);
    const rateCheck = checkRateLimit(`contact:${hashedIp}`, 5, 10 * 60 * 1000);

    if (!rateCheck.allowed) {
      return fail(
        "RATE_LIMIT",
        `Too many submissions from your connection. Please wait ${rateCheck.resetSeconds} seconds before trying again.`
      );
    }

    // 3. Server-side validation
    const raw = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      subject: formData.get("subject") || undefined,
      message: formData.get("message"),
      consent: formData.get("consent"),
      hp_national_code: formData.get("hp_national_code") || undefined,
    };

    const parsed = contactEnquirySchema.parse(raw);

    // 4. PostgreSQL Persistence
    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        subject: parsed.subject,
        message: parsed.message,
        status: EnquiryStatus.NEW,
        consentGiven: true,
        ipHash: hashedIp,
      },
    });

    // 5. Email Notification with graceful failure handling
    const emailResult = await sendContactNotificationEmail({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      subject: enquiry.subject,
      message: enquiry.message,
      createdAt: enquiry.createdAt,
    });

    // Update database record with notification delivery state
    await prisma.contactEnquiry.update({
      where: { id: enquiry.id },
      data: {
        emailDelivered: emailResult.delivered,
        emailError: emailResult.error || null,
      },
    });

    // Explicit response message: never report successful email delivery if sending failed
    const userMessage = emailResult.delivered
      ? "Thank you for contacting NASI India. Your message has been received and our secretariat has been notified via email."
      : "Thank you for contacting NASI India. Your message has been safely logged in our database and will be reviewed by the secretariat in the portal.";

    return ok({
      id: enquiry.id,
      emailDelivered: emailResult.delivered,
      message: userMessage,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of err.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return fail("VALIDATION_ERROR", "Please correct the form errors.", fieldErrors);
    }
    console.error("[submitContactEnquiry] Unexpected error:", err);
    return fail("INTERNAL_ERROR", "An unexpected error occurred while saving your enquiry. Please try again.");
  }
}

// ---------------------------------------------------------------------------
// Public: Submit a Membership Application (Join SI Today)
// ---------------------------------------------------------------------------

export async function submitMembershipEnquiry(
  formData: FormData
): Promise<ApiResponse<PublicEnquiryResult>> {
  try {
    // 1. Spam Prevention: Honeypot check
    const honeypot = formData.get("hp_national_code");
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn("[submitMembershipEnquiry] Honeypot triggered; discarding bot submission.");
      return fail("VALIDATION_ERROR", "Unable to process request at this time.");
    }

    // 2. Client Privacy & Rate Limiting
    const clientIp = await getClientIp();
    const hashedIp = hashClientIdentifier(clientIp);
    const rateCheck = checkRateLimit(`membership:${hashedIp}`, 5, 10 * 60 * 1000);

    if (!rateCheck.allowed) {
      return fail(
        "RATE_LIMIT",
        `Too many submissions from your connection. Please wait ${rateCheck.resetSeconds} seconds before trying again.`
      );
    }

    // 3. Server-side validation
    const raw = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      preferredClub: formData.get("preferredClub") || undefined,
      city: formData.get("city") || undefined,
      state: formData.get("state") || undefined,
      occupation: formData.get("occupation") || undefined,
      motivation: formData.get("motivation") || undefined,
      consent: formData.get("consent"),
      hp_national_code: formData.get("hp_national_code") || undefined,
    };

    const parsed = membershipEnquirySchema.parse(raw);

    // 4. PostgreSQL Persistence
    const enquiry = await prisma.membershipEnquiry.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        preferredClub: parsed.preferredClub,
        city: parsed.city,
        state: parsed.state,
        occupation: parsed.occupation,
        motivation: parsed.motivation,
        status: EnquiryStatus.NEW,
        consentGiven: true,
        ipHash: hashedIp,
      },
    });

    // 5. Email Notification with graceful failure handling
    const emailResult = await sendMembershipNotificationEmail({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      city: enquiry.city,
      state: enquiry.state,
      occupation: enquiry.occupation,
      preferredClub: enquiry.preferredClub,
      motivation: enquiry.motivation,
      createdAt: enquiry.createdAt,
    });

    // Update database record with notification delivery state
    await prisma.membershipEnquiry.update({
      where: { id: enquiry.id },
      data: {
        emailDelivered: emailResult.delivered,
        emailError: emailResult.error || null,
      },
    });

    // Explicit response message: never report successful email delivery if sending failed
    const userMessage = emailResult.delivered
      ? "Thank you for applying to join Soroptimist International of India. Your application has been received and our membership committee has been notified via email."
      : "Thank you for applying to join Soroptimist International of India. Your application has been safely logged in our database and will be reviewed by the membership committee in the portal.";

    return ok({
      id: enquiry.id,
      emailDelivered: emailResult.delivered,
      message: userMessage,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of err.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return fail("VALIDATION_ERROR", "Please correct the form errors.", fieldErrors);
    }
    console.error("[submitMembershipEnquiry] Unexpected error:", err);
    return fail("INTERNAL_ERROR", "An unexpected error occurred while saving your application. Please try again.");
  }
}

// ---------------------------------------------------------------------------
// Admin: Update Status, Assignment & Internal Staff Notes
// ---------------------------------------------------------------------------

export async function updateEnquiryStatusAction(
  data: unknown
): Promise<ApiResponse<EnquiryItem>> {
  try {
    const session = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
    const parsed = enquiryStatusUpdateSchema.parse(data);

    const updated = await updateEnquiryRecord({
      id: parsed.id,
      type: parsed.type,
      status: parsed.status as EnquiryStatus,
      internalNotes: parsed.internalNotes,
      assignedToId: parsed.assignedToId,
      actorUserId: session.id,
    });

    return ok(updated);
  } catch (err) {
    if (err instanceof ZodError) {
      return fail("VALIDATION_ERROR", "Invalid update parameters.");
    }
    const msg = err instanceof Error ? err.message : "Failed to update enquiry";
    return fail("FORBIDDEN", msg);
  }
}

// ---------------------------------------------------------------------------
// Admin: Export Enquiries to Protected CSV
// ---------------------------------------------------------------------------

export async function exportEnquiriesCsvAction(
  type: "ALL" | "CONTACT" | "MEMBERSHIP" = "ALL"
): Promise<ApiResponse<{ filename: string; csv: string }>> {
  try {
    const session = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);
    const result = await exportEnquiriesCsv(type, session.id);
    return ok(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to export CSV";
    return fail("FORBIDDEN", msg);
  }
}
