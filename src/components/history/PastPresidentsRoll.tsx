import React from "react";
import { nasiPastPresidents } from "@/data/clubs";
import { Card, CardContent } from "@/components/ui/Card";

export function PastPresidentsRoll() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D7E8F5] pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-full border border-[#D7E8F5] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005596]" />
            Leadership Heritage (1990 – 2026)
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17324D] mt-2">
            Roll of Past Presidents of NASI–India
          </h3>
          <p className="text-xs sm:text-sm text-[#61758A] mt-1">
            Honouring 17 distinguished national presidents across 36 years of visionary governance and dedicated service.
          </p>
        </div>
        <div className="shrink-0 text-xs text-[#005596] bg-[#F4FAFF] px-3 py-1.5 rounded-xl border border-[#D7E8F5] font-semibold">
          17 National Presidencies
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nasiPastPresidents.map((president) => {
          const isFirst = president.order === 1;
          const isCurrent = president.order === 17;

          return (
            <Card
              key={president.order}
              variant="elevated"
              className={`rounded-2xl transition-all duration-200 border ${
                isCurrent
                  ? "bg-[#FFFDEB] border-[#F2D79A] shadow-xs"
                  : isFirst
                  ? "bg-[#F4FAFF] border-[#005596]/30 shadow-xs"
                  : "bg-white border-[#D7E8F5] hover:border-[#005596]/40 hover:shadow-2xs"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#005596] bg-[#E8F3FC] px-2 py-0.5 rounded-md">
                    #{String(president.order).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-semibold font-mono text-[#17324D] bg-white px-2 py-0.5 rounded-md border border-[#D7E8F5]">
                    {president.tenure}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-[#17324D] leading-snug">
                    {president.name}
                  </h4>
                  <p className="text-xs text-[#005596] font-medium mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005596]/60" />
                    {president.club}
                  </p>
                </div>

                {isFirst && (
                  <div className="pt-2 border-t border-[#D7E8F5] text-[10.5px] font-semibold text-[#005596]">
                    Charter President of NASI–India
                  </div>
                )}
                {isCurrent && (
                  <div className="pt-2 border-t border-[#F2D79A] text-[10.5px] font-semibold text-[#7B580B]">
                    Current Term (2024–2026)
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
