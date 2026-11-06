import React from "react";
import Link from "next/link";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CommitteeCard } from "@/components/committee/CommitteeCard";
import { HomeHeroBanner } from "@/components/home/HomeHeroBanner";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  UsersIcon,
  HeartHandshakeIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site";
import { initialClubs } from "@/data/clubs";
import { initialCommittee } from "@/data/committee";
import { initialNews } from "@/data/news";
import { initialEvents } from "@/data/events";
import { getSiteSettings } from "@/lib/dal/settings";

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
    } catch { }
  }

  return { latestNews, upcomingEvents };
}

export default async function HomePage() {
  await connection();
  const featuredClubs = initialClubs.slice(0, 3);
  const committeePreview = initialCommittee; // NASI India Board: 2026-2028
  const [homeData, settings] = await Promise.all([
    getHomePageData(),
    getSiteSettings().catch(() => null),
  ]);
  const { latestNews, upcomingEvents } = homeData;

  return (
    <>
      {/* 1. Main Hero Banner - Reference Layout with Dynamic Admin Settings */}
      <HomeHeroBanner
        title={settings?.["home.heroTitle"]}
        subtitle={settings?.["home.heroSubtitle"]}
        ctaText={settings?.["home.heroCtaText"]}
        ctaUrl={settings?.["home.heroCtaUrl"]}
        secondaryCtaText={settings?.["home.heroSecondaryCtaText"]}
        secondaryCtaUrl={settings?.["home.heroSecondaryCtaUrl"]}
        imageLeft={settings?.["home.heroImageLeft"]}
        imageRight={settings?.["home.heroImageRight"]}
        displayMode={settings?.["home.bannerDisplayMode"]}
      />

      {/* 2. Who We Are & Our Impact Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                kicker="Who We Are"
                title="A Global Movement Dedicated to Women and Girls"
                description="We are part of a global movement working to improve the lives of women and girls. Through our clubs across India, we turn commitment into action and make a meaningful difference in our communities."
              />

              <div className="space-y-4 text-[#17324D] leading-relaxed text-sm sm:text-base">
                <p>
                  Soroptimists are women who take action. Across our chartered chapters,
                  members volunteer their professional expertise, resources, and time to
                  deliver measurable improvements in the lives of women and children.
                </p>
                <p>
                  From academic scholarships and vocational workshops to healthcare
                  and environmental stewardship, our initiatives align with Soroptimist
                  International&apos;s global Programme Action priorities and consultative status
                  with the United Nations.
                </p>
              </div>

              {/* Mission & Vision Statements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon size={16} className="text-[#005596]" />
                    <span className="text-xs uppercase font-bold tracking-wider text-[#17324D]">Our Mission</span>
                  </div>
                  <p className="text-xs text-[#61758A] leading-relaxed">
                    To improve the lives and opportunities of women and girls through education, empowerment, advocacy and community service.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] space-y-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon size={16} className="text-[#D4A737]" />
                    <span className="text-xs uppercase font-bold tracking-wider text-[#17324D]">Our Vision</span>
                  </div>
                  <p className="text-xs text-[#61758A] leading-relaxed">
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

            {/* Our Impact 4 Pillars */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#005596]">
                  Our Impact
                </span>
                <h3 className="text-xl font-serif font-bold text-[#17324D] mt-1">
                  How We Drive Lasting Change
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] shadow-2xs flex items-start gap-4 hover:border-[#aed1ef] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 shadow-2xs">
                  <HeartHandshakeIcon size={22} />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#17324D]">
                    Empowering Women and Girls
                  </h4>
                  <p className="text-sm text-[#61758A] mt-1 leading-relaxed">
                    Facilitating skills, mentorship, and economic self-reliance so women and girls can lead with confidence and dignity.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] shadow-2xs flex items-start gap-4 hover:border-[#aed1ef] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpenIcon size={22} />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#17324D]">
                    Supporting Education and Opportunities
                  </h4>
                  <p className="text-sm text-[#61758A] mt-1 leading-relaxed">
                    Awarding scholarships, funding school retention programs, and creating vocational opportunities for underserved youth.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] shadow-2xs flex items-start gap-4 hover:border-[#aed1ef] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 shadow-2xs">
                  <SparklesIcon size={22} />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#17324D]">
                    Strengthening Local Communities
                  </h4>
                  <p className="text-sm text-[#61758A] mt-1 leading-relaxed">
                    Addressing maternal healthcare, clean water, environmental sustainability, and disaster response at the grassroots level.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] shadow-2xs flex items-start gap-4 hover:border-[#aed1ef] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 shadow-2xs">
                  <UsersIcon size={22} />
                </div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#17324D]">
                    Building a Network of Women Leaders
                  </h4>
                  <p className="text-sm text-[#61758A] mt-1 leading-relaxed">
                    Uniting professional women across India in fellowship, leadership development, and high-impact collective advocacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Featured Clubs Section */}
      <section className="py-16 sm:py-24 bg-[#F4FAFF] border-b border-[#D7E8F5]">
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
              <Card key={club.slug} variant="elevated" className="flex flex-col justify-between group hover:border-[#005596] transition-all duration-200">
                <div>
                  <div className="relative h-36 w-full bg-gradient-to-br from-[#005596] to-[#003A6B] p-5 text-white flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <Badge variant="teal" size="sm" className="bg-[#002D54]/90 text-white border-white/20">
                        {club.region}
                      </Badge>
                      <span className="text-[11px] font-mono text-[#D7E8F5]">Chartered</span>
                    </div>
                    <div>
                      <span className="font-serif font-bold text-xl text-white group-hover:text-[#E8F3FC] transition-colors">
                        {club.name}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pt-4 pb-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#005596] font-medium">
                      <MapPinIcon size={14} className="text-[#005596] shrink-0" />
                      <span>{club.city}, {club.state}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-[#61758A] leading-relaxed line-clamp-2">
                      {club.description}
                    </p>
                  </CardContent>
                </div>
                <CardFooter className="pt-3 border-t border-[#D7E8F5] bg-[#F4FAFF] flex items-center justify-between">
                  <span className="text-xs text-[#61758A] font-medium">Active Club</span>
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="text-xs font-semibold text-[#005596] group-hover:text-[#003A6B] inline-flex items-center gap-1 transition-colors"
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

      {/* 4. National Board: 2026-2028 */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="National Association Soroptimist India (NASI-India)"
              title="NASI India Board: 2026–2028"
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
              Meet Full Board
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
      <section className="py-16 sm:py-24 bg-[#F4FAFF] border-b border-[#D7E8F5]">
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
              <Card key={news.slug} variant="elevated" className="flex flex-col justify-between group hover:border-[#005596] transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="forest" size="sm">
                      {news.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#61758A]">
                      {news.readTime}
                    </span>
                  </div>
                  <CardTitle as="h3" className="text-base sm:text-lg group-hover:text-[#005596] transition-colors">
                    {news.title}
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-[#61758A] mt-2">
                    <CalendarIcon size={14} className="text-[#005596] shrink-0" />
                    <span>{news.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[#61758A] leading-relaxed line-clamp-2">
                    {news.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-[#D7E8F5] bg-[#F4FAFF] flex items-center justify-between">
                  <span className="text-xs text-[#61758A] italic">National Action</span>
                  <Link
                    href={`/news/${news.slug}`}
                    className="text-xs font-semibold text-[#005596] group-hover:text-[#003A6B] inline-flex items-center gap-1 transition-colors"
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
      <section className="py-16 sm:py-24 bg-white border-b border-[#D7E8F5]">
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
              <Card key={event.slug} variant="elevated" className="group hover:border-[#005596] transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="teal" size="sm">
                      {event.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#61758A]">
                      {event.format}
                    </span>
                  </div>
                  <CardTitle as="h3" className="text-lg group-hover:text-[#005596] transition-colors">
                    {event.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#61758A] mt-2">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-[#005596] shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon size={14} className="text-[#005596] shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[#61758A] leading-relaxed">
                    {event.shortDescription}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-[#D7E8F5] bg-[#F4FAFF] flex items-center justify-between">
                  <span className="text-xs text-[#005596] font-medium">Open for Registration</span>
                  <Link
                    href={`/events/${event.slug}`}
                    className="text-xs font-semibold text-[#005596] hover:text-[#003A6B] inline-flex items-center gap-1 transition-colors"
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
      <section className="py-16 sm:py-24 bg-[#002D54] text-white border-b border-[#001E38]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#E8F3FC] bg-[#003A6B] px-3 py-1 rounded-md border border-[#004780] inline-block">
                Soroptimist International Affiliation
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
                Connected to a Global Network of Service
              </h2>
              <p className="text-[#D7E8F5] text-sm sm:text-base leading-relaxed max-w-2xl">
                Soroptimist International holds General Consultative Status with the United
                Nations Economic and Social Council (ECOSOC). Our club members participate in
                global dialogues, biennial federation conferences, and international advocacy campaigns.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Button
                  href="/resources"
                  size="md"
                  className="bg-[#E8F3FC] hover:bg-white text-[#005596] font-semibold"
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  Explore 7 Global Resources
                </Button>
                <Button
                  href={siteConfig.internationalAffiliation.globalUrl}
                  isExternal
                  variant="outline"
                  size="md"
                  className="text-white border-white/80 hover:bg-white/10"
                  rightIcon={<ExternalLinkIcon size={14} />}
                >
                  Visit Soroptimist International
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#001E38] border border-[#003A6B] text-xs space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-[#E8F3FC] font-semibold text-sm">
                <SparklesIcon size={18} className="text-[#aed1ef]" />
                <span>Federation Network</span>
              </div>
              <p className="text-[#D7E8F5]">
                Explore our sister federations and publications in the resources repository:
              </p>
              <ul className="space-y-2 text-[#D7E8F5]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#aed1ef]" />
                  <span>SI Africa & SI Americas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#aed1ef]" />
                  <span>SI Europe & SI South East Asia Pacific</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#aed1ef]" />
                  <span>Global Voice Newsletter & Charter Toolkits</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Join Our Movement Section */}
      <section className="py-16 sm:py-24 bg-[#F4FAFF] border-t border-[#D7E8F5]">
        <Container>
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#005596] text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden border border-[#004780]">
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
              <span className="text-xs uppercase tracking-widest font-semibold text-[#D4A737]">
                Join Our Movement
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">
                Together, we can make a difference.
              </h2>
              <p className="text-sm sm:text-base text-[#F4FAFF] leading-relaxed">
                Become part of a community of women who believe in service, leadership and creating lasting change.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 shrink-0 w-full sm:w-auto">
              <Button
                href="/join"
                size="lg"
                className="justify-center bg-white hover:bg-[#E8F3FC] text-[#005596] font-semibold shadow-md transition-colors"
                rightIcon={<ArrowRightIcon size={16} />}
              >
                Become a Member
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="text-white border-white/80 hover:bg-white/10 justify-center font-medium transition-colors"
              >
                Contact NASI India
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
