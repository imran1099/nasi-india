import React from "react";

export interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton" | "inline";
  className?: string;
}

export function LoadingState({
  message = "Loading information...",
  variant = "spinner",
  className = "",
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 text-sm text-forest-700 ${className}`}
      >
        <span className="w-4 h-4 border-2 border-forest-600 border-t-transparent rounded-full animate-spin shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message}
        className={`space-y-4 w-full animate-pulse p-6 bg-white rounded-xl border border-sand-200 ${className}`}
      >
        <div className="h-6 bg-sand-200 rounded-md w-1/3" />
        <div className="h-4 bg-sand-100 rounded-md w-full" />
        <div className="h-4 bg-sand-100 rounded-md w-5/6" />
        <div className="h-10 bg-sand-200 rounded-lg w-1/4 mt-4" />
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-sand-200" />
        <div className="absolute inset-0 rounded-full border-4 border-forest-700 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-forest-800">{message}</p>
      <span className="sr-only">Content is loading, please wait.</span>
    </div>
  );
}
