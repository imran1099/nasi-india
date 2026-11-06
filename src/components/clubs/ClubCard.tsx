import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPinIcon, ArrowRightIcon, UsersIcon } from "@/components/icons";
import { Club } from "@/data/clubs";

export interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card
      variant="elevated"
      className="flex flex-col justify-between h-full bg-white group hover:border-[#005596] hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden border border-[#D7E8F5]"
    >
      <div>
        {/* Card Header with Brand Primary Blue Palette */}
        <div className="relative h-44 w-full bg-[#005596] overflow-hidden flex flex-col justify-between p-5 text-white">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <Badge variant="teal" size="sm" className="bg-[#002D54]/90 text-white border-white/20 shadow-xs">
              {club.region}
            </Badge>
            <span className="text-[10.5px] font-mono text-[#D7E8F5] bg-[#003A6B]/80 px-2.5 py-0.5 rounded-full border border-white/20">
              Chartered
            </span>
          </div>

          <div className="relative z-10">
            <span className="text-[11px] uppercase tracking-widest text-[#D4A737] font-semibold block">
              Soroptimist International
            </span>
            <span className="font-serif font-bold text-xl text-white block mt-0.5 group-hover:text-[#E8F3FC] transition-colors leading-tight">
              {club.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 space-y-3.5">
          <div className="flex items-center gap-1.5 text-xs text-[#005596] font-medium">
            <MapPinIcon size={14} className="text-[#005596] shrink-0" />
            <span>
              {club.city}, {club.state}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#61758A] leading-relaxed line-clamp-2">
            {club.description}
          </p>

          <div className="pt-1">
            <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[#17324D] block mb-1.5">
              Focus Pillars:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {club.focusAreas.map((f, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#E8F3FC] text-[#005596] border border-[#D7E8F5] font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </div>

      {/* Footer */}
      <CardFooter className="px-5 py-3.5 border-t border-[#D7E8F5] bg-[#F4FAFF] flex items-center justify-between">
        <span className="text-xs text-[#61758A] flex items-center gap-1.5 font-medium">
          <UsersIcon size={14} className="text-[#005596]" />
          <span>Active Chapter</span>
        </span>

        <Link
          href={`/clubs/${club.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005596] group-hover:text-[#003A6B] transition-colors"
        >
          <span>View Club Profile</span>
          <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}
