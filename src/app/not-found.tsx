import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HomeIcon, MapPinIcon, NewspaperIcon, MailIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-16 md:py-24 bg-sand-50">
      <Container size="sm" className="text-center space-y-8">
        <div>
          <Badge variant="gold" size="md" className="mb-4">
            Error 404 — Page Not Found
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-3 text-sm sm:text-base text-forest-800/80 max-w-md mx-auto leading-relaxed">
            The link you followed may be broken, outdated, or the content may have been moved or archived by the Secretariat.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sand-300 shadow-sm space-y-4 max-w-md mx-auto text-left">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-teal-800">
            Suggested Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href="/"
              className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-sand-100 text-forest-900 transition-colors"
            >
              <HomeIcon size={16} className="text-teal-700 shrink-0" />
              <span>National Home</span>
            </Link>
            <Link
              href="/clubs"
              className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-sand-100 text-forest-900 transition-colors"
            >
              <MapPinIcon size={16} className="text-teal-700 shrink-0" />
              <span>Clubs Directory</span>
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-sand-100 text-forest-900 transition-colors"
            >
              <NewspaperIcon size={16} className="text-teal-700 shrink-0" />
              <span>News &amp; Events</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-sand-100 text-forest-900 transition-colors"
            >
              <MailIcon size={16} className="text-teal-700 shrink-0" />
              <span>Contact Secretariat</span>
            </Link>
          </div>
        </div>

        <div>
          <Button href="/" variant="primary" size="lg">
            Return to Homepage
          </Button>
        </div>
      </Container>
    </div>
  );
}
