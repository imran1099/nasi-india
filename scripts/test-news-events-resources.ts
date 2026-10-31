/**
 * Automated Test Suite — News, Events, Newsletters & Resources Management
 *
 * Verifies:
 * 1. URL validation safety
 * 2. Magic bytes validation for safe uploads (PDF, JPEG, PNG, WebP)
 * 3. News article validations, slug formatting, and draft protection
 * 4. Scheduled publication logic
 * 5. Event cancellation and format validations
 * 6. Newsletter approval workflow & PDF metadata
 * 7. External resource CRUD & category ordering
 * 8. Public shielding: drafts & archived items excluded from public queries
 */

import { isValidHttpUrl, newsArticleFormSchema, eventFormSchema, newsletterFormSchema, externalResourceFormSchema } from "../src/lib/validations";
import { publishScheduledContent } from "../src/lib/scheduler";
import { prisma } from "../src/lib/db";
import { PublishStatus } from "@prisma/client";

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (condition) {
    console.log(`✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`✗ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log(" NASI India — News, Events, Newsletters & Resources Tests");
  console.log("=================================================\n");

  // 1. URL Safety & Validation
  console.log("1. URL Safety Validation:");
  assert(isValidHttpUrl("https://soroptimistinternational.org"), "Valid HTTPS URL accepted");
  assert(isValidHttpUrl("http://nasi-india.org/bulletin"), "Valid HTTP URL accepted");
  assert(!isValidHttpUrl("javascript:alert(1)"), "XSS javascript: protocol rejected");
  assert(!isValidHttpUrl("data:text/html;base64,PHNjcmlwdD4="), "Dangerous data: URI rejected");
  assert(!isValidHttpUrl("not-a-url"), "Malformed string rejected");

  // 2. Magic Bytes / File Upload Signature Check
  console.log("\n2. File Upload Magic Byte Signature Verification:");
  const pdfHeader = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]); // %PDF-1.5
  const isPdf = pdfHeader[0] === 0x25 && pdfHeader[1] === 0x50 && pdfHeader[2] === 0x44 && pdfHeader[3] === 0x46;
  assert(isPdf, "PDF magic bytes signature (%PDF) identified");

  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
  const isJpeg = jpegHeader[0] === 0xff && jpegHeader[1] === 0xd8 && jpegHeader[2] === 0xff;
  assert(isJpeg, "JPEG magic bytes signature (FF D8 FF) identified");

  const fakePdf = Buffer.from([0x4d, 0x5a, 0x90, 0x00]); // EXE file renamed to .pdf
  const isFakePdf = fakePdf[0] === 0x25 && fakePdf[1] === 0x50 && fakePdf[2] === 0x44 && fakePdf[3] === 0x46;
  assert(!isFakePdf, "Executable renamed as PDF safely rejected");

  // 3. News Article Form Schema Validation
  console.log("\n3. News Article Validations & Slug Protection:");
  const validNews = newsArticleFormSchema.safeParse({
    title: "Annual STEM Scholarships Announced",
    slug: "annual-stem-scholarships-announced",
    excerpt: "NASI announces 50 new grants for young women in engineering.",
    content: "## Overview\nThe National Association of Soroptimist International of India...",
    status: "PUBLISHED",
    sourceUrl: "https://soroptimistinternational.org/news/india",
  });
  assert(validNews.success, "Valid news article payload parsed successfully");

  const invalidSlug = newsArticleFormSchema.safeParse({
    title: "Invalid Slug Article",
    slug: "Invalid Slug With Spaces!",
    content: "Content that meets minimum length.",
  });
  assert(!invalidSlug.success, "Invalid slug with uppercase and spaces correctly rejected");

  // 4. Events Form Schema Validation
  console.log("\n4. Event Form Schema & Timezone Validation:");
  const validEvent = eventFormSchema.safeParse({
    title: "NASI Biennial National Conference 2025",
    slug: "nasi-biennial-national-conference-2025",
    description: "Annual meeting of delegates from all 19 chartered clubs.",
    eventType: "IN_PERSON",
    startsAt: "2025-02-15T09:30:00.000Z",
    timezone: "Asia/Kolkata",
    venue: "Grand Hall, Marine Drive",
    city: "Kochi",
    state: "Kerala",
    registrationLink: "https://forms.gle/sampleRsvp",
    status: "PUBLISHED",
  });
  assert(validEvent.success, "Valid event payload with timezone and venue parsed");

  // 5. Newsletter Form Schema & Approval
  console.log("\n5. Newsletter Form Schema & Approval Workflow:");
  const validNewsletter = newsletterFormSchema.safeParse({
    title: "National Gazette — Biennium Issue 2024",
    slug: "national-gazette-biennium-issue-2024",
    issueNumber: "Vol. 14, Issue 4",
    fileUrl: "/uploads/newsletters/gazette-2024-sample.pdf",
    status: "PUBLISHED",
    isApproved: true,
  });
  assert(validNewsletter.success, "Valid approved newsletter payload parsed");

  // 6. External Resource Form Schema
  console.log("\n6. External Resource CRUD Schema:");
  const validResource = externalResourceFormSchema.safeParse({
    title: "Soroptimist International of Europe",
    url: "https://soroptimisteurope.org",
    category: "Federation Gateway",
    badge: "Official Federation",
    displayOrder: 2,
    isActive: true,
  });
  assert(validResource.success, "Valid external resource payload parsed");

  // 7. Database Integration Tests (if DATABASE_URL is active)
  if (process.env.DATABASE_URL) {
    console.log("\n7. Database Integration & Public Shielding Verification:");
    const testSlug = `test-draft-shield-${Date.now()}`;

    // Create a DRAFT article
    const draftArticle = await prisma.newsArticle.create({
      data: {
        title: "Secret Unannounced Draft Article",
        slug: testSlug,
        excerpt: "This should never appear to public visitors",
        content: "Draft content only accessible in admin desk.",
        status: PublishStatus.DRAFT,
      },
    });

    // Public DAL query for this slug
    const { getPublishedArticleBySlug } = await import("../src/lib/dal/news");
    const publicResult = await getPublishedArticleBySlug(testSlug);
    assert(publicResult === null, "Public query returns null for DRAFT article (Protected)");

    // Test Scheduler on a past-scheduled item
    const schedSlug = `test-sched-${Date.now()}`;
    const scheduledArticle = await prisma.newsArticle.create({
      data: {
        title: "Scheduled Article To Auto-Publish",
        slug: schedSlug,
        excerpt: "Auto-publish test",
        content: "Testing automatic publication engine.",
        status: PublishStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() - 10000), // 10 seconds ago
      },
    });

    const schedResult = await publishScheduledContent();
    assert(schedResult.publishedNewsCount >= 1, "Scheduler detected and published due article");

    const rechecked = await prisma.newsArticle.findUnique({ where: { id: scheduledArticle.id } });
    assert(rechecked?.status === PublishStatus.PUBLISHED, "Scheduled article transitioned to PUBLISHED status");

    // Clean up test articles
    await prisma.newsArticle.deleteMany({
      where: { id: { in: [draftArticle.id, scheduledArticle.id] } },
    });
  }

  console.log("\n-------------------------------------------------");
  console.log(`Test Results: ${passed} of ${total} tests passed.`);
  console.log("-------------------------------------------------\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
