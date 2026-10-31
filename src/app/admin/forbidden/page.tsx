import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ShieldIcon } from "@/components/icons";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Access Restricted | NASI India Admin",
  description: "Insufficient administrative permissions to access this module.",
};

export const instant = false;

export default async function AdminForbiddenPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 mx-auto flex items-center justify-center mb-6 shadow-sm">
          <ShieldIcon size={32} />
        </div>

        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Authorization Notice (403)
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 mt-1">
          Permission Restricted
        </h1>
        <p className="mt-3 text-sm text-forest-700 leading-relaxed">
          The module you attempted to access requires higher administrative privileges (such as{" "}
          <strong>Super Administrator</strong>).
        </p>

        {session && (
          <div className="mt-6 p-4 rounded-xl bg-white border border-sand-200 text-left text-xs space-y-1">
            <p className="text-forest-600">Currently authenticated as:</p>
            <p className="font-semibold text-forest-950">{session.name} ({session.email})</p>
            <p className="text-forest-700">Role: <span className="font-mono bg-sand-100 px-2 py-0.5 rounded text-forest-900">{session.role}</span></p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/admin" variant="primary" size="md">
            Return to Dashboard
          </Button>
          <Button href="/admin/login" variant="outline" size="md">
            Sign in with Another Account
          </Button>
        </div>
      </div>
    </div>
  );
}
