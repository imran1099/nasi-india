"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";
import { submitMembershipEnquiry, type PublicEnquiryResult } from "@/actions/enquiries";
import type { ApiResponse } from "@/lib/api-response";

type ClubOption = { label: string; value: string };
type State = ApiResponse<PublicEnquiryResult> | null;

const initialState: State = null;

async function formAction(_prev: State, formData: FormData): Promise<State> {
  return submitMembershipEnquiry(formData);
}

export function MembershipForm({ clubOptions }: { clubOptions: ClubOption[] }) {
  const [state, action, isPending] = useActionState(formAction, initialState);

  const isSuccess = state?.success === true;
  const fieldErrors = state && !state.success ? state.error.fieldErrors : undefined;

  return (
    <form
      action={action}
      className="space-y-6"
      noValidate
      key={isSuccess ? "success" : "form"}
    >
      {/* Honeypot field (hidden from view and screen readers) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="join-hp">Do not fill this field</label>
        <input
          type="text"
          id="join-hp"
          name="hp_national_code"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Success state */}
      {isSuccess && state?.data && (
        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950">
          <CheckCircleIcon size={22} className="text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm sm:text-base text-forest-950">
                Application Received Successfully!
              </p>
              {state.data.emailDelivered ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Email Notified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-sand-200 text-forest-800 px-2 py-0.5 rounded-full border border-sand-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                  Portal Logged
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-forest-800 leading-relaxed">
              {state.data.message}
            </p>
            <p className="text-[11px] text-forest-600 font-mono pt-1">
              Application Reference ID: {state.data.id}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {state && !state.success && (
        <ErrorMessage
          variant="error"
          title={
            state.error.code === "RATE_LIMIT"
              ? "Rate limit exceeded"
              : state.error.code === "VALIDATION_ERROR"
              ? "Please correct the required fields"
              : "Submission failed"
          }
          message={state.error.message}
        />
      )}

      {/* Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          id="join-name"
          name="name"
          placeholder="e.g., Dr. Sunita Mehra"
          required
          errorMessage={fieldErrors?.name?.[0]}
          disabled={isPending}
        />
        <FormField
          label="Email Address"
          id="join-email"
          name="email"
          type="email"
          placeholder="e.g., sunita@example.com"
          required
          errorMessage={fieldErrors?.email?.[0]}
          disabled={isPending}
        />
      </div>

      {/* Phone, City, State */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label="Phone / Mobile Number"
          id="join-phone"
          name="phone"
          type="tel"
          placeholder="+91 98765 43210"
          required
          helperText="Primary contact number"
          errorMessage={fieldErrors?.phone?.[0]}
          disabled={isPending}
        />
        <FormField
          label="City of Residence"
          id="join-city"
          name="city"
          placeholder="e.g., Pune"
          disabled={isPending}
        />
        <FormField
          label="State / Union Territory"
          id="join-state"
          name="state"
          placeholder="e.g., Maharashtra"
          disabled={isPending}
        />
      </div>

      {/* Profession and Preferred Club */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Profession / Current Field"
          id="join-profession"
          name="occupation"
          placeholder="e.g., Healthcare, Legal, Education, IT"
          helperText="Soroptimist International connects women in leadership & professions."
          disabled={isPending}
        />
        <FormField
          label="Select Preferred Club Chapter"
          id="join-club"
          name="preferredClub"
          type="select"
          placeholder="Choose an initial club or new chapter"
          options={clubOptions}
          required
          errorMessage={fieldErrors?.preferredClub?.[0]}
          disabled={isPending}
        />
      </div>

      {/* Motivation / Message */}
      <FormField
        label="Why are you interested in joining Soroptimist International?"
        id="join-statement"
        name="motivation"
        type="textarea"
        rows={4}
        placeholder="Briefly describe your areas of community interest (e.g., mentoring girls, women's health, education)..."
        helperText="Optional — helps us connect you with active local club project leaders."
        errorMessage={fieldErrors?.motivation?.[0]}
        disabled={isPending}
      />

      {/* Consent & Privacy Notice */}
      <div className="p-3.5 rounded-lg bg-sand-50/70 border border-sand-200">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="consent"
            value="true"
            required
            disabled={isPending}
            className="mt-1 h-4 w-4 rounded border-sand-400 text-teal-800 focus:ring-teal-700"
          />
          <span className="text-xs text-forest-800 leading-relaxed">
            I consent to the processing of my contact and professional details by the National Association
            of Soroptimist International of India in accordance with the{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-teal-800 font-semibold underline hover:text-forest-950"
            >
              Privacy Policy
            </Link>{" "}
            for the purpose of membership coordination. My details will not be used for unsolicited third-party marketing.
          </span>
        </label>
        {fieldErrors?.consent?.[0] && (
          <p className="text-xs text-rose-700 font-medium mt-1.5 ml-7">
            {fieldErrors.consent[0]}
          </p>
        )}
      </div>

      {/* Submit Button & Security Assurance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-sand-200">
        <div className="flex items-center gap-1.5 text-xs text-forest-600">
          <ShieldCheckIcon size={16} className="text-teal-700 shrink-0" />
          <span>Encrypted transmission &amp; spam protection enabled</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isPending}
        >
          {isPending ? "Submitting Application…" : "Submit Membership Application"}
        </Button>
      </div>
    </form>
  );
}
