"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type AuthUser } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { logoutAction } from "@/actions/auth";
import {
  HomeIcon,
  MapPinIcon,
  UsersIcon,
  NewspaperIcon,
  CalendarIcon,
  BookOpenIcon,
  GlobeIcon,
  InboxIcon,
  ShieldIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ExternalLinkIcon,
} from "@/components/icons";

interface AdminShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  superAdminOnly?: boolean;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = user.role === Role.SUPER_ADMIN;

  const coreNav: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <HomeIcon size={18} /> },
    { label: "Clubs Directory", href: "/admin/clubs", icon: <MapPinIcon size={18} /> },
    { label: "National Committee", href: "/admin/committee", icon: <UsersIcon size={18} /> },
    { label: "News & Articles", href: "/admin/news", icon: <NewspaperIcon size={18} /> },
    { label: "Events & Calendar", href: "/admin/events", icon: <CalendarIcon size={18} /> },
    { label: "Newsletters", href: "/admin/newsletters", icon: <BookOpenIcon size={18} /> },
    { label: "Resources", href: "/admin/resources", icon: <GlobeIcon size={18} /> },
    { label: "Enquiries", href: "/admin/enquiries", icon: <InboxIcon size={18} /> },
  ];

  const systemNav: NavItem[] = [
    { label: "User Accounts", href: "/admin/users", icon: <ShieldIcon size={18} />, superAdminOnly: true },
    { label: "Site Settings", href: "/admin/settings", icon: <SettingsIcon size={18} />, superAdminOnly: true },
  ];

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            Super Admin
          </span>
        );
      case Role.NATIONAL_ADMIN:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-100 text-teal-900 border border-teal-300">
            NASI Editor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sand-200 text-forest-900">
            {role}
          </span>
        );
    }
  };

  const userInitials =
    user.name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  const renderNavLinks = () => (
    <div className="space-y-6">
      <div>
        <p className="px-3 text-[11px] font-semibold text-sand-400 uppercase tracking-wider mb-2">
          Operations
        </p>
        <nav className="space-y-1">
          {coreNav.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-sand-200 hover:bg-forest-800/80 hover:text-white"
                }`}
              >
                <span className={isActive ? "text-teal-200" : "text-sand-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <p className="px-3 text-[11px] font-semibold text-sand-400 uppercase tracking-wider mb-2">
          Administration
        </p>
        <nav className="space-y-1">
          {systemNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const isDisabled = item.superAdminOnly && !isSuperAdmin;

            if (isDisabled) {
              return (
                <div
                  key={item.href}
                  title="Super Admin role required"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-sand-400/40 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sand-400/30">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-forest-950/60 text-sand-500">
                    Locked
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-sand-200 hover:bg-forest-800/80 hover:text-white"
                }`}
              >
                <span className={isActive ? "text-teal-200" : "text-sand-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-forest-950 text-white border-b border-forest-800/80">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-sand-300 hover:text-white hover:bg-forest-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>

            {/* Portal Brand */}
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-forest-800 border border-teal-500/40 flex items-center justify-center font-serif text-sm font-bold text-sand-100">
                SI
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-300 block leading-tight">
                  NASI India
                </span>
                <span className="text-sm font-serif font-bold text-white leading-tight">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right Header: Live Site, User, Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sand-300 hover:text-white hover:bg-forest-800/70 border border-forest-800 transition-colors"
            >
              <span>Live Website</span>
              <ExternalLinkIcon size={12} />
            </Link>

            {/* User Profile Info */}
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l sm:border-forest-800">
              <div className="w-8 h-8 rounded-full bg-forest-800 border border-forest-700 flex items-center justify-center text-xs font-semibold text-teal-200">
                {userInitials}
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user.name}
                  </span>
                  {getRoleBadge(user.role)}
                </div>
                <span className="text-[11px] text-sand-400 block leading-tight font-mono">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Logout Action */}
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sign out of Admin Portal"
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-sand-300 hover:text-white hover:bg-rose-950/60 border border-forest-800 hover:border-rose-800/60 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOutIcon size={15} className="text-sand-400 hover:text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar (Fixed Left) */}
        <aside className="hidden lg:block w-64 bg-forest-900 border-r border-forest-800/80 p-5 shrink-0">
          <div className="sticky top-20">{renderNavLinks()}</div>
        </aside>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-forest-900 p-5 z-10 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-forest-800 mb-6">
                  <span className="text-sm font-serif font-bold text-white">Navigation</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-sand-400 hover:text-white"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                {renderNavLinks()}
              </div>

              <div className="pt-6 border-t border-forest-800 text-xs text-sand-400 space-y-2">
                <p className="font-semibold text-white">{user.name}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] truncate max-w-[140px]">{user.email}</span>
                  {getRoleBadge(user.role)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
