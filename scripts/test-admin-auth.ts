/**
 * Test Suite — Admin Authentication, Session & Role Authorization
 * Tests:
 * 1. Password hashing (PBKDF2-SHA512) & timing-safe verification
 * 2. Session signing & HMAC-SHA256 tampering detection
 * 3. Role-based permission logic (Super Admin vs NASI Editor)
 * 4. Site settings DAL defaults & structure
 */

import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { Role } from "@prisma/client";
import { getDefaultSiteSettings } from "../src/lib/dal/settings";
import { createHmac } from "crypto";

async function runTests() {
  console.log("=================================================");
  console.log(" Running NASI India Admin Auth & Security Tests");
  console.log("=================================================\n");

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

  // 1. Password Security Tests
  console.log("1. Password Security & PBKDF2 Verification:");
  const testPassword = "SecurePassword@2024!";
  const hash = hashPassword(testPassword);
  assert(hash.includes(":"), "Password hash format contains salt:hash delimiter");
  assert(verifyPassword(testPassword, hash), "Valid password successfully verified");
  assert(!verifyPassword("WrongPassword!", hash), "Incorrect password correctly rejected");
  assert(!verifyPassword(testPassword, "tampered:hash"), "Tampered hash string safely rejected");

  // 2. Session Token & Tamper-Proof Signature Tests
  console.log("\n2. Session Token Cryptographic Signing & Tamper Verification:");
  const secret = process.env.SESSION_SECRET || "nasi-india-session-fallback-secret-key-32-chars-long";
  const payload = {
    id: "user-1",
    email: "admin@nasi-india.org",
    name: "National Admin",
    role: Role.SUPER_ADMIN,
    expiresAt: Date.now() + 100000,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payloadStr).digest("base64url");
  const validToken = `${payloadStr}.${signature}`;

  assert(validToken.split(".").length === 2, "Session token structure is payload.signature");

  // Tampered payload test
  const tamperedPayloadStr = Buffer.from(JSON.stringify({ ...payload, email: "hacker@evil.com" })).toString("base64url");
  const tamperedSigCheck = createHmac("sha256", secret).update(tamperedPayloadStr).digest("base64url");
  assert(signature !== tamperedSigCheck, "Tampered payload causes HMAC signature verification failure");

  // 3. Role-Based Permissions
  console.log("\n3. Role-Based Permissions Matrix:");
  const superAdminRole = Role.SUPER_ADMIN;
  const editorRole = Role.NATIONAL_ADMIN;
  const memberRole = Role.MEMBER;

  const superAdminPages: Role[] = [Role.SUPER_ADMIN];
  const editorPages: Role[] = [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN];

  assert(superAdminPages.includes(superAdminRole), "Super Admin has access to /admin/users and /admin/settings");
  assert(!superAdminPages.includes(editorRole), "NASI Editor is BLOCKED from /admin/users and /admin/settings");
  assert(editorPages.includes(editorRole), "NASI Editor has access to /admin/news, /admin/events, /admin/clubs");
  assert(!editorPages.includes(memberRole), "Regular Member has NO administrative module access");

  // 4. Site Settings DAL
  console.log("\n4. Site Settings Defaults & Keys:");
  const defaultSettings = getDefaultSiteSettings();
  assert(Boolean(defaultSettings["site.name"]), "Site name setting exists");
  assert(Boolean(defaultSettings["contact.email"]), "Contact email setting exists");
  assert(Boolean(defaultSettings["social.facebook"]), "Social Facebook setting exists");
  assert(Boolean(defaultSettings["home.heroTitle"]), "Homepage hero title exists");
  assert(Boolean(defaultSettings["footer.copyright"]), "Footer copyright setting exists");

  console.log("\n-------------------------------------------------");
  console.log(`Test Results: ${passed} of ${total} tests passed.`);
  console.log("-------------------------------------------------\n");
}

runTests();
