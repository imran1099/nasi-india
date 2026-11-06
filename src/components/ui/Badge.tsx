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
  forest: "bg-[#E8F3FC] text-[#005596] border border-[#D7E8F5] shadow-2xs font-semibold",
  teal: "bg-[#F4FAFF] text-[#005596] border border-[#D7E8F5] shadow-2xs font-medium",
  neutral: "bg-white text-[#17324D] border border-[#D7E8F5] shadow-2xs",
  gold: "bg-[#FFF9EB] text-[#7B580B] border border-[#F2D79A] shadow-2xs",
  outline: "bg-white text-[#005596] border border-[#D7E8F5] shadow-2xs",
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
