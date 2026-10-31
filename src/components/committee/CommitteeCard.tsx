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
    <Card variant={variant} className="flex flex-col justify-between h-full bg-white rounded-2xl overflow-hidden border border-sand-200/90 hover:border-forest-400 hover:shadow-md transition-all duration-200">
      <div>
        <CardHeader className="p-6 pb-3">
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Photograph Placeholder with Monogram / Refined Frame */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-forest-900 via-forest-950 to-teal-950 text-sand-100 flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-md border border-forest-800 shrink-0">
              <span className="text-white tracking-wider">{member.initials}</span>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-gold-500 border-2 border-white" />
              <span className="sr-only">Photograph placeholder for {member.name}</span>
            </div>

            <div className="flex flex-col items-end gap-1.5 text-right">
              <Badge variant="teal" size="sm" className="bg-teal-50 text-teal-900 border-teal-200">
                {member.roleShort}
              </Badge>
              <span className="text-[11px] font-mono text-forest-600 bg-sand-100 px-2 py-0.5 rounded-md">
                {member.tenure}
              </span>
            </div>
          </div>

          <CardTitle as="h3" className="text-lg sm:text-xl leading-snug">
            {member.name}
          </CardTitle>
          <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mt-1">
            {member.designation}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-forest-600 mt-2.5">
            <MapPinIcon size={14} className="text-teal-600 shrink-0" />
            <span>Member Chapter: {member.clubAffiliation}</span>
          </div>
        </CardHeader>

        {showBio && member.bio && (
          <CardContent className="px-6 pt-0 pb-4">
            <p className="text-xs sm:text-sm text-forest-800/80 leading-relaxed border-t border-sand-100 pt-3">
              {member.bio}
            </p>
          </CardContent>
        )}
      </div>

      <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50">
        <span className="text-xs text-forest-600 font-medium">Secretariat Liaison:</span>
        <a
          href={`mailto:${member.emailPlaceholder}`}
          className="text-xs text-teal-800 hover:text-forest-950 underline inline-flex items-center gap-1 font-mono"
        >
          <MailIcon size={13} />
          <span>{member.emailPlaceholder}</span>
        </a>
      </CardFooter>
    </Card>
  );
}
