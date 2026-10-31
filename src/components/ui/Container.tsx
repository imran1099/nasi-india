import React from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: "div" | "section" | "main" | "header" | "footer";
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  size = "xl",
  as: Component = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
