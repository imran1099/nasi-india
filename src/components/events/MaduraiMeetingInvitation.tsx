"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon, SparklesIcon, ExternalLinkIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";

export interface MaduraiMeetingInvitationProps {
  invitationUrl?: string;
  highlights?: string[];
}

const DEFAULT_HIGHLIGHTS = [
  "Formal Installation Ceremony of National President Anitha Rajarajan and the newly elected 2026–2028 NASI India Board officers.",
  "National Executive Committee (EC) strategic deliberations establishing the biennial roadmap, governance charters, and national club expansion.",
  "Grassroots Programme Action review showcasing milestone projects in girl education, women's healthcare, and alignment with the United Nations 17 SDGs.",
  "Delegation fellowship banquet, cultural heritage reception, and photographic documentation celebrating 19 chartered clubs nationwide.",
];

export function MaduraiMeetingInvitation({
  invitationUrl,
  highlights,
}: MaduraiMeetingInvitationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeHighlights = highlights && highlights.filter(Boolean).length > 0 ? highlights.filter(Boolean) : DEFAULT_HIGHLIGHTS;

  return (
    <>
      <section className="bg-gradient-to-br from-[#F4FAFF] to-[#E8F3FC] border-b border-[#D7E8F5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Original Madurai Meeting Invitation (Maintains original proportions, no cropping) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 border border-[#D7E8F5] shadow-md hover:shadow-lg transition-all duration-200">
                {invitationUrl ? (
                  <div className="relative w-full aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-[#D7E8F5] flex items-center justify-center p-2 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={invitationUrl}
                      alt="Official Madurai Meeting Invitation"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#003A6B] to-[#001E38] rounded-2xl overflow-hidden border border-[#004780] flex flex-col justify-between p-6 text-white text-center">
                    {/* Decorative subtle border */}
                    <div className="absolute inset-2 border border-dashed border-[#D4A737]/60 rounded-xl pointer-events-none" />

                    {/* Invitation Header Emblem */}
                    <div className="relative z-10 pt-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A737] block">
                        Soroptimist International of India
                      </span>
                      <h4 className="font-serif font-bold text-lg text-white mt-1">
                        NASI EC Meeting &amp; Installation
                      </h4>
                      <p className="text-xs text-[#E8F3FC] mt-0.5">
                        Madurai, Tamil Nadu
                      </p>
                    </div>

                    {/* Invitation Graphic Placeholder / Artwork Area */}
                    <div className="relative z-10 py-6 my-auto flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 border border-[#D4A737] flex items-center justify-center font-serif text-xl font-bold text-[#D4A737] mb-3 shadow-inner">
                        SI
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        Official Meeting Invitation
                      </span>
                      <p className="text-[11px] text-[#D7E8F5] mt-1 max-w-[220px]">
                        [Official Madurai Invitation Graphic will be supplied by NASI]
                      </p>
                    </div>

                    {/* Invitation Footer / Host details */}
                    <div className="relative z-10 border-t border-white/20 pt-3">
                      <span className="text-[11px] text-[#E8F3FC] block">
                        Host Club: <strong>SI Madurai</strong>
                      </span>
                      <span className="text-[10px] text-[#D4A737] font-mono">
                        Biennium 2026–2028 Leadership
                      </span>
                    </div>
                  </div>
                )}

                {/* View Full Size Image Trigger */}
                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#005596] hover:bg-[#004780] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    <span>View Full Size Invitation</span>
                    <ExternalLinkIcon size={14} />
                  </button>
                  <p className="text-[11px] text-[#61758A] mt-1.5">
                    Click to view the full-size uncropped document
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Heading & Event Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="forest" size="sm" className="bg-[#005596] text-white border-[#004780]">
                    Official Gathering
                  </Badge>
                  <Badge variant="teal" size="sm" className="bg-[#E8F3FC] text-[#005596] border-[#D7E8F5]">
                    National Executive Committee
                  </Badge>
                  <span className="text-xs font-mono text-[#61758A] flex items-center gap-1">
                    <MapPinIcon size={13} className="text-[#005596]" />
                    <span>Madurai, Tamil Nadu</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#17324D] leading-tight">
                  NASI EC Meeting &amp; Installation Ceremony
                </h2>

                <p className="text-sm sm:text-base text-[#61758A] mt-2 leading-relaxed">
                  The official convening of the National Executive Committee (EC) alongside the formal
                  installation of the newly elected 2026–2028 National Board, hosted by SI Madurai.
                </p>
              </div>

              {/* 3-4 Event Highlights in Larger Italic Typography & Bullet-Point Formatting */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D7E8F5] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#005596]">
                  <SparklesIcon size={16} />
                  <span>Key Event Highlights</span>
                </div>

                <ul className="space-y-4 text-[#17324D]">
                  {activeHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span
                        className={`w-2 h-2 rounded-full mt-2.5 shrink-0 ${
                          index % 2 === 0 ? "bg-[#005596]" : "bg-[#D4A737]"
                        }`}
                      />
                      <p className="text-base sm:text-lg font-serif italic leading-relaxed text-[#17324D]">
                        {highlight}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#005596] hover:bg-[#004780] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                >
                  <span>Secretariat Delegate Inquiry</span>
                  <ArrowRightIcon size={14} className="ml-1.5" />
                </Link>
                <Link
                  href="/committee"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white hover:bg-[#F4FAFF] text-[#17324D] border border-[#D7E8F5] text-xs sm:text-sm font-medium transition-colors"
                >
                  <span>Meet National Board</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox / Full Size Image Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full Size Madurai Meeting Invitation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7E8F5] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#D7E8F5] pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#17324D]">
                  Madurai Meeting Invitation (Full Size)
                </h3>
                <p className="text-xs text-[#61758A] mt-0.5">
                  NASI EC Meeting &amp; Installation Ceremony • Host Club: SI Madurai
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4FAFF] border border-[#D7E8F5] text-[#17324D] hover:bg-[#E8F3FC] flex items-center justify-center text-sm font-bold cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* High-resolution preview area maintaining original proportions */}
            {invitationUrl ? (
              <div className="aspect-[3/4] max-h-[65vh] w-full bg-white rounded-2xl flex items-center justify-center p-3 border-2 border-[#D4A737] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={invitationUrl}
                  alt="Madurai Meeting Invitation Full Size"
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] max-h-[65vh] w-full bg-gradient-to-br from-[#003A6B] to-[#001E38] rounded-2xl flex flex-col items-center justify-center p-8 text-white text-center border-2 border-[#D4A737]">
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#D4A737] flex items-center justify-center font-serif text-2xl font-bold text-[#D4A737] mb-4">
                  SI
                </div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4A737]">
                  Official Meeting Invitation
                </span>
                <h4 className="font-serif font-bold text-2xl text-white mt-2">
                  NASI EC Meeting &amp; Installation Ceremony
                </h4>
                <p className="text-sm text-[#E8F3FC] mt-2 max-w-md">
                  Formal convening of the National Executive Committee and Installation of the 2026–2028 National Board.
                </p>
                <div className="mt-6 pt-4 border-t border-white/20 text-xs text-[#D7E8F5] space-y-1">
                  <p><strong>Host Club:</strong> SI Madurai, Tamil Nadu</p>
                  <p><strong>Presiding:</strong> President Anitha Rajarajan</p>
                  <p className="italic text-[#D4A737] pt-2">[Full official invitation graphic artwork will be supplied by NASI India]</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-[#F4FAFF] text-[#17324D] border border-[#D7E8F5] text-xs font-semibold hover:bg-[#E8F3FC]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
