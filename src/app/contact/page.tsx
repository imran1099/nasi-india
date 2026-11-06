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
                <span className="text-xs uppercase font-semibold tracking-wider text-[#005596] bg-[#E8F3FC] px-2.5 py-1 rounded-md border border-[#D7E8F5]">
                  National Office
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#17324D] mt-3">
                  National Secretariat
                </h2>
                <p className="text-sm text-[#61758A] mt-2 leading-relaxed">
                  The National Association of Soroptimist International of India coordinates all regional clubs, national initiatives, and international correspondence.
                </p>
              </div>

              {/* Contact Details Card */}
              <Card variant="muted" className="space-y-4 p-6 bg-[#F4FAFF] border border-[#D7E8F5]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#17324D]">Official Address</h3>
                    <div className="text-xs text-[#61758A] mt-0.5 leading-relaxed">
                      {siteConfig.contact.addressLines.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-[#D7E8F5]">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 mt-0.5">
                    <MailIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#17324D]">Email Inquiry</h3>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-xs text-[#005596] hover:text-[#004780] underline mt-0.5 block font-medium"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-3 border-t border-[#D7E8F5]">
                  <div className="w-9 h-9 rounded-lg bg-[#E8F3FC] text-[#005596] flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#17324D]">Telephone</h3>
                    <p className="text-xs text-[#61758A] mt-0.5">
                      {siteConfig.contact.phone}
                    </p>
                    <p className="text-[11px] text-[#61758A] mt-0.5">
                      {siteConfig.contact.officeHours}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Official Secretariat Notice */}
              <div className="p-4 rounded-xl bg-[#E8F3FC]/50 border border-[#D7E8F5] text-xs text-[#17324D] space-y-1.5 shadow-2xs">
                <p className="font-semibold text-[#17324D]">
                  National Secretariat Liaison
                </p>
                <p className="text-[#61758A] leading-relaxed">
                  Official inquiries are routed directly to the National Secretariat office. For urgent communication regarding upcoming national conferences or club chartering, please contact us by telephone during office hours.
                </p>
              </div>
            </div>

            {/* Right Column: Live Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <Card variant="default" className="bg-white border border-[#D7E8F5]">
                <CardHeader className="bg-[#F4FAFF] border-b border-[#D7E8F5]">
                  <CardTitle as="h2" className="text-xl text-[#17324D]">
                    Send a Message to the Secretariat
                  </CardTitle>
                  <p className="text-xs text-[#61758A] mt-1">
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
