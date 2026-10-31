export interface CommitteeMember {
  role: string;
  roleShort: string;
  name: string;
  designation: string;
  department: string;
  tenure: string;
  bio?: string;
  clubAffiliation: string;
  emailPlaceholder: string;
  initials: string;
}

export const initialCommittee: CommitteeMember[] = [
  {
    role: "President",
    roleShort: "National President",
    name: "Dr. Ananya Sen (Sample Profile)",
    designation: "National President",
    department: "Executive Leadership",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Calcutta",
    emailPlaceholder: "president@nasi-india.org",
    initials: "AS",
    bio: "Senior educator and community leader with over two decades of voluntary service in Soroptimist International. Leads the National Board in coordinating national programmes, strategic expansion, and federation representation.",
  },
  {
    role: "Secretary",
    roleShort: "National Secretary",
    name: "Meenakshi Sundaram (Sample Profile)",
    designation: "National Secretary",
    department: "Secretariat Administration",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Bangalore",
    emailPlaceholder: "secretary@nasi-india.org",
    initials: "MS",
    bio: "Corporate legal counsel specializing in nonprofit governance and governance frameworks. Oversees official correspondence, National Council minutes, and compliance with Soroptimist International bylaws.",
  },
  {
    role: "Treasurer",
    roleShort: "National Treasurer",
    name: "Kavita Deshmukh (Sample Profile)",
    designation: "National Treasurer",
    department: "Finance & Accounts",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Pune Metro East",
    emailPlaceholder: "treasurer@nasi-india.org",
    initials: "KD",
    bio: "Chartered accountant with extensive experience in statutory auditing and institutional budgeting. Manages NASI India's financial integrity, project disbursement audits, and annual statutory filings.",
  },
  {
    role: "PAC",
    roleShort: "Programme Action Coordinator",
    name: "Prof. Radhika Nair (Sample Profile)",
    designation: "National Programme Action Coordinator (PAC)",
    department: "Programme Action & Advocacy",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Kochi",
    emailPlaceholder: "pac@nasi-india.org",
    initials: "RN",
    bio: "Academic researcher and public health specialist. Coordinates national initiatives across education, maternal health, and environmental sustainability, ensuring alignment with UN Sustainable Development Goals.",
  },
  {
    role: "Membership Officer",
    roleShort: "National Membership Convener",
    name: "Shabnam Farooqui (Sample Profile)",
    designation: "National Membership Officer",
    department: "Membership & Club Expansion",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Delhi",
    emailPlaceholder: "membership@nasi-india.org",
    initials: "SF",
    bio: "Human resources strategist dedicated to voluntary organization growth. Supports the induction of new professional members, mentorship circles, and chartering procedures for prospective chapters nationwide.",
  },
  {
    role: "Communication Officer",
    roleShort: "National Communications Lead",
    name: "Sunita Chawla (Sample Profile)",
    designation: "National Communication Officer",
    department: "Public Relations & Media",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Bombay West",
    emailPlaceholder: "communications@nasi-india.org",
    initials: "SC",
    bio: "Media and brand communications professional. Directs national digital outreach, annual reporting publications, public advocacy campaigns, and media relations for member clubs across India.",
  },
  {
    role: "Friendship Link Officer",
    roleShort: "National Friendship Link Officer",
    name: "Lalitha Ramanathan (Sample Profile)",
    designation: "National Friendship Link Officer",
    department: "International Relations & Friendship Links",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Chennai",
    emailPlaceholder: "friendship@nasi-india.org",
    initials: "LR",
    bio: "Promotes global solidarity and international twin-club relationships with Soroptimist sister chapters across Africa, the Americas, Europe, and South East Asia Pacific.",
  },
  {
    role: "IPP",
    roleShort: "Immediate Past President",
    name: "Dr. Geeta Varghese (Sample Profile)",
    designation: "Immediate Past National President (IPP)",
    department: "Executive Advisory",
    tenure: "Biennium 2024–2026",
    clubAffiliation: "SI Coimbatore",
    emailPlaceholder: "ipp@nasi-india.org",
    initials: "GV",
    bio: "Consultant physician and long-serving Soroptimist leader. Provides institutional memory, constitutional advisory, and leadership continuity to the current National Board.",
  },
];

export function getAllCommitteeMembers(): CommitteeMember[] {
  return initialCommittee;
}
