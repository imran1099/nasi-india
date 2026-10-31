import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "elevated" | "accent";
}

export function Card({
  children,
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white border border-sand-200/90 shadow-2xs",
    muted: "bg-sand-50/80 border border-sand-200/90",
    elevated: "bg-white border border-sand-200/90 shadow-2xs hover:shadow-md hover:border-forest-300 transition-all duration-200",
    accent: "bg-white border-t-4 border-t-forest-800 border-x border-b border-sand-200/90 shadow-2xs",
  };

  return (
    <div
      className={`rounded-xl overflow-hidden ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" | "h5" }) {
  return (
    <Component
      className={`text-xl font-serif font-bold text-forest-950 tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-forest-800/80 mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-6 pt-0 border-t border-sand-100 mt-4 flex items-center justify-between text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
