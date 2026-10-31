import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MailIcon, PhoneIcon, MapPinIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the NASI India National Secretariat for membership inquiries, club coordination, and partnerships.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | NASI India",
    description:
      "Get in touch with the NASI India National Secretariat for membership inquiries, club coordination, and partnerships.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeading
        title="Contact NASI India"
        kicker="Secretariat & Communications"
        description="We welcome inquiries from prospective members, partner organizations, and existing club coordinators across India."
        breadcrumbs={[{ label: "Contact Us" }]}
        badge={<Badge variant="teal">Contact Portal</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Configurable Contact Information (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  National Office
                </span>
                <h2 className="text-2xl font-serif font-bold text-forest-950 mt-3">
                  National Secretariat
                </h2>
                <p className="text-sm text-forest-800/80 mt-2 leading-relaxed">
                  The National Association of Soroptimist International of India coordinates all regional clubs, national initiatives, and international correspondence.
                </p>
              </div>

              {/* Contact Details Card */}
              <Card variant="muted" className="space-y-4 p-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-950">Official Address</h3>
                    <div className="text-xs text-forest-700 mt-0.5 leading-relaxed">
                      {siteConfig.contact.addressLines.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-sand-200">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MailIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-950">Email Inquiry</h3>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-xs text-teal-800 hover:text-forest-950 underline mt-0.5 block"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-sand-200">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-forest-950">Telephone</h3>
                    <p className="text-xs text-forest-700 mt-0.5">
                      {siteConfig.contact.phone}
                    </p>
                    <p className="text-[11px] text-forest-500 mt-0.5">
                      {siteConfig.contact.officeHours}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Official Secretariat Notice */}
              <div className="p-4 rounded-xl bg-sand-100/80 border border-sand-200 text-xs text-forest-800 space-y-1.5 shadow-2xs">
                <p className="font-semibold text-forest-950">
                  National Secretariat Liaison
                </p>
                <p className="text-forest-700 leading-relaxed">
                  Official inquiries are routed directly to the National Secretariat office. For urgent communication regarding upcoming national conferences or club chartering, please contact us by telephone during office hours.
                </p>
              </div>
            </div>

              {/* Right Column: Live Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <Card variant="default">
                <CardHeader>
                  <CardTitle as="h2" className="text-xl">
                    Send a Message to the Secretariat
                  </CardTitle>
                  <p className="text-xs text-forest-600 mt-1">
                    Fill out the fields below. A designated officer from the National Secretariat
                    or the relevant regional committee will respond.
                  </p>
                </CardHeader>

                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
