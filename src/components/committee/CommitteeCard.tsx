import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MailIcon } from "@/components/icons";
import { CommitteeMember } from "@/data/committee";

export interface CommitteeCardProps {
  member: CommitteeMember;
  variant?: "default" | "elevated" | "muted" | "accent";
  showBio?: boolean;
}

const DEFAULT_AVATAR = "/images/default-avatar.svg";

export function CommitteeCard({
  member,
  variant = "elevated",
  showBio = true,
}: CommitteeCardProps) {
  const hasPhoto = Boolean(member.image);

  return (
    <Card
      variant={variant}
      className="flex flex-col justify-between h-full bg-white rounded-2xl overflow-hidden border border-[#D7E8F5] hover:border-[#005596] hover:shadow-md transition-all duration-200"
    >
      <div>
        <CardHeader className="p-6 pb-3">
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Photograph Display with Dignified Profile Frame */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm border border-[#D7E8F5] shrink-0 bg-[#E8F3FC]">
              {hasPhoto ? (
                <Image
                  src={member.image!}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-[#E8F3FC] to-[#D7E8F5]">
                  <Image
                    src={DEFAULT_AVATAR}
                    alt={`Default avatar for ${member.name}`}
                    width={44}
                    height={44}
                    className="opacity-85"
                  />
                </div>
              )}
              {/* Corner Brand Accent Badge */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  hasPhoto ? "bg-[#D4A737]" : "bg-[#005596]"
                }`}
                title={hasPhoto ? "Official Photograph" : "NASI Officer Silhouette"}
              />
            </div>

            <div className="flex flex-col items-end gap-1.5 text-right">
              <Badge
                variant="teal"
                size="sm"
                className="bg-[#E8F3FC] text-[#005596] border-[#D7E8F5]"
              >
                {member.roleShort || member.role}
              </Badge>
              <span className="text-[11px] font-mono text-[#61758A] bg-[#F4FAFF] px-2 py-0.5 rounded-md border border-[#D7E8F5]">
                {member.tenure}
              </span>
            </div>
          </div>

          <CardTitle as="h3" className="text-lg sm:text-xl text-[#17324D] leading-snug">
            {member.name}
          </CardTitle>
          <p className="text-xs font-semibold text-[#005596] uppercase tracking-wider mt-1.5">
            {member.designation}
          </p>
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
