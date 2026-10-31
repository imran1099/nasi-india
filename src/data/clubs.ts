export interface Club {
  slug: string;
  name: string;
  city: string;
  state: string;
  region: "Northern Region" | "Southern Region" | "Western Region" | "Eastern Region" | "North Eastern Region";
  charterYear: string;
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

export const initialClubs: Club[] = [
  {
    slug: "si-kochi",
    name: "SI Kochi",
    city: "Kochi",
    state: "Kerala",
    region: "Southern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Coastal Women Livelihoods", "Health & Hygiene Drives", "Girls Education"],
    description:
      "SI Kochi unites women professionals across the Ernakulam and greater Kochi area to implement community health workshops, literacy assistance, and economic resilience programmes for coastal communities.",
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
    slug: "si-pune-metro-east",
    name: "SI Pune Metro East",
    city: "Pune",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["STEM Mentorship", "Adolescent Health", "Environmental Conservation"],
    description:
      "Active in eastern Pune and adjacent industrial belts, SI Pune Metro East supports young girls in technical education, organizes maternal health check-ups, and champions waste management initiatives.",
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
    slug: "si-south-kolkata",
    name: "SI South Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    region: "Eastern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Primary Girl Literacy", "Artisan Micro-Finance", "Elderly Women Care"],
    description:
      "SI South Kolkata advocates for marginalized women and girls in southern Kolkata districts, promoting traditional craft preservation, micro-enterprise training, and adult literacy centres.",
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
    slug: "si-bangalore",
    name: "SI Bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    region: "Southern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Higher Education Scholarships", "Maternal Nutrition", "Digital Literacy"],
    description:
      "One of the cornerstone clubs of southern India, SI Bangalore brings together leaders from tech, academia, and healthcare to empower girls pursuing STEM and vocational degrees.",
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
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-guwahati",
    name: "SI Guwahati",
    city: "Guwahati",
    state: "Assam",
    region: "North Eastern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Handloom Weaver Support", "Flood Relief & Health", "Girl Child Welfare"],
    description:
      "Representing the Brahmaputra valley, SI Guwahati focuses on indigenous women weavers, health access during monsoon crises, and educational infrastructure in rural Kamrup.",
    meetingSchedule: "Third Saturday of every month at 3:00 PM IST",
    coordinatorPlaceholder: "Club Coordinator",
    emailPlaceholder: "si.guwahati@nasi-india.org",
    sampleProjects: [
      {
        title: "Weaver Empowerment & Yarn Subsidy Support",
        description: "Providing modern looms, organic dye workshops, and market linkages for women weavers.",
        status: "Ongoing",
      },
      {
        title: "Mobile Health Camps in Riverine Belts",
        description: "Preventative healthcare, clean birthing kits, and immunization awareness.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-burdwan",
    name: "SI Burdwan",
    city: "Bardhaman",
    state: "West Bengal",
    region: "Eastern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Rural Sanitation", "Early Marriage Prevention", "Vocational Training"],
    description:
      "Active across Bardhaman district, SI Burdwan works directly with village panchayats to promote girl child schooling, menstrual hygiene awareness, and youth vocational skills.",
    meetingSchedule: "Second Sunday of every month at 10:30 AM IST",
    coordinatorPlaceholder: "Club Secretary",
    emailPlaceholder: "si.burdwan@nasi-india.org",
    sampleProjects: [
      {
        title: "Kanya Suraksha Awareness Workshops",
        description: "Community counseling camps for parents and girls on the importance of completing secondary school.",
        status: "Ongoing",
      },
      {
        title: "Sanitary Pad Dispenser Installation",
        description: "Equipping rural high schools with clean sanitation infrastructure.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-chennai",
    name: "SI Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Palliative Care Support", "Urban Slum Education", "Women's Legal Literacy"],
    description:
      "SI Chennai brings together women leaders across medical, legal, and educational professions to provide community counseling, palliative care volunteering, and legal rights workshops.",
    meetingSchedule: "Second Tuesday of every month at 5:30 PM IST",
    coordinatorPlaceholder: "Club Office Bearers",
    emailPlaceholder: "si.chennai@nasi-india.org",
    sampleProjects: [
      {
        title: "Neethi Legal Literacy for Women",
        description: "Free legal awareness clinics regarding domestic rights, property inheritance, and workplace safety.",
        status: "Ongoing",
      },
      {
        title: "Cancer Awareness & Early Screening Camps",
        description: "Camps organized in collaboration with regional oncology institutes.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-madurai",
    name: "SI Madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Rural Women Entrepreneurship", "Girl Child Education", "Heritage Crafts"],
    description:
      "Rooted in the cultural capital of Tamil Nadu, SI Madurai supports young girls through educational sponsorship and enables rural women to establish sustainable self-help groups.",
    meetingSchedule: "First Thursday of every month at 6:00 PM IST",
    coordinatorPlaceholder: "Club President",
    emailPlaceholder: "si.madurai@nasi-india.org",
    sampleProjects: [
      {
        title: "Self-Help Group Micro-Enterprise Incubator",
        description: "Training rural women in food processing, packaging, and financial bookkeeping.",
        status: "Ongoing",
      },
      {
        title: "School Library Enrichment Project",
        description: "Donating bilingual books and reference materials to government high schools.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-bombay-north",
    name: "SI Bombay North",
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Skill Development", "Community Nutrition", "Elder Care"],
    description:
      "Serving northern Mumbai suburbs, SI Bombay North organizes community health interventions, vocational training in culinary and craft arts, and support for senior women living alone.",
    meetingSchedule: "Third Tuesday of every month at 4:30 PM IST",
    coordinatorPlaceholder: "Club Liaison",
    emailPlaceholder: "si.bombaynorth@nasi-india.org",
    sampleProjects: [
      {
        title: "Poshan Community Kitchens",
        description: "Nutritious meal supplement kits for expectant mothers in suburban settlements.",
        status: "Ongoing",
      },
      {
        title: "Senior Citizens Care Circles",
        description: "Weekly companion visits, medical check-ups, and recreational programs for elderly women.",
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
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Girls Remedial Education", "Vocational Training", "Mother & Child Health"],
    description:
      "With a proud history of community service in Kolkata, SI Calcutta supports child protection, remedial coaching for vulnerable girls, and livelihood training for destitute women.",
    meetingSchedule: "Second Saturday of every month at 3:30 PM IST",
    coordinatorPlaceholder: "Club Secretary",
    emailPlaceholder: "si.calcutta@nasi-india.org",
    sampleProjects: [
      {
        title: "Aalo Remedial Coaching Centres",
        description: "Daily after-school tutoring for first-generation school-going girls.",
        status: "Ongoing",
      },
      {
        title: "Bakery & Culinary Vocational Training",
        description: "Certifying young women from care shelters in commercial baking and hospitality.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-srinagar-kashmir",
    name: "SI Srinagar Kashmir",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    region: "Northern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Kashmiri Craft Preservation", "Winter Warmth Drives", "Women Mental Wellness"],
    description:
      "Operating in the Kashmir valley, SI Srinagar Kashmir fosters women-led artisanal collectives in Sozni and Pashmina embroidery while providing mental health counseling and winter aid.",
    meetingSchedule: "First Monday of every month at 2:00 PM IST",
    coordinatorPlaceholder: "Regional Coordinator",
    emailPlaceholder: "si.srinagarkashmir@nasi-india.org",
    sampleProjects: [
      {
        title: "Kashmiri Artisan Revival Network",
        description: "Supporting women needleworkers with direct supply chains and fair wages.",
        status: "Ongoing",
      },
      {
        title: "Winter Relief Kits for Remote Hamlets",
        description: "Distribution of thermals, heating essentials, and medicine in high-altitude villages.",
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
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["High-Altitude Health", "Nomadic Girls Education", "Eco-Tourism Training"],
    description:
      "SI Leh champions educational accessibility and healthcare awareness for women in high-altitude Himalayan communities, including Changthang and Sham valley.",
    meetingSchedule: "Last Saturday of every month at 11:00 AM IST",
    coordinatorPlaceholder: "Club Convener",
    emailPlaceholder: "si.leh@nasi-india.org",
    sampleProjects: [
      {
        title: "Solar-Powered Hostel Study Centers",
        description: "Equipping residential hostels for nomadic schoolgirls with continuous solar lighting.",
        status: "Ongoing",
      },
      {
        title: "Ladakhi Women Homestay & Eco-Guides",
        description: "Training rural women in sustainable hospitality, hygiene, and birding guide skills.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-coimbatore",
    name: "SI Coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    region: "Southern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Textile Worker Welfare", "Eco-Sanitation", "STEM for Rural Girls"],
    description:
      "Serving the industrial and textile hub of western Tamil Nadu, SI Coimbatore empowers women garment workers and sponsors digital classrooms in rural primary schools.",
    meetingSchedule: "Third Thursday of every month at 5:00 PM IST",
    coordinatorPlaceholder: "Club Leadership",
    emailPlaceholder: "si.coimbatore@nasi-india.org",
    sampleProjects: [
      {
        title: "Smart Classroom for Village School",
        description: "Installation of computer lab and audio-visual learning equipment in Pollachi block.",
        status: "Completed",
      },
      {
        title: "Women Weaver Health & Ergonomics",
        description: "Physiotherapy camps and eye screening for handloom and powerloom workers.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-bombay-west",
    name: "SI Bombay West",
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Special Needs Education", "Women's Mental Health", "Green Communities"],
    description:
      "Covering western Mumbai from Bandra to Andheri, SI Bombay West collaborates with special educators, vocational workshops, and environmental NGOs for inclusive growth.",
    meetingSchedule: "First Wednesday of every month at 5:00 PM IST",
    coordinatorPlaceholder: "Club Office",
    emailPlaceholder: "si.bombaywest@nasi-india.org",
    sampleProjects: [
      {
        title: "Vocational Art for Neurodivergent Girls",
        description: "Creating micro-earning avenues through printed stationery and craft design.",
        status: "Ongoing",
      },
      {
        title: "Mental Health First Aid Workshops",
        description: "Workshops for college students and frontline social workers.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-poona",
    name: "SI Poona",
    city: "Pune",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Heritage Preservation", "Girl Child Athletics", "Vocational Sewing"],
    description:
      "One of the historic chapters in Maharashtra, SI Poona encourages young female athletes from municipal schools and trains underprivileged women in tailoring and fashion trade.",
    meetingSchedule: "Second Thursday of every month at 4:00 PM IST",
    coordinatorPlaceholder: "Club President",
    emailPlaceholder: "si.poona@nasi-india.org",
    sampleProjects: [
      {
        title: "Udaan Girls Athletic Support Program",
        description: "Providing sportswear, coaching stipends, and nutrition kits for state-level runners.",
        status: "Ongoing",
      },
      {
        title: "Certified Garment Construction Academy",
        description: "Government-recognized 6-month skill program for women seeking formal factory jobs.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-bombay-chembur",
    name: "SI Bombay Chembur",
    city: "Mumbai",
    state: "Maharashtra",
    region: "Western Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Community Sanitation", "Adolescent Education", "Micro-Finance"],
    description:
      "Active in eastern Mumbai, SI Bombay Chembur partners with local communities on clean water accessibility, secondary school tutoring, and self-help group micro-financing.",
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
    slug: "si-cd",
    name: "SI CD",
    city: "Central Delhi",
    state: "Delhi NCR",
    region: "Northern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Public Policy Advocacy", "Women in Law & Administration", "Youth Mentoring"],
    description:
      "Based in the national capital territory, SI CD focuses on policy seminars, legal advocacy for gender equity, and leadership mentorship for college students.",
    meetingSchedule: "Fourth Saturday of every month at 11:30 AM IST",
    coordinatorPlaceholder: "Club Secretary",
    emailPlaceholder: "si.cd@nasi-india.org",
    sampleProjects: [
      {
        title: "National Policy Roundtables on Women Safety",
        description: "Annual multi-stakeholder symposium with civil society and administrative leaders.",
        status: "Annual",
      },
      {
        title: "Young Women Leaders Fellowship",
        description: "Stipends and mentorship for university students researching women's labor participation.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-whitefield",
    name: "SI Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    region: "Southern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Tech Inclusion", "Urban Slum Health", "Waste Recyclers Support"],
    description:
      "Situated in Bengaluru's technology corridor, SI Whitefield bridges corporate mentorship with grassroots community service for waste worker families and government schools.",
    meetingSchedule: "First Friday of every month at 6:30 PM IST",
    coordinatorPlaceholder: "Club Office Bearers",
    emailPlaceholder: "si.whitefield@nasi-india.org",
    sampleProjects: [
      {
        title: "Healthcare Shield for Informal Waste Workers",
        description: "Regular occupational health checkups, tetanus vaccinations, and protective gear distribution.",
        status: "Ongoing",
      },
      {
        title: "STEM Kits for Government High Schools",
        description: "Hands-on robotics and physics demonstration kits for middle-school girls.",
        status: "Completed",
      },
    ],
  },
  {
    slug: "si-delhi",
    name: "SI Delhi",
    city: "New Delhi",
    state: "Delhi NCR",
    region: "Northern Region",
    charterYear: "Chartered Club (Sample)",
    focusAreas: ["Girls Scholarship Fund", "Women Crafts Bazaar", "Maternal Care"],
    description:
      "A veteran club in northern India, SI Delhi champions educational access, maternal healthcare interventions, and annual charity bazaars supporting regional craftswomen.",
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
];

export function getAllClubs(): Club[] {
  return initialClubs;
}

export function getClubBySlug(slug: string): Club | undefined {
  return initialClubs.find((c) => c.slug === slug);
}
