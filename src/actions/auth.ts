"use server";

import { z } from "zod";
import { Role, AuditAction } from "@prisma/client";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, type AuthUser } from "@/lib/auth/session";
import { ok, fail, type ApiResponse } from "@/lib/api-response";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

// Allowed administrative roles
const ADMIN_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.NATIONAL_ADMIN,
  Role.CLUB_ADMIN,
  Role.CLUB_EDITOR,
];

/**
 * Server Action for admin login
 */
export async function loginAction(
  _prevState: ApiResponse<AuthUser> | null,
  formData: FormData
): Promise<ApiResponse<AuthUser>> {
  try {
    const raw = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      return fail("VALIDATION_ERROR", "Please check your login details.", fieldErrors);
    }

    const { email, password } = parsed.data;

    // Database lookup
    if (!process.env.DATABASE_URL) {
      // In development fallback mode without a live PostgreSQL instance,
      // allow testing the admin portal if development flag or initial test credentials are provided.
      if (
        process.env.NODE_ENV !== "production" &&
        email.toLowerCase() === "superadmin@nasi-india.org" &&
        password === "NasiDev2024!"
      ) {
        const devUser: AuthUser = {
          id: "dev-super-admin-id",
          email: "superadmin@nasi-india.org",
          name: "Super Administrator (Dev)",
          role: Role.SUPER_ADMIN,
        };
        await createSession(devUser);
        return ok(devUser);
      }

      if (
        process.env.NODE_ENV !== "production" &&
        email.toLowerCase() === "editor@nasi-india.org" &&
        password === "NasiDev2024!"
      ) {
        const devUser: AuthUser = {
          id: "dev-nasi-editor-id",
          email: "editor@nasi-india.org",
          name: "NASI Editor (Dev)",
          role: Role.NATIONAL_ADMIN,
        };
        await createSession(devUser);
        return ok(devUser);
      }

      return fail(
        "INVALID_CREDENTIALS",
        "Database is currently not connected. For local dev testing without PostgreSQL, use superadmin@nasi-india.org or editor@nasi-india.org with dev credentials."
      );
    }

    const { prisma } = await import("@/lib/db");

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive || !user.passwordHash) {
      return fail("INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return fail("INVALID_CREDENTIALS", "Invalid email or password.");
    }

    if (!ADMIN_ROLES.includes(user.role)) {
      return fail(
        "FORBIDDEN",
        "This account does not have administrative permissions for the NASI India portal."
      );
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Record Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: AuditAction.LOGIN,
          entityType: "User",
          entityId: user.id,
          changes: { email: user.email, role: user.role },
        },
      });
    } catch (auditErr) {
      console.warn("[loginAction] Could not create audit log:", auditErr);
    }

    await createSession(authUser);
    return ok(authUser);
  } catch (err) {
    console.error("[loginAction] Error:", err);
    return fail("INTERNAL_ERROR", "An unexpected error occurred during login. Please try again.");
  }
}

/**
 * Server Action for admin logout
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
