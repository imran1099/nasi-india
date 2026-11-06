export interface Club {
  slug: string;
  name: string;
  city: string;
  state: string;
  region: "Northern Region" | "Southern Region" | "Western Region" | "Eastern Region" | "North Eastern Region";
  charterYear: string;
  charterDate?: string;
  charterStatusNote?: string;
  foundingPresident?: string;
  nasiPresidentAtCharter?: string;
  nasiMembershipOfficer?: string;
  sigbiOfficer?: string;
  motherClub?: string;
  founderMembersCount?: number | string;
  historicalNotes?: string;
  focusAreas: string[];
  description: string;
  meetingSchedule: string;
  coordinatorPlaceholder: string;
  emailPlaceholder: string;
  sampleProjects: Array<{
    title: string;
    description: string;
    status: "Ongoing" | "Completed" | "Annual";
  }>;
}

export interface HistoricalTimelineItem {
  id: string;
  clubName: string;
  slug: string;
  charterDate: string;
  year: number;
  city: string;
  state: string;
  region: string;
  foundingPresident?: string;
  nasiPresidentAtCharter?: string;
  nasiMembershipOfficer?: string;
  sigbiOfficer?: string;
  motherClub?: string;
  historicalNotes?: string;
  charterStatusNote?: string;
  isFirstInIndia?: boolean;
}

export interface MissingInfoChecklistItem {
  clubName: string;
  slug: string;
  charterDate: string;
  informationRequired: string[];
  verificationStatus: "Pending Verification" | "Partially Verified";
}

