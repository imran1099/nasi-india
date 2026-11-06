/**
 * Prisma Seed Script
 * -----------------
 * Seeds the database with:
 *  - 19 NASI India clubs (real names, stable slugs, sample/placeholder content)
 *  - Sample club projects for each club
 *  - News categories
 *  - Sample news articles (PUBLISHED)
 *  - Sample events (PUBLISHED, future-dated)
 *  - Committee members (sample placeholders)
 *  - External resources (Soroptimist SI links)
 *  - Site settings
 *
 * Run with:  npx prisma db seed
 *
 * SAFETY: All upserts are idempotent — safe to re-run without duplicates.
 * Does NOT delete any existing records before inserting.
 *
 * All contact details, names, and biographical information are clearly
 * labeled as sample/placeholder data. No real personal information is used.
 */

import { PrismaClient, Region, PublishStatus, EventType } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Club seed data — real NASI India club names, sample content
// ---------------------------------------------------------------------------

const clubSeedData = [
  {
    slug: "si-kochi",
    name: "SI Kochi",
    city: "Kochi",
    state: "Kerala",
    region: Region.SOUTHERN_REGION,
    focusAreas: ["Coastal Women Livelihoods", "Health & Hygiene Drives", "Girls Education"],
    description:
      "SI Kochi unites women professionals across the Ernakulam and greater Kochi area to implement community health workshops, literacy assistance, and economic resilience programmes for coastal communities.",
    meetingSchedule: "Second Saturday of every month (Hybrid: Kochi Club Office & Virtual)",
    email: "si.kochi@nasi-india.org",
    displayOrder: 1,
    projects: [
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
    region: Region.WESTERN_REGION,
    focusAreas: ["STEM Mentorship", "Adolescent Health", "Environmental Conservation"],
    description:
      "Active in eastern Pune and adjacent industrial belts, SI Pune Metro East supports young girls in technical education, organises maternal health check-ups, and champions waste management initiatives.",
    meetingSchedule: "Third Wednesday of every month at 6:00 PM IST",
    email: "si.punemetroeast@nasi-india.org",
    displayOrder: 2,
    projects: [
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
    region: Region.EASTERN_REGION,
    focusAreas: ["Primary Girl Literacy", "Artisan Micro-Finance", "Elderly Women Care"],
    description:
      "SI South Kolkata advocates for marginalised women and girls in southern Kolkata districts, promoting traditional craft preservation, micro-enterprise training, and adult literacy centres.",
    meetingSchedule: "First Sunday of every month at 11:00 AM IST",
    email: "si.southkolkata@nasi-india.org",
    displayOrder: 3,
    projects: [
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
    region: Region.SOUTHERN_REGION,
    focusAreas: ["Higher Education Scholarships", "Maternal Nutrition", "Digital Literacy"],
    description:
      "One of the cornerstone clubs of southern India, SI Bangalore brings together leaders from tech, academia, and healthcare to empower girls pursuing STEM and vocational degrees.",
    meetingSchedule: "First Saturday of every month at 4:30 PM IST",
    email: "si.bangalore@nasi-india.org",
    displayOrder: 4,
    projects: [
      {
        title: "Vidya Jyothi Higher Education Scholarships",
        description: "Need-cum-merit educational grants for girls enrolled in degree colleges.",
        status: "Ongoing",
      },
      {
        title: "Adolescent Nutrition & Anemia Screening",
        description: "Comprehensive health and haemoglobin testing camps across municipal schools.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-guwahati",
    name: "SI Guwahati",
    city: "Guwahati",
    state: "Assam",
    region: Region.NORTH_EASTERN_REGION,
    focusAreas: ["Handloom Weaver Support", "Flood Relief & Health", "Girl Child Welfare"],
    description:
      "Representing the Brahmaputra valley, SI Guwahati focuses on indigenous women weavers, health access during monsoon crises, and educational infrastructure in rural Kamrup.",
    meetingSchedule: "Third Saturday of every month at 3:00 PM IST",
    email: "si.guwahati@nasi-india.org",
    displayOrder: 5,
    projects: [
      {
        title: "Weaver Empowerment & Yarn Subsidy Support",
        description: "Providing modern looms, organic dye workshops, and market linkages for women weavers.",
        status: "Ongoing",
      },
      {
        title: "Mobile Health Camps in Riverine Belts",
        description: "Preventative healthcare, clean birthing kits, and immunisation awareness.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-burdwan",
    name: "SI Burdwan",
    city: "Bardhaman",
    state: "West Bengal",
    region: Region.EASTERN_REGION,
    focusAreas: ["Rural Sanitation", "Early Marriage Prevention", "Vocational Training"],
    description:
      "Active across Bardhaman district, SI Burdwan works directly with village panchayats to promote girl child schooling, menstrual hygiene awareness, and youth vocational skills.",
    meetingSchedule: "Second Sunday of every month at 10:30 AM IST",
    email: "si.burdwan@nasi-india.org",
    displayOrder: 6,
    projects: [
      {
        title: "Kanya Suraksha Awareness Workshops",
        description: "Community counselling camps for parents and girls on completing secondary school.",
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
    region: Region.SOUTHERN_REGION,
    focusAreas: ["Palliative Care Support", "Urban Slum Education", "Women's Legal Literacy"],
    description:
      "SI Chennai brings together women leaders across medical, legal, and educational professions to provide community counselling, palliative care volunteering, and legal rights workshops.",
    meetingSchedule: "Second Tuesday of every month at 5:30 PM IST",
    email: "si.chennai@nasi-india.org",
    displayOrder: 7,
    projects: [
      {
        title: "Neethi Legal Literacy for Women",
        description: "Free legal awareness clinics regarding domestic rights, property inheritance, and workplace safety.",
        status: "Ongoing",
      },
      {
        title: "Cancer Awareness & Early Screening Camps",
        description: "Camps organised in collaboration with regional oncology institutes.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-madurai",
    name: "SI Madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    region: Region.SOUTHERN_REGION,
    focusAreas: ["Rural Women Entrepreneurship", "Girl Child Education", "Heritage Crafts"],
    description:
      "Rooted in the cultural capital of Tamil Nadu, SI Madurai supports young girls through educational sponsorship and enables rural women to establish sustainable self-help groups.",
    meetingSchedule: "First Thursday of every month at 6:00 PM IST",
    email: "si.madurai@nasi-india.org",
    displayOrder: 8,
    projects: [
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
    region: Region.WESTERN_REGION,
    focusAreas: ["Skill Development", "Community Nutrition", "Elder Care"],
    description:
      "Serving northern Mumbai suburbs, SI Bombay North organises community health interventions, vocational training in culinary and craft arts, and support for senior women living alone.",
    meetingSchedule: "Third Tuesday of every month at 4:30 PM IST",
    email: "si.bombaynorth@nasi-india.org",
    displayOrder: 9,
    projects: [
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
    region: Region.EASTERN_REGION,
    focusAreas: ["Girls Remedial Education", "Vocational Training", "Mother & Child Health"],
    description:
      "With a proud history of community service in Kolkata, SI Calcutta supports child protection, remedial coaching for vulnerable girls, and livelihood training for destitute women.",
    meetingSchedule: "Second Saturday of every month at 3:30 PM IST",
    email: "si.calcutta@nasi-india.org",
    displayOrder: 10,
    projects: [
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
    region: Region.NORTHERN_REGION,
    focusAreas: ["Kashmiri Craft Preservation", "Winter Warmth Drives", "Women Mental Wellness"],
    description:
      "Operating in the Kashmir valley, SI Srinagar Kashmir fosters women-led artisanal collectives in Sozni and Pashmina embroidery while providing mental health counselling and winter aid.",
    meetingSchedule: "First Monday of every month at 2:00 PM IST",
    email: "si.srinagarkashmir@nasi-india.org",
    displayOrder: 11,
    projects: [
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
    region: Region.NORTHERN_REGION,
    focusAreas: ["High-Altitude Health", "Nomadic Girls Education", "Eco-Tourism Training"],
    description:
      "SI Leh champions educational accessibility and healthcare awareness for women in high-altitude Himalayan communities, including Changthang and Sham valley.",
    meetingSchedule: "Last Saturday of every month at 11:00 AM IST",
    email: "si.leh@nasi-india.org",
    displayOrder: 12,
    projects: [
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
    region: Region.SOUTHERN_REGION,
    focusAreas: ["Textile Worker Welfare", "Eco-Sanitation", "STEM for Rural Girls"],
    description:
      "Serving the industrial and textile hub of western Tamil Nadu, SI Coimbatore empowers women garment workers and sponsors digital classrooms in rural primary schools.",
    meetingSchedule: "Third Thursday of every month at 5:00 PM IST",
    email: "si.coimbatore@nasi-india.org",
    displayOrder: 13,
    projects: [
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
    region: Region.WESTERN_REGION,
    focusAreas: ["Special Needs Education", "Women's Mental Health", "Green Communities"],
    description:
      "Covering western Mumbai from Bandra to Andheri, SI Bombay West collaborates with special educators, vocational workshops, and environmental NGOs for inclusive growth.",
    meetingSchedule: "First Wednesday of every month at 5:00 PM IST",
    email: "si.bombaywest@nasi-india.org",
    displayOrder: 14,
    projects: [
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
    region: Region.WESTERN_REGION,
    focusAreas: ["Heritage Preservation", "Girl Child Athletics", "Vocational Sewing"],
    description:
      "One of the historic chapters in Maharashtra, SI Poona encourages young female athletes from municipal schools and trains underprivileged women in tailoring and fashion trade.",
    meetingSchedule: "Second Thursday of every month at 4:00 PM IST",
    email: "si.poona@nasi-india.org",
    displayOrder: 15,
    projects: [
      {
        title: "Udaan Girls Athletic Support Program",
        description: "Providing sportswear, coaching stipends, and nutrition kits for state-level runners.",
        status: "Ongoing",
      },
      {
        title: "Certified Garment Construction Academy",
        description: "Government-recognised 6-month skill program for women seeking formal factory jobs.",
        status: "Annual",
      },
    ],
  },
  {
    slug: "si-bombay-chembur",
    name: "SI Bombay Chembur",
    city: "Mumbai",
    state: "Maharashtra",
    region: Region.WESTERN_REGION,
    focusAreas: ["Community Sanitation", "Adolescent Education", "Micro-Finance"],
    description:
      "Active in eastern Mumbai, SI Bombay Chembur partners with local communities on clean water accessibility, secondary school tutoring, and self-help group micro-financing.",
    meetingSchedule: "Third Saturday of every month at 4:00 PM IST",
    email: "si.chembur@nasi-india.org",
    displayOrder: 16,
    projects: [
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
    region: Region.NORTHERN_REGION,
    focusAreas: ["Public Policy Advocacy", "Women in Law & Administration", "Youth Mentoring"],
    description:
      "Based in the national capital territory, SI CD focuses on policy seminars, legal advocacy for gender equity, and leadership mentorship for college students.",
    meetingSchedule: "Fourth Saturday of every month at 11:30 AM IST",
    email: "si.cd@nasi-india.org",
    displayOrder: 17,
    projects: [
      {
        title: "National Policy Roundtables on Women Safety",
        description: "Annual multi-stakeholder symposium with civil society and administrative leaders.",
        status: "Annual",
      },
      {
        title: "Young Women Leaders Fellowship",
        description: "Stipends and mentorship for university students researching women's labour participation.",
        status: "Ongoing",
      },
    ],
  },
  {
    slug: "si-whitefield",
    name: "SI Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    region: Region.SOUTHERN_REGION,
    focusAreas: ["Tech Inclusion", "Urban Slum Health", "Waste Recyclers Support"],
    description:
      "Situated in Bengaluru's technology corridor, SI Whitefield bridges corporate mentorship with grassroots community service for waste worker families and government schools.",
    meetingSchedule: "First Friday of every month at 6:30 PM IST",
    email: "si.whitefield@nasi-india.org",
    displayOrder: 18,
    projects: [
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
    region: Region.NORTHERN_REGION,
    focusAreas: ["Girls Scholarship Fund", "Women Crafts Bazaar", "Maternal Care"],
    description:
      "A veteran club in northern India, SI Delhi champions educational access, maternal healthcare interventions, and annual charity bazaars supporting regional craftswomen.",
    meetingSchedule: "Second Wednesday of every month at 5:00 PM IST",
    email: "si.delhi@nasi-india.org",
    displayOrder: 19,
    projects: [
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

// ---------------------------------------------------------------------------
// Sample news categories
// ---------------------------------------------------------------------------

const newsCategoriesData = [
  { slug: "announcements", name: "Announcements" },
  { slug: "club-activities", name: "Club Activities" },
  { slug: "international", name: "International" },
  { slug: "awards", name: "Awards & Recognition" },
];

// ---------------------------------------------------------------------------
// Sample news articles (PUBLISHED — clearly labeled as sample)
// ---------------------------------------------------------------------------

const newsArticlesData = [
  {
    slug: "nasi-india-annual-general-meeting-2025",
    title: "[Sample] NASI India Annual General Meeting 2025",
    excerpt:
      "The National Association of Soroptimist International of India convened its Annual General Meeting to review the year's achievements and chart the course for the coming year.",
    content:
      "[SAMPLE CONTENT — replace with official content before publishing]\n\nThe Annual General Meeting of NASI India brought together club presidents and delegates from all 19 affiliated clubs across India. Key agenda items included the review of the national action plan, election of office bearers for the next term, and the launch of new signature programs aligned with Soroptimist International's global priority areas.\n\nDetailed minutes will be circulated to all member clubs separately.",
    authorName: "NASI India Secretariat (Sample)",
    tags: ["AGM", "Governance", "Annual Meeting"],
    categorySlug: "announcements",
    publishedAt: new Date("2025-09-15T10:00:00Z"),
  },
  {
    slug: "si-bangalore-vidya-jyothi-scholarship-2025",
    title: "[Sample] SI Bangalore Awards Vidya Jyothi Scholarships to 20 Girls",
    excerpt:
      "The SI Bangalore club celebrated the award of its annual Vidya Jyothi scholarships to 20 meritorious girls from low-income families pursuing higher education.",
    content:
      "[SAMPLE CONTENT — replace with official content before publishing]\n\nSI Bangalore concluded its scholarship selection process for the academic year 2025–26. Twenty girls studying in degree colleges across Bengaluru were selected based on a combination of academic performance and financial need.\n\nThe scholarship covers tuition fees and a monthly stipend for study materials. Details of individual recipients have been withheld for privacy.",
    authorName: "SI Bangalore (Sample)",
    tags: ["Scholarships", "Education", "Bangalore"],
    categorySlug: "club-activities",
    publishedAt: new Date("2025-10-01T10:00:00Z"),
  },
  {
    slug: "si-international-federation-conference-2025",
    title: "[Sample] Indian Delegates Participate in SI Federation Conference",
    excerpt:
      "Representatives from NASI India participated in the biennial Soroptimist International Federation Conference, presenting India's national program contributions.",
    content:
      "[SAMPLE CONTENT — replace with official content before publishing]\n\nNASI India delegates attended the Soroptimist International Federation Conference held at the SI headquarters. India's contributions to the global SIGBI priority areas — Education, Empowerment, and Enabling Environment — were presented by the national president.\n\nFull conference proceedings are available on the SI Federation website.",
    authorName: "NASI India Secretariat (Sample)",
    tags: ["International", "Federation", "Conference"],
    categorySlug: "international",
    publishedAt: new Date("2025-10-10T10:00:00Z"),
  },
];

// ---------------------------------------------------------------------------
// Sample events (PUBLISHED — clearly labeled as sample, future-dated)
// ---------------------------------------------------------------------------

const eventsData = [
  {
    slug: "nasi-india-national-conference-2026",
    title: "[Sample] NASI India National Conference 2026",
    description:
      "The annual national conference of NASI India brings together delegates from all member clubs for two days of workshops, plenary sessions, and networking.",
    content:
      "[SAMPLE CONTENT — replace with official details before publishing]\n\nThe NASI India National Conference is the flagship annual event of the National Association. This year's theme is 'Empowering Women, Transforming Communities.' Delegates from all 19 member clubs are expected to attend.\n\nRegistration details will be communicated to club presidents separately.",
    eventType: EventType.IN_PERSON,
    startsAt: new Date("2026-02-14T09:00:00Z"),
    endsAt: new Date("2026-02-15T18:00:00Z"),
    venue: "India Habitat Centre (Sample Venue)",
    city: "New Delhi",
    state: "Delhi NCR",
    tags: ["Conference", "National", "Annual"],
  },
  {
    slug: "si-kochi-coastal-health-camp-2026",
    title: "[Sample] SI Kochi Coastal Hygiene & Health Camp",
    description:
      "A free health camp for coastal fishing community women in Kochi, covering preventative care, hygiene distribution, and livelihood counselling.",
    content:
      "[SAMPLE CONTENT — replace with official details before publishing]\n\nSI Kochi is organising a one-day coastal health camp in collaboration with a local NGO partner. Services offered include hemoglobin and BMI screening, hygiene kit distribution, and vocational counselling for women in fishing hamlets.\n\nAll services are free of charge.",
    eventType: EventType.IN_PERSON,
    startsAt: new Date("2026-03-08T08:30:00Z"),
    endsAt: new Date("2026-03-08T17:00:00Z"),
    venue: "Sample Community Hall, Mattancherry",
    city: "Kochi",
    state: "Kerala",
    tags: ["Health", "Community", "Women's Day"],
  },
  {
    slug: "nasi-india-webinar-technology-women-2026",
    title: "[Sample] Webinar: Technology as a Tool for Women Empowerment",
    description:
      "A national webinar featuring speakers from NASI India clubs on leveraging digital tools and technology for community impact.",
    content:
      "[SAMPLE CONTENT — replace with official details before publishing]\n\nThis free online webinar is open to all NASI India members and the public. Speakers from SI Whitefield, SI Bangalore, and SI CD will share case studies on digital literacy programs, mobile health interventions, and policy advocacy using data.\n\nRegistration link will be shared 2 weeks before the event.",
    eventType: EventType.ONLINE,
    startsAt: new Date("2026-04-18T14:00:00Z"),
    endsAt: new Date("2026-04-18T16:00:00Z"),
    venue: null,
    city: "Online",
    state: null,
    tags: ["Webinar", "Technology", "Empowerment"],
  },
];

// ---------------------------------------------------------------------------
// NASI India Board: 2026-2028
// ---------------------------------------------------------------------------

const committeeData = [
  {
    name: "Anitha Rajarajan",
    title: "National President",
    organization: "NASI India",
    city: "Madurai",
    state: "Tamil Nadu",
    bio: "Founding President of SI Madurai and experienced Soroptimist leader who has spearheaded club chartering and membership expansion across India. Leads the National Board in coordinating nationwide programmes, federation relations with SIGBI, and advancing opportunities for women and girls.",
    displayOrder: 1,
  },
  {
    name: "Anjaly Banarji",
    title: "National Secretary",
    organization: "NASI India",
    city: "New Delhi",
    state: "Delhi NCR",
    bio: "Manages national secretariat administration, official correspondence, council documentation, and constitutional compliance across all chartered clubs in the Indian national association.",
    displayOrder: 2,
  },
  {
    name: "Reni Francis",
    title: "National Treasurer",
    organization: "NASI India",
    city: "Mumbai",
    state: "Maharashtra",
    bio: "Oversees financial management, budgeting, statutory audits, and transparent disbursement of programme funds for national projects and club initiatives nationwide.",
    displayOrder: 3,
  },
  {
    name: "Jamuna Ravi",
    title: "President Elect",
    organization: "NASI India",
    city: "Bengaluru",
    state: "Karnataka",
    bio: "Supports executive governance and strategic planning, working closely with member clubs and the federation to ensure leadership continuity and organizational growth.",
    displayOrder: 4,
  },
  {
    name: "Naina Shah",
    title: "Immediate Past President (IPP)",
    organization: "NASI India",
    city: "Mumbai",
    state: "Maharashtra",
    bio: "Immediate Past National President providing institutional guidance, constitutional advisory, and federation coordination to sustain long-term impact across India.",
    displayOrder: 5,
  },
  {
    name: "Shukla Chattopadhyay",
    title: "Programme Action Chairperson (PAC)",
    organization: "NASI India",
    city: "Kolkata",
    state: "West Bengal",
    bio: "Directs national Programme Action across education, women's empowerment, healthcare, and environmental sustainability, aligning local club projects with SIGBI priorities and UN Sustainable Development Goals.",
    displayOrder: 6,
  },
  {
    name: "Kavitha Ramesh",
    title: "Membership and Development Officer",
    organization: "NASI India",
    city: "Coimbatore",
    state: "Tamil Nadu",
    bio: "Leads membership development, club revitalization, and nationwide chapter expansion, guiding prospective members and new clubs through induction and chartering.",
    displayOrder: 7,
  },
  {
    name: "Anupama Sen",
    title: "Communications Officer",
    organization: "NASI India",
    city: "New Delhi",
    state: "Delhi NCR",
    bio: "Manages public relations, media engagement, digital communications, and national publications to amplify the voices and accomplishments of Soroptimist clubs across India.",
    displayOrder: 8,
  },
];

// ---------------------------------------------------------------------------
// External resources (Soroptimist International — public links)
// ---------------------------------------------------------------------------

const resourcesData = [
  {
    title: "Soroptimist International",
    url: "https://www.soroptimistinternational.org",
    description: "The official website of Soroptimist International — the global federation.",
    category: "Global Soroptimist",
    displayOrder: 1,
  },
  {
    title: "SI Federation (SIGBI)",
    url: "https://www.sigbi.org",
    description: "Soroptimist International of Great Britain and Ireland — the federation NASI India affiliates with.",
    category: "Global Soroptimist",
    displayOrder: 2,
  },
  {
    title: "SI Programme Priority Areas",
    url: "https://www.soroptimistinternational.org/our-programmes/",
    description: "The global programme framework covering Education, Empowerment and Enabling Environment.",
    category: "Programmes",
    displayOrder: 1,
  },
  {
    title: "UN Women",
    url: "https://www.unwomen.org",
    description: "The United Nations entity for gender equality and empowerment of women.",
    category: "Partner Organisations",
    displayOrder: 1,
  },
  {
    title: "UN SDG Goal 5: Gender Equality",
    url: "https://sdgs.un.org/goals/goal5",
    description: "Achieve gender equality and empower all women and girls.",
    category: "Partner Organisations",
    displayOrder: 2,
  },
  {
    title: "NITI Aayog — Women Empowerment",
    url: "https://www.niti.gov.in",
    description: "Government of India policy resources on women's empowerment and social development.",
    category: "India Resources",
    displayOrder: 1,
  },
];

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

const siteSettingsData = [
  { key: "site_name", value: "NASI India", label: "Site Name", group: "general" },
  { key: "site_tagline", value: "Empowering Women. Transforming Communities.", label: "Tagline", group: "general" },
  { key: "contact_email", value: "info@nasi-india.org", label: "General Contact Email", group: "contact" },
  { key: "secretariat_address", value: "[Sample Secretariat Address — contact via email]", label: "Secretariat Address", group: "contact" },
  { key: "facebook_url", value: "", label: "Facebook URL", group: "social" },
  { key: "twitter_url", value: "", label: "Twitter/X URL", group: "social" },
  { key: "instagram_url", value: "", label: "Instagram URL", group: "social" },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱 Starting NASI India database seed...\n");

  // — Site settings
  console.log("Setting up site settings...");
  for (const setting of siteSettingsData) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // — News categories
  console.log("Seeding news categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of newsCategoriesData) {
    const record = await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
  }

  // — News articles
  console.log("Seeding sample news articles...");
  for (const article of newsArticlesData) {
    const { categorySlug, ...articleData } = article;
    await prisma.newsArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...articleData,
        status: PublishStatus.PUBLISHED,
        categoryId: categoryMap[categorySlug] ?? null,
      },
    });
  }

  // — Events
  console.log("Seeding sample events...");
  for (const event of eventsData) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: {
        ...event,
        status: PublishStatus.PUBLISHED,
      },
    });
  }

  // — Committee members
  console.log("Seeding sample committee members...");
  for (const member of committeeData) {
    // Use name+title as a composite key for upsert (no unique constraint on name alone)
    const existing = await prisma.committeeMember.findFirst({
      where: { name: member.name, title: member.title },
    });
    if (!existing) {
      await prisma.committeeMember.create({ data: member });
    }
  }

  // — External resources
  console.log("Seeding external resources...");
  for (const resource of resourcesData) {
    const existing = await prisma.externalResource.findFirst({
      where: { url: resource.url },
    });
    if (!existing) {
      await prisma.externalResource.create({ data: resource });
    }
  }

  // — Clubs (19 real NASI India clubs)
  console.log(`\nSeeding ${clubSeedData.length} NASI India clubs...`);
  for (const clubData of clubSeedData) {
    const { projects, ...clubFields } = clubData;

    // Upsert the club (idempotent — slug is unique)
    const club = await prisma.club.upsert({
      where: { slug: clubFields.slug },
      update: {},
      create: {
        ...clubFields,
        charterYear: "Chartered Club (Sample)",
        isActive: true,
      },
    });

    // Seed projects only if club has none yet
    const existingProjects = await prisma.clubProject.count({
      where: { clubId: club.id },
    });

    if (existingProjects === 0) {
      await prisma.clubProject.createMany({
        data: projects.map((p) => ({
          clubId: club.id,
          title: p.title,
          description: p.description,
          status: p.status,
        })),
      });
    }

    console.log(`  ✓ ${club.name} (${club.slug})`);
  }

  console.log("\n✅ Seed completed successfully.");
  console.log(`   • ${clubSeedData.length} clubs`);
  console.log(`   • ${newsCategoriesData.length} news categories`);
  console.log(`   • ${newsArticlesData.length} sample articles`);
  console.log(`   • ${eventsData.length} sample events`);
  console.log(`   • ${committeeData.length} sample committee members`);
  console.log(`   • ${resourcesData.length} external resources`);
  console.log(`   • ${siteSettingsData.length} site settings`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
