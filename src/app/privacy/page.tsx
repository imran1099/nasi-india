import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeading } from "@/components/ui/PageHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MailIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data handling guidelines for NASI India.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | NASI India",
    description: "Privacy policy and data handling guidelines for NASI India.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeading
        title="Privacy Policy"
        kicker="Governance & Compliance"
        description="Learn how the National Association of Soroptimist International of India respects and protects the personal information of members, visitors, and partners."
        breadcrumbs={[{ label: "Privacy Policy" }]}
        badge={<Badge variant="forest">Policy Document</Badge>}
      />

      <section className="py-12 md:py-16 bg-white">
        <Container size="lg">
          <Card variant="default" className="p-6 sm:p-10 space-y-8 text-forest-900 leading-relaxed">
            <div className="border-b border-sand-200 pb-6">
              <span className="text-xs font-mono uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Effective Date: January 2025 (Sample Policy Shell)
              </span>
              <p className="mt-4 text-sm text-forest-700">
                This Privacy Policy outlines how NASI India collects, uses, and safeguards personal data submitted through our public website and correspondence with the National Secretariat.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-forest-950">1. Information We Collect</h2>
              <p className="text-sm text-forest-800">
                When you interact with our website to inquire about club membership, register for national webinars, or submit a message to the National Secretariat, we may collect:
              </p>
              <ul className="list-disc pl-5 text-sm text-forest-800 space-y-1.5">
                <li>Contact details: Name, email address, telephone number, city, and state.</li>
                <li>Inquiry context: Professional background, preferred club chapter, and specific message details.</li>
                <li>Technical data: Standard browser metadata, IP address, and anonymized aggregate usage logs.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-forest-950">2. How We Use Information</h2>
              <p className="text-sm text-forest-800">
                NASI India is a voluntary women&apos;s service organization. We use personal data solely for non-profit and organizational purposes:
              </p>
              <ul className="list-disc pl-5 text-sm text-forest-800 space-y-1.5">
                <li>Connecting prospective members with the relevant chartered club coordinator in their region.</li>
                <li>Responding to general inquiries, event registrations, and programme action partnerships.</li>
                <li>Issuing national council communications and official newsletters to accredited delegates.</li>
                <li>We do not sell, rent, or commercially exploit any personal information collected.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-forest-950">3. Cookies and Website Analytics</h2>
              <p className="text-sm text-forest-800">
                Our website uses essential cookies and anonymized performance analytics to optimize page load speeds, verify mobile layout responsiveness, and ensure navigation integrity. No third-party behavioral advertising trackers are employed.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-forest-950">4. Data Security & Storage</h2>
              <p className="text-sm text-forest-800">
                We implement industry-standard organizational and technological safeguards to prevent unauthorized access, loss, or disclosure. In Phase 1 and Phase 2, sample form interfaces do not transmit live databases; production storage safeguards will be audited in subsequent integration phases.
              </p>
            </div>

            <div className="space-y-4 border-t border-sand-200 pt-6">
              <h2 className="text-xl font-serif font-bold text-forest-950">5. Contacting the Secretariat Regarding Privacy</h2>
              <p className="text-sm text-forest-800">
                If you have questions regarding this policy or wish to update or delete your contact records from our voluntary database, please contact the National Secretariat:
              </p>
              <div className="p-4 rounded-lg bg-sand-50 border border-sand-200 text-sm space-y-1 text-forest-800">
                <p className="font-semibold text-forest-950">{siteConfig.contact.organizationName}</p>
                <p>{siteConfig.contact.addressLines.join(", ")}</p>
                <p className="flex items-center gap-2 pt-1 text-teal-800 font-medium">
                  <MailIcon size={16} />
                  <span>Email: {siteConfig.contact.email}</span>
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button href="/contact" variant="primary" size="md">
                Contact National Secretariat
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
