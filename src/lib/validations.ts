import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(12),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ---------------------------------------------------------------------------
// Club schemas
// ---------------------------------------------------------------------------

export const clubFilterSchema = z.object({
  region: z
    .enum([
      "NORTHERN_REGION",
      "SOUTHERN_REGION",
      "WESTERN_REGION",
      "EASTERN_REGION",
      "NORTH_EASTERN_REGION",
    ])
    .optional(),
  search: z.string().max(100).trim().optional(),
  ...paginationSchema.shape,
});

export type ClubFilterInput = z.infer<typeof clubFilterSchema>;

// ---------------------------------------------------------------------------
// News schemas
// ---------------------------------------------------------------------------

export const newsFilterSchema = z.object({
  categorySlug: z.string().max(80).trim().optional(),
  search: z.string().max(100).trim().optional(),
  ...paginationSchema.shape,
});

export type NewsFilterInput = z.infer<typeof newsFilterSchema>;

// ---------------------------------------------------------------------------
// Event schemas
// ---------------------------------------------------------------------------

export const eventFilterSchema = z.object({
  upcoming: z.boolean().default(true),
  clubId: z.string().cuid().optional(),
  search: z.string().max(100).trim().optional(),
  ...paginationSchema.shape,
});

export type EventFilterInput = z.infer<typeof eventFilterSchema>;

// ---------------------------------------------------------------------------
// Contact enquiry schema
// ---------------------------------------------------------------------------

export const contactEnquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .regex(/^[+0-9\s\-()]{7,20}$/, "Please enter a valid telephone number")
    .trim(),
  subject: z.string().max(200).trim().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(3000, "Message must not exceed 3000 characters")
    .trim(),
  consent: z
    .any()
    .refine((val) => val === true || val === "on" || val === "true", {
      message: "You must consent to our privacy terms to submit an enquiry.",
    }),
  hp_national_code: z
    .string()
    .max(0, "Automated submission rejected")
    .optional()
    .or(z.literal("")),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;

// ---------------------------------------------------------------------------
// Membership enquiry schema
// ---------------------------------------------------------------------------

export const membershipEnquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phone: z
    .string()
    .min(7, "Contact phone number must be at least 7 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .regex(/^[+0-9\s\-()]{7,20}$/, "Please enter a valid telephone number")
    .trim(),
  preferredClub: z
    .string()
    .min(2, "Please select or specify a preferred club")
    .max(100)
    .trim(),
  city: z
    .string()
    .max(80)
    .trim()
    .optional()
    .transform((v) => v || undefined),
  state: z
    .string()
    .max(80)
    .trim()
    .optional()
    .transform((v) => v || undefined),
  occupation: z
    .string()
    .max(100)
    .trim()
    .optional()
    .transform((v) => v || undefined),
  motivation: z
    .string()
    .max(2000, "Motivation message must not exceed 2000 characters")
    .trim()
    .optional()
    .transform((v) => v || undefined),
  consent: z
    .any()
    .refine((val) => val === true || val === "on" || val === "true", {
      message: "You must consent to our privacy terms to submit your application.",
    }),
  hp_national_code: z
    .string()
    .max(0, "Automated submission rejected")
    .optional()
    .or(z.literal("")),
});

export type MembershipEnquiryInput = z.infer<typeof membershipEnquirySchema>;

// ---------------------------------------------------------------------------
// Admin Enquiry Schemas
// ---------------------------------------------------------------------------

export const enquiryStatusUpdateSchema = z.object({
  id: z.string().min(1, "Enquiry ID is required"),
  type: z.enum(["contact", "membership"]),
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
  internalNotes: z.string().max(2000).optional(),
  assignedToId: z.string().cuid().nullable().optional(),
});

export type EnquiryStatusUpdateInput = z.infer<typeof enquiryStatusUpdateSchema>;

