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
    default: "bg-white border border-[#D7E8F5] shadow-2xs",
    muted: "bg-[#E8F3FC]/50 border border-[#D7E8F5]",
    elevated: "bg-white border border-[#D7E8F5] shadow-2xs hover:shadow-md hover:border-[#aed1ef] transition-all duration-200",
    accent: "bg-white border-t-4 border-t-[#005596] border-x border-b border-[#D7E8F5] shadow-2xs",
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
      className={`text-xl font-serif font-bold text-[#17324D] tracking-tight ${className}`}
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
    <p className={`text-sm text-[#61758A] mt-1 leading-relaxed ${className}`} {...props}>
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
      className={`p-6 pt-0 border-t border-[#D7E8F5] mt-4 flex items-center justify-between text-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
