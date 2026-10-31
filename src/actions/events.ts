"use server";

import { Role, AuditAction, PublishStatus, EventType } from "@prisma/client";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { eventFormSchema } from "@/lib/validations";
import { logAuditEvent } from "@/lib/audit";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { revalidatePath } from "next/cache";

export async function saveEventAction(
  _prevState: ApiResponse<{ id: string; slug: string }> | null,
  formData: FormData
): Promise<ApiResponse<{ id: string; slug: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const raw = {
      id: (formData.get("id") as string) || undefined,
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      content: formData.get("content"),
      coverImage: formData.get("coverImage"),
      eventType: formData.get("eventType") || "IN_PERSON",
      startsAt: formData.get("startsAt"),
      endsAt: formData.get("endsAt") || undefined,
      timezone: formData.get("timezone") || "Asia/Kolkata",
      venue: formData.get("venue"),
      city: formData.get("city"),
      state: formData.get("state"),
      onlineLink: formData.get("onlineLink"),
      registrationLink: formData.get("registrationLink"),
      status: formData.get("status") || "DRAFT",
      isCancelled: formData.get("isCancelled") === "true",
      clubId: formData.get("clubId") || undefined,
      tags: formData.get("tags") || "",
    };

    const parsed = eventFormSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return fail("VALIDATION_ERROR", "Please fix validation errors.", fieldErrors);
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existingWithSlug = await prisma.event.findFirst({
      where: {
        slug: data.slug,
        ...(data.id ? { id: { not: data.id } } : {}),
      },
    });

    if (existingWithSlug) {
      return fail(
        "CONFLICT",
        `An event with the slug "${data.slug}" already exists. Please choose a unique slug.`,
        { slug: ["Slug already in use."] }
      );
    }

    const tagsArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    let eventId = data.id;

    if (data.id) {
      // Update
      const previous = await prisma.event.findUnique({ where: { id: data.id } });
      const updated = await prisma.event.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          content: data.content || null,
          coverImage: data.coverImage || null,
          eventType: data.eventType as EventType,
          startsAt: new Date(data.startsAt),
          endsAt: data.endsAt ? new Date(data.endsAt) : null,
          timezone: data.timezone,
          venue: data.venue || null,
          city: data.city || null,
          state: data.state || null,
          onlineLink: data.onlineLink || null,
          registrationLink: data.registrationLink || null,
          status: data.status as PublishStatus,
          isCancelled: data.isCancelled,
          clubId: data.clubId || null,
          tags: tagsArray,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.UPDATE,
        entityType: "Event",
        entityId: updated.id,
        changes: {
          previousStatus: previous?.status,
          newStatus: updated.status,
          isCancelled: updated.isCancelled,
          title: updated.title,
        },
      });

      eventId = updated.id;
    } else {
      // Create
      const created = await prisma.event.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          content: data.content || null,
          coverImage: data.coverImage || null,
          eventType: data.eventType as EventType,
          startsAt: new Date(data.startsAt),
          endsAt: data.endsAt ? new Date(data.endsAt) : null,
          timezone: data.timezone,
          venue: data.venue || null,
          city: data.city || null,
          state: data.state || null,
          onlineLink: data.onlineLink || null,
          registrationLink: data.registrationLink || null,
          status: data.status as PublishStatus,
          isCancelled: data.isCancelled,
          clubId: data.clubId || null,
          tags: tagsArray,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.CREATE,
        entityType: "Event",
        entityId: created.id,
        changes: { title: created.title, status: created.status },
      });

      eventId = created.id;
    }

    revalidatePath("/events");
    revalidatePath(`/events/${data.slug}`);
    revalidatePath("/admin/events");
    revalidatePath("/");

    return ok({ id: eventId!, slug: data.slug });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save event.";
    console.error("[saveEventAction] Error:", message);
    return fail("INTERNAL_ERROR", message);
  }
}

export async function setEventStatusAction(
  id: string,
  newStatus: PublishStatus
): Promise<ApiResponse<{ id: string; status: PublishStatus }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return fail("NOT_FOUND", "Event not found.");

    const updated = await prisma.event.update({
      where: { id },
      data: { status: newStatus },
    });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "Event",
      entityId: id,
      changes: { previousStatus: event.status, newStatus: updated.status },
    });

    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");
    revalidatePath("/");

    return ok({ id: updated.id, status: updated.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update event status.";
    return fail("INTERNAL_ERROR", message);
  }
}

export async function toggleEventCancellationAction(
  id: string
): Promise<ApiResponse<{ id: string; isCancelled: boolean }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return fail("NOT_FOUND", "Event not found.");

    const updated = await prisma.event.update({
      where: { id },
      data: { isCancelled: !event.isCancelled },
    });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.UPDATE,
      entityType: "Event",
      entityId: id,
      changes: { isCancelled: updated.isCancelled },
    });

    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");

    return ok({ id: updated.id, isCancelled: updated.isCancelled });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle cancellation status.";
    return fail("INTERNAL_ERROR", message);
  }
}

export async function deleteEventAction(id: string): Promise<ApiResponse<{ id: string }>> {
  try {
    const user = await requireAuth([Role.SUPER_ADMIN, Role.NATIONAL_ADMIN]);

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return fail("NOT_FOUND", "Event not found.");

    await prisma.event.delete({ where: { id } });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.DELETE,
      entityType: "Event",
      entityId: id,
      changes: { title: event.title, slug: event.slug },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/");

    return ok({ id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete event.";
    return fail("INTERNAL_ERROR", message);
  }
}
