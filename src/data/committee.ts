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
    roleShort: "President",
    name: "Anitha Rajarajan",
    designation: "President – NASI India",
    department: "Executive Leadership",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "SI Madurai",
    emailPlaceholder: "president@nasi-india.org",
    initials: "AR",
    bio: "Founding President of SI Madurai and experienced Soroptimist leader who has spearheaded club chartering and membership expansion across India. Leads the National Board in coordinating nationwide programmes, federation relations with SIGBI, and advancing opportunities for women and girls.",
  },
  {
    role: "Secretary",
    roleShort: "Secretary",
    name: "Anjaly Banarji",
    designation: "Secretary – NASI India",
    department: "Secretariat Administration",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "NASI India",
    emailPlaceholder: "secretary@nasi-india.org",
    initials: "AB",
    bio: "Manages national secretariat administration, official correspondence, council documentation, and constitutional compliance across all chartered clubs in the Indian national association.",
  },
  {
    role: "Treasurer",
    roleShort: "Treasurer",
    name: "Reni Francis",
    designation: "Treasurer – NASI India",
    department: "Finance & Accounts",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "SI Bombay Chembur",
    emailPlaceholder: "treasurer@nasi-india.org",
    initials: "RF",
    bio: "Oversees financial management, budgeting, statutory audits, and transparent disbursement of programme funds for national projects and club initiatives nationwide.",
  },
  {
    role: "President Elect",
    roleShort: "President Elect",
    name: "Jamuna Ravi",
    designation: "President Elect – NASI India",
    department: "Executive Leadership & Strategic Planning",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "NASI India",
    emailPlaceholder: "presidentelect@nasi-india.org",
    initials: "JR",
    bio: "Supports executive governance and strategic planning, working closely with member clubs and the federation to ensure leadership continuity and organizational growth.",
  },
  {
    role: "IPP",
    roleShort: "Immediate Past President",
    name: "Naina Shah",
    designation: "Immediate Past President (IPP) – NASI India",
    department: "Executive Advisory & Governance",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "NASI India",
    emailPlaceholder: "ipp@nasi-india.org",
    initials: "NS",
    bio: "Immediate Past National President providing institutional guidance, constitutional advisory, and federation coordination to sustain long-term impact across India.",
  },
  {
    role: "PAC",
    roleShort: "Programme Action Chairperson",
    name: "Shukla Chattopadhyay",
    designation: "Programme Action Chairperson (PAC) – NASI India",
    department: "Programme Action & Advocacy",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "SI Calcutta",
    emailPlaceholder: "pac@nasi-india.org",
    initials: "SC",
    bio: "Directs national Programme Action across education, women's empowerment, healthcare, and environmental sustainability, aligning local club projects with SIGBI priorities and UN Sustainable Development Goals.",
  },
  {
    role: "Membership and Development Officer",
    roleShort: "Membership & Development",
    name: "Kavitha Ramesh",
    designation: "Membership and Development Officer – NASI India",
    department: "Membership & Club Expansion",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "SI Coimbatore",
    emailPlaceholder: "membership@nasi-india.org",
    initials: "KR",
    bio: "Leads membership development, club revitalization, and nationwide chapter expansion, guiding prospective members and new clubs through induction and chartering.",
  },
  {
    role: "Communications Officer",
    roleShort: "Communications Officer",
    name: "Anupama Sen",
    designation: "Communications Officer – NASI India",
    department: "Communications & Media",
    tenure: "Biennium 2026–2028",
    clubAffiliation: "NASI India",
    emailPlaceholder: "communications@nasi-india.org",
    initials: "AS",
    bio: "Manages public relations, media engagement, digital communications, and national publications to amplify the voices and accomplishments of Soroptimist clubs across India.",
  },
];

export function getAllCommitteeMembers(): CommitteeMember[] {
  return initialCommittee;
}
