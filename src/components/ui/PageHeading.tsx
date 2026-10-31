import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "../icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeadingProps {
  title: string;
  description?: string;
  kicker?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  className?: string;
}

export function PageHeading({
  title,
  description,
  kicker,
  badge,
  breadcrumbs,
  action,
  className = "",
}: PageHeadingProps) {
  return (
    <header className={`relative border-b border-sand-200/90 bg-gradient-to-b from-sand-100/90 via-sand-50/70 to-sand-50/40 py-10 md:py-14 overflow-hidden ${className}`}>
      {/* Decorative ambient background accent */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #13382c 0.75px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center flex-wrap gap-1.5 text-xs text-forest-700">
              <li>
                <Link href="/" className="hover:text-forest-950 font-medium transition-colors">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center gap-1.5">
                  <ChevronRightIcon size={12} className="text-forest-400 shrink-0" />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="hover:text-forest-950 font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-forest-950" aria-current="page">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {kicker && (
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full mb-3 border border-teal-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                {kicker}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-forest-950 tracking-tight leading-[1.15]">
                {title}
              </h1>
              {badge && <span className="inline-flex items-center">{badge}</span>}
            </div>
            {description && (
              <p className="mt-3.5 text-base sm:text-lg text-forest-800/85 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </header>
  );
}
