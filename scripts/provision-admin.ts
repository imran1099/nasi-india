/**
 * Provision Administrator CLI Tool
 * --------------------------------
 * Securely provisions the first Super Admin or updates existing admin credentials.
 * NEVER seeds or commits a static production password.
 *
 * Usage:
 *   npx tsx scripts/provision-admin.ts --email=admin@nasi-india.org --name="National Admin" --role=SUPER_ADMIN
 *
 * Or with custom password:
 *   npx tsx scripts/provision-admin.ts --email=admin@nasi-india.org --password="YourSecurePasswordHere"
 */

import { PrismaClient, Role, AuditAction } from "@prisma/client";
import { randomBytes, pbkdf2Sync } from "crypto";

const prisma = new PrismaClient();

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt}:${derivedKey.toString("hex")}`;
}

function generateSecurePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%^&*";
  const bytes = randomBytes(16);
  let pass = "";
  for (let i = 0; i < 16; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (const arg of args) {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (key && value) {
        parsed[key.toLowerCase()] = value;
      }
    }
  }

  return parsed;
}

async function main() {
  console.log("=================================================");
  console.log(" NASI India — Administrator Provisioning Utility");
  console.log("=================================================");

  const args = parseArgs();

  const email = (
    args["email"] ||
    process.env.ADMIN_EMAIL ||
    "admin@nasi-india.org"
  ).trim().toLowerCase();

  const name = (
    args["name"] ||
    process.env.ADMIN_NAME ||
    "NASI India Super Administrator"
  ).trim();

  const roleInput = (args["role"] || process.env.ADMIN_ROLE || "SUPER_ADMIN").toUpperCase();
  const role: Role = roleInput === "NATIONAL_ADMIN" ? Role.NATIONAL_ADMIN : Role.SUPER_ADMIN;

  const passwordProvided = Boolean(args["password"] || process.env.ADMIN_PASSWORD);
  const password = args["password"] || process.env.ADMIN_PASSWORD || generateSecurePassword();

  const passwordHash = hashPassword(password);

  console.log(`\nTarget Administrator:`);
  console.log(`- Email : ${email}`);
  console.log(`- Name  : ${name}`);
  console.log(`- Role  : ${role}`);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role,
        passwordHash,
        isActive: true,
        emailVerified: true,
      },
      create: {
        email,
        name,
        role,
        passwordHash,
        isActive: true,
        emailVerified: true,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: AuditAction.CREATE,
          entityType: "User",
          entityId: user.id,
          changes: {
            reason: "CLI Administrator Provisioning",
            role: user.role,
            email: user.email,
          },
        },
      });
    } catch {
      // Audit log optional if table not yet migrated
    }

    console.log(`\n[SUCCESS] Administrator provisioned successfully in database!`);
    console.log(`User ID : ${user.id}`);
    console.log(`Email   : ${user.email}`);
    console.log(`Role    : ${user.role}`);

    if (!passwordProvided) {
      console.log(`\n-------------------------------------------------`);
      console.log(`Generated One-Time Password: ${password}`);
      console.log(`PLEASE RECORD THIS PASSWORD SECURELY NOW.`);
      console.log(`It will NOT be shown again.`);
      console.log(`-------------------------------------------------`);
    } else {
      console.log(`\nPassword: [Set as provided by command argument / environment]`);
    }
  } catch (err) {
    console.error(`\n[ERROR] Failed to provision administrator in database:`, err);
    console.error(`Please ensure PostgreSQL is running and DATABASE_URL is set in .env.local.`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
