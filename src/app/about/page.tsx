import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  UsersIcon,
  BookOpenIcon,
  HeartHandshakeIcon,
  CheckCircleIcon,
  SparklesIcon,
  GlobeIcon,
  CalendarIcon,
} from "@/components/icons";
import { HistoricalTimeline } from "@/components/history/HistoricalTimeline";

export const metadata: Metadata = {
  title: "About NASI India",
  description:
    "Learn what Soroptimist means, who we are, our mission, journey in India since 1974, and the interactive history of our 19 chartered clubs.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About NASI India | Who We Are & Our History",
    description:
      "Learn what Soroptimist means, who we are, our mission, journey in India since 1974, and the interactive history of our 19 chartered clubs.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeading
        title="About NASI India"
        kicker="Who We Are, Our Mission & History"
        description="The National Association of Soroptimist International of India unites women committed to service, leadership, and community development to improve the lives and opportunities of women and girls."
        breadcrumbs={[{ label: "About NASI India" }]}
        badge={<Badge variant="forest">SIGBI Affiliated National Association</Badge>}
      />

      {/* 1. What does Soroptimist mean? */}
      <section className="py-12 md:py-16 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-full border border-[#D7E8F5] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005596]" />
                Etymology & Global Meaning
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#17324D] tracking-tight leading-tight">
                What Does <span className="text-[#005596] italic">Soroptimist</span> Mean?
              </h2>

              <div className="space-y-4 text-[#17324D] leading-relaxed text-base sm:text-lg">
                <p>
                  The word <strong>Soroptimist</strong> comes from two Latin words: <em>Soror</em>, meaning sister, and <em>Optima</em>, meaning best. Together, Soroptimist is commonly interpreted as <strong className="text-[#005596] font-serif">“Best for Women.”</strong>
                </p>
                <p>
                  Soroptimist International is a global volunteer organisation working to transform the lives and opportunities of women and girls around the world.
                </p>
                <p>
                  There are five Soroptimist International Federations. <strong>Soroptimist International Great Britain and Ireland (SIGBI)</strong> is one of them, and the <strong>National Association of Soroptimist International India (NASI India)</strong> is part of SIGBI.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F4FAFF] border border-[#D7E8F5] text-xs text-[#61758A] flex items-center gap-3">
                <GlobeIcon size={20} className="text-[#005596] shrink-0" />
                <span>
                  Chartered under SIGBI (Soroptimist International Great Britain and Ireland) with General Consultative Status at the United Nations.
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-8 rounded-3xl bg-[#005596] text-white shadow-xl relative overflow-hidden border border-[#004780]">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 space-y-4">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#D4A737]">
                    Latin Roots & Identity
                  </span>
                  <div className="space-y-2 border-y border-white/20 py-4 my-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif italic text-lg text-[#F4FAFF]">Soror</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#E8F3FC]">Sister</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif italic text-lg text-[#F4FAFF]">Optima</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#E8F3FC]">Best</span>
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-white">
                    “Best for Women”
                  </h3>
                  <p className="text-xs text-[#E8F3FC] leading-relaxed">
                    Uniting professional women across borders to stand as sisters and advocates for those who need it most.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Who We Are & Our Mission */}
      <section className="py-12 md:py-16 bg-[#F4FAFF] border-b border-[#D7E8F5]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                kicker="Our Identity & Purpose"
                title="Who We Are"
                description="NASI India is a network of Soroptimist clubs working together to improve the lives of women and girls."
              />

              <div className="space-y-4 text-[#17324D] text-sm sm:text-base leading-relaxed">
                <p>
                  Through our local community initiatives and global connections, we aim to:
                </p>

                <ul className="space-y-3 pt-1">
                  {[
                    "Help women and girls access better opportunities.",
                    "Contribute meaningfully to local communities.",
                    "Enable girls to reach their full potential.",
                    "Support education, empowerment and equality.",
                    "Connect with a global movement working for positive change.",
                  ].map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#D7E8F5] shadow-2xs">
                      <CheckCircleIcon size={18} className="text-[#005596] shrink-0 mt-0.5" />
                      <span className="text-[#17324D] font-medium text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>

                <p className="pt-2 text-xs text-[#61758A] italic">
                  Soroptimist International has consultative status with the United Nations.
                </p>
              </div>
            </div>

            {/* Our Mission Card & Quick Stats */}
            <div className="lg:col-span-5 space-y-6">
              <Card variant="accent" className="p-6 sm:p-8 bg-white border-[#D7E8F5] shadow-sm">
                <CardHeader className="p-0 pb-3">
                  <span className="text-xs uppercase font-semibold text-[#005596] tracking-wider">
                    Core Commitment
                  </span>
                  <CardTitle as="h3" className="text-2xl text-[#17324D] font-serif font-bold mt-1">
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-2 space-y-4">
                  <p className="text-base sm:text-lg font-serif italic text-[#17324D] leading-relaxed border-l-2 border-[#005596] pl-4 py-1">
                    “To improve the lives and opportunities of women and girls through education, empowerment, advocacy and community service.”
                  </p>
                  <p className="text-xs text-[#61758A] leading-relaxed">
                    This mission drives our nationwide programmes, member inductions, and partnerships with local community stakeholders.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Button href="/join" variant="primary" size="sm" className="justify-center">
                      Become a Member
                    </Button>
                    <Button href="/clubs" variant="outline" size="sm" className="justify-center">
                      Find a Local Club
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Three Pillars Summary */}
              <div className="p-6 rounded-2xl bg-white border border-[#D7E8F5] shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-[#005596] font-semibold text-xs uppercase tracking-wider">
                  <SparklesIcon size={16} />
                  <span>Programmatic Focus</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F4FAFF] border border-[#D7E8F5]">
                    <BookOpenIcon size={18} className="mx-auto text-[#005596] mb-1" />
                    <span className="font-semibold block text-[#17324D]">Education</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4FAFF] border border-[#D7E8F5]">
                    <UsersIcon size={18} className="mx-auto text-[#005596] mb-1" />
                    <span className="font-semibold block text-[#17324D]">Empowerment</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F4FAFF] border border-[#D7E8F5]">
                    <HeartHandshakeIcon size={18} className="mx-auto text-[#005596] mb-1" />
                    <span className="font-semibold block text-[#17324D]">Advocacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Our Journey in India */}
      <section className="py-12 md:py-16 bg-white border-b border-[#D7E8F5]">
        <Container>
          <div className="max-w-4xl space-y-6">
            <SectionHeading
              kicker="Historical Narrative"
              title="Our Journey in India"
              description="From the first club chartered in Bombay North in 1974 to the formal institution of NASI India in 1990 and nationwide expansion today."
            />

            <div className="prose max-w-none text-[#17324D] space-y-4 text-base sm:text-lg leading-relaxed">
              <p>
                Soroptimist clubs in India began their journey in <strong>1974</strong> with the establishment of <strong>SI Bombay North</strong>, the first Soroptimist club in India.
              </p>
              <p>
                <strong>NASI India</strong> subsequently took office in <strong>1990</strong>, providing a national structure for the growing Soroptimist movement in India under the auspices of SIGBI.
              </p>
              <p>
                Since then, the movement has expanded across the country, bringing together women committed to service, leadership and community development across 19 chartered clubs from Leh and Srinagar in the north to Kochi, Chennai, and Madurai in the south, and from Mumbai and Pune in the west to Kolkata, Burdwan, and Guwahati in the east and northeast.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Our History – Interactive Chronological Timeline */}
      <section id="timeline" className="py-12 md:py-20 bg-[#F4FAFF]">
        <Container>
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-full mb-3 border border-[#D7E8F5] shadow-2xs">
              <CalendarIcon size={13} className="text-[#005596]" />
              1974 – 2024 Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17324D] tracking-tight leading-tight">
              Our History – Soroptimist Clubs in India
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#61758A] leading-relaxed">
              Explore the chronological establishment of all 19 chartered clubs. Use the interactive filters to explore by decade, search by founder, or filter by geographical region.
            </p>
          </div>

          {/* Interactive Chronological Timeline Component */}
          <HistoricalTimeline />
        </Container>
      </section>
    </>
  );
}
