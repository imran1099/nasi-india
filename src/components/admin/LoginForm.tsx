"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { loginAction } from "@/actions/auth";
import type { ApiResponse } from "@/lib/api-response";
import type { AuthUser } from "@/lib/auth/session";
import { LockIcon, MailIcon, CheckCircleIcon } from "@/components/icons";

type State = ApiResponse<AuthUser> | null;

async function formAction(_prev: State, formData: FormData): Promise<State> {
  return loginAction(_prev, formData);
}

export function LoginForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(formAction, null);

  const isSuccess = state?.success === true;
  const fieldErrors = state && !state.success ? state.error.fieldErrors : undefined;

  useEffect(() => {
    if (isSuccess) {
      router.push("/admin");
      router.refresh();
    }
  }, [isSuccess, router]);

  const fillDevAccount = (email: string) => {
    const emailInput = document.getElementById("admin-email") as HTMLInputElement | null;
    const passInput = document.getElementById("admin-password") as HTMLInputElement | null;
    if (emailInput && passInput) {
      emailInput.value = email;
      passInput.value = "NasiDev2024!";
    }
  };

  return (
    <div className="space-y-6">
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-sm">
          <CheckCircleIcon size={20} className="text-teal-700 shrink-0" />
          <div>
            <p className="font-semibold">Authentication successful!</p>
            <p className="text-xs text-teal-800">Redirecting to admin dashboard...</p>
          </div>
        </div>
      )}

      {state && !state.success && (
        <ErrorMessage
          variant="error"
          title={
            state.error.code === "VALIDATION_ERROR"
              ? "Please check your details"
              : state.error.code === "FORBIDDEN"
              ? "Access Restricted"
              : "Sign In Failed"
          }
          message={state.error.message}
        />
      )}

      <form action={action} className="space-y-4" noValidate>
        <FormField
          label="Administrator Email"
          id="admin-email"
          name="email"
          type="email"
          placeholder="admin@nasi-india.org"
          required
          autoComplete="username"
          errorMessage={fieldErrors?.email?.[0]}
          icon={<MailIcon size={16} className="text-forest-500" />}
        />

        <FormField
          label="Password"
          id="admin-password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          required
          autoComplete="current-password"
          errorMessage={fieldErrors?.password?.[0]}
          icon={<LockIcon size={16} className="text-forest-500" />}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center shadow-md bg-forest-900 hover:bg-forest-950 text-white font-medium py-3"
            disabled={isPending || isSuccess}
          >
            {isPending ? "Verifying Credentials..." : "Sign In to Admin Portal"}
          </Button>
        </div>
      </form>

      {/* Development Quick-Fill Helper for reviewer convenience */}
      {process.env.NODE_ENV !== "production" && (
        <div className="p-3.5 rounded-lg bg-sand-50 border border-sand-300/80 text-xs text-forest-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-teal-900 uppercase tracking-wider text-[10px]">
              Dev Quick-Test Accounts
            </span>
            <span className="font-mono text-[10px] text-forest-500">Local Dev Only</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDevAccount("superadmin@nasi-india.org")}
              className="px-2.5 py-1 rounded bg-forest-800 text-white hover:bg-forest-900 transition-colors text-[11px] font-medium"
            >
              Fill Super Admin
            </button>
            <button
              type="button"
              onClick={() => fillDevAccount("editor@nasi-india.org")}
              className="px-2.5 py-1 rounded bg-teal-800 text-white hover:bg-teal-900 transition-colors text-[11px] font-medium"
            >
              Fill NASI Editor
            </button>
          </div>
          <p className="text-[10px] text-forest-600">
            For production database provisioning, use CLI script: <code>npm run admin:provision</code>
          </p>
        </div>
      )}
    </div>
  );
}
