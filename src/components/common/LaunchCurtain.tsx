"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { type CurtainSettings } from "@/lib/curtain";
import { SparklesIcon, RefreshCwIcon, XIcon } from "@/components/icons";

interface LaunchCurtainProps {
  settings: CurtainSettings;
  previewMode?: boolean;
}

// Module-level visit flag: prevents intrusive replay during internal SPA navigation
// (e.g. clicking /about and clicking back to Home), but resets every time the website is opened,
// closed and reopened, or reloaded.
let hasPlayedInCurrentVisit = false;

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getFalseServerSnapshot() {
  return false;
}

export function LaunchCurtain({
  settings,
  previewMode = false,
}: LaunchCurtainProps) {
  const storageKey = `nasi_curtain_seen_${settings.launchDate}`;

  // Clean up any legacy persistent cookies/localStorage so previous test sessions are cleared
  useEffect(() => {
    try {
      localStorage.removeItem(storageKey);
      document.cookie = `${storageKey}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    } catch {
      // Ignore
    }
  }, [storageKey]);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getFalseServerSnapshot
  );

  // Animation states:
  // "closed": curtain fully down covering viewport, content visible
  // "opening": curtain rising upwards
  // "completed": curtain completely out of view, removed
  const [stage, setStage] = useState<"closed" | "opening" | "completed">(() => {
    if (!previewMode && hasPlayedInCurrentVisit) {
      return "completed";
    }
    return "closed";
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Orchestrate the opening sequence
  useEffect(() => {
    if (stage !== "closed") return;

    if (prefersReducedMotion && !previewMode) {
      const t = setTimeout(() => {
        hasPlayedInCurrentVisit = true;
        setStage("completed");
      }, 1000);
      return () => clearTimeout(t);
    }

    // Hold content closed briefly (1.5 seconds) so visitors read the launch announcement
    const holdTimeMs = previewMode ? 1000 : 1500;
    timerRef.current = setTimeout(() => {
      setStage("opening");
    }, holdTimeMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, prefersReducedMotion, previewMode]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && stage === "opening") {
      hasPlayedInCurrentVisit = true;
      setStage("completed");
    }
  };

  // Replay handler for Admin Preview
  const handleReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage("closed");
  };

  const handleClosePreview = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage("completed");
  };

  if (stage === "completed") {
    // If previewMode and completed, still show floating control to allow replay
    if (previewMode) {
      return (
        <div className="fixed top-20 right-6 z-[10000] animate-in fade-in duration-200">
          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#003A6B] text-[#FAEB57] border-2 border-[#D4A737] shadow-xl text-xs font-bold hover:bg-[#00284D] transition-all cursor-pointer"
          >
            <RefreshCwIcon size={14} />
            <span>Replay Curtain Animation</span>
          </button>
        </div>
      );
    }
    return null;
  }

  const durationSec = settings.duration || 4;
  const isOpening = stage === "opening";

  return (
    <div
      role="dialog"
      aria-label="Website Launch Ceremonial Curtain"
      aria-modal="true"
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{
        pointerEvents: isOpening ? "none" : "auto",
      }}
    >
      {/* Admin Preview Mode Floating Banner */}
      {previewMode && (
        <div className="fixed top-4 right-4 z-[10002] flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-950/90 text-white border border-[#D4A737]/60 shadow-2xl backdrop-blur-md text-xs">
          <span className="flex items-center gap-1.5 font-bold text-[#FAEB57]">
            <SparklesIcon size={14} />
            <span>Admin Preview Mode</span>
          </span>
          <span className="text-white/40">|</span>
          <button
            type="button"
            onClick={handleReplay}
            className="px-2.5 py-1 rounded-md bg-[#005596] hover:bg-[#004780] text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCwIcon size={12} />
            <span>Replay</span>
          </button>
          <button
            type="button"
            onClick={handleClosePreview}
            className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Close Preview"
          >
            <XIcon size={14} />
          </button>
        </div>
      )}

      {/* Main Rising Velvet Curtain Container */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className="relative w-full h-full flex flex-col justify-between"
        style={{
          transform: isOpening ? "translateY(-100%)" : "translateY(0%)",
          transitionProperty: "transform",
          transitionDuration: prefersReducedMotion ? "0.6s" : `${durationSec}s`,
          transitionTimingFunction: "cubic-bezier(0.65, 0.05, 0.36, 1)",
          willChange: "transform",
          background: "linear-gradient(180deg, #001830 0%, #002D54 35%, #003A6B 70%, #002244 100%)",
        }}
      >
        {/* Fabric Folds & Pleats Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.42) 0px,
                rgba(0, 0, 0, 0.15) 15px,
                rgba(255, 255, 255, 0.08) 30px,
                rgba(0, 0, 0, 0.12) 45px,
                rgba(0, 0, 0, 0.48) 60px,
                rgba(0, 0, 0, 0.2) 75px,
                rgba(255, 255, 255, 0.05) 90px,
                rgba(0, 0, 0, 0.38) 120px
              )
            `,
            opacity: 0.85,
          }}
        />

        {/* Ambient Royal Blue Velvet Sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(0, 85, 150, 0.5) 0%, rgba(0, 24, 48, 0.85) 100%)",
          }}
        />

        {/* Top Gold Drapery Valance (Pelmet Trim) */}
        <div className="relative z-10 w-full">
          {/* Gold Header Bar */}
          <div
            className="w-full h-2.5 sm:h-3.5 shadow-md"
            style={{
              background:
                "linear-gradient(90deg, #785A18 0%, #D4A737 20%, #FFF2A3 50%, #D4A737 80%, #785A18 100%)",
            }}
          />

          {/* Scalloped Gold Embroidery Trim */}
          <div className="w-full h-5 sm:h-7 flex items-center justify-around overflow-hidden opacity-90 px-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-8 sm:w-12 h-4 sm:h-6 rounded-b-full border-b-2 border-x border-[#D4A737]/80 shrink-0 bg-[#002244]/60 shadow-xs"
                style={{
                  boxShadow: "inset 0 -2px 4px rgba(212, 167, 55, 0.4)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Center Launch Screen Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Official NASI-India Logo in Gilded Ceremonial Medallion */}
            {settings.showLogo && (
              <div className="mb-6 sm:mb-8 relative">
                {/* Golden Glow Aura */}
                <div
                  className="absolute -inset-4 rounded-full blur-2xl opacity-50 animate-pulse pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, #D4A737 0%, transparent 70%)",
                  }}
                />

                {/* Gilded Double-Ring Medallion Frame */}
                <div
                  className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full p-1.5 shadow-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFF5B8 0%, #D4A737 40%, #785A18 70%, #F5DE7A 100%)",
                    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white p-1.5 sm:p-2 flex items-center justify-center border-2 border-[#D4A737] shadow-inner overflow-hidden">
                    <Image
                      src={settings.logoUrl || "/uploads/general/img-20261110-wa0080-b3d7704c9b213c51be5bd5a0.jpg"}
                      alt="National Association Soroptimist India (NASI-India) Official Logo"
                      width={208}
                      height={208}
                      priority
                      className="w-full h-full object-contain rounded-full drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* National Organisation Kicker */}
            <span
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#F5DE7A] mb-2 px-3 py-1 rounded-full border border-[#D4A737]/40 bg-black/30 backdrop-blur-xs"
              style={{
                textShadow: "0 2px 6px rgba(0, 0, 0, 0.8)",
              }}
            >
              {settings.title}
            </span>

            {/* Brand Acronym */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-wide mt-1 mb-2"
              style={{
                textShadow:
                  "0 3px 12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 85, 150, 0.6)",
              }}
            >
              {settings.organization}
            </h1>

            {/* Decorative Gold Divider with Diamond Ornament */}
            <div className="flex items-center justify-center gap-3 w-64 sm:w-80 my-3 opacity-90">
              <div
                className="flex-1 h-[1.5px]"
                style={{
                  background: "linear-gradient(90deg, transparent, #D4A737)",
                }}
              />
              <div className="w-2.5 h-2.5 rotate-45 bg-[#FFF2A3] border border-[#785A18] shadow-xs" />
              <div
                className="flex-1 h-[1.5px]"
                style={{
                  background: "linear-gradient(90deg, #D4A737, transparent)",
                }}
              />
            </div>

            {/* Ceremonial Launch Heading */}
            <p
              className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#FFF5B8] tracking-wider mb-3"
              style={{
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 167, 55, 0.4)",
              }}
            >
              {settings.launchHeading}
            </p>

            {/* Subtitle / Theme Motto */}
            {settings.subtitle && (
              <p
                className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#DCEAF8]/90 font-medium px-4 py-1.5 rounded-lg bg-black/25 border border-white/10"
              >
                {settings.subtitle}
              </p>
            )}

            {/* Soft Breathing Indicator */}
            <div className="mt-8 flex items-center gap-2 text-[11px] text-[#F5DE7A]/80 font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#FFF2A3] animate-ping" />
              <span>Inaugural Reveal</span>
            </div>
          </div>
        </div>

        {/* Bottom Gold Braid Hem & Fringe Tassels Border */}
        <div className="relative z-10 w-full shrink-0">
          {/* Main Gold Hem Band */}
          <div
            className="w-full h-4 sm:h-5 shadow-2xl relative"
            style={{
              background:
                "linear-gradient(90deg, #785A18 0%, #D4A737 25%, #FFF5B8 50%, #D4A737 75%, #785A18 100%)",
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.5), 0 6px 16px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Braided Rope Pattern Overlay */}
            <div
              className="w-full h-full opacity-35"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #000 0, #000 3px, transparent 0, transparent 8px)",
              }}
            />
          </div>

          {/* Golden Fringe / Tassel Border */}
          <div
            className="w-full h-5 sm:h-7 flex items-start justify-between overflow-hidden shadow-2xl"
            style={{
              background:
                "repeating-linear-gradient(90deg, #B38728 0px, #E5C158 3px, #785A18 6px, #FFF5B8 8px, #B38728 11px)",
              boxShadow: "0 12px 28px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Bottom scallop cutouts */}
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-3 sm:w-4 h-5 sm:h-7 border-r border-black/20 shrink-0"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 100%)"
                      : "linear-gradient(180deg, transparent 20%, rgba(255,255,255,0.2) 100%)",
                }}
              />
            ))}
          </div>

          {/* Deep Cast Shadow under the curtain onto homepage */}
          <div
            className="w-full h-6 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
