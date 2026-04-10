// lib/server/audit-logger.ts
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Use Prisma's InputJsonValue compatible types
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue | undefined;
}

export interface AuditLogParams {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: JsonObject | null;
  metadata?: JsonObject;
}

export async function logAdminAction(
  adminId: string,
  action: string,
  metadata?: JsonObject
): Promise<void> {
  try {
    const headersList = await headers();
    
    await prisma.adminAction.create({
      data: {
        adminId,
        action,
        entity: "ADMIN",
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
        userAgent: headersList.get("user-agent") || undefined,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}

export async function logDetailedAction(params: AuditLogParams): Promise<void> {
  try {
    const headersList = await headers();
    
    await prisma.adminAction.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        changes: params.changes || undefined,
        metadata: params.metadata || {},
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
        userAgent: headersList.get("user-agent") || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log detailed action:", error);
  }
}