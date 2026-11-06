import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MailIcon, MapPinIcon } from "@/components/icons";
import { CommitteeMember } from "@/data/committee";

export interface CommitteeCardProps {
  member: CommitteeMember;
  variant?: "default" | "elevated" | "muted" | "accent";
  showBio?: boolean;
}

export function CommitteeCard({
  member,
  variant = "elevated",
  showBio = true,
}: CommitteeCardProps) {
  return (
    <Card variant={variant} className="flex flex-col justify-between h-full bg-white rounded-2xl overflow-hidden border border-[#D7E8F5] hover:border-[#005596] hover:shadow-md transition-all duration-200">
      <div>
        <CardHeader className="p-6 pb-3">
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Photograph Placeholder with Monogram / Refined Frame */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-sm border border-[#004780] shrink-0">
              <span className="text-white tracking-wider">{member.initials}</span>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#D4A737] border-2 border-white" />
              <span className="sr-only">Photograph placeholder for {member.name}</span>
            </div>

            <div className="flex flex-col items-end gap-1.5 text-right">
              <Badge variant="teal" size="sm" className="bg-[#E8F3FC] text-[#005596] border-[#D7E8F5]">
                {member.roleShort}
              </Badge>
              <span className="text-[11px] font-mono text-[#61758A] bg-[#F4FAFF] px-2 py-0.5 rounded-md border border-[#D7E8F5]">
                {member.tenure}
              </span>
            </div>
          </div>

          <CardTitle as="h3" className="text-lg sm:text-xl text-[#17324D] leading-snug">
            {member.name}
          </CardTitle>
          <p className="text-xs font-semibold text-[#005596] uppercase tracking-wider mt-1">
            {member.designation}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#61758A] mt-2.5">
            <MapPinIcon size={14} className="text-[#005596] shrink-0" />
            <span>Member Chapter: {member.clubAffiliation}</span>
          </div>
        </CardHeader>

        {showBio && member.bio && (
          <CardContent className="px-6 pt-0 pb-4">
            <p className="text-xs sm:text-sm text-[#61758A] leading-relaxed border-t border-[#D7E8F5] pt-3">
              {member.bio}
            </p>
          </CardContent>
        )}
      </div>

      <CardFooter className="pt-3 border-t border-[#D7E8F5] bg-[#F4FAFF]">
        <span className="text-xs text-[#61758A] font-medium">Secretariat Liaison:</span>
        <a
          href={`mailto:${member.emailPlaceholder}`}
          className="text-xs text-[#005596] hover:text-[#004780] underline inline-flex items-center gap-1 font-mono"
        >
          <MailIcon size={13} />
          <span>{member.emailPlaceholder}</span>
        </a>
      </CardFooter>
    </Card>
  );
}
