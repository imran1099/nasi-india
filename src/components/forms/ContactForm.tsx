"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CheckCircleIcon, ShieldCheckIcon } from "@/components/icons";
import { submitContactEnquiry, type PublicEnquiryResult } from "@/actions/enquiries";
import type { ApiResponse } from "@/lib/api-response";

type State = ApiResponse<PublicEnquiryResult> | null;

const initialState: State = null;

async function formAction(_prev: State, formData: FormData): Promise<State> {
  return submitContactEnquiry(formData);
}

export function ContactForm() {
  const [state, action, isPending] = useActionState(formAction, initialState);

  const isSuccess = state?.success === true;
  const fieldErrors = state && !state.success ? state.error.fieldErrors : undefined;

  return (
    <form
      action={action}
      className="space-y-4"
      noValidate
      key={isSuccess ? "success" : "form"}
    >
      {/* Honeypot field (hidden from view and assistive tech) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-hp">Do not fill this field</label>
        <input
          type="text"
          id="contact-hp"
          name="hp_national_code"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Success State */}
      {isSuccess && state?.data && (
        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950">
          <CheckCircleIcon size={22} className="text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm sm:text-base text-forest-950">
                Enquiry Recorded Successfully
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
              Reference ID: {state.data.id}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
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
          id="contact-name"
          name="name"
          placeholder="e.g., Priya Sharma"
          required
          errorMessage={fieldErrors?.name?.[0]}
          disabled={isPending}
        />
        <FormField
          label="Email Address"
          id="contact-email"
          name="email"
          type="email"
          placeholder="e.g., priya@example.com"
          required
          errorMessage={fieldErrors?.email?.[0]}
          disabled={isPending}
        />
      </div>

      {/* Mobile/Telephone and Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Mobile / Telephone"
          id="contact-phone"
          name="phone"
          type="tel"
          placeholder="+91 98765 43210"
          required
          helperText="Include city/country dialing code"
          errorMessage={fieldErrors?.phone?.[0]}
          disabled={isPending}
        />
        <FormField
          label="Subject of Inquiry"
          id="contact-subject"
          name="subject"
          type="select"
          placeholder="Select an enquiry type"
          options={[
            { label: "Join a Local Soroptimist Club", value: "Join a Local Soroptimist Club" },
            { label: "Charter a New Club Chapter", value: "Charter a New Club Chapter" },
            { label: "National Programme Action Inquiry", value: "National Programme Action Inquiry" },
            { label: "Media & Communications", value: "Media & Communications" },
            { label: "General Secretariat Inquiry", value: "General Secretariat Inquiry" },
          ]}
          disabled={isPending}
        />
      </div>

      {/* Enquiry Details */}
      <FormField
        label="Enquiry Details"
        id="contact-message"
        name="message"
        type="textarea"
        rows={5}
        placeholder="Please outline your inquiry, club location interest, or detailed message..."
        required
        helperText="Please do not submit sensitive personal identifiers or confidential financial details."
        errorMessage={fieldErrors?.message?.[0]}
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
            I consent to NASI India processing my submitted contact details in accordance with the{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-teal-800 font-semibold underline hover:text-forest-950"
            >
              Privacy Policy
            </Link>{" "}
            for the purpose of responding to this enquiry. Personal details will never be sold or shared.
          </span>
        </label>
        {fieldErrors?.consent?.[0] && (
          <p className="text-xs text-rose-700 font-medium mt-1.5 ml-7">
            {fieldErrors.consent[0]}
          </p>
        )}
      </div>

      {/* Submit Button & Security Assurance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isPending}
        >
          {isPending ? "Sending Inquiry…" : "Send Message to Secretariat"}
        </Button>

        <div className="flex items-center gap-1.5 text-xs text-forest-600">
          <ShieldCheckIcon size={16} className="text-teal-700" />
          <span>Protected by spam detection & rate limiting</span>
        </div>
      </div>
    </form>
  );
}
