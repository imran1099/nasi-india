export interface ResourceCardItem {
  id: string;
  title: string;
  shortDescription: string;
  category: "Global Body" | "Federation" | "Publication" | "Membership";
  federationType?: string;
  details: string;
  urlPlaceholder: string;
  isExternal: boolean;
  actionText: string;
  statusBadge: string;
}

export const designatedResources: ResourceCardItem[] = [
  {
    id: "soroptimist-international",
    title: "Soroptimist International",
    shortDescription: "The global parent organization holding General Consultative Status with the United Nations ECOSOC.",
    category: "Global Body",
    federationType: "Worldwide Parent Body",
    details:
      "Founded in 1921, Soroptimist International unites over 66,000 members across more than 120 countries, advocating for human rights and gender equality at the UN Commission on the Status of Women.",
    urlPlaceholder: "https://www.soroptimistinternational.org",
    isExternal: true,
    actionText: "Visit SI Global Portal",
    statusBadge: "Official Global Portal",
  },
  {
    id: "si-africa",
    title: "SI Africa Federation",
    shortDescription: "The newest federation of Soroptimist International, uniting clubs and national associations across the African continent.",
    category: "Federation",
    federationType: "Continental Federation",
    details:
      "SI Africa spearheads transformative initiatives focusing on maternal healthcare, girl-child education in rural communities, and economic empowerment across member nations.",
    urlPlaceholder: "https://www.soroptimistinternational.org/where-we-work/africa-federation/",
    isExternal: true,
    actionText: "Explore SI Africa (Temporary Link)",
    statusBadge: "Federation Resource",
  },
  {
    id: "si-americas",
    title: "Soroptimist International of the Americas (SIA)",
    shortDescription: "Supporting women and girls through signature programmes including 'Live Your Dream Awards' and 'Dream It, Be It'.",
    category: "Federation",
    federationType: "Continental Federation",
    details:
      "SIA encompasses clubs throughout North America, Latin America, and the Pacific Rim, focusing on providing women and girls with access to education and training needed for economic independence.",
    urlPlaceholder: "https://www.soroptimist.org",
    isExternal: true,
    actionText: "Explore SI Americas (Temporary Link)",
    statusBadge: "Federation Resource",
  },
  {
    id: "si-europe",
    title: "Soroptimist International of Europe (SIE)",
    shortDescription: "A network of clubs promoting women's rights, peace, and sustainable development across European and Mediterranean nations.",
    category: "Federation",
    federationType: "Continental Federation",
    details:
      "SIE coordinates hundreds of grassroots projects supporting STEM education, female entrepreneurship, refugee integration, and campaigns against domestic violence.",
    urlPlaceholder: "https://www.soroptimisteurope.org",
    isExternal: true,
    actionText: "Explore SI Europe (Temporary Link)",
    statusBadge: "Federation Resource",
  },
  {
    id: "si-south-east-asia-pacific",
    title: "Soroptimist International South East Asia Pacific (SISEAP)",
    shortDescription: "Comprising member clubs across Australia, New Zealand, the Pacific Islands, and South East Asian nations.",
    category: "Federation",
    federationType: "Regional Federation",
    details:
      "SISEAP champions regional climate resilience, education scholarships for indigenous girls, and collaborative healthcare initiatives across Oceania and Southeast Asia.",
    urlPlaceholder: "https://www.siswp.org",
    isExternal: true,
    actionText: "Explore SISEAP (Temporary Link)",
    statusBadge: "Federation Resource",
  },
  {
    id: "global-voice-newsletter",
    title: "Global Voice Newsletter & SI Publications",
    shortDescription: "Official international publication detailing global UN advocacy, federation congress reports, and grassroots impact stories.",
    category: "Publication",
    federationType: "International Periodical",
    details:
      "Access quarterly compendiums, United Nations position papers, leadership declarations, and inspirational photo essays from Soroptimist service projects worldwide.",
    urlPlaceholder: "https://www.soroptimistinternational.org/resources/global-voice/",
    isExternal: true,
    actionText: "Read Global Voice (Temporary Link)",
    statusBadge: "Official Publication",
  },
  {
    id: "join-si-today",
    title: "Join SI Today — Membership Portal",
    shortDescription: "Step-by-step guidance for professional women and community leaders aspiring to charter or join a local Soroptimist club.",
    category: "Membership",
    federationType: "National Membership Guide",
    details:
      "Discover the volunteer commitment, membership eligibility criteria, professional networking opportunities, and how you can make a meaningful difference in the lives of women and girls.",
    urlPlaceholder: "/join",
    isExternal: false,
    actionText: "Start Membership Inquiry",
    statusBadge: "NASI India Portal",
  },
];

export function getAllResources(): ResourceCardItem[] {
  return designatedResources;
}
