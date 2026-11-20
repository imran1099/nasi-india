"use client";

import React, { useState } from "react";
import { nasiHistoricalPhotographs, HistoricalPhotograph } from "@/data/clubs";
import { Card, CardContent } from "@/components/ui/Card";
import { SparklesIcon, XIcon } from "@/components/icons";

export function HistoricalPhotoGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<HistoricalPhotograph | null>(null);

  const categories = [
    { id: "all", label: `All Photographs (${nasiHistoricalPhotographs.length})` },
    { id: "charter", label: "Club Charters & Inceptions" },
    { id: "assembly", label: "National Assemblies & Meetings" },
    { id: "project", label: "Foundational Projects" },
  ];

  const filteredPhotos = nasiHistoricalPhotographs.filter((photo) => {
    if (selectedCategory === "all") return true;
    return photo.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Gallery Header and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D7E8F5] pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-full border border-[#D7E8F5] shadow-2xs">
            <SparklesIcon size={13} className="text-[#005596]" />
            Archival Document Repository
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17324D] mt-2">
            Historical Photographic Archives (1979 – 2024)
          </h3>
          <p className="text-xs sm:text-sm text-[#61758A] mt-1">
            Historic charter ceremonies, national assemblies, and foundational projects documenting 50+ years of Soroptimism in India.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#005596] text-white shadow-xs"
                  : "bg-white text-[#17324D] border border-[#D7E8F5] hover:bg-[#F4FAFF] hover:border-[#005596]/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Archival Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <Card
            key={photo.id}
            variant="elevated"
            className="group rounded-2xl overflow-hidden bg-white border border-[#D7E8F5] hover:border-[#005596] hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Image Container with Click-to-Zoom */}
            <div
              className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => setActivePhoto(photo)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActivePhoto(photo);
                }
              }}
              title="Click to view full photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[11px] text-white font-medium bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  Click to enlarge photo
                </span>
              </div>
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-black/70 text-white backdrop-blur-xs">
                {photo.year}
              </span>
            </div>

            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-[#005596] bg-[#E8F3FC] px-2 py-0.5 rounded-md border border-[#D7E8F5]">
                    {photo.associatedClub}
                  </span>
                  <span className="text-[10.5px] uppercase font-semibold tracking-wider text-[#61758A]">
                    {photo.category === "charter"
                      ? "Charter Milestone"
                      : photo.category === "assembly"
                      ? "National Gathering"
                      : "Flagship Project"}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#17324D] leading-snug group-hover:text-[#005596] transition-colors">
                  {photo.title}
                </h4>
                <p className="text-xs text-[#61758A] mt-2 leading-relaxed font-serif italic border-l-2 border-[#005596]/30 pl-2.5">
                  {photo.caption}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D7E8F5] flex items-center justify-between text-[11px] text-[#61758A]">
                <span>Archival Record</span>
                <button
                  type="button"
                  onClick={() => setActivePhoto(photo)}
                  className="text-[#005596] font-semibold hover:underline cursor-pointer"
                >
                  View Full Image
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fullscreen Photo Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <XIcon size={20} />
            </button>

            {/* Modal Image */}
            <div className="relative max-h-[70vh] bg-black/95 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.caption}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-6 bg-white space-y-2 border-t border-[#D7E8F5]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white bg-[#005596] px-2.5 py-1 rounded-md">
                    {activePhoto.year}
                  </span>
                  <span className="text-xs font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-md border border-[#D7E8F5]">
                    {activePhoto.associatedClub}
                  </span>
                </div>
                <span className="text-xs text-[#61758A]">
                  Archival Record #{activePhoto.id}
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#17324D]">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-[#17324D] leading-relaxed font-serif italic border-l-2 border-[#005596] pl-3 py-1 bg-[#F4FAFF] rounded-r-md">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
