import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  UsersIcon,
  BookOpenIcon,
  HeartHandshakeIcon,
  CheckCircleIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "About NASI India",
  description:
    "Learn about the National Association of Soroptimist International of India, our history, mission, structure, and dedication to women and girls.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About NASI India",
    description:
      "Learn about the National Association of Soroptimist International of India, our history, mission, structure, and dedication to women and girls.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeading
        title="About NASI India"
        kicker="Heritage, Mission & Structure"
        description="The National Association of Soroptimist International of India unites women professionals and leaders across the country to transform the lives of women and girls through purposeful community action."
        breadcrumbs={[{ label: "About NASI India" }]}
        badge={<Badge variant="forest">Chartered Association</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-8 text-forest-900 leading-relaxed">
              <SectionHeading
                kicker="Our Mission & Purpose"
                title="A Global Voice for Women in India"
                description="Soroptimist International is a worldwide voluntary service organization for women in management and professions with a common goal: educating, empowering, and enabling women and girls."
              />

              <div className="prose max-w-none text-forest-800 space-y-4 text-base sm:text-lg">
                <p>
                  NASI India represents the national collective of Soroptimist clubs operating across 19 major metropolitan and regional centres in India. As an affiliated body of Soroptimist International, our members collaborate on local and national initiatives addressing fundamental social, economic, educational, and healthcare needs.
                </p>
                <p>
                  Our work is organized around clear Programme Action pillars, fostering sustainable advancement through scholarships for underprivileged girls, vocational training for rural women, maternal healthcare camps, and advocacy against gender violence.
                </p>
              </div>

              {/* Three Mission Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <Card variant="muted" className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
                    <BookOpenIcon size={20} />
                  </div>
                  <CardTitle as="h3" className="text-lg">Education</CardTitle>
                  <p className="text-sm text-forest-700 mt-2 leading-relaxed">
                    Providing secondary school scholarships, digital classrooms, and STEM mentorship for girls.
                  </p>
                </Card>

                <Card variant="muted" className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                    <UsersIcon size={20} />
                  </div>
                  <CardTitle as="h3" className="text-lg">Empowerment</CardTitle>
                  <p className="text-sm text-forest-700 mt-2 leading-relaxed">
                    Developing leadership skills, micro-enterprise training for artisans, and economic self-reliance.
                  </p>
                </Card>

                <Card variant="muted" className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
                    <HeartHandshakeIcon size={20} />
                  </div>
                  <CardTitle as="h3" className="text-lg">Enablement</CardTitle>
                  <p className="text-sm text-forest-700 mt-2 leading-relaxed">
                    Advocacy and community initiatives safeguarding the legal rights, clean sanitation, and wellbeing of women.
                  </p>
                </Card>
              </div>

              {/* History & Heritage Section */}
              <div className="pt-8 border-t border-sand-200 space-y-4">
                <h3 className="text-2xl font-serif font-bold text-forest-950">
                  Soroptimist Heritage & Movement in India
                </h3>
                <p className="text-forest-800 leading-relaxed text-sm sm:text-base">
                  Soroptimist International was founded in Oakland, California in 1921. Over a century of service, the movement has grown into a global voice for women with General Consultative Status at the United Nations.
                </p>
                <p className="text-forest-800 leading-relaxed text-sm sm:text-base">
                  In India, chartered clubs have served as vital beacons of community transformation. From coastal communities in Kochi to metropolitan centres in Delhi, Mumbai, Bengaluru, and Kolkata, and high-altitude regions in Leh and Srinagar, NASI India connects local action with international solidarity.
                </p>

                <div className="p-5 rounded-xl bg-sand-50 border border-sand-200 mt-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-forest-950">
                    <CheckCircleIcon size={16} className="text-teal-700" />
                    <span>Democratic Governance & Accountability</span>
                  </div>
                  <p className="text-xs text-forest-700 leading-relaxed pl-6">
                    NASI India is governed by an elected National Board and National Council representing each chartered club. Office bearers serve honorary terms, ensuring transparent stewardship of all volunteer resources.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-4 space-y-6">
              <Card variant="accent">
                <CardHeader>
                  <span className="text-xs uppercase font-semibold text-teal-800">Governance Framework</span>
                  <CardTitle as="h3" className="text-lg">NASI Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-forest-800">
                  <div className="pb-3 border-b border-sand-200">
                    <p className="font-semibold text-forest-950">Parent Body</p>
                    <p className="text-forest-700 text-xs mt-0.5">Soroptimist International</p>
                  </div>
                  <div className="pb-3 border-b border-sand-200">
                    <p className="font-semibold text-forest-950">National Jurisdiction</p>
                    <p className="text-forest-700 text-xs mt-0.5">Republic of India (19 Chartered Clubs)</p>
                  </div>
                  <div className="pb-3 border-b border-sand-200">
                    <p className="font-semibold text-forest-950">Membership Scope</p>
                    <p className="text-forest-700 text-xs mt-0.5">Women in management and professions</p>
                  </div>
                  <div>
                    <p className="font-semibold text-forest-950">National Governance</p>
                    <p className="text-forest-700 text-xs mt-0.5">
                      Executive board with President, Secretary, Treasurer, PAC, and portfolio leads.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 rounded-xl bg-forest-900 text-white space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-300">
                  Get Involved
                </span>
                <h4 className="font-serif font-bold text-lg text-white">Join a Club in Your City</h4>
                <p className="text-xs text-sand-200 leading-relaxed">
                  Connect with dynamic women leaders in your city who are actively making a difference.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Button href="/join" variant="secondary" size="sm" className="justify-center" rightIcon={<ArrowRightIcon size={14} />}>
                    Join SI Today
                  </Button>
                  <Button href="/committee" variant="outline" size="sm" className="justify-center text-white border-sand-300 hover:bg-white/10">
                    Meet the Committee
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
