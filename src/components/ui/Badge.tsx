import React from "react";

export type BadgeVariant = "forest" | "teal" | "neutral" | "gold" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  forest: "bg-forest-50 text-forest-900 border border-forest-200/90 shadow-2xs",
  teal: "bg-teal-50 text-teal-900 border border-teal-200/90 shadow-2xs",
  neutral: "bg-sand-100 text-forest-800 border border-sand-300/80 shadow-2xs",
  gold: "bg-amber-50 text-amber-950 border border-amber-300/80 shadow-2xs",
  outline: "bg-white/80 text-forest-800 border border-sand-300 shadow-2xs",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5 gap-1 rounded-md",
  md: "text-xs px-2.5 py-1 gap-1.5 rounded-lg font-medium",
};

export function Badge({
  variant = "forest",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
