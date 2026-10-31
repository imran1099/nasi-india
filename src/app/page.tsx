import React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CommitteeCard } from "@/components/committee/CommitteeCard";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  UsersIcon,
  HeartHandshakeIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site";
import { initialClubs } from "@/data/clubs";
import { initialCommittee } from "@/data/committee";
import { initialNews } from "@/data/news";
import { initialEvents } from "@/data/events";

// Allow this route to block at prerender when dynamic DB data is fetched
export const instant = false;
export const ensureStatic = false;

interface HomeNewsItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
}

interface HomeEventItem {
  slug: string;
  title: string;
  category: string;
  format: string;
  date: string;
  location: string;
  shortDescription: string;
}

async function getHomePageData(): Promise<{
  latestNews: HomeNewsItem[];
  upcomingEvents: HomeEventItem[];
}> {
  await connection();
  let latestNews: HomeNewsItem[] = initialNews.slice(0, 3).map((n) => ({
    slug: n.slug,
    title: n.title,
    category: n.category,
    readTime: n.readTime,
    date: n.date,
    excerpt: n.excerpt,
  }));

  let upcomingEvents: HomeEventItem[] = initialEvents.slice(0, 2).map((e) => ({
    slug: e.slug,
    title: e.title,
    category: e.category,
    format: e.format,
    date: e.date,
    location: e.location,
    shortDescription: e.shortDescription,
  }));

  if (process.env.DATABASE_URL) {
    try {
      const { getPublishedArticles } = await import("@/lib/dal/news");
      const { getFeaturedEvents } = await import("@/lib/dal/events");

      const [newsRes, eventsRes] = await Promise.all([
        getPublishedArticles({ perPage: 3 }).catch(() => null),
        getFeaturedEvents().catch(() => []),
      ]);

      if (newsRes && newsRes.items.length > 0) {
        latestNews = newsRes.items.map((a) => ({
          slug: a.slug,
          title: a.title,
          category: a.category?.name || "National Programme",
          readTime: "3 min read",
          date: a.publishedAt
            ? new Date(a.publishedAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent",
          excerpt: a.excerpt || "",
        }));
      }

      if (eventsRes && eventsRes.length > 0) {
        upcomingEvents = eventsRes.map((e) => ({
          slug: e.slug,
          title: e.title,
          category: e.eventType.replace("_", "-"),
          format: e.eventType.replace("_", "-"),
          date: new Date(e.startsAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          location: [e.venue, e.city].filter(Boolean).join(", ") || "Virtual",
          shortDescription: e.description || "",
        }));
      }
    } catch {}
  }

  return { latestNews, upcomingEvents };
}

export default async function HomePage() {
  const featuredClubs = initialClubs.slice(0, 3);
  const committeePreview = initialCommittee.slice(0, 4); // President, Secretary, Treasurer, PAC
  const { latestNews, upcomingEvents } = await getHomePageData();

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white py-16 sm:py-24 lg:py-28 border-b border-forest-800">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Organization Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-800/90 border border-forest-700/80 text-teal-200 text-xs sm:text-sm font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span>National Association of Soroptimist International of India</span>
              </div>

              {/* Hero Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.12]">
                Empowering Women & Transforming Communities Across India
              </h1>

              {/* Hero Subtext */}
              <p className="text-base sm:text-lg lg:text-xl text-sand-200/90 leading-relaxed max-w-2xl">
                A national network of chartered Soroptimist clubs uniting professional women
                in purposeful voluntary service — advancing education, healthcare, economic
                self-reliance, and leadership for women and girls nationwide.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  href="/clubs"
                  variant="secondary"
                  size="lg"
                  className="bg-teal-700 hover:bg-teal-800 text-white shadow-md font-semibold"
                  rightIcon={<ArrowRightIcon size={18} />}
                >
                  Explore Our Clubs
                </Button>
                <Button
                  href="/about"
                  variant="outline"
                  size="lg"
                  className="text-white border-sand-200/80 hover:bg-white/10 hover:text-white focus-visible:ring-white font-medium"
                >
                  Learn About NASI India
                </Button>
              </div>

              {/* Trust & Credibility Strip */}
              <div className="pt-6 border-t border-forest-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-sand-300">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-gold-400 shrink-0" />
                  <span>19 Chartered Clubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} className="text-teal-400 shrink-0" />
                  <span>Affiliated to SI Global</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircleIcon size={16} className="text-gold-400 shrink-0" />
                  <span>UN ECOSOC Status</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Column (5 cols) - Professional image area with sample visual showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Visual Showcase Card */}
                <div className="rounded-2xl bg-gradient-to-br from-forest-800 via-forest-850 to-teal-950 p-6 sm:p-8 border border-forest-700/80 shadow-2xl space-y-6 relative overflow-hidden">
                  <div
                    className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-teal-300 bg-forest-900/80 px-3 py-1 rounded-full border border-forest-700">
                      National Programme Action
                    </span>
                    <span className="text-xs font-mono text-sand-300">
                      Est. Chartered
                    </span>
                  </div>

                  {/* Headline in Showcase */}
                  <div>
                    <span className="text-xs font-serif italic text-gold-400">
                      A Century of Global Service
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                      Women Inspiring Action, Transforming Lives
                    </h3>
                    <p className="text-xs sm:text-sm text-sand-200/80 mt-2 leading-relaxed">
                      Soroptimist clubs across 19 Indian cities champion education,
                      vocational training, maternal health, and social equity through
                      grassroots volunteer action.
                    </p>
                  </div>

                  {/* Three Pillars Mini Showcase */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-forest-700/60 text-center">
                    <div className="p-2.5 rounded-lg bg-forest-900/60 border border-forest-700/40">
                      <BookOpenIcon size={18} className="mx-auto text-teal-300 mb-1" />
                      <span className="text-[11px] font-semibold text-white block">Educate</span>
                      <span className="text-[10px] text-sand-300">Girls & Youth</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-forest-900/60 border border-forest-700/40">
                      <UsersIcon size={18} className="mx-auto text-gold-400 mb-1" />
                      <span className="text-[11px] font-semibold text-white block">Empower</span>
                      <span className="text-[10px] text-sand-300">Leadership</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-forest-900/60 border border-forest-700/40">
                      <HeartHandshakeIcon size={18} className="mx-auto text-teal-300 mb-1" />
                      <span className="text-[11px] font-semibold text-white block">Enable</span>
                      <span className="text-[10px] text-sand-300">Community</span>
                    </div>
                  </div>

                  {/* Floating Action Chip */}
                  <div className="pt-2 flex items-center justify-between text-xs text-sand-300">
                    <span className="italic">Explore active local chapters</span>
                    <Link
                      href="/clubs"
                      className="text-teal-300 hover:text-white font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Find nearest club</span>
                      <ArrowRightIcon size={12} />
                    </Link>
                  </div>
                </div>

                {/* Decorative overlapping stat pill */}
                <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-5 bg-white text-forest-950 px-4 py-2.5 rounded-xl border border-sand-200 shadow-xl">
                  <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-sm">
                    19
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-forest-950">Chartered Clubs</span>
                    <span className="text-[10px] text-forest-600">Across Metropolitan & Regional India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Organization Introduction & Mission / Vision Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                kicker="About Our Organization"
                title="A National Movement for Grassroots Empowerment"
                description="NASI India serves as the umbrella body for Soroptimist International clubs active across India, coordinating national campaigns, sharing best practices, and fostering inter-club synergy."
              />

              <div className="space-y-4 text-forest-800 leading-relaxed text-sm sm:text-base">
                <p>
                  Soroptimists are women who take action. Across our chartered chapters,
                  members volunteer their professional expertise, resources, and time to
                  deliver measurable improvements in the lives of women and children.
                </p>
                <p>
                  From academic scholarships and vocational workshops to maternal healthcare
                  and environmental education, our initiatives align with Soroptimist
                  International&apos;s global Programme Action priorities.
                </p>
              </div>

              {/* Mission & Vision Statements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon size={16} className="text-teal-700" />
                    <span className="text-xs uppercase font-bold tracking-wider text-forest-950">Our Mission</span>
                  </div>
                  <p className="text-xs text-forest-800/85 leading-relaxed">
                    To inspire action and create opportunities that transform the lives of women and girls through a global network of members and international partnerships.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon size={16} className="text-gold-600" />
                    <span className="text-xs uppercase font-bold tracking-wider text-forest-950">Our Vision</span>
                  </div>
                  <p className="text-xs text-forest-800/85 leading-relaxed">
                    Women and girls will achieve their individual and collective potential, realize aspirations, and have an equal voice in creating strong, peaceful communities.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Button
                  href="/about"
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  Learn More About NASI India
                </Button>
                <Button
                  href="/join"
                  variant="outline"
                  size="md"
                >
                  Membership Pathway
                </Button>
              </div>
            </div>

            {/* Three Mission Pillars Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200/90 shadow-2xs flex items-start gap-4 hover:border-forest-400 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpenIcon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-forest-950">
                    Education & Literacy
                  </h3>
                  <p className="text-sm text-forest-700 mt-1 leading-relaxed">
                    Facilitating school retention, digital skills, and vocational training
                    scholarships for underprivileged girls to achieve long-term independence.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200/90 shadow-2xs flex items-start gap-4 hover:border-forest-400 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <UsersIcon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-forest-950">
                    Leadership & Economic Independence
                  </h3>
                  <p className="text-sm text-forest-700 mt-1 leading-relaxed">
                    Nurturing mentorship networks, financial literacy, and micro-entrepreneurship
                    opportunities for women artisans and emerging entrepreneurs.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200/90 shadow-2xs flex items-start gap-4 hover:border-forest-400 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                  <HeartHandshakeIcon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-forest-950">
                    Advocacy & Healthcare
                  </h3>
                  <p className="text-sm text-forest-700 mt-1 leading-relaxed">
                    Championing gender equity, maternal wellbeing, clean sanitation, and safety
                    in both urban slums and rural grassroots communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Featured Clubs Section */}
      <section className="py-16 sm:py-24 bg-sand-50/60 border-b border-sand-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="Nationwide Network"
              title="Chartered Club Chapters"
              description="Explore 19 vibrant Soroptimist International clubs driving community action across India."
              className="mb-0"
            />
            <Button
              href="/clubs"
              variant="outline"
              size="md"
              rightIcon={<ArrowRightIcon size={16} />}
              className="shrink-0 font-medium"
            >
              All 19 Clubs Directory
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <Card key={club.slug} variant="elevated" className="flex flex-col justify-between group hover:border-forest-400 transition-all duration-200">
                <div>
                  <div className="relative h-36 w-full bg-gradient-to-br from-forest-800 to-teal-950 p-5 text-white flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <Badge variant="teal" size="sm" className="bg-teal-900/80 text-teal-200 border-teal-700">
                        {club.region}
                      </Badge>
                      <span className="text-[11px] font-mono text-sand-300">Chartered</span>
                    </div>
                    <div>
                      <span className="font-serif font-bold text-xl text-white group-hover:text-teal-200 transition-colors">
                        {club.name}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pt-4 pb-2">
                    <div className="flex items-center gap-1.5 text-xs text-forest-700 font-medium">
                      <MapPinIcon size={14} className="text-teal-600 shrink-0" />
                      <span>{club.city}, {club.state}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-forest-800/80 leading-relaxed line-clamp-2">
                      {club.description}
                    </p>
                  </CardContent>
                </div>
                <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50 flex items-center justify-between">
                  <span className="text-xs text-forest-600 font-medium">Active Club</span>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="text-xs font-semibold text-teal-800 group-hover:text-forest-950 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Club Profile</span>
                    <ArrowRightIcon size={13} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. National Committee Preview */}
      <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="Governance & Leadership"
              title="National Executive Committee"
              description="Dedicated volunteer leaders guiding NASI India's strategic vision, governance, and nationwide programme action."
              className="mb-0"
            />
            <Button
              href="/committee"
              variant="outline"
              size="md"
              rightIcon={<ArrowRightIcon size={16} />}
              className="shrink-0 font-medium"
            >
              Meet Full Committee
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committeePreview.map((member) => (
              <CommitteeCard key={member.role} member={member} showBio={false} />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Latest News Section */}
      <section className="py-16 sm:py-24 bg-sand-50/60 border-b border-sand-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="News & Updates"
              title="Latest Action & Reports"
              description="Stay informed with announcements from the National Secretariat and impact highlights from chartered clubs."
              className="mb-0"
            />
            <Button
              href="/news"
              variant="outline"
              size="md"
              rightIcon={<ArrowRightIcon size={16} />}
              className="shrink-0 font-medium"
            >
              All News
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <Card key={news.slug} variant="elevated" className="flex flex-col justify-between group hover:border-forest-400 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="forest" size="sm">
                      {news.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-forest-500">
                      {news.readTime}
                    </span>
                  </div>
                  <CardTitle as="h3" className="text-base sm:text-lg group-hover:text-forest-800 transition-colors">
                    {news.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-forest-600 mt-2">
                    <CalendarIcon size={14} className="text-teal-600 shrink-0" />
                    <span>{news.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-forest-800/80 leading-relaxed line-clamp-2">
                    {news.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50 flex items-center justify-between">
                  <span className="text-xs text-forest-500 italic">Sample item</span>
                  <Link
                    href={`/news/${news.slug}`}
                    className="text-xs font-semibold text-teal-800 group-hover:text-forest-950 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRightIcon size={13} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Upcoming Events Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="Events & Calendar"
              title="Upcoming Gatherings"
              description="Join conferences, national meetings, and collaborative workshops across India."
              className="mb-0"
            />
            <Button
              href="/events"
              variant="outline"
              size="md"
              rightIcon={<ArrowRightIcon size={16} />}
              className="shrink-0 font-medium"
            >
              Full Calendar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.slug} variant="elevated" className="group hover:border-forest-400 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="teal" size="sm">
                      {event.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-forest-500">
                      {event.format}
                    </span>
                  </div>
                  <CardTitle as="h3" className="text-lg group-hover:text-forest-800 transition-colors">
                    {event.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-forest-700 mt-2">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-teal-600 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon size={14} className="text-teal-600 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-forest-800/80 leading-relaxed">
                    {event.shortDescription}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50 flex items-center justify-between">
                  <span className="text-xs text-forest-600">Open for Registration</span>
                  <Link
                    href={`/events/${event.slug}`}
                    className="text-xs font-semibold text-forest-900 hover:text-teal-800 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Agenda & Details</span>
                    <ArrowRightIcon size={13} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. International Resources Section */}
      <section className="py-16 sm:py-24 bg-forest-950 text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase font-semibold tracking-wider text-teal-300 bg-forest-800 px-3 py-1 rounded-md border border-forest-700 inline-block">
                Soroptimist International Affiliation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
                Connected to a Global Network of Service
              </h2>
              <p className="text-sand-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                Soroptimist International holds General Consultative Status with the United
                Nations Economic and Social Council (ECOSOC). Our club members participate in
                global dialogues, biennial federation conferences, and international advocacy campaigns.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Button
                  href="/resources"
                  variant="secondary"
                  size="md"
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  Explore 7 Global Resources
                </Button>
                <Button
                  href={siteConfig.internationalAffiliation.globalUrl}
                  isExternal
                  variant="outline"
                  size="md"
                  className="text-white border-sand-200 hover:bg-white/10"
                  rightIcon={<ExternalLinkIcon size={14} />}
                >
                  Visit Soroptimist International
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-forest-900 border border-forest-800 text-xs space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm">
                <SparklesIcon size={18} />
                <span>Federation Network</span>
              </div>
              <p className="text-sand-300">
                Explore our sister federations and publications in the resources repository:
              </p>
              <ul className="space-y-2 text-sand-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>SI Africa & SI Americas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>SI Europe & SI South East Asia Pacific</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Global Voice Newsletter & Charter Toolkits</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Membership Call to Action (Join SI Today) */}
      <section className="py-16 sm:py-24 bg-sand-100/70 border-t border-sand-200">
        <Container>
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-teal-950 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden border border-forest-800">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-2xl space-y-3 text-center lg:text-left">
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-400">
                Join The Movement
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">
                Become a Soroptimist in India Today
              </h2>
              <p className="text-sm sm:text-base text-sand-200/90 leading-relaxed">
                Connect with women professionals, mentor the next generation of girls, and participate in grassroots projects that transform communities.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
              <Button
                href="/join"
                variant="secondary"
                size="lg"
                className="justify-center bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-md"
                rightIcon={<ArrowRightIcon size={16} />}
              >
                Apply for Membership
              </Button>
              <Button
                href="/clubs"
                variant="outline"
                size="lg"
                className="text-white border-sand-200 hover:bg-white/10 justify-center font-medium"
              >
                Find a Local Club
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
