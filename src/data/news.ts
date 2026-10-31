export interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  category: "Programme Action" | "National Event" | "Advocacy" | "Club Milestone" | "International";
  clubAttribution: string;
  readTime: string;
  isFeatured?: boolean;
  excerpt: string;
  content: string[];
  keyHighlights: string[];
  tags: string[];
}

export const initialNews: NewsArticle[] = [
  {
    slug: "national-programme-action-stem-scholarships",
    title: "National Programme Action: Expanding STEM Support and Mentoring for Girls",
    date: "October 15, 2024",
    isoDate: "2024-10-15",
    category: "Programme Action",
    clubAttribution: "SI Bangalore & National PAC",
    readTime: "4 min read (Sample)",
    isFeatured: true,
    excerpt:
      "A coordinated multi-club initiative focusing on secondary school mentoring, laboratory access, and STEM scholarship grants for girls in semi-urban communities.",
    content: [
      "As part of the nationwide Programme Action agenda, NASI India clubs have collaborated to scale STEM (Science, Technology, Engineering, and Mathematics) education initiatives targeting young girls in municipal and government schools.",
      "Spearheaded by SI Bangalore with coordination from the National Programme Action Coordinator, the initiative connects female engineers, doctors, and data scientists with high-school students. Over the past academic quarter, clubs organized interactive coding workshops, mobile science exhibitions, and scholarship guidance sessions.",
      "The Programme Action committee emphasizes that sustained interventions—combining tuition fee support, digital devices, and continuous mentorship—yield the highest transition rates from high school to undergraduate scientific degrees.",
      "Member clubs across Karnataka, Maharashtra, and West Bengal have pledged continued support for the upcoming academic cycle, with regional workshops planned throughout the winter semester.",
    ],
    keyHighlights: [
      "Over 120 students supported with academic mentoring and guidance.",
      "Bilingual STEM reference kits distributed to community schools.",
      "Ongoing collaboration between Southern and Western region member chapters.",
    ],
    tags: ["STEM Education", "Scholarships", "Mentorship", "Programme Action"],
  },
  {
    slug: "nasi-annual-national-council-preparations",
    title: "NASI India Annual National Council Preparations Announced",
    date: "September 28, 2024",
    isoDate: "2024-09-28",
    category: "National Event",
    clubAttribution: "National Secretariat",
    readTime: "3 min read (Sample)",
    isFeatured: false,
    excerpt:
      "Delegates and club leaders from across all four regions prepare to convene for the annual review of community impact, leadership transitions, and strategic goals.",
    content: [
      "The National Secretariat has announced preliminary details for the upcoming NASI India National Council Meeting. The hybrid convention will bring together club presidents, secretaries, and voting delegates from chartered chapters across India.",
      "Key agenda items include the presentation of the biennial Programme Action review, statutory audited accounts by the National Treasurer, and constitutional governance deliberations.",
      "The convention will also host specialized masterclasses on grant writing, youth engagement, and fostering international friendship links with Soroptimist federations globally.",
    ],
    keyHighlights: [
      "Hybrid format to ensure full representation from northern, southern, western, and eastern clubs.",
      "Official release of the Biennial Programme Action Best Practices Compendium.",
      "Formal induction ceremony for newly chartered project teams.",
    ],
    tags: ["Governance", "National Council", "Leadership", "Annual Review"],
  },
  {
    slug: "soroptimist-international-16-days-of-activism",
    title: "Soroptimist International Global Campaign: 16 Days of Activism Against Gender Violence",
    date: "August 12, 2024",
    isoDate: "2024-08-12",
    category: "Advocacy",
    clubAttribution: "SI Delhi & National Communications",
    readTime: "3 min read (Sample)",
    isFeatured: false,
    excerpt:
      "Member clubs align local community awareness campaigns with the international coalition to end violence against women and promote legal empowerment.",
    content: [
      "In solidarity with the annual United Nations campaign, NASI India chapters are mobilizing grassroots advocacy across regional urban and rural centres for the '16 Days of Activism Against Gender-Based Violence'.",
      "Clubs including SI Delhi, SI Chennai, and SI Bombay North are conducting localized legal aid clinics, self-defense workshops for adolescent girls, and street plays highlighting domestic rights.",
      "The campaign highlights the crucial link between economic independence and personal safety, encouraging community workshops on banking, digital safety, and legal helplines.",
    ],
    keyHighlights: [
      "Community legal awareness workshops conducted in three regional languages.",
      "Digital awareness toolkit shared with university women's cells.",
      "Coordinated solidarity campaign with Soroptimist International federations worldwide.",
    ],
    tags: ["Advocacy", "Women Safety", "Legal Rights", "Global Campaign"],
  },
  {
    slug: "si-pune-water-sanitation-milestone",
    title: "SI Pune Metro East Completes Community Bio-Sand Water Filter Project",
    date: "July 24, 2024",
    isoDate: "2024-07-24",
    category: "Club Milestone",
    clubAttribution: "SI Pune Metro East",
    readTime: "3 min read (Sample)",
    isFeatured: false,
    excerpt:
      "Clean drinking water facilities and sanitation education delivered to peri-urban school communities in eastern Pune.",
    content: [
      "SI Pune Metro East has successfully commissioned community bio-sand water filtration units across three primary schools on the outskirts of Pune.",
      "The project addresses recurrent water-borne illnesses that previously contributed to high school absenteeism among young girls. In parallel, club members conducted hygiene and water conservation seminars for teachers and parent associations.",
      "Water quality parameters will be monitored quarterly by volunteer environmental engineers from the club roster.",
    ],
    keyHighlights: [
      "Sustainable gravity-based filtration requiring minimal maintenance.",
      "Over 450 school children benefit from clean drinking water.",
      "Student 'Eco-Clubs' formed to oversee daily filter care.",
    ],
    tags: ["Sanitation", "Clean Water", "Health", "Pune"],
  },
  {
    slug: "si-guwahati-handloom-artisan-exhibition",
    title: "SI Guwahati Showcases Indigenous Weavers at Regional Craft Forum",
    date: "June 18, 2024",
    isoDate: "2024-06-18",
    category: "Club Milestone",
    clubAttribution: "SI Guwahati",
    readTime: "3 min read (Sample)",
    isFeatured: false,
    excerpt:
      "Traditional Assamese silk and cotton textiles crafted by women's cooperatives highlighted at the regional economic development conclave.",
    content: [
      "Members of SI Guwahati facilitated a dedicated market pavilion for rural women handloom weavers from Kamrup rural district.",
      "The showcase enabled women artisans to sell their Eri and Muga silk creations directly to ethical buyers without intermediary commissions, tripling household returns.",
      "The club announced plans to establish an ongoing design mentorship program pairing traditional weavers with young textile institute graduates.",
    ],
    keyHighlights: [
      "Direct market access generated sustainable earnings for 35 artisan families.",
      "Natural vegetable dye workshop conducted to reduce chemical effluent.",
      "Seed fund established for next season's raw silk procurement.",
    ],
    tags: ["Livelihoods", "Artisans", "Handloom", "Guwahati"],
  },
  {
    slug: "global-friendship-link-australia-india",
    title: "NASI India Establishes New Friendship Links with SI South East Asia Pacific",
    date: "May 10, 2024",
    isoDate: "2024-05-10",
    category: "International",
    clubAttribution: "National Friendship Link Officer",
    readTime: "3 min read (Sample)",
    isFeatured: false,
    excerpt:
      "Cultural exchange and joint webinars fostered between Indian clubs and sister chapters across the Asia Pacific federation.",
    content: [
      "Soroptimist International's Friendship Link programme connects sister clubs across national borders to share best practices, promote international understanding, and support reciprocal community causes.",
      "The National Friendship Link Officer confirmed the formalization of twin-club links between SI Kochi, SI Bangalore, and clubs in Australia and New Zealand.",
      "Joint virtual sessions will highlight cross-cultural approaches to girls' vocational training and environmental sustainability.",
    ],
    keyHighlights: [
      "Bi-monthly virtual roundtables between international twin clubs.",
      "Knowledge sharing on disaster resilience and climate adaptation.",
      "Strengthened federation bonds ahead of the international quadrennial convention.",
    ],
    tags: ["International", "Friendship Links", "Global Network", "Exchange"],
  },
];

export function getAllNews(): NewsArticle[] {
  return initialNews;
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return initialNews.find((n) => n.slug === slug);
}

export function getFeaturedNews(): NewsArticle | undefined {
  return initialNews.find((n) => n.isFeatured) || initialNews[0];
}
