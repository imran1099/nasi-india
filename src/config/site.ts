export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface LogoConfig {
  type: "text" | "image";
  text: string;
  subtext?: string;
  imageUrl?: string;
  footerImageUrl?: string;
  altText: string;
}

export interface ContactInfo {
  organizationName: string;
  parentBody: string;
  email: string;
  phone: string;
  addressLines: string[];
  officeHours: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  ariaLabel: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  logo: LogoConfig;
  navItems: NavItem[];
  contact: ContactInfo;
  socialLinks: SocialLink[];
  internationalAffiliation: {
    name: string;
    description: string;
    globalUrl: string;
  };
  copyrightYear: number;
}

// Read any administrator-saved settings from persistent local store
let savedLogoUrl: string | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const saved = require("@/data/site-settings.json");
  if (saved && typeof saved["site.logoUrl"] === "string" && saved["site.logoUrl"]) {
    savedLogoUrl = saved["site.logoUrl"];
  }
} catch {
  // Fall back to default branding
}

export const siteConfig: SiteConfig = {
  name: "NASI India",
  tagline: "Inspiring action, transforming lives for women and girls across India.",
  description:
    "National Association of Soroptimist International of India (NASI India) is a voluntary service organization committed to educating, empowering, and enabling women and girls through grassroots community action.",
  logo: {
    type: "image",
    text: "NASI India",
    subtext: "Soroptimist International",
    imageUrl: savedLogoUrl || "/images/soroptimist-india-logo.svg",
    footerImageUrl: savedLogoUrl || "/images/soroptimist-india-logo-white.svg",
    altText: "NASI India - National Association of Soroptimist International of India",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "About NASI India", href: "/about", description: "Who We Are, What Soroptimist Means, Mission & History" },
    { label: "Our Clubs", href: "/clubs", description: "All Clubs, Club Profiles & Find a Club" },
    { label: "Our Team", href: "/committee", description: "NASI National Board & Committee Members" },
    { label: "News & Events", href: "/news", description: "National reports, club updates and gatherings" },
    { label: "Resources", href: "/resources", description: "Charter guides, governance and federation links" },
    { label: "Join Us", href: "/join", description: "Membership pathways and enquiry" },
    { label: "Contact Us", href: "/contact", description: "Get in touch with the National Secretariat" },
  ],
  contact: {
    organizationName: "National Association of Soroptimist International of India",
    parentBody: "Chartered under Soroptimist International",
    email: "contact@nasi-india.org",
    phone: "+91 (0) 11 0000 0000",
    addressLines: [
      "NASI India National Secretariat",
      "New Delhi, India (Placeholder Address)",
    ],
    officeHours: "Monday – Friday: 10:00 AM – 5:00 PM IST",
  },
  socialLinks: [
    {
      platform: "Facebook",
      href: "https://facebook.com",
      ariaLabel: "Follow NASI India on Facebook (placeholder link)",
    },
    {
      platform: "Instagram",
      href: "https://instagram.com",
      ariaLabel: "Follow NASI India on Instagram (placeholder link)",
    },
    {
      platform: "LinkedIn",
      href: "https://linkedin.com",
      ariaLabel: "Connect with NASI India on LinkedIn (placeholder link)",
    },
    {
      platform: "YouTube",
      href: "https://youtube.com",
      ariaLabel: "Subscribe to NASI India on YouTube (placeholder link)",
    },
  ],
  internationalAffiliation: {
    name: "Soroptimist International",
    description: "A worldwide volunteer service organization for women who work for peace, and to improve the lives of women and girls.",
    globalUrl: "https://www.soroptimistinternational.org",
  },
  copyrightYear: 2026,
};
