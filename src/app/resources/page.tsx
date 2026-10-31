import type { Metadata } from "next";
import { connection } from "next/server";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ExternalLinkIcon,
  ArrowRightIcon,
  BookOpenIcon,
  UsersIcon,
  HeartHandshakeIcon,
  SparklesIcon,
} from "@/components/icons";
import { getAllResources, ResourceCardItem } from "@/data/resources";
import { getPublishedNewsletters } from "@/lib/dal/newsletters";

// Allow this route to block at prerender when DB data is fetched
export const instant = false;

// ---------------------------------------------------------------------------
// Normalize DB record to ResourceCardItem shape
// ---------------------------------------------------------------------------

interface DbResourceRecord {
  id: string;
  title: string;
  category?: string | null;
  description?: string | null;
  url: string;
  badge?: string | null;
}

function dbResourceToCard(r: DbResourceRecord): ResourceCardItem {
  return {
    id: r.id,
    title: r.title,
    federationType: r.category || undefined,
    category: (r.category ?? "Global Network") as ResourceCardItem["category"],
    shortDescription: r.description ?? "",
    details: r.description ?? "",
    urlPlaceholder: r.url,
    isExternal: !r.url.startsWith("/"),
    statusBadge: r.badge || "Verified Portal",
    actionText: r.url.startsWith("/") ? "Visit Page" : "Visit Portal",
  };
}

async function getResourcesData(): Promise<ResourceCardItem[]> {
  await connection();
  if (!process.env.DATABASE_URL) {
    return getAllResources();
  }
  try {
    const { getExternalResources } = await import("@/lib/dal/resources");
    const dbResources = await getExternalResources();
    if (dbResources.length > 0) {
      return dbResources.map(dbResourceToCard);
    }
  } catch (err) {
    console.warn("[resources/page] DB unavailable, falling back to static data:", err);
  }
  return getAllResources();
}

export const metadata: Metadata = {
  title: "Soroptimist Resources",
  description:
    "Official resource repository, federation directories, Global Voice publications, and membership portals for Soroptimist International of India.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Soroptimist Resources | NASI India",
    description:
      "Official resource repository, federation directories, Global Voice publications, and membership portals for Soroptimist International of India.",
    url: "/resources",
  },
};

