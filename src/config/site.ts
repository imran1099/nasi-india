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

export const siteConfig: SiteConfig = {
  name: "NASI India",
  tagline: "Inspiring action, transforming lives for women and girls across India.",
  description:
    "National Association of Soroptimist International of India (NASI India) is a voluntary service organization committed to educating, empowering, and enabling women and girls through grassroots community action.",
  logo: {
    type: "text",
    text: "NASI India",
    subtext: "Soroptimist International",
    // When an official logo is uploaded via admin panel in future phases,
    // imageUrl can be populated (e.g., '/images/nasi-india-logo.png') and type set to 'image'.
    imageUrl: "",
    altText: "NASI India - National Association of Soroptimist International of India",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "About NASI India", href: "/about", description: "Our heritage, mission, and structure" },
    { label: "Committee", href: "/committee", description: "National leadership and executive team" },
    { label: "NASI India Clubs", href: "/clubs", description: "Directory of chartered clubs nationwide" },
    { label: "News", href: "/news", description: "National initiatives and club updates" },
    { label: "Events", href: "/events", description: "Conferences, webinars, and action days" },
    { label: "Soroptimist Resources", href: "/resources", description: "Charter guides, governance, and SI materials" },
    { label: "Join SI", href: "/join", description: "Membership information and application" },
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
