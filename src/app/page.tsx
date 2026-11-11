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
import { InteractiveIndiaClubsMap } from "@/components/clubs/InteractiveIndiaClubsMap";
import { LandingPageStrapline } from "@/components/home/LandingPageStrapline";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  HeartHandshakeIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from "@/components/icons";
import { siteConfig } from "@/config/site";
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
  const committeePreview = initialCommittee; // NASI India Board: 2026-2028
  const [homeData, settings] = await Promise.all([
    getHomePageData(),
    getSiteSettings().catch(() => null),
  ]);
  const { latestNews, upcomingEvents } = homeData;

  // Dynamic Content from Admin Settings
  const visionText =
    settings?.["vision.text"] ||
    "Women and girls will achieve their individual and collective potential, realize aspirations, and have an equal voice in creating strong, peaceful communities.";
  const missionText =
    settings?.["mission.text"] ||
    "To improve the lives and opportunities of women and girls through education, empowerment, advocacy and community service.";
  const triadGraphicUrl = settings?.["media.triadGraphicUrl"];
  const sdgGraphicUrl = settings?.["media.sdgGraphicUrl"];

  const presidentName = settings?.["president.name"] || "Anitha Rajarajan";
  const presidentDesignation = settings?.["president.designation"] || "President, NASI-India";
  const presidentTenure = settings?.["president.tenure"] || "Biennium 2026–2028";
  const presidentPhotoUrl = settings?.["president.photoUrl"];
  const presidentMessage =
    settings?.["president.message"] ||
    "Welcome to the National Association of Soroptimist International of India. As President for the 2026–2028 biennium, I am privileged to lead an extraordinary network of women professionals and grassroots leaders across 19 chartered clubs nationwide.\n\nSince 1974, our movement in India has stood up for women and girls through practical, life-changing action. By aligning our initiatives with the United Nations Sustainable Development Goals and drawing strength from our global Soroptimist sisterhood, we strive to build a future where every girl is educated, empowered, and enabled to reach her fullest potential.\n\nTogether, with passion and commitment, we continue to create lasting change in our communities.";

  const presidentParagraphs = presidentMessage.split("\n\n").filter(Boolean);

  const federationList = (settings?.["federation.itemsText"] || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const activeFederations =
    federationList.length > 0
      ? federationList
      : [
          "Soroptimist International Great Britain & Ireland (SIGBI)",
          "Soroptimist International of the Americas (SIA)",
          "Soroptimist International of Europe (SIE)",
          "Soroptimist International of South East Asia Pacific (SISEAP)",
          "Soroptimist International African Federation (SIAF)",
        ];

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

      {/* 2. Who We Are Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            <SectionHeading
              kicker="Who We Are"
              title="A Global Movement Dedicated to Women and Girls"
              description="We are part of a global movement working to improve the lives of women and girls. Through our clubs across India, we turn commitment into action and make a meaningful difference in our communities."
            />

            <div className="space-y-5 text-[#17324D] leading-relaxed text-base sm:text-lg">
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
              <p className="font-medium text-[#005596] pt-2 border-t border-[#D7E8F5]">
                Soroptimist women are part of the largest service club movement in the world, which is more than 100 years old.
              </p>
              <p>
                NASI India is the national body governing and coordinating with all SI clubs across India.
              </p>
              <p>
                All our projects align with the 17 Sustainable Development Goals (SDGs) of the United Nations.
              </p>
              <p>
                Soroptimist International (SI) holds General Consultative Status with the United Nations Economic and Social Council (ECOSOC), and SIGBI has been granted Special Consultative Status with ECOSOC.
              </p>
              <p>
                All our programme action work is aligned with the UN Sustainable Development Goals (SDGs).
              </p>
            </div>

            {/* Credibility highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0">
                  <SparklesIcon size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#17324D]">
                    United Nations ECOSOC Status
                  </h4>
                  <p className="text-xs text-[#61758A] mt-1 leading-relaxed">
                    General Consultative Status for SI and Special Consultative Status for SIGBI, advancing women&apos;s rights globally.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4FAFF] border border-[#D7E8F5] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0">
                  <HeartHandshakeIcon size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#17324D]">
                    Aligned with the 17 UN SDGs
                  </h4>
                  <p className="text-xs text-[#61758A] mt-1 leading-relaxed">
                    Every grassroots programme action project across our 19 clubs contributes directly to the UN Sustainable Development Goals.
                  </p>
                </div>
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
                href="/clubs"
                variant="outline"
                size="md"
              >
                Explore SI Clubs Across India
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Vision and Mission (Two-Column Section) */}
      <section id="vision-mission" className="py-16 sm:py-24 bg-[#F4FAFF] border-b border-[#D7E8F5] scroll-mt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT COLUMN: Vision & Mission */}
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                kicker="Our Purpose"
                title="Vision & Mission"
                description="Guiding our nationwide movement of women leaders dedicated to transformative social change."
              />

              {/* Vision Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D7E8F5] shadow-xs hover:border-[#005596] transition-all duration-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#D4A737]" />
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#17324D]">
                    Our Vision
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-[#17324D] leading-relaxed font-serif italic pl-4 border-l-2 border-[#D4A737]">
                  &ldquo;{visionText}&rdquo;
                </p>
              </div>

              {/* Mission Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#D7E8F5] shadow-xs hover:border-[#005596] transition-all duration-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#005596]" />
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#17324D]">
                    Our Mission
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-[#17324D] leading-relaxed font-serif italic pl-4 border-l-2 border-[#005596]">
                  &ldquo;{missionText}&rdquo;
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Graphic Placeholders (Educate, Empower, Enable + UN SDGs) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Graphic 1: Educate, Empower, Enable */}
              {triadGraphicUrl ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D7E8F5] shadow-md relative overflow-hidden flex flex-col items-center text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={triadGraphicUrl}
                    alt="Educate • Empower • Enable Graphic"
                    className="max-h-48 w-auto object-contain"
                  />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#005596] mt-3">
                    Educate • Empower • Enable
                  </span>
                </div>
              ) : (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#005596] to-[#003A6B] text-white shadow-md border border-[#004780] relative overflow-hidden text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-2xl font-serif font-bold text-[#D4A737]">3E</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white">Triad</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D4A737] bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
                        Official Graphic Placeholder
                      </span>
                      <h4 className="font-serif font-bold text-xl sm:text-2xl text-white">
                        Educate • Empower • Enable
                      </h4>
                      <p className="text-xs text-[#E8F3FC] leading-relaxed">
                        Core pillar graphic representing the tripartite foundation of Soroptimist action across India.
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 pt-3 border-t border-white/15 text-[11px] text-[#D7E8F5] italic text-center">
                    [Educate, Empower, Enable graphic will be supplied by the NASI team]
                  </p>
                </div>
              )}

              {/* Graphic 2: Circular UN Sustainable Development Goals */}
              {sdgGraphicUrl ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D7E8F5] shadow-md relative overflow-hidden flex flex-col items-center text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sdgGraphicUrl}
                    alt="Circular UN Sustainable Development Goals"
                    className="max-h-48 w-auto object-contain"
                  />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#005596] mt-3">
                    Circular UN Sustainable Development Goals (SDGs)
                  </span>
                </div>
              ) : (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#D7E8F5] shadow-xs text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Stylized Circular 17 SDG Ring */}
                    <div className="relative w-20 h-20 rounded-full border-4 border-dashed border-[#005596]/40 flex items-center justify-center shrink-0 bg-[#F4FAFF]">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#005596] via-[#D4A737] to-[#10B981] flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                        17 SDGs
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-0.5 rounded-full inline-block">
                        UN Graphic Placeholder
                      </span>
                      <h4 className="font-serif font-bold text-lg sm:text-xl text-[#17324D]">
                        Circular UN Sustainable Development Goals
                      </h4>
                      <p className="text-xs text-[#61758A] leading-relaxed">
                        Official 17 UN SDGs circular color wheel illustrating comprehensive program action alignment.
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 pt-3 border-t border-[#D7E8F5] text-[11px] text-[#61758A] italic text-center">
                    [Circular UN Sustainable Development Goals graphic will be supplied by the NASI team]
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Meet the President Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              kicker="National Leadership"
              title="Meet the President"
              description="A message from the President of the National Association of Soroptimist International of India."
              className="text-center sm:text-left mb-10"
            />

            <div className="rounded-3xl bg-gradient-to-br from-[#F4FAFF] to-[#E8F3FC] border border-[#D7E8F5] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* President Photograph Frame */}
                <div className="lg:col-span-4 flex flex-col items-center text-center">
                  <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-3xl bg-[#005596] p-2 shadow-md border-2 border-[#D4A737] overflow-hidden flex flex-col items-center justify-center text-white">
                    {presidentPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={presidentPhotoUrl}
                        alt={`${presidentName} - ${presidentDesignation}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-[#003A6B] flex flex-col items-center justify-center p-4 border border-white/20">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-serif text-2xl font-bold text-[#D4A737] mb-3 border border-white/20">
                          {presidentName.split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("") || "AR"}
                        </div>
                        <span className="text-xs uppercase font-bold tracking-wider text-white">
                          Official Portrait
                        </span>
                        <span className="text-[11px] text-[#D7E8F5] mt-1">
                          Photograph Awaited
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#17324D] mt-4">
                    {presidentName}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#005596] mt-0.5">
                    {presidentDesignation}
                  </p>
                  <span className="text-[11px] font-mono text-[#61758A] mt-1 bg-white px-2.5 py-0.5 rounded-full border border-[#D7E8F5]">
                    {presidentTenure}
                  </span>
                </div>

                {/* President Message */}
                <div className="lg:col-span-8 space-y-4 text-[#17324D] leading-relaxed">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D7E8F5] text-xs font-medium text-[#005596]">
                    <span className="w-2 h-2 rounded-full bg-[#005596]" />
                    <span>{presidentTenure} Message</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#17324D]">
                    &ldquo;Inspiring action, transforming lives for women and girls across India.&rdquo;
                  </h4>

                  <div className="space-y-3.5 text-sm sm:text-base text-[#17324D]/90">
                    {presidentParagraphs.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#D7E8F5] flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-[#17324D]">
                        {presidentName}
                      </p>
                      <p className="text-xs text-[#005596] font-medium">
                        {presidentDesignation} ({presidentTenure})
                      </p>
                    </div>
                    <Button
                      href="/committee"
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowRightIcon size={14} />}
                    >
                      View Board Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Board Members Section */}
      <section className="py-16 sm:py-24 bg-[#F4FAFF] border-b border-[#D7E8F5]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="National Association of Soroptimist India (NASI-India)"
              title="NASI India Board: 2026–2028"
              description="Elected volunteer leaders guiding NASI India's strategic vision, governance, and nationwide programme action."
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

      {/* 6. SI Clubs – India (Interactive Map & Sequential Chronological Roster) */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <SectionHeading
              kicker="Nationwide Network"
              title="SI Clubs – India"
              description="19 vibrant Soroptimist International clubs driving community action across India, presented in NASI-approved chronological order."
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

          {/* Interactive Map and Numbered List */}
          <InteractiveIndiaClubsMap />
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
                  href={siteConfig.internationalAffiliation.globalUrl}
                  isExternal
                  size="md"
                  className="bg-[#E8F3FC] hover:bg-white text-[#005596] font-semibold"
                  rightIcon={<ExternalLinkIcon size={14} />}
                >
                  Visit Soroptimist International
                </Button>
                <Button
                  href="/about"
                  variant="outline"
                  size="md"
                  className="text-white border-white/80 hover:bg-white/10"
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  Learn About SIGBI & NASI India
                </Button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#001E38] border border-[#003A6B] text-xs space-y-3.5 shadow-xl">
              <div className="flex items-center gap-2 text-[#E8F3FC] font-semibold text-sm">
                <SparklesIcon size={18} className="text-[#aed1ef]" />
                <span>Federation Networks</span>
              </div>
              <p className="text-[#D7E8F5]">
                Soroptimist International is composed of five worldwide federations:
              </p>
              <ul className="space-y-2.5 text-[#D7E8F5]">
                {activeFederations.map((federation, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#aed1ef] shrink-0" />
                    <span>{federation}</span>
                  </li>
                ))}
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

      {/* 9. Page-Wide Floating Strapline */}
      <LandingPageStrapline />
    </>
  );
}
