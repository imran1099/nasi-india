import { prisma } from "@/lib/db";
import { AuditAction, type Prisma } from "@prisma/client";

interface AuditLogParams {
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  changes?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Persists an audit log event to PostgreSQL.
 * Safely fails without crashing callers if DB is unavailable.
 */
export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        changes: params.changes ?? undefined,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch (err) {
    console.warn("[logAuditEvent] Warning: Could not write audit log:", err);
  }
}

