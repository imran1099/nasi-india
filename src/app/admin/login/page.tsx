import type { Metadata } from "next";
import { connection } from "next/server";
import { LoginForm } from "@/components/admin/LoginForm";
import Link from "next/link";
import { ShieldIcon } from "@/components/icons";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | NASI India",
  description: "Secure administrative gateway for NASI India leadership and national editors.",
};

export const instant = false;
export const ensureStatic = false;

export default async function AdminLoginPage() {
  await connection();
  // If already authenticated, redirect to dashboard directly
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Emblem / Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-800 to-teal-900 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-xl shadow-black/40">
            <ShieldIcon size={32} />
          </div>
        </div>

        <div className="text-center">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-teal-300 mb-2">
            National Association of Soroptimist International of India
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Admin Portal Access
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-sand-300">
            Sign in with authorized credentials to access national and club management modules.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-sand-200">
          <LoginForm />

          <div className="mt-8 pt-6 border-t border-sand-200 flex items-center justify-between text-xs text-forest-600">
            <Link
              href="/"
              className="text-forest-700 hover:text-forest-950 font-medium inline-flex items-center gap-1 transition-colors"
            >
              &larr; Back to Public Website
            </Link>
            <Link
              href="/contact"
              className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Need Support?
            </Link>
          </div>
        </div>

        {/* Informational Role Note */}
        <div className="mt-6 p-4 rounded-xl bg-forest-900/60 border border-forest-800/80 text-sand-200 text-xs space-y-1.5 text-center">
          <p className="font-semibold text-teal-300">Role-Based Access Control</p>
          <p className="text-sand-300/90 leading-relaxed">
            <strong>Super Admin</strong> grants full platform access and user governance.{" "}
            <strong>NASI Editor</strong> manages editorial news, events, and community resources.
          </p>
        </div>
      </div>
    </div>
  );
}
