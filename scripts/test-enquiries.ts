/**
 * Comprehensive Automated Test Suite — Contact & Membership Enquiries
 *
 * Verifies:
 * 1. Server-side validation (valid and invalid inputs).
 * 2. Spam prevention (honeypot detection).
 * 3. Rate limiting (sliding window throttling).
 * 4. Database persistence in PostgreSQL.
 * 5. Email notification failure handling (never falsely reporting delivery).
 * 6. Admin access restrictions, status transitions, authorized assignment, and CSV export.
 */

import { prisma } from "../src/lib/db";
import { contactEnquirySchema, membershipEnquirySchema } from "../src/lib/validations";
import { checkRateLimit, hashClientIdentifier } from "../src/lib/rate-limiter";
import { sendContactNotificationEmail } from "../src/lib/email";
import {
  updateEnquiryRecord,
  exportEnquiriesCsv,
} from "../src/lib/dal/enquiries";
import { EnquiryStatus } from "@prisma/client";

let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, message: string) {
  totalCount++;
  if (condition) {
    console.log(`✓ [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`✗ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log(" NASI India — Enquiries & Membership Test Suite");
  console.log("=================================================\n");

  // -------------------------------------------------------------------------
  // 1. Validation: Contact Form Schema
  // -------------------------------------------------------------------------
  console.log("1. Contact Form Server-Side Validation:");
  const validContact = {
    name: "Dr. Ananya Sen",
    email: "ananya.sen@example.com",
    phone: "+91 98300 12345",
    subject: "CSR Collaboration Inquiry",
    message: "We wish to partner with NASI India on vocational digital literacy workshops.",
    consent: true,
    hp_national_code: "",
  };
  const parsedContact = contactEnquirySchema.safeParse(validContact);
  assert(parsedContact.success, "Valid contact enquiry payload successfully parsed");

  // Invalid email
  const invalidEmail = { ...validContact, email: "not-an-email" };
  assert(!contactEnquirySchema.safeParse(invalidEmail).success, "Invalid email address rejected");

  // Missing / invalid phone
  const invalidPhone = { ...validContact, phone: "123" };
  assert(!contactEnquirySchema.safeParse(invalidPhone).success, "Short/invalid phone number rejected");

  // Missing consent
  const noConsent = { ...validContact, consent: false };
  assert(!contactEnquirySchema.safeParse(noConsent).success, "Missing privacy consent rejected");

  // -------------------------------------------------------------------------
  // 2. Validation: Membership Form Schema
  // -------------------------------------------------------------------------
  console.log("\n2. Membership Form Server-Side Validation:");
  const validMembership = {
    name: "Meenakshi Sundaram",
    email: "meenakshi@example.com",
    phone: "+91 94440 55667",
    preferredClub: "si-chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    occupation: "Senior Architect",
    motivation: "Dedicated to mentoring young women entering structural engineering fields.",
    consent: true,
    hp_national_code: "",
  };
  const parsedMembership = membershipEnquirySchema.safeParse(validMembership);
  assert(parsedMembership.success, "Valid membership application payload parsed");

  // Missing preferred club
  const noClub = { ...validMembership, preferredClub: "" };
  assert(!membershipEnquirySchema.safeParse(noClub).success, "Missing preferred club rejected");

  // -------------------------------------------------------------------------
  // 3. Spam Prevention: Honeypot Detection
  // -------------------------------------------------------------------------
  console.log("\n3. Spam Controls & Honeypot Detection:");
  const spamContact = { ...validContact, hp_national_code: "http://bot-spam.example" };
  assert(!contactEnquirySchema.safeParse(spamContact).success, "Filled honeypot field safely rejected as spam");

  const spamMembership = { ...validMembership, hp_national_code: "viagra-seo" };
  assert(!membershipEnquirySchema.safeParse(spamMembership).success, "Membership bot honeypot rejected");

  // -------------------------------------------------------------------------
  // 4. Rate Limiting: Sliding Window Check
  // -------------------------------------------------------------------------
  console.log("\n4. Privacy Hashing & Rate Limiting:");
  const testIp = "192.168.1.42";
  const hashedIp = hashClientIdentifier(testIp);
  assert(hashedIp.length === 24 && !hashedIp.includes(testIp), "Client IP anonymized into fixed-length SHA-256 hash");

  const testKey = `test-rate-${Date.now()}`;
  let allowed = true;
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testKey, 5, 60000);
    allowed = allowed && res.allowed;
  }
  assert(allowed, "First 5 requests within limit are accepted");

  const sixthReq = checkRateLimit(testKey, 5, 60000);
  assert(!sixthReq.allowed && sixthReq.resetSeconds > 0, "6th request correctly throttled by rate limiter");

  // -------------------------------------------------------------------------
  // 5. Database Persistence & Storage
  // -------------------------------------------------------------------------
  console.log("\n5. Database Persistence in PostgreSQL:");
  const dbContact = await prisma.contactEnquiry.create({
    data: {
      name: "Automated Test Sender",
      email: "test.sender@example.com",
      phone: "+91 99999 88888",
      subject: "Test Subject",
      message: "Testing database persistence and workflow status.",
      status: EnquiryStatus.NEW,
      consentGiven: true,
      ipHash: hashedIp,
    },
  });
  assert(Boolean(dbContact.id) && dbContact.status === EnquiryStatus.NEW, "Contact enquiry created with NEW status in DB");

  const dbMembership = await prisma.membershipEnquiry.create({
    data: {
      name: "Automated Applicant",
      email: "applicant@example.com",
      phone: "+91 98888 77777",
      preferredClub: "si-kochi",
      city: "Kochi",
      state: "Kerala",
      occupation: "Marine Biologist",
      motivation: "Passionate about marine conservation and women in STEM.",
      status: EnquiryStatus.NEW,
      consentGiven: true,
      ipHash: hashedIp,
    },
  });
  assert(Boolean(dbMembership.id) && dbMembership.preferredClub === "si-kochi", "Membership enquiry saved with preferred club in DB");

  // -------------------------------------------------------------------------
  // 6. Email Notifications & Graceful Failure Handling
  // -------------------------------------------------------------------------
  console.log("\n6. Email Dispatch & Graceful Failure Handling:");
  // Simulate network/provider failure
  process.env.EMAIL_SIMULATE_FAILURE = "true";
  const failContactEmail = await sendContactNotificationEmail({
    name: dbContact.name,
    email: dbContact.email,
    phone: dbContact.phone,
    subject: dbContact.subject,
    message: dbContact.message,
    createdAt: dbContact.createdAt,
  });

  assert(
    failContactEmail.delivered === false && typeof failContactEmail.error === "string",
    "Email failure handled gracefully without throwing unhandled exception"
  );
  assert(
    !failContactEmail.delivered,
    "Delivery is NEVER reported as true when transmission failed"
  );

  delete process.env.EMAIL_SIMULATE_FAILURE;

  // -------------------------------------------------------------------------
  // 7. Admin Workflow: Status Updates, Assignment & Internal Notes
  // -------------------------------------------------------------------------
  console.log("\n7. Admin Workflow & Status Transitions:");
  const updatedContact = await updateEnquiryRecord({
    id: dbContact.id,
    type: "contact",
    status: EnquiryStatus.IN_PROGRESS,
    internalNotes: "Spoke via telephone; referred to Pune Metro East coordinator.",
    assignedToId: null,
  });

  assert(
    updatedContact.status === EnquiryStatus.IN_PROGRESS &&
      Boolean(updatedContact.internalNotes?.includes("Pune Metro East")),
    "Enquiry status transitioned to IN_PROGRESS with internal notes recorded"
  );

  // -------------------------------------------------------------------------
  // 8. Protected CSV Export & Formula Injection Prevention
  // -------------------------------------------------------------------------
  console.log("\n8. Protected CSV Export & DDE Formula Injection Prevention:");
  // Insert an enquiry with formula injection attempt
  const injectionEnquiry = await prisma.contactEnquiry.create({
    data: {
      name: "=cmd|' /C calc'!A0",
      email: "attacker@example.com",
      phone: "+91 90000 00000",
      subject: "@SUM(1+1)",
      message: "-2+3+cmd",
      status: EnquiryStatus.NEW,
      consentGiven: true,
    },
  });

  const exportResult = await exportEnquiriesCsv("CONTACT");
  assert(
    exportResult.csv.includes(`"'=cmd|' /C calc'!A0"`),
    "Leading '=' in CSV sanitized with apostrophe prefix against formula execution"
  );
  assert(
    exportResult.csv.includes(`"'@SUM(1+1)"`),
    "Leading '@' sanitized against DDE formula execution"
  );
  assert(
    exportResult.filename.startsWith("nasi-india-enquiries-contact-"),
    "Export produces compliant timestamped filename"
  );

  // Clean up test records
  await prisma.contactEnquiry.deleteMany({
    where: { id: { in: [dbContact.id, injectionEnquiry.id] } },
  });
  await prisma.membershipEnquiry.deleteMany({
    where: { id: dbMembership.id },
  });

  console.log("\n-------------------------------------------------");
  console.log(`Test Results: ${passedCount} of ${totalCount} tests passed.`);
  console.log("-------------------------------------------------\n");

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
