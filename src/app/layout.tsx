import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nasiindia.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NASI India | National Association of Soroptimist International of India",
    template: "%s | NASI India",
  },
  description: siteConfig.description,
  keywords: [
    "NASI India",
    "Soroptimist International India",
    "women service organization India",
    "women empowerment",
    "women education",
    "community service",
    "Soroptimist clubs India",
  ],
  authors: [{ name: "NASI India Secretariat" }],
  creator: "National Association of Soroptimist International of India",
  publisher: "NASI India",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "NASI India",
    title: "NASI India | National Association of Soroptimist International of India",
    description: siteConfig.description,
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "National Association of Soroptimist International of India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NASI India | National Association of Soroptimist International of India",
    description: siteConfig.description,
    images: ["/images/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15362c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand-50 text-forest-950 font-sans selection:bg-teal-200 selection:text-forest-950">
        <OrganizationJsonLd siteUrl={siteUrl} />
        <Header />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
