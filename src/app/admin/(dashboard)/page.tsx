import React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { getDashboardMetrics } from "@/lib/dal/admin-dashboard";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MapPinIcon,
  NewspaperIcon,
  CalendarIcon,
  BookOpenIcon,
  InboxIcon,
  UsersIcon,
  ArrowRightIcon,
  SettingsIcon,
} from "@/components/icons";

export default async function AdminDashboardPage() {
  await connection();
  const [metrics, session] = await Promise.all([
    getDashboardMetrics(),
    getSession(),
  ]);

  const isSuperAdmin = session?.role === Role.SUPER_ADMIN;

  return (
    <div className="space-y-8">
      {/* 1. Header & Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sand-300">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
              National Operations Console
            </span>
            {metrics.isLiveDatabase ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live PostgreSQL
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Resilient Baseline Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Welcome back, {session?.name ?? "Administrator"}
          </h1>
          <p className="text-xs sm:text-sm text-forest-700 mt-1">
            System overview and operational status for the National Association of Soroptimist International of India.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button href="/admin/news" variant="primary" size="sm">
            Publish Update
          </Button>
          <Button href="/admin/enquiries" variant="outline" size="sm">
            View Enquiries ({metrics.enquiries.unreadContact + metrics.enquiries.unreadMembership})
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Grid (Clubs, News, Events, Newsletters, Enquiries) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Clubs Metric */}
        <Card variant="elevated" className="bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Clubs</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <MapPinIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-forest-950">
              {metrics.clubs.active}
            </div>
            <p className="text-[11px] text-forest-600 mt-1">
              Active chapters of {metrics.clubs.total} nationwide
            </p>
          </div>
          <Link
            href="/admin/clubs"
            className="text-xs font-semibold text-teal-800 hover:text-forest-950 inline-flex items-center gap-1 mt-4 pt-3 border-t border-sand-100"
          >
            <span>Manage Clubs</span>
            <ArrowRightIcon size={12} />
          </Link>
        </Card>

        {/* News Metric */}
        <Card variant="elevated" className="bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">News</span>
              <div className="w-8 h-8 rounded-lg bg-sand-100 text-forest-700 flex items-center justify-center">
                <NewspaperIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-forest-950">
              {metrics.news.published}
            </div>
            <p className="text-[11px] text-forest-600 mt-1">
              Published articles ({metrics.news.drafts} drafts)
            </p>
          </div>
          <Link
            href="/admin/news"
            className="text-xs font-semibold text-teal-800 hover:text-forest-950 inline-flex items-center gap-1 mt-4 pt-3 border-t border-sand-100"
          >
            <span>Article Manager</span>
            <ArrowRightIcon size={12} />
          </Link>
        </Card>

        {/* Upcoming Events Metric */}
        <Card variant="elevated" className="bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Events</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <CalendarIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-forest-950">
              {metrics.events.upcoming}
            </div>
            <p className="text-[11px] text-forest-600 mt-1">
              Upcoming gatherings scheduled
            </p>
          </div>
          <Link
            href="/admin/events"
            className="text-xs font-semibold text-teal-800 hover:text-forest-950 inline-flex items-center gap-1 mt-4 pt-3 border-t border-sand-100"
          >
            <span>Action Calendar</span>
            <ArrowRightIcon size={12} />
          </Link>
        </Card>

        {/* Pending Newsletters Metric */}
        <Card variant="elevated" className="bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Newsletters</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <BookOpenIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-forest-950">
              {metrics.newsletters.total}
            </div>
            <p className="text-[11px] text-forest-600 mt-1">
              {metrics.newsletters.pending} pending editorial review
            </p>
          </div>
          <Link
            href="/admin/newsletters"
            className="text-xs font-semibold text-teal-800 hover:text-forest-950 inline-flex items-center gap-1 mt-4 pt-3 border-t border-sand-100"
          >
            <span>View Issues</span>
            <ArrowRightIcon size={12} />
          </Link>
        </Card>

        {/* Unread Enquiries Metric */}
        <Card variant="elevated" className="bg-white p-5 flex flex-col justify-between border-teal-200">
          <div>
            <div className="flex items-center justify-between text-forest-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Enquiries</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <InboxIcon size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-forest-950">
              {metrics.enquiries.unreadContact + metrics.enquiries.unreadMembership}
            </div>
            <p className="text-[11px] text-forest-600 mt-1">
              Unread ({metrics.enquiries.unreadContact} contact, {metrics.enquiries.unreadMembership} membership)
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-semibold text-teal-800 hover:text-forest-950 inline-flex items-center gap-1 mt-4 pt-3 border-t border-sand-100"
          >
            <span>Review Inbox</span>
            <ArrowRightIcon size={12} />
          </Link>
        </Card>
      </div>

      {/* 3. Operational Modules & Quick Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-forest-800 font-sans">
          Working Administration Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module: Clubs */}
          <Card variant="default" className="p-5 hover:border-forest-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-teal-300 flex items-center justify-center mb-3">
                <MapPinIcon size={20} />
              </div>
              <Badge variant="teal" size="sm">19 Clubs</Badge>
            </div>
            <CardTitle as="h3" className="text-base text-forest-950">
              Clubs Directory & Chapters
            </CardTitle>
            <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
              Maintain chapter locations, contact coordinators, meeting timings, and signature grassroots projects across all 5 regional zones.
            </p>
            <div className="mt-4 pt-3 border-t border-sand-200">
              <Button href="/admin/clubs" variant="outline" size="sm" className="w-full justify-center">
                Open Clubs Module
              </Button>
            </div>
          </Card>

          {/* Module: Committee */}
          <Card variant="default" className="p-5 hover:border-forest-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-teal-300 flex items-center justify-center mb-3">
                <UsersIcon size={20} />
              </div>
              <Badge variant="forest" size="sm">Biennium 2026–2028</Badge>
            </div>
            <CardTitle as="h3" className="text-base text-forest-950">
              National Committee Roster
            </CardTitle>
            <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
              Manage national executive portfolios, including President, Secretary, Treasurer, PAC, and Regional Club convenors.
            </p>
            <div className="mt-4 pt-3 border-t border-sand-200">
              <Button href="/admin/committee" variant="outline" size="sm" className="w-full justify-center">
                Open Committee Module
              </Button>
            </div>
          </Card>

          {/* Module: News */}
          <Card variant="default" className="p-5 hover:border-forest-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-teal-300 flex items-center justify-center mb-3">
                <NewspaperIcon size={20} />
              </div>
              <Badge variant="teal" size="sm">Content Hub</Badge>
            </div>
            <CardTitle as="h3" className="text-base text-forest-950">
              News & Media Announcements
            </CardTitle>
            <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
              Draft, review, and publish national press releases, programme updates, and club spotlight stories with category tagging.
            </p>
            <div className="mt-4 pt-3 border-t border-sand-200">
              <Button href="/admin/news" variant="outline" size="sm" className="w-full justify-center">
                Open News Module
              </Button>
            </div>
          </Card>

          {/* Module: Events */}
          <Card variant="default" className="p-5 hover:border-forest-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-teal-300 flex items-center justify-center mb-3">
                <CalendarIcon size={20} />
              </div>
              <Badge variant="gold" size="sm">National Calendar</Badge>
            </div>
            <CardTitle as="h3" className="text-base text-forest-950">
              Events & National Conferences
            </CardTitle>
            <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
              Manage hybrid conferences, National Council gatherings, virtual webinars, and regional leadership workshops.
            </p>
            <div className="mt-4 pt-3 border-t border-sand-200">
              <Button href="/admin/events" variant="outline" size="sm" className="w-full justify-center">
                Open Events Module
              </Button>
            </div>
          </Card>

          {/* Module: Enquiries */}
          <Card variant="default" className="p-5 hover:border-forest-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-teal-300 flex items-center justify-center mb-3">
                <InboxIcon size={20} />
              </div>
              <Badge variant="forest" size="sm">
                {metrics.enquiries.unreadContact + metrics.enquiries.unreadMembership} New
              </Badge>
            </div>
            <CardTitle as="h3" className="text-base text-forest-950">
              Enquiries & Membership Applications
            </CardTitle>
            <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
              Direct inbox routing for public contact forms and prospective member applications with preferred chapter tracking.
            </p>
            <div className="mt-4 pt-3 border-t border-sand-200">
              <Button href="/admin/enquiries" variant="outline" size="sm" className="w-full justify-center">
                Open Enquiries Module
              </Button>
            </div>
          </Card>

          {/* Module: Site Settings (Super Admin Only) */}
          <Card
            variant={isSuperAdmin ? "default" : "muted"}
            className="p-5 hover:border-forest-400 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-300 flex items-center justify-center mb-3">
                <SettingsIcon size={20} />
              </div>
              <Badge variant={isSuperAdmin ? "gold" : "neutral"} size="sm">
                {isSuperAdmin ? "Super Admin" : "Restricted"}
              </Badge>
            </div>
            <CardTitle as="h3" className="text-base text-forest-950">
              Site Settings & Brand Config
            </CardTitle>
            <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
              Update organization name, logos, contact information, social handles, homepage banners, and footer compliance notes.
            </p>
            <div className="mt-4 pt-3 border-t border-sand-200">
              {isSuperAdmin ? (
                <Button href="/admin/settings" variant="outline" size="sm" className="w-full justify-center">
                  Configure Settings
                </Button>
              ) : (
                <span className="text-xs text-forest-500 font-mono block text-center py-1.5">
                  Super Admin role required
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Recent Inquiries Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Enquiries */}
        <Card variant="elevated" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle as="h3" className="text-base">Recent Contact Inquiries</CardTitle>
              <p className="text-xs text-forest-600 mt-0.5">Submitted via national Contact Us page</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-teal-800 hover:text-forest-950"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-sand-100 p-0">
            {metrics.recentContactEnquiries.length === 0 ? (
              <div className="p-6 text-center text-xs text-forest-600">
                No inquiries received yet.
              </div>
            ) : (
              metrics.recentContactEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 flex items-center justify-between hover:bg-sand-50/50">
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-forest-950 truncate">{enq.name}</p>
                    <p className="text-[11px] text-forest-600 font-mono truncate">{enq.email}</p>
                    {enq.subject && (
                      <p className="text-xs text-forest-800 mt-0.5 truncate">{enq.subject}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-forest-500 font-mono">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {!enq.isRead ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-teal-100 text-teal-900">
                        NEW
                      </span>
                    ) : (
                      <span className="text-[10px] text-forest-400">Read</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Membership Applications */}
        <Card variant="elevated" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle as="h3" className="text-base">Recent Membership Applications</CardTitle>
              <p className="text-xs text-forest-600 mt-0.5">Submitted via Join SI Today application form</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-teal-800 hover:text-forest-950"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-sand-100 p-0">
            {metrics.recentMembershipEnquiries.length === 0 ? (
              <div className="p-6 text-center text-xs text-forest-600">
                No membership applications received yet.
              </div>
            ) : (
              metrics.recentMembershipEnquiries.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between hover:bg-sand-50/50">
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-forest-950 truncate">{app.name}</p>
                    <p className="text-[11px] text-forest-600 font-mono truncate">{app.email}</p>
                    {app.city && (
                      <p className="text-xs text-forest-800 mt-0.5">Location: {app.city}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-forest-500 font-mono">
                      {new Date(app.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {!app.isRead ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-teal-100 text-teal-900">
                        NEW
                      </span>
                    ) : (
                      <span className="text-[10px] text-forest-400">Reviewed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
