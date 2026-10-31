import React from "react";
import { AlertCircleIcon } from "../icons";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: "error" | "warning" | "info";
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "An error occurred",
  message,
  variant = "error",
  action,
  onDismiss,
  className = "",
}: ErrorMessageProps) {
  const styles = {
    error: {
      container: "bg-red-50 border-red-200 text-red-900",
      icon: "text-red-600",
      title: "text-red-950",
      dismiss: "text-red-700 hover:text-red-950",
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-900",
      icon: "text-amber-600",
      title: "text-amber-950",
      dismiss: "text-amber-700 hover:text-amber-950",
    },
    info: {
      container: "bg-teal-50 border-teal-200 text-teal-900",
      icon: "text-teal-600",
      title: "text-teal-950",
      dismiss: "text-teal-700 hover:text-teal-950",
    },
  }[variant];

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 sm:p-5 flex items-start gap-3.5 ${styles.container} ${className}`}
    >
      <div className={`shrink-0 mt-0.5 ${styles.icon}`}>
        <AlertCircleIcon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        {title && <h4 className={`text-sm font-semibold mb-1 ${styles.title}`}>{title}</h4>}
        <p className="text-sm leading-relaxed opacity-90">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className={`shrink-0 p-1 rounded-md transition-colors ${styles.dismiss}`}
        >
          <span className="sr-only">Dismiss</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
