import React from "react";

export interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  headingLevel?: "h2" | "h3";
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className = "",
  headingLevel: Heading = "h2",
}: SectionHeadingProps) {
  const alignmentClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col mb-8 md:mb-12 ${alignmentClass} ${className}`}>
      {kicker && (
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full mb-3 border border-teal-200/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
          {kicker}
        </span>
      )}
      <Heading className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-forest-950 tracking-tight leading-[1.2]">
        {title}
      </Heading>
      {description && (
        <p className="mt-3.5 text-base sm:text-lg text-forest-800/85 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
