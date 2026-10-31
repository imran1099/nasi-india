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
    slug: "nasi-national-council-meeting-2024",
    title: "NASI National Council Meeting & Biennial Leadership Workshop",
    date: "November 16–17, 2024",
    isoDate: "2024-11-16",
    time: "09:30 AM – 04:30 PM IST",
    location: "India Habitat Centre / Hybrid Online",
    city: "New Delhi",
    state: "Delhi NCR",
    format: "Hybrid",
    category: "National Conference",
    clubAttribution: "National Secretariat & SI Delhi",
    isFeatured: true,
    shortDescription:
      "A flagship two-day strategic conference bringing together club presidents, secretaries, and regional coordinators for governance, impact reviews, and best-practice workshops.",
    detailedDescription: [
      "The National Council Meeting serves as the highest governance forum of the National Association of Soroptimist International of India. Delegates will review annual Programme Action reports, approve audited financial statements, and align national advocacy goals with Soroptimist International's global roadmap.",
      "Day 1 focuses on constitutional matters, federation updates, and inter-club awards celebrating outstanding community impact in education and women's economic independence.",
      "Day 2 features interactive break-out workshops on grant mobilization, modern nonprofit digital management, and building high-impact community partnerships with civil society organizations.",
    ],
    agenda: [
      { time: "09:30 AM – 10:15 AM", activity: "Delegate Registration, Welcome Address & Soroptimist Pledge", speaker: "National Secretary" },
      { time: "10:15 AM – 11:30 AM", activity: "Presidential Address & Biennial Strategic Review", speaker: "National President" },
      { time: "11:45 AM – 01:15 PM", activity: "Programme Action Showcase: Grassroots Presentations by Region", speaker: "National PAC & Regional Leads" },
      { time: "02:15 PM – 03:30 PM", activity: "Financial Transparency & Governance Compliance", speaker: "National Treasurer" },
      { time: "03:45 PM – 04:30 PM", activity: "Resolutions, Next Biennium Roadmap & Closing Remarks", speaker: "National Board" },
    ],
    registrationDeadline: "November 10, 2024 (Sample Deadline)",
    registrationNotes: "Official delegates should confirm accreditation through their club secretary. Online attendees will receive secure access links.",
  },
  {
    slug: "international-day-girl-child-panel",
    title: "International Day of the Girl Child: Nationwide Advocacy Panel",
    date: "December 05, 2024",
    isoDate: "2024-12-05",
    time: "05:00 PM – 07:00 PM IST",
    location: "Live Virtual Webinar (Open to Public)",
    city: "National Virtual Event",
    state: "All India",
    format: "Online",
    category: "Webinar",
    clubAttribution: "National Advocacy Committee & SI Bangalore",
    isFeatured: false,
    shortDescription:
      "A national public webinar highlighting innovative mentorship models, school retention initiatives, and digital literacy pathways for young women.",
    detailedDescription: [
      "Observed globally, the International Day of the Girl Child provides an opportunity to amplify young women's voices and address barriers to equitable education.",
      "Panelists representing educationists, technology leaders, and grassroots social workers will explore practical interventions that keep semi-urban and rural girls in school through higher secondary education.",
      "Club youth coordinators will share case studies from successful scholarship programs running in Karnataka, Maharashtra, and Tamil Nadu.",
    ],
    agenda: [
      { time: "05:00 PM – 05:15 PM", activity: "Opening Remarks: The State of Girl Child Secondary Education", speaker: "Moderator" },
      { time: "05:15 PM – 06:15 PM", activity: "Panel Discussion: Digital Access, Nutrition, and Safe Schools", speaker: "Guest Educationists & SI Panelists" },
      { time: "06:15 PM – 06:45 PM", activity: "Interactive Audience Q&A", speaker: "Open Discussion" },
      { time: "06:45 PM – 07:00 PM", activity: "Action Commitments & Closing", speaker: "National PAC" },
    ],
    registrationDeadline: "December 03, 2024 (Sample Deadline)",
    registrationNotes: "Pre-registration is required to receive webinar joining credentials. Session will be recorded for member club archives.",
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
