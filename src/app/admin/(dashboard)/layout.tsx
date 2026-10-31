import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Dashboard | NASI India",
  description: "Administrative portal for NASI India executive leadership and editors.",
};

export const instant = false;
export const ensureStatic = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  // Server-side authentication guard: redirects to /admin/login if not logged in
  const user = await requireAuth();

  return <AdminShell user={user}>{children}</AdminShell>;
}
