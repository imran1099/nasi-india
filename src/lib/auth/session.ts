/**
 * Server-Side Session Management
 * HMAC-SHA256 signed session cookies with role-based authorization guards.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { type Role } from "@prisma/client";

export const SESSION_COOKIE_NAME = "nasi_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface SessionPayload extends AuthUser {
  expiresAt: number;
}

function getSecretKey(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY ||
    "nasi-india-session-fallback-secret-key-32-chars-long"
  );
}

function sign(payloadStr: string): string {
  const secret = getSecretKey();
  return createHmac("sha256", secret).update(payloadStr).digest("base64url");
}

function createToken(payload: SessionPayload): string {
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(payloadStr);
  return `${payloadStr}.${signature}`;
}

function verifyToken(token: string): SessionPayload | null {
  try {
    const [payloadStr, signature] = token.split(".");
    if (!payloadStr || !signature) return null;

    const expectedSignature = sign(payloadStr);
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expBuffer)) return null;

    const decoded = Buffer.from(payloadStr, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(decoded);

    // During build prerendering, skip dynamic Date.now() evaluation to prevent prerender value bailouts
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      if (Date.now() > payload.expiresAt) {
        return null;
      }
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates an HTTP-only signed session cookie.
 */
export async function createSession(user: AuthUser): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;

  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt,
  };

  const token = createToken(payload);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Reads and validates the current session from cookies.
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    await connection();
  } catch {}
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Destroys the current admin session cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Server-side guard: requires an authenticated user.
 * Redirects to `/admin/login` if not authenticated.
 * If `allowedRoles` is passed and user does not match, redirects to `/admin/forbidden`.
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<AuthUser> {
  try {
    await connection();
  } catch {}
  const user = await getSession();

  if (!user) {
    redirect("/admin/login");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      redirect("/admin/forbidden");
    }
  }

  return user;
}
