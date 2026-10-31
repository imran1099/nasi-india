import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  UsersIcon,
  HeartHandshakeIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from "@/components/icons";
import { initialClubs } from "@/data/clubs";
import { MembershipForm } from "@/components/forms/MembershipForm";

export const metadata: Metadata = {
  title: "Join SI Today",
  description:
    "Become a member of Soroptimist International of India. Connect with women leaders, empower girls, and serve communities across the nation.",
  alternates: {
    canonical: "/join",
  },
  openGraph: {
    title: "Join SI Today | NASI India Membership",
    description:
      "Become a member of Soroptimist International of India. Connect with women leaders, empower girls, and serve communities across the nation.",
    url: "/join",
  },
};

export default function JoinPage() {
  const clubOptions = initialClubs.map((club) => ({
    label: `${club.name} (${club.city}, ${club.state})`,
    value: club.slug,
  }));

  clubOptions.unshift({ label: "Other / Interested in Chartering a New Club", value: "new-club" });

  return (
    <>
      <PageHeading
        title="Join SI Today"
        kicker="Membership & Community Action"
        description="Join a global sisterhood of women in management and professions who dedicate their skills, resources, and passion to transforming the lives of women and girls across India."
        breadcrumbs={[{ label: "Join SI Today" }]}
        badge={<Badge variant="forest">Membership Portal</Badge>}
      />

      {/* Why Join Section */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <SectionHeading
            kicker="Why Join NASI India?"
            title="Meaningful Service with a Global Voice"
            description="Soroptimist International offers a purposeful platform where your professional expertise directly translates into tangible community progress."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="muted" className="p-6">
              <div className="w-12 h-12 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
                <HeartHandshakeIcon size={24} />
              </div>
              <CardTitle as="h3" className="text-lg">
                Tangible Community Impact
              </CardTitle>
              <p className="text-sm text-forest-700 mt-2 leading-relaxed">
                Take direct action on local issues: girl-child education, women&apos;s healthcare, vocational independence, and emergency relief drives.
              </p>
            </Card>

            <Card variant="muted" className="p-6">
              <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <UsersIcon size={24} />
              </div>
              <CardTitle as="h3" className="text-lg">
                Professional Sisterhood
              </CardTitle>
              <p className="text-sm text-forest-700 mt-2 leading-relaxed">
                Collaborate with accomplished women across medicine, law, engineering, education, and civil administration in your city and nationwide.
              </p>
            </Card>

            <Card variant="muted" className="p-6">
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <BookOpenIcon size={24} />
              </div>
              <CardTitle as="h3" className="text-lg">
                UN Advocacy & Global Links
              </CardTitle>
              <p className="text-sm text-forest-700 mt-2 leading-relaxed">
                Participate in global campaigns with Soroptimist International delegations at the UN Commission on the Status of Women and international twin-club links.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* 4 Steps to Membership */}
      <section className="py-12 md:py-16 bg-sand-100/60 border-y border-sand-200">
        <Container>
          <SectionHeading
            kicker="The Membership Journey"
            title="How to Become a Soroptimist in India"
            description="Our simple 4-step induction journey ensures prospective members find the ideal club alignment."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Submit Interest",
                desc: "Complete the membership inquiry form with your background and city preference.",
              },
              {
                step: "02",
                title: "Club Introduction",
                desc: "The National Membership Officer connects you with the local club president and conveners.",
              },
              {
                step: "03",
                title: "Attend a Meeting",
                desc: "Join a regular monthly meeting as a guest observer to experience current projects.",
              },
              {
                step: "04",
                title: "Formal Induction",
                desc: "Accept the membership charter and take the Soroptimist pledge of purposeful service.",
              },
            ].map((st, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-sand-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif font-bold text-3xl text-teal-700 block mb-3">
                    {st.step}
                  </span>
                  <h3 className="font-serif font-bold text-forest-950 text-lg mb-2">
                    {st.title}
                  </h3>
                  <p className="text-sm text-forest-700 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-sand-100 flex items-center gap-1.5 text-xs text-forest-600">
                  <CheckCircleIcon size={14} className="text-teal-600" />
                  <span>Step {i + 1} of 4</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Membership Application Form */}
      <section className="py-12 md:py-16 bg-white">
        <Container size="lg">
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
            <div className="border-b border-sand-200 px-6 py-5">
              <h2 className="text-2xl font-serif font-bold text-forest-950">
                Membership Inquiry Application
              </h2>
              <p className="text-sm text-forest-700 mt-1">
                Please complete the form below. A member of the National Membership Committee or
                your local club convenor will reach out with meeting details.
              </p>
            </div>
            <div className="p-6">
              <MembershipForm clubOptions={clubOptions} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
