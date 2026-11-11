export interface EventItem {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  time: string;
  location: string;
  city: string;
  state: string;
  format: "In-Person" | "Hybrid" | "Online";
  category: "National Conference" | "Webinar" | "Regional Summit" | "Community Workshop" | "Training";
  clubAttribution: string;
  isFeatured?: boolean;
  shortDescription: string;
  detailedDescription: string[];
  agenda: Array<{ time: string; activity: string; speaker?: string }>;
  registrationDeadline: string;
  registrationNotes: string;
}

export const initialEvents: EventItem[] = [
  {
    slug: "nasi-ec-meeting-installation-ceremony",
    title: "NASI EC Meeting & Installation Ceremony",
    date: "Current Biennium Gathering",
    isoDate: "2026-03-15",
    time: "09:30 AM – 05:00 PM IST",
    location: "Madurai, Tamil Nadu",
    city: "Madurai",
    state: "Tamil Nadu",
    format: "In-Person",
    category: "National Conference",
    clubAttribution: "Host Club: SI Madurai & NASI Secretariat",
    isFeatured: true,
    shortDescription:
      "Official National Executive Committee (EC) meeting, installation of the 2026–2028 Board led by President Anitha Rajarajan, event happenings, photographs, and nationwide programme action roadmap.",
    detailedDescription: [
      "The NASI EC Meeting and formal Installation Ceremony marks the official commencement of the 2026–2028 Biennium under President Anitha Rajarajan and the elected National Board.",
      "Hosted in the historic city of Madurai by SI Madurai, the gathering brings together national office bearers, past presidents, and club delegates from across all regions of India.",
      "The agenda features formal induction ceremonies, committee appointments, photographic documentation of milestone projects, and alignment with Soroptimist International and UN Sustainable Development Goals.",
    ],
    agenda: [
      { time: "09:30 AM – 10:15 AM", activity: "Delegate Registration & Welcome", speaker: "Host Club President" },
      { time: "10:15 AM – 12:00 PM", activity: "National EC Meeting & Biennial Strategic Directives", speaker: "National Secretary & Board" },
      { time: "12:00 PM – 01:15 PM", activity: "Programme Action Showcase & Club Project Highlights", speaker: "PAC & Regional Coordinators" },
      { time: "02:30 PM – 04:30 PM", activity: "Formal Installation Ceremony & Presidential Address", speaker: "National President Anitha Rajarajan" },
      { time: "05:00 PM Onwards", activity: "Fellowship Gathering & Photographic Showcase", speaker: "Delegates & Dignitaries" },
    ],
    registrationDeadline: "Accredited delegates through Club Secretaries",
    registrationNotes: "Official delegates and attending members are requested to confirm through SI Madurai host committee.",
  },
  {
    slug: "nasi-annual-national-council-meeting",
    title: "NASI Annual National Council Meeting",
    date: "Annual National Gathering",
    isoDate: "2026-10-18",
    time: "10:00 AM – 04:30 PM IST",
    location: "National Headquarters / Hybrid",
    city: "New Delhi",
    state: "Delhi NCR",
    format: "Hybrid",
    category: "National Conference",
    clubAttribution: "NASI National Secretariat",
    isFeatured: false,
    shortDescription:
      "The Annual National Council serves as the supreme governance forum of NASI India, reviewing annual reports, audited statements, and constitutional deliberations.",
    detailedDescription: [
      "The Annual National Council serves as the supreme governance forum of the National Association of Soroptimist International of India. Delegates review annual Programme Action reports, approve audited financial statements, and align national advocacy goals with Soroptimist International's global roadmap.",
      "Day 1 focuses on constitutional matters, federation updates, and inter-club awards celebrating outstanding community impact in education and women's economic independence.",
      "Day 2 features interactive break-out workshops on grant mobilization, modern nonprofit digital management, and building high-impact community partnerships with civil society organizations.",
    ],
    agenda: [
      { time: "10:00 AM – 10:30 AM", activity: "Roll Call of Chartered Clubs & Welcome", speaker: "National Secretary" },
      { time: "10:30 AM – 12:00 PM", activity: "Presidential Address & Annual Report Presentation", speaker: "National President" },
      { time: "01:00 PM – 02:30 PM", activity: "Financial Statements & Statutory Compliance Review", speaker: "National Treasurer" },
      { time: "02:45 PM – 04:15 PM", activity: "National Council Resolutions & Regional Action Plans", speaker: "National Council" },
    ],
    registrationDeadline: "Council delegate registration opens 30 days prior",
    registrationNotes: "Official delegates should confirm accreditation through their club secretary. Online attendees will receive secure access links.",
  },
  {
    slug: "western-region-inter-club-action-summit",
    title: "Western Region Inter-Club Action Summit: Sustainable Livelihoods",
    date: "January 20, 2025",
    isoDate: "2025-01-20",
    time: "10:00 AM – 03:30 PM IST",
    location: "Yashwantrao Chavan Center, Nariman Point",
    city: "Mumbai",
    state: "Maharashtra",
    format: "In-Person",
    category: "Regional Summit",
    clubAttribution: "SI Bombay West, SI Bombay Chembur & SI Bombay North",
    isFeatured: false,
    shortDescription:
      "Collaborative project review for western region clubs focusing on sustainable livelihoods, waste management, and vocational training for women.",
    detailedDescription: [
      "Western region clubs convene in Mumbai to share multi-year project learnings on women's micro-enterprise incubation, municipal composting, and occupational healthcare.",
      "The summit will formalize cross-club collaboration for joint fundraising and volunteer mobilization across Mumbai, Pune, and surrounding districts.",
      "Featuring guest lectures from nonprofit finance advisors on FCRA compliance, CSR partnership opportunities, and project measurement frameworks.",
    ],
    agenda: [
      { time: "10:00 AM – 10:30 AM", activity: "Breakfast Networking & Registration", speaker: "Organizing Committee" },
      { time: "10:30 AM – 12:30 PM", activity: "Livelihood Project Roundtables: Scaling Self-Help Groups", speaker: "Club Project Leads" },
      { time: "01:30 PM – 02:45 PM", activity: "CSR Partnerships & Statutory Compliances", speaker: "Guest Specialist" },
      { time: "02:45 PM – 03:30 PM", activity: "Regional Action Plan 2025 Adoption", speaker: "Western Region Coordinator" },
    ],
    registrationDeadline: "January 14, 2025 (Sample Deadline)",
    registrationNotes: "Open to members of all Western Region clubs and prospective volunteers. Lunch and summit kit included.",
  },
  {
    slug: "southern-region-leadership-mentoring-symposium",
    title: "Southern Region Leadership & Mentoring Symposium",
    date: "February 15, 2025",
    isoDate: "2025-02-15",
    time: "10:30 AM – 04:00 PM IST",
    location: "Tagore Hall / Hybrid",
    city: "Kochi",
    state: "Kerala",
    format: "Hybrid",
    category: "Training",
    clubAttribution: "SI Kochi, SI Chennai & SI Bangalore",
    isFeatured: false,
    shortDescription:
      "Interactive training for newly appointed club board members on volunteer leadership, public speaking, and project cycle management.",
    detailedDescription: [
      "Designed to nurture the next generation of women leaders, this symposium offers intensive modules on non-profit project governance, club secretarial compliance, and digital communications.",
      "Experienced Soroptimist elders will mentor incoming club executives through practical simulations of meeting procedures, crisis management, and international twinning.",
    ],
    agenda: [
      { time: "10:30 AM – 11:30 AM", activity: "Leadership Ethics in Voluntary Organizations", speaker: "Senior Soroptimist Fellow" },
      { time: "11:45 AM – 01:00 PM", activity: "Hands-on Project Proposal & Grant Writing Lab", speaker: "PAC Committee" },
      { time: "02:00 PM – 03:30 PM", activity: "Public Speaking & Media Relations Workshop", speaker: "Communications Officer" },
      { time: "03:30 PM – 04:00 PM", activity: "Peer Mentoring Pairings & Conclusion", speaker: "Southern Region Lead" },
    ],
    registrationDeadline: "February 08, 2025 (Sample Deadline)",
    registrationNotes: "Nominations invited from all Southern Region chartered clubs.",
  },
];

export function getAllEvents(): EventItem[] {
  return initialEvents;
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return initialEvents.find((e) => e.slug === slug);
}

export function getFeaturedEvents(): EventItem[] {
  return initialEvents.filter((e) => e.isFeatured);
}