export const initialClubs: Club[] = [
  {
    slug: "si-bombay-north",
    name: "SI Bombay North",
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "1974",
    charterDate: "2 September 1974",
    foundingPresident: "Perin Bhiwandiwala",
    sigbiOfficer: "Dorothy Mackenzie White",
    historicalNotes: "First Soroptimist club in India, established before NASI India came into being.",
    focusAreas: ["Women Literacy", "Vocational Training", "Community Health"],
    description:
      "As the pioneering first Soroptimist club chartered in India on 2 September 1974, SI Bombay North laid the foundation of Soroptimist service in the country with decades of dedicated grassroots initiatives in education and social welfare.",
    meetingSchedule: "First Tuesday of every month at 5:00 PM IST",
    coordinatorPlaceholder: "Club Office Bearers",
    emailPlaceholder: "si.bombaynorth@nasi-india.org",
    sampleProjects: [
      {
        title: "Pioneering Women's Literacy & Tailoring Center",
        description: "Community vocational training center supporting women with sustainable sewing and craft skills.",
        status: "Ongoing",
      },
      {
        title: "Healthcare Camps & Eye Checkups",
        description: "Annual health interventions and cataract screenings for underprivileged senior citizens.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-calcutta",
    name: "SI Calcutta",
    city: "Kolkata",
    state: "West Bengal",
    region: "Eastern Region",
    charterYear: "1979",
    charterDate: "27 October 1979",
    foundingPresident: "Aroti Dutta",
    sigbiOfficer: "Jean Wishart",
    focusAreas: ["Girl Education", "Rural Women Welfare", "Health & Sanitation"],
    description:
      "Established on 27 October 1979 under Founding President Aroti Dutta and SIGBI Chartering Officer Jean Wishart, SI Calcutta has been a pillar of empowerment across eastern India for over four decades.",
    meetingSchedule: "Third Saturday of every month at 4:30 PM IST",
    coordinatorPlaceholder: "Club Leadership",
    emailPlaceholder: "si.calcutta@nasi-india.org",
    sampleProjects: [
      {
        title: "Aroti Memorial Rural Girls Schooling Fund",
        description: "Providing books, uniforms, and tuition assistance to first-generation school-going girls.",
        status: "Ongoing",
      },
      {
        title: "Clean Water & Sanitation Workshops",
        description: "Hygiene camps and sanitary napkin distribution in peri-urban communities.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-burdwan",
    name: "SI Burdwan",
    city: "Burdwan",
    state: "West Bengal",
    region: "Eastern Region",
    charterYear: "1987",
    charterDate: "August 1987",
    foundingPresident: "Santanwana Sen",
    sigbiOfficer: "Katherine Fussel",
    focusAreas: ["District Girl Literacy", "Artisan Cooperatives", "Maternal Care"],
    description:
      "Chartered in August 1987 under Founding President Santanwana Sen and Chartering President Katherine Fussel, SI Burdwan works diligently to empower women in regional Bengal through literacy and sustainable livelihood projects.",
    meetingSchedule: "Second Sunday of every month at 11:00 AM IST",
    coordinatorPlaceholder: "Club President",
    emailPlaceholder: "si.burdwan@nasi-india.org",
    sampleProjects: [
      {
        title: "District Handicrafts Promotion Circle",
        description: "Assisting rural women artisans in direct market linkage for indigenous jute crafts.",
        status: "Annual",
      },
      {
        title: "Adolescent Health Education Series",
        description: "Workshops in secondary schools on nutrition, anemia prevention, and hygiene.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-poona",
    name: "SI Poona",
    city: "Pune",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "1991",
    charterDate: "8 April 1991",
    focusAreas: ["Higher Education Grants", "Women Health Initiatives", "Vocational Independence"],
    description:
      "Chartered on 8 April 1991, SI Poona has played an instrumental role in western India and has notably served as the Mother Club for both SI Bangalore (2004) and SI Srinagar, Kashmir (2023).",
    meetingSchedule: "First Wednesday of every month at 5:30 PM IST",
    coordinatorPlaceholder: "Club Coordinator",
    emailPlaceholder: "si.poona@nasi-india.org",
    sampleProjects: [
      {
        title: "Poona Higher Education Grant Program",
        description: "Scholarship stipends for underprivileged young women studying science and commerce.",
        status: "Ongoing",
      },
      {
        title: "Community Cancer Awareness & Mammography Drives",
        description: "Collaborative early screening camps in peri-urban areas of Pune.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-bombay-west",
    name: "SI Bombay West",
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "1992",
    charterDate: "September 1992",
    focusAreas: ["Youth Counseling", "Senior Women Care", "Vocational Livelihoods"],
    description:
      "Chartered in September 1992, SI Bombay West unites professional women along the western Mumbai corridor, driving targeted initiatives for women's healthcare, vocational skills, and social inclusion.",
    meetingSchedule: "Second Saturday of every month at 4:00 PM IST",
    coordinatorPlaceholder: "Club Office Bearers",
    emailPlaceholder: "si.bombaywest@nasi-india.org",
    sampleProjects: [
      {
        title: "Career Guidance for Underprivileged College Girls",
        description: "Structured mentorship circles pairing college students with industry professionals.",
        status: "Ongoing",
      },
      {
        title: "Senior Citizens Livelihood Support",
        description: "Support programs assisting elderly women with healthcare and hobby-craft sales.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-bombay-chembur",
    name: "SI Bombay Chembur",
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "1997",
    charterDate: "2 March 1997",
    charterStatusNote: "Charter date recorded as 2 March 1997; confirmation pending against initial November 1997 timeline note.",
    foundingPresident: "Daphne Pillai",
    sigbiOfficer: "Olive R. Newton",
    motherClub: "Soroptimist International of Colaba",
    focusAreas: ["Community Sanitation", "Adolescent Education", "Micro-Finance"],
    description:
      "Chartered under Founding President Daphne Pillai, SIGBI President Olive R. Newton, and Mother Club SI Colaba, SI Bombay Chembur partners with local communities on educational tutoring, clean sanitation, and women's self-help groups.",
    meetingSchedule: "Third Saturday of every month at 4:00 PM IST",
    coordinatorPlaceholder: "Club Coordinator",
    emailPlaceholder: "si.chembur@nasi-india.org",
    sampleProjects: [
      {
        title: "Slum Sanitation and Waste Segregation",
        description: "Community-managed composting and clean toilet maintenance in municipal colonies.",
        status: "Ongoing",
      },
      {
        title: "Digital Literacy Hub for Adolescent Girls",
        description: "Free coding, typing, and internet security courses.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-chennai",
    name: "SI Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "1998",
    charterDate: "14 December 1998",
    focusAreas: ["Maternal Health", "Girl Child Scholarships", "Community Welfare"],
    description:
      "Chartered on 14 December 1998, SI Chennai brings together women leaders across Tamil Nadu's capital city to foster academic excellence for girls and advocate for maternal and infant healthcare access.",
    meetingSchedule: "Second Thursday of every month at 6:00 PM IST",
    coordinatorPlaceholder: "Club President",
    emailPlaceholder: "si.chennai@nasi-india.org",
    sampleProjects: [
      {
        title: "Chennai Girls STEM Scholarships",
        description: "Endowed funding for girls pursuing undergraduate engineering and medicine.",
        status: "Ongoing",
      },
      {
        title: "Coastal Community Health Vans",
        description: "Mobile clinics delivering primary gynecological care to coastal fisherfolk hamlets.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-cd",
    name: "SI Chennai Downtown",
    city: "Chennai",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "2002",
    charterDate: "September 2002",
    focusAreas: ["Urban Slum Education", "Women's Micro-Enterprise", "Adolescent Counseling"],
    description:
      "Chartered in September 2002, SI Chennai Downtown serves the metropolitan core of Chennai and proudly acted as the Mother Club for SI Madurai in 2010.",
    meetingSchedule: "Fourth Saturday of every month at 11:30 AM IST",
    coordinatorPlaceholder: "Club Secretary",
    emailPlaceholder: "si.chennaidowntown@nasi-india.org",
    sampleProjects: [
      {
        title: "Young Women Leaders Fellowship",
        description: "Stipends and mentorship for university students researching women's labor participation.",
        status: "Ongoing",
      },
      {
        title: "Micro-Enterprise Skill Labs",
        description: "Training programs in culinary arts and tailoring for urban women seeking independent income.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-bangalore",
    name: "SI Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    region: "Southern Region",
    charterYear: "2004",
    charterDate: "10 January 2004",
    foundingPresident: "Dr. Nalini Subbiah",
    nasiPresidentAtCharter: "Sheela Rao",
    sigbiOfficer: "Jacqueline Mosedale",
    motherClub: "SI Poona",
    focusAreas: ["Higher Education Scholarships", "Maternal Nutrition", "Digital Literacy"],
    description:
      "Chartered on 10 January 2004 by Founding President Dr. Nalini Subbiah, NASI India President Sheela Rao, SIGBI President Jacqueline Mosedale, and Mother Club SI Poona. SI Bangalore brings together leaders from tech, academia, and healthcare to empower girls pursuing STEM and vocational degrees.",
    meetingSchedule: "First Saturday of every month at 4:30 PM IST",
    coordinatorPlaceholder: "President / Secretariat Liaison",
    emailPlaceholder: "si.bangalore@nasi-india.org",
    sampleProjects: [
      {
        title: "Vidya Jyothi Higher Education Scholarships",
        description: "Need-cum-merit educational grants for girls enrolled in degree colleges.",
        status: "Ongoing",
      },
      {
        title: "Adolescent Nutrition & Anemia Screening",
        description: "Comprehensive health and hemoglobin testing camps across municipal schools.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-south-kolkata",
    name: "SI South Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    region: "Eastern Region",
    charterYear: "2006",
    charterDate: "21 September 2006",
    focusAreas: ["Primary Girl Literacy", "Artisan Micro-Finance", "Elderly Women Care"],
    description:
      "Chartered on 21 September 2006, SI South Kolkata advocates for marginalized women and girls in southern Kolkata districts, promoting traditional craft preservation, micro-enterprise training, and adult literacy centres.",
    meetingSchedule: "First Sunday of every month at 11:00 AM IST",
    coordinatorPlaceholder: "Club Office Bearers",
    emailPlaceholder: "si.southkolkata@nasi-india.org",
    sampleProjects: [
      {
        title: "Shilpa Srijan Handicrafts Marketplace",
        description: "Direct-to-consumer exhibition support for rural women artisans from the Sundarbans border.",
        status: "Annual",
      },
      {
        title: "Evening Literacy Classes for Domestic Workers",
        description: "Basic reading, numeracy, and bank account literacy for women.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-pune-metro-east",
    name: "SI Pune Metro East",
    city: "Pune",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "2010",
    charterDate: "31 January 2010",
    focusAreas: ["STEM Mentorship", "Adolescent Health", "Environmental Conservation"],
    description:
      "Chartered on 31 January 2010 and active in eastern Pune and adjacent industrial belts, SI Pune Metro East supports young girls in technical education, organizes maternal health check-ups, and champions waste management initiatives.",
    meetingSchedule: "Third Wednesday of every month at 6:00 PM IST",
    coordinatorPlaceholder: "Club Leadership Coordinator",
    emailPlaceholder: "si.punemetroeast@nasi-india.org",
    sampleProjects: [
      {
        title: "Girls in Technology Mentoring Circle",
        description: "Pairing engineering students with senior women technology leaders for career guidance.",
        status: "Ongoing",
      },
      {
        title: "Tree Plantation & Community Compost Drive",
        description: "Urban greening initiative with local municipal schools in Pune.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-madurai",
    name: "SI Madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "2010",
    charterDate: "14 September 2010",
    foundingPresident: "Anitha Rajarajan",
    nasiMembershipOfficer: "Annette",
    motherClub: "SI Chennai Downtown",
    focusAreas: ["Weavers Livelihood Support", "Rural Health", "Tribal Girl Education"],
    description:
      "Chartered on 14 September 2010 with Founding President Anitha Rajarajan, Membership Officer Annette, and Mother Club SI Chennai Downtown. SI Madurai serves southern Tamil Nadu with a notable track record, subsequently acting as Mother Club to both SI Coimbatore (2021) and SI Kochi (2021).",
    meetingSchedule: "First Sunday of every month at 4:00 PM IST",
    coordinatorPlaceholder: "Club President",
    emailPlaceholder: "si.madurai@nasi-india.org",
    sampleProjects: [
      {
        title: "Handloom Weavers Welfare Initiative",
        description: "Micro-loans and ergonomic seating for traditional cotton handloom women artisans.",
        status: "Ongoing",
      },
      {
        title: "Rural Anemia Eradication Campaign",
        description: "Nutrition counseling and iron supplements for pregnant rural women.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-whitefield",
    name: "SI Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    region: "Southern Region",
    charterYear: "2015",
    charterDate: "August 2015",
    focusAreas: ["Tech Inclusion", "Urban Slum Health", "Waste Recyclers Support"],
    description:
      "Chartered in August 2015 in Bengaluru's eastern IT corridor, SI Whitefield engages technology professionals and social entrepreneurs to build scalable models for vocational education and community sanitation.",
    meetingSchedule: "Second Sunday of every month at 10:30 AM IST",
    coordinatorPlaceholder: "Club Coordinator",
    emailPlaceholder: "si.whitefield@nasi-india.org",
    sampleProjects: [
      {
        title: "Women Waste Recyclers Safety Kits",
        description: "Protective equipment, tetanus shots, and eye exams for informal sanitation workers.",
        status: "Ongoing",
      },
      {
        title: "Coding Academies in Slum Rehabilitation Centers",
        description: "Weekend computer programming and basic office automation training.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-coimbatore",
    name: "SI Coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "2021",
    charterDate: "6 September 2021",
    foundingPresident: "Surekha Shekhar",
    nasiPresidentAtCharter: "Achina Kundu",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge",
    motherClub: "SI Madurai",
    historicalNotes: "Revived in 2024 by Kavitha Ramesh, who took over as President.",
    focusAreas: ["Textile Workers Health", "Organic Farming Groups", "Eco-Entrepreneurship"],
    description:
      "Chartered on 6 September 2021 by Founding President Surekha Shekhar, NASI India President Achina Kundu, Membership Officer Anitha Rajarajan, SIGBI Chartering President Cathy Cottridge, and Mother Club SI Madurai. The club was revived in 2024 by Kavitha Ramesh, who took over as President.",
    meetingSchedule: "Second Monday of every month at 5:00 PM IST",
    coordinatorPlaceholder: "Club President",
    emailPlaceholder: "si.coimbatore@nasi-india.org",
    sampleProjects: [
      {
        title: "Spinning Mill Women Health Surveillance",
        description: "Respiratory screenings and protective mask drives in regional textile units.",
        status: "Ongoing",
      },
      {
        title: "Eco-Friendly Menstrual Cup Awareness",
        description: "Educational drives reducing pad waste while improving reproductive hygiene.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-kochi",
    name: "SI Kochi",
    city: "Kochi",
    state: "Kerala",
    region: "Southern Region",
    charterYear: "2021",
    charterDate: "9 September 2021",
    foundingPresident: "Dr. Beena Ravikumar",
    nasiPresidentAtCharter: "Achina Kundu",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge",
    motherClub: "SI Madurai",
    focusAreas: ["Coastal Women Livelihoods", "Health & Hygiene Drives", "Girls Education"],
    description:
      "Chartered on 9 September 2021 by Founding President Dr. Beena Ravikumar, NASI President Achina Kundu, Membership Officer Anitha Rajarajan, SIGBI Chartering President Cathy Cottridge, and Mother Club SI Madurai. SI Kochi unites women professionals across Ernakulam and greater Kochi to implement health workshops, literacy assistance, and economic resilience programmes for coastal communities.",
    meetingSchedule: "Second Saturday of every month (Hybrid: Kochi Club Office & Virtual)",
    coordinatorPlaceholder: "Club President & Secretary (Contact via Secretariat)",
    emailPlaceholder: "si.kochi@nasi-india.org",
    sampleProjects: [
      {
        title: "Clean Water & Coastal Hygiene Drive",
        description: "Distribution of bio-sand water filters and sanitary education sessions for fishing hamlets.",
        status: "Ongoing",
      },
      {
        title: "Vocational Skills for Young Mothers",
        description: "Tailoring and digital literacy workshops providing alternative household income.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-delhi",
    name: "SI Delhi",
    city: "New Delhi",
    state: "Delhi NCR",
    region: "Northern Region",
    charterYear: "2022",
    charterDate: "9 April 2022",
    foundingPresident: "Jaya Ahuja and Veera Malawala",
    nasiPresidentAtCharter: "Achina Kundu",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge",
    motherClub: "SI Bangalore",
    focusAreas: ["Girls Scholarship Fund", "Women Crafts Bazaar", "Maternal Care"],
    description:
      "Chartered on 9 April 2022 by Founding Presidents Jaya Ahuja and Veera Malawala, NASI President Achina Kundu, Membership Officer Anitha Rajarajan, SIGBI Chartering President Cathy Cottridge, and Mother Club SI Bangalore. SI Delhi champions educational access, maternal healthcare interventions, and annual charity bazaars supporting regional craftswomen.",
    meetingSchedule: "Second Wednesday of every month at 5:00 PM IST",
    coordinatorPlaceholder: "Club Secretariat",
    emailPlaceholder: "si.delhi@nasi-india.org",
    sampleProjects: [
      {
        title: "Kalyani Memorial Girls Scholarships",
        description: "Tuition support for undergraduate women in arts, science, and nursing.",
        status: "Ongoing",
      },
      {
        title: "National Crafts Exhibition & Bazaar",
        description: "Annual fundraising showcase promoting women-led cooperative societies.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-leh",
    name: "SI Leh",
    city: "Leh",
    state: "Ladakh",
    region: "Northern Region",
    charterYear: "2022",
    charterDate: "16 July 2022",
    foundingPresident: "Sarla Chhewang",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge",
    motherClub: "SI Calcutta",
    focusAreas: ["High-Altitude Health", "Pashmina Women Spinners", "Eco-Tourism Training"],
    description:
      "Chartered on 16 July 2022 under Founding President Sarla Chhewang, Membership Officer Anitha Rajarajan, SIGBI Chartering President Cathy Cottridge, and Mother Club SI Calcutta. Serving the high-altitude Ladakh region, SI Leh promotes winter livelihoods, solar sanitation, and education for tribal youth.",
    meetingSchedule: "Second Saturday of every month at 3:00 PM IST",
    coordinatorPlaceholder: "Club Office",
    emailPlaceholder: "si.leh@nasi-india.org",
    sampleProjects: [
      {
        title: "Changthang Pashmina Spinners Welfare",
        description: "Solar lamps and ergonomic hand-spindles for nomadic Ladakhi women herders.",
        status: "Ongoing",
      },
      {
        title: "Winter Library Boxes for Remote Schools",
        description: "Bilingual English-Ladakhi reading collections for mountain villages during freeze-over months.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-srinagar-kashmir",
    name: "SI Srinagar, Kashmir",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    region: "Northern Region",
    charterYear: "2023",
    charterDate: "19 August 2023",
    foundingPresident: "Parveen",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge",
    motherClub: "SI Poona",
    focusAreas: ["Handicraft Artisans", "Post-Conflict Mental Health", "Girls Education"],
    description:
      "Chartered on 19 August 2023 by Founding President Parveen, Membership Officer Anitha Rajarajan, SIGBI Chartering President Cathy Cottridge, and Mother Club SI Poona. SI Srinagar empowers women across the Kashmir valley through artisanal training, psychological wellbeing programs, and educational scholarships.",
    meetingSchedule: "Third Thursday of every month at 3:30 PM IST",
    coordinatorPlaceholder: "Club Leadership",
    emailPlaceholder: "si.srinagar@nasi-india.org",
    sampleProjects: [
      {
        title: "Sozni & Aari Embroidery Collective",
        description: "Fair-trade cooperative marketing Kashmiri needlework directly to national buyers.",
        status: "Ongoing",
      },
      {
        title: "Mental Wellness & Grief Support Circles",
        description: "Certified counselor-led trauma and stress management sessions for conflict-affected mothers.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-guwahati",
    name: "SI Guwahati",
    city: "Guwahati",
    state: "Assam",
    region: "North Eastern Region",
    charterYear: "2024",
    charterDate: "2 October 2024",
    focusAreas: ["Eri Silk Weaver Livelihoods", "Flood Relief Health Camps", "Tribal Girl Literacy"],
    description:
      "Chartered on 2 October 2024 as the foremost Soroptimist club in Northeast India, SI Guwahati spearheads indigenous silk artisan training, flood resilient healthcare, and secondary education retention for girls across Assam.",
    meetingSchedule: "First Saturday of every month at 3:00 PM IST",
    coordinatorPlaceholder: "Club Office Bearers",
    emailPlaceholder: "si.guwahati@nasi-india.org",
    sampleProjects: [
      {
        title: "Brahmaputra Flood Relief Hygiene Kits",
        description: "Providing clean drinking tablets and sanitation kits to women in submerged riverine islands.",
        status: "Annual",
      },
      {
        title: "Eri Silk Spinning & Weaving Collective",
        description: "Capacity-building workshops preserving traditional non-violent silk production for tribal women.",
        status: "Ongoing",
      },
    ],
  },
];

// Chronological timeline from 1974 to 2024 (19 Chartered Clubs)
export const clubHistoricalTimeline: HistoricalTimelineItem[] = [
  {
    id: "1974-bombay-north",
    clubName: "SI Bombay North",
    slug: "si-bombay-north",
    charterDate: "2 September 1974",
    year: 1974,
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    foundingPresident: "Perin Bhiwandiwala",
    sigbiOfficer: "Dorothy Mackenzie White (SIGBI Chartering Officer)",
    isFirstInIndia: true,
    historicalNotes: "First Soroptimist club in India, established before NASI India came into being.",
  },
  {
    id: "1979-calcutta",
    clubName: "SI Calcutta",
    slug: "si-calcutta",
    charterDate: "27 October 1979",
    year: 1979,
    city: "Kolkata",
    state: "West Bengal",
    region: "Eastern Region",
    foundingPresident: "Aroti Dutta",
    sigbiOfficer: "Jean Wishart (SIGBI Chartering Officer)",
  },
  {
    id: "1987-burdwan",
    clubName: "SI Burdwan",
    slug: "si-burdwan",
    charterDate: "August 1987",
    year: 1987,
    city: "Burdwan",
    state: "West Bengal",
    region: "Eastern Region",
    foundingPresident: "Santanwana Sen",
    sigbiOfficer: "Katherine Fussel (Chartering President)",
  },
  {
    id: "1991-poona",
    clubName: "SI Poona",
    slug: "si-poona",
    charterDate: "8 April 1991",
    year: 1991,
    city: "Pune",
    state: "Maharashtra",
    region: "Western Region",
    historicalNotes: "Mother Club to SI Bangalore (2004) and SI Srinagar, Kashmir (2023).",
  },
  {
    id: "1992-bombay-west",
    clubName: "SI Bombay West",
    slug: "si-bombay-west",
    charterDate: "September 1992",
    year: 1992,
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
  },
  {
    id: "1997-bombay-chembur",
    clubName: "SI Bombay Chembur",
    slug: "si-bombay-chembur",
    charterDate: "2 March 1997",
    year: 1997,
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    foundingPresident: "Daphne Pillai",
    sigbiOfficer: "Olive R. Newton (SIGBI President)",
    motherClub: "Soroptimist International of Colaba",
    charterStatusNote: "Charter date recorded as 2 March 1997 (requires confirmation against initial timeline notes).",
  },
  {
    id: "1998-chennai",
    clubName: "SI Chennai",
    slug: "si-chennai",
    charterDate: "14 December 1998",
    year: 1998,
    city: "Chennai",
    state: "Tamil Nadu",
    region: "Southern Region",
  },
  {
    id: "2002-chennai-downtown",
    clubName: "SI Chennai Downtown",
    slug: "si-cd",
    charterDate: "September 2002",
    year: 2002,
    city: "Chennai",
    state: "Tamil Nadu",
    region: "Southern Region",
    historicalNotes: "Mother Club to SI Madurai (2010).",
  },
  {
    id: "2004-bangalore",
    clubName: "SI Bangalore",
    slug: "si-bangalore",
    charterDate: "10 January 2004",
    year: 2004,
    city: "Bengaluru",
    state: "Karnataka",
    region: "Southern Region",
    foundingPresident: "Dr. Nalini Subbiah",
    nasiPresidentAtCharter: "Sheela Rao",
    sigbiOfficer: "Jacqueline Mosedale (SIGBI President)",
    motherClub: "SI Poona",
  },
  {
    id: "2006-south-kolkata",
    clubName: "SI South Kolkata",
    slug: "si-south-kolkata",
    charterDate: "21 September 2006",
    year: 2006,
    city: "Kolkata",
    state: "West Bengal",
    region: "Eastern Region",
  },
  {
    id: "2010-pune-metro-east",
    clubName: "SI Pune Metro East",
    slug: "si-pune-metro-east",
    charterDate: "31 January 2010",
    year: 2010,
    city: "Pune",
    state: "Maharashtra",
    region: "Western Region",
  },
  {
    id: "2010-madurai",
    clubName: "SI Madurai",
    slug: "si-madurai",
    charterDate: "14 September 2010",
    year: 2010,
    city: "Madurai",
    state: "Tamil Nadu",
    region: "Southern Region",
    foundingPresident: "Anitha Rajarajan",
    nasiMembershipOfficer: "Annette",
    motherClub: "SI Chennai Downtown",
    historicalNotes: "Mother Club to SI Coimbatore (2021) and SI Kochi (2021).",
  },
  {
    id: "2015-whitefield",
    clubName: "SI Whitefield",
    slug: "si-whitefield",
    charterDate: "August 2015",
    year: 2015,
    city: "Bengaluru",
    state: "Karnataka",
    region: "Southern Region",
  },
  {
    id: "2021-coimbatore",
    clubName: "SI Coimbatore",
    slug: "si-coimbatore",
    charterDate: "6 September 2021",
    year: 2021,
    city: "Coimbatore",
    state: "Tamil Nadu",
    region: "Southern Region",
    foundingPresident: "Surekha Shekhar",
    nasiPresidentAtCharter: "Achina Kundu",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge (SIGBI Chartering President)",
    motherClub: "SI Madurai",
    historicalNotes: "Revived in 2024 by Kavitha Ramesh, who took over as President.",
  },
  {
    id: "2021-kochi",
    clubName: "SI Kochi",
    slug: "si-kochi",
    charterDate: "9 September 2021",
    year: 2021,
    city: "Kochi",
    state: "Kerala",
    region: "Southern Region",
    foundingPresident: "Dr. Beena Ravikumar",
    nasiPresidentAtCharter: "Achina Kundu",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge (SIGBI Chartering President)",
    motherClub: "SI Madurai",
  },
  {
    id: "2022-delhi",
    clubName: "SI Delhi",
    slug: "si-delhi",
    charterDate: "9 April 2022",
    year: 2022,
    city: "New Delhi",
    state: "Delhi NCR",
    region: "Northern Region",
    foundingPresident: "Jaya Ahuja and Veera Malawala",
    nasiPresidentAtCharter: "Achina Kundu",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge (SIGBI Chartering President)",
    motherClub: "SI Bangalore",
  },
  {
    id: "2022-leh",
    clubName: "SI Leh",
    slug: "si-leh",
    charterDate: "16 July 2022",
    year: 2022,
    city: "Leh",
    state: "Ladakh",
    region: "Northern Region",
    foundingPresident: "Sarla Chhewang",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge (SIGBI Chartering President)",
    motherClub: "SI Calcutta",
  },
  {
    id: "2023-srinagar",
    clubName: "SI Srinagar, Kashmir",
    slug: "si-srinagar-kashmir",
    charterDate: "19 August 2023",
    year: 2023,
    city: "Srinagar",
    state: "Jammu & Kashmir",
    region: "Northern Region",
    foundingPresident: "Parveen",
    nasiMembershipOfficer: "Anitha Rajarajan",
    sigbiOfficer: "Cathy Cottridge (SIGBI Chartering President)",
    motherClub: "SI Poona",
  },
  {
    id: "2024-guwahati",
    clubName: "SI Guwahati",
    slug: "si-guwahati",
    charterDate: "2 October 2024",
    year: 2024,
    city: "Guwahati",
    state: "Assam",
    region: "North Eastern Region",
  },
];

// Administrative Content Checklist for information still required
export const adminHistoricalChecklist: MissingInfoChecklistItem[] = [
  {
    clubName: "SI Poona",
    slug: "si-poona",
    charterDate: "8 April 1991",
    informationRequired: ["Founder member count", "Mother Club", "NASI Membership Officer(s)"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Bombay West",
    slug: "si-bombay-west",
    charterDate: "September 1992",
    informationRequired: ["Founder member count", "NASI Membership Officer(s)", "NASI President(s)", "SIGBI Chartering Officer"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Bombay Chembur",
    slug: "si-bombay-chembur",
    charterDate: "2 March 1997 / November 1997",
    informationRequired: ["Founder member count", "NASI Membership Officer(s)", "NASI President(s)", "Resolution of March vs November 1997 charter date"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Chennai",
    slug: "si-chennai",
    charterDate: "14 December 1998",
    informationRequired: ["NASI Membership Officer(s)", "NASI President(s)", "SIGBI Chartering Officer"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Chennai Downtown",
    slug: "si-cd",
    charterDate: "September 2002",
    informationRequired: ["NASI Membership Officer(s)", "SIGBI Chartering Officer"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Bangalore",
    slug: "si-bangalore",
    charterDate: "10 January 2004",
    informationRequired: ["NASI Membership Officer(s)"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI South Kolkata",
    slug: "si-south-kolkata",
    charterDate: "21 September 2006",
    informationRequired: ["NASI Membership Officer(s)", "NASI President(s)"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Pune Metro East",
    slug: "si-pune-metro-east",
    charterDate: "31 January 2010",
    informationRequired: ["NASI Membership Officer(s)", "NASI President(s)"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Madurai",
    slug: "si-madurai",
    charterDate: "14 September 2010",
    informationRequired: ["NASI President(s)", "SIGBI Chartering Officer"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Whitefield",
    slug: "si-whitefield",
    charterDate: "August 2015",
    informationRequired: ["NASI Membership Officer(s)"],
    verificationStatus: "Pending Verification",
  },
  {
    clubName: "SI Coimbatore",
    slug: "si-coimbatore",
    charterDate: "6 September 2021",
    informationRequired: ["Founder member count"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Kochi",
    slug: "si-kochi",
    charterDate: "9 September 2021",
    informationRequired: ["Founder member count"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Delhi",
    slug: "si-delhi",
    charterDate: "9 April 2022",
    informationRequired: ["Founder member count"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Leh",
    slug: "si-leh",
    charterDate: "16 July 2022",
    informationRequired: ["Founder member count", "NASI President(s)"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Srinagar, Kashmir",
    slug: "si-srinagar-kashmir",
    charterDate: "19 August 2023",
    informationRequired: ["Founder member count", "NASI President(s)"],
    verificationStatus: "Partially Verified",
  },
  {
    clubName: "SI Guwahati",
    slug: "si-guwahati",
    charterDate: "2 October 2024",
    informationRequired: ["NASI Membership Officer(s)"],
    verificationStatus: "Pending Verification",
  },
];

export function getAllClubs(): Club[] {
  return initialClubs;
}

export function getClubBySlug(slug: string): Club | undefined {
  if (slug === "si-cd" || slug === "si-chennai-downtown") {
    return initialClubs.find((c) => c.slug === "si-cd" || c.slug === "si-chennai-downtown");
  }
  return initialClubs.find((c) => c.slug === slug);
}
