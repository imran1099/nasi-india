# NASI India — National Association of Soroptimist International of India

Official web portal and digital infrastructure for the **National Association of Soroptimist International of India (NASI India)**, representing 19 chartered clubs and women leaders nationwide committed to educating, empowering, and enabling women and girls.

---

## Architecture & Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with Turbopack & React 19
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4 design system with custom brand tokens:
  - Deep Heritage Forest Green (`#0c2a21`)
  - Warm Sand & Parchment neutrals (`#fbf8f3`, `#ede5d8`)
  - Refined Emerald / Teal accents (`#1b6b57`, `#0f4a3c`)
  - Warm Antique Gold highlights (`#c99732`)
  - Editorial Serif typography (`Playfair Display` / `Merriweather` font pairings)
- **Database & ORM**: PostgreSQL with [Prisma ORM 5](https://www.prisma.io)
- **Validation**: [Zod](https://zod.dev) with type-safe server actions
- **Rendering Strategy**: Partial Prerendering (PPR) enabled, with static build fallbacks ensuring 100% build reliability when database credentials are not yet configured.

---

## Project Structure

```text
NASAI/
├── prisma/
│   ├── schema.prisma         # Full database schema (14 models, indexes, enums)
│   └── seed.ts               # Idempotent seed script for 19 clubs & sample data
├── src/
│   ├── actions/
│   │   └── enquiries.ts      # Type-safe Server Actions for Contact & Membership 
│   ├── app/
│   │   ├── (public pages)    # /, /about, /clubs, /committee, /events, /news, etc.
│   │   ├── clubs/[slug]/     # Dynamic club profile with static generation
│   │   ├── events/[slug]/    # Dynamic event details page
│   │   └── news/[slug]/      # Dynamic article reading template
│   ├── components/
│   │   ├── ui/               # Reusable UI primitives (Button, Card, Badge, FormField)
│   │   ├── layout/           # Navbar, MobileNav, Footer
│   │   ├── clubs/            # Directory, ClubCard, Search & Filters
│   │   ├── events/           # EventsDirectory, EventCard
│   │   ├── news/             # NewsDirectory, ArticleCard
│   │   └── forms/            # ContactForm, MembershipForm
│   ├── data/                 # Baseline static datasets for clubs, news, events, committee
│   ├── lib/
│   │   ├── dal/              # Data Access Layer (clubs, committee, events, news, resources)
│   │   ├── api-response.ts   # Standardized Result<T, E> error responses
│   │   ├── db.ts             # Prisma Client singleton
│   │   └── validations.ts    # Zod schemas for forms and filters
│   └── config/
│       └── site.ts           # Site metadata, navigation items, brand constants
├── .env.example              # Documented environment variable template
└── package.json
```

---

## Implemented Database Models

The PostgreSQL database schema in [`prisma/schema.prisma`](file:///e:/NASAI/prisma/schema.prisma) includes:

1. **User**: Authentication, roles (`MEMBER`, `CLUB_EDITOR`, `CLUB_ADMIN`, `NATIONAL_ADMIN`, `SUPER_ADMIN`), security flags.
2. **Club**: Chartered chapters across India (all 19 official clubs), regional categorizations, meeting schedules.
3. **ClubOfficer**: Chapter leadership roles (President, Secretary, PAC, Treasurer).
4. **ClubProject**: Community initiatives with status (`Ongoing`, `Completed`, `Annual`).
5. **CommitteeMember**: National executive board and portfolios (Biennium 2024–2026).
6. **NewsCategory**: Editorial categories (Education, Healthcare, Environment, Empowerment).
7. **NewsArticle**: Published and draft articles, Markdown content, author, tags.
8. **Event**: National Council meetings, conferences, webinars, hybrid gatherings.
9. **Newsletter**: National circulars, Global Voice issues, and PDFs.
10. **ExternalResource**: Soroptimist International, SIGBI, and federation directories.
11. **ContactEnquiry**: Validated contact form inquiries with tracking.
12. **MembershipEnquiry**: Prospective member applications with club preferences.
13. **MediaAsset**: Media library records with MIME categorization and upload attribution.
14. **SiteSetting**: Key-value administrative configuration store.
15. **AuditLog**: Tamper-evident activity logging for compliance and governance.

---

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your PostgreSQL database connection:

```ini
DATABASE_URL="postgresql://postgres:root@localhost:5432/nasi_india?schema=public"
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="random_32_character_hex_key_here"
```

*(Note: If `DATABASE_URL` is commented out or unavailable, the website automatically falls back to curated static datasets with zero crashes or broken layouts.)*

### 2. Database Setup & Seeding

```bash
# Generate Prisma Client
npm run db:generate

# Push database schema to PostgreSQL
npm run db:push
# or run migrations:
npm run db:migrate

# Seed 19 NASI India clubs and sample content
npm run db:seed
```

### 3. Running Locally

```bash
# Start development server
npm run dev

# Open in browser: http://localhost:3000
```

### 4. Production Build Validation

```bash
npm run build
```

---

## 19 NASI India Chartered Clubs

The seed script creates and idempotently manages all 19 chartered clubs:

- **Southern Region**: SI Bangalore, SI Bangalore City, SI Bangalore South, SI Bangalore West, SI Chennai, SI Chennai Downtown, SI Cochin, SI Kochi, SI Madurai, SI South West Bangalore
- **Western Region**: SI Bombay, SI Bombay Chembur, SI Bombay South, SI Pune, SI Pune Metro East
- **Northern Region**: SI Delhi, SI Kalka
- **Eastern Region**: SI Calcutta
- **Central Region**: SI Jabalpur

---

## Security & Compliance Rules

- **Unpublished Guard**: Data Access Layer (DAL) strictly limits queries to `isActive: true` and `status: PUBLISHED` for all public visitors.
- **Audit Trails**: Critical changes are recorded via `AuditLog`.
- **Validation**: All user inputs in Contact and Membership forms are parsed through strict Zod schemas preventing malicious payloads or malformed requests.
