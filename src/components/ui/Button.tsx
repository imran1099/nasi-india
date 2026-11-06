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
    "bg-[#005596] text-white hover:bg-[#004780] focus-visible:ring-[#005596] border border-transparent shadow-xs active:bg-[#003a6b] font-medium transition-all duration-150",
  secondary:
    "bg-[#E8F3FC] text-[#005596] hover:bg-[#d7e8f5] focus-visible:ring-[#005596] border border-[#d7e8f5] shadow-xs active:bg-[#c4dcf2] font-semibold transition-all duration-150",
  outline:
    "bg-transparent text-[#005596] border border-[#005596] hover:bg-[#E8F3FC] focus-visible:ring-[#005596] active:bg-[#d7e8f5] font-medium transition-all duration-150",
  ghost:
    "bg-transparent text-[#17324D] hover:bg-[#E8F3FC] hover:text-[#005596] focus-visible:ring-[#005596] border border-transparent font-medium transition-all duration-150",
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
