import React from "react";
import { InfoIcon } from "../icons";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-sand-300 bg-sand-50/70 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-200 text-forest-700 flex items-center justify-center mb-4">
        {icon || <InfoIcon size={24} />}
      </div>
      <h3 className="text-lg font-serif font-bold text-forest-950 mb-2">{title}</h3>
      <p className="text-sm text-forest-800/80 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="inline-flex items-center">{action}</div>}
    </div>
  );
}
