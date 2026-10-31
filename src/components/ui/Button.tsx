import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isExternal?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-forest-800 text-white hover:bg-forest-900 focus-visible:ring-forest-800 border border-transparent shadow-xs active:bg-forest-950",
  secondary:
    "bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700 border border-transparent shadow-xs active:bg-teal-900",
  outline:
    "bg-transparent text-forest-800 border border-forest-700 hover:bg-forest-50 focus-visible:ring-forest-700 active:bg-forest-100",
  ghost:
    "bg-transparent text-forest-800 hover:bg-forest-50 hover:text-forest-900 focus-visible:ring-forest-700 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-md",
  md: "text-sm px-4 py-2 gap-2 rounded-lg font-medium",
  lg: "text-base px-5 py-2.5 gap-2.5 rounded-lg font-medium",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      isExternal = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2";
    const combinedClasses = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    const content = (
      <>
        {isLoading ? (
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      if (isExternal) {
        return (
          <a
            href={href}
            className={combinedClasses}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={props.type || "button"}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