export const enquiryFilterSchema = z.object({
  type: z.enum(["ALL", "CONTACT", "MEMBERSHIP"]).default("ALL"),
  status: z.enum(["ALL", "NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]).default("ALL"),
  search: z.string().max(100).trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type EnquiryFilterInput = z.infer<typeof enquiryFilterSchema>;

// ---------------------------------------------------------------------------
// URL Safety Helper
// ---------------------------------------------------------------------------

export function isValidHttpUrl(str: string): boolean {
  try {
    const parsed = new URL(str);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// News Article Form Schema
// ---------------------------------------------------------------------------

export const newsArticleFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(250).trim(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .trim(),
  excerpt: z.string().max(500).trim().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().max(1000).trim().optional(),
  sourceUrl: z
    .string()
    .max(1000)
    .trim()
    .optional()
    .refine((val) => !val || isValidHttpUrl(val), {
      message: "Source URL must be a valid http or https URL",
    }),
  metaTitle: z.string().max(120).trim().optional(),
  metaDescription: z.string().max(250).trim().optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string().trim().optional(),
  clubId: z.string().trim().optional(),
  authorName: z.string().max(100).trim().optional(),
  tags: z.string().max(300).trim().optional(),
  publishedAt: z.string().trim().optional(),
  scheduledAt: z.string().trim().optional(),
});

export type NewsArticleFormInput = z.infer<typeof newsArticleFormSchema>;

// ---------------------------------------------------------------------------
// Event Form Schema
// ---------------------------------------------------------------------------

export const eventFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(250).trim(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .trim(),
  description: z.string().max(1000).trim().optional(),
  content: z.string().max(50000).trim().optional(),
  coverImage: z.string().max(1000).trim().optional(),
  eventType: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]).default("IN_PERSON"),
  startsAt: z.string().min(1, "Event start date and time is required"),
  endsAt: z.string().trim().optional(),
  timezone: z.string().max(60).default("Asia/Kolkata"),
  venue: z.string().max(250).trim().optional(),
  city: z.string().max(100).trim().optional(),
  state: z.string().max(100).trim().optional(),
  onlineLink: z
    .string()
    .max(1000)
    .trim()
    .optional()
    .refine((val) => !val || isValidHttpUrl(val), {
      message: "Online link must be a valid http or https URL",
    }),
  registrationLink: z
    .string()
    .max(1000)
    .trim()
    .optional()
    .refine((val) => !val || isValidHttpUrl(val), {
      message: "Registration link must be a valid http or https URL",
    }),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isCancelled: z.boolean().default(false),
  clubId: z.string().trim().optional(),
  tags: z.string().max(300).trim().optional(),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;

// ---------------------------------------------------------------------------
// Newsletter Form Schema
// ---------------------------------------------------------------------------

export const newsletterFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(250).trim(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .trim(),
  description: z.string().max(2000).trim().optional(),
  issueNumber: z.string().max(100).trim().optional(),
  volumeNumber: z.string().max(100).trim().optional(),
  fileUrl: z.string().max(1000).trim().optional(),
  fileName: z.string().max(255).trim().optional(),
  fileSize: z.coerce.number().optional(),
  coverImage: z.string().max(1000).trim().optional(),
  clubId: z.string().trim().optional(),
  publishedAt: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isApproved: z.boolean().default(false),
});

export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>;

// ---------------------------------------------------------------------------
// External Resource Form Schema
// ---------------------------------------------------------------------------

export const externalResourceFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters").max(150).trim(),
  url: z
    .string()
    .min(1, "URL is required")
    .max(1000)
    .trim()
    .refine((val) => isValidHttpUrl(val) || val.startsWith("/"), {
      message: "Must be a valid web URL (https://...) or internal path (/...)",
    }),
  description: z.string().max(500).trim().optional(),
  category: z.string().max(100).trim().default("Soroptimist Network"),
  badge: z.string().max(50).trim().optional(),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ExternalResourceFormInput = z.infer<typeof externalResourceFormSchema>;
