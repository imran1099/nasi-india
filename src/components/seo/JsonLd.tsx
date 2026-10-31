import React from "react";

interface BaseJsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: BaseJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema for NASI India
 */
export function OrganizationJsonLd({
  siteUrl = "https://nasiindia.org",
  name = "National Association of Soroptimist International of India",
  alternateName = "NASI India",
  logoUrl = "https://nasiindia.org/images/logo.png",
  description = "A voluntary service organization of women in management and professions dedicated to inspiring action and transforming the lives of women and girls across India.",
}: {
  siteUrl?: string;
  name?: string;
  alternateName?: string;
  logoUrl?: string;
  description?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name,
    alternateName,
    url: siteUrl,
    logo: logoUrl,
    description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "India",
    },
    sameAs: [
      "https://www.facebook.com/nasiindia",
      "https://www.instagram.com/nasiindia",
      "https://www.linkedin.com/company/nasi-india",
      "https://www.soroptimistinternational.org",
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList Schema
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * NewsArticle Schema for news detail pages
 */
export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "NASI India Secretariat",
  imageUrl,
}: {
  title: string;
  description?: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description || title,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "NGO",
      name: "NASI India",
      logo: {
        "@type": "ImageObject",
        url: "https://nasiindia.org/images/logo.png",
      },
    },
    ...(imageUrl ? { image: [imageUrl] } : {}),
  };

  return <JsonLd data={data} />;
}

/**
 * Event Schema for event detail pages
 */
export function EventJsonLd({
  name,
  description,
  url,
  startDate,
  endDate,
  locationName,
  locationAddress,
  isOnline = false,
  imageUrl,
  isCancelled = false,
}: {
  name: string;
  description?: string;
  url: string;
  startDate: string;
  endDate?: string;
  locationName?: string;
  locationAddress?: string;
  isOnline?: boolean;
  imageUrl?: string;
  isCancelled?: boolean;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description: description || name,
    url,
    startDate,
    ...(endDate ? { endDate } : {}),
    eventStatus: isCancelled
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: isOnline
      ? {
          "@type": "VirtualLocation",
          url,
        }
      : {
          "@type": "Place",
          name: locationName || "Venue",
          address: {
            "@type": "PostalAddress",
            streetAddress: locationAddress || locationName || "India",
            addressCountry: "IN",
          },
        },
    organizer: {
      "@type": "NGO",
      name: "NASI India",
      url: "https://nasiindia.org",
    },
    ...(imageUrl ? { image: [imageUrl] } : {}),
  };

  return <JsonLd data={data} />;
}