export default async function ResourcesPage() {
  const [resources, newsletters] = await Promise.all([
    getResourcesData(),
    getPublishedNewsletters(),
  ]);

  const getResourceIcon = (item: ResourceCardItem) => {
    switch (item.id) {
      case "soroptimist-international":
        return <SparklesIcon size={22} className="text-forest-800" />;
      case "global-voice-newsletter":
        return <BookOpenIcon size={22} className="text-teal-800" />;
      case "join-si-today":
        return <HeartHandshakeIcon size={22} className="text-forest-800" />;
      default:
        return <UsersIcon size={22} className="text-teal-800" />;
    }
  };

  return (
    <>
      <PageHeading
        title="Soroptimist Resources"
        kicker="Global Network & Federations"
        description="Access official documentation, federation directories, international publications, and national membership materials connecting Soroptimist clubs worldwide."
        breadcrumbs={[{ label: "Soroptimist Resources" }]}
        badge={<Badge variant="forest">{resources.length} Resource Portals</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          {/* Verification Notice */}
          <div className="mb-10 p-5 rounded-xl bg-sand-50 border border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Resource Verification Notice
              </span>
              <p className="text-sm text-forest-800 mt-0.5">
                Displaying designated international federations, official publications, and membership gateways. External links point to verified organizational portals or temporary links as designated.
              </p>
            </div>
            <span className="shrink-0 text-xs font-mono text-forest-600 bg-sand-200/80 px-2.5 py-1 rounded-md">
              Federation Directory
            </span>
          </div>

          <SectionHeading
            kicker="Worldwide Directory"
            title="Designated Federations & Global Portals"
            description="Explore the global bodies and communication channels of Soroptimist International."
          />

          {/* Grid of resource cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item) => (
              <Card
                key={item.id}
                variant="default"
                className="flex flex-col justify-between h-full bg-white group hover:border-forest-400 transition-all duration-200"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="teal" size="sm">
                        {item.category}
                      </Badge>
                      <span className="text-[11px] font-mono text-forest-600 bg-sand-100 px-2 py-0.5 rounded-sm">
                        {item.statusBadge}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-lg bg-sand-100 flex items-center justify-center shrink-0 border border-sand-200">
                        {getResourceIcon(item)}
                      </div>
                      <div>
                        <CardTitle as="h3" className="text-lg group-hover:text-forest-800 transition-colors">
                          {item.title}
                        </CardTitle>
                        {item.federationType && (
                          <span className="text-xs text-forest-600 block mt-0.5 font-medium">
                            {item.federationType}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <p className="text-xs font-medium text-forest-900 leading-snug">
                      {item.shortDescription}
                    </p>
                    <p className="text-xs text-forest-700/90 leading-relaxed border-t border-sand-100 pt-2.5">
                      {item.details}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50">
                  <span className="text-[11px] text-forest-500 font-mono truncate max-w-[150px]">
                    {item.isExternal ? "External Gateway" : "National Portal"}
                  </span>

                  <Button
                    href={item.urlPlaceholder}
                    isExternal={item.isExternal}
                    variant={item.id === "join-si-today" ? "primary" : "outline"}
                    size="sm"
                    rightIcon={
                      item.isExternal ? (
                        <ExternalLinkIcon size={13} />
                      ) : (
                        <ArrowRightIcon size={14} />
                      )
                    }
                  >
                    {item.actionText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Official Publications & Newsletters Section */}
          {newsletters.length > 0 && (
            <div className="mt-16 pt-12 border-t border-sand-200">
              <SectionHeading
                kicker="National Publications"
                title="Circulated Newsletters & Official Gazette"
                description="Browse and download approved national council bulletins, biennium reports, and federation digests."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {newsletters.map((nl) => (
                  <Card key={nl.id} variant="elevated" className="bg-white flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {nl.issueNumber || "Official Circular"}
                          </span>
                          <span className="text-[11px] text-forest-500 font-mono">
                            {nl.publishedAt
                              ? new Date(nl.publishedAt).toLocaleDateString("en-IN", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Circulated"}
                          </span>
                        </div>
                        <CardTitle as="h4" className="text-base text-forest-950 font-serif">
                          {nl.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-forest-700 leading-relaxed">
                          {nl.description || "Official circular published by the National Secretariat."}
                        </p>
                      </CardContent>
                    </div>

                    <CardFooter className="pt-3 border-t border-sand-100 bg-sand-50/50 flex items-center justify-between">
                      <span className="text-[11px] text-forest-600">
                        {nl.club?.name || "NASI India"}
                      </span>
                      {nl.fileUrl ? (
                        <Button
                          href={nl.fileUrl}
                          isExternal
                          variant="primary"
                          size="sm"
                          rightIcon={<ExternalLinkIcon size={12} />}
                        >
                          Download PDF
                        </Button>
                      ) : (
                        <span className="text-xs text-forest-400 italic">Document in review</span>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* National Governance & Constitution Download Banner */}
          <div className="mt-14 p-8 rounded-2xl bg-forest-900 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                National Governance Archive
              </span>
              <h3 className="text-2xl font-serif font-bold">
                NASI India Constitution & Club Chartering Toolkit
              </h3>
              <p className="text-sm text-sand-200 leading-relaxed">
                Charter guides, national bylaws, and administrative playbooks are maintained by the National Secretariat for club convenors and delegates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Button href="/contact" variant="secondary" size="md">
                Request Governance Handbook
              </Button>
              <Button href="/about" variant="outline" size="md" className="text-white border-sand-300 hover:bg-white/10">
                About NASI India Structure
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
