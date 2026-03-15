import { prisma } from "@/lib/prisma";
import { ActivityFeed, Activity } from "../_components/ActivityFeed";
import { Prisma } from "@prisma/client";

type AuditLogRow = Prisma.AuditLogGetPayload<{
  select: {
    id: true;
    action: true;
    metadata: true;
    createdAt: true;
  };
}>;

export async function ActivitySection({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) return null;

  const logs: AuditLogRow[] = await prisma.auditLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      action: true,
      metadata: true,
      createdAt: true,
    },
  });

  const activities: Activity[] = logs.map((log) => ({
    id: log.id,
    type: mapActionToType(log.action),
    message: buildMessage(log),
    timestamp: log.createdAt.toISOString(),
    amount: extractAmount(log.metadata),
  }));

  return <ActivityFeed activities={activities} />;
}

function mapActionToType(action: string): Activity["type"] {
  if (action.includes("APPLICATION")) return "application";
  if (action.includes("LEASE")) return "lease";
  if (action.includes("PAYMENT")) return "payment";
  return "application";
}

function buildMessage(log: Pick<AuditLogRow, "action">): string {
  return log.action.replace(/_/g, " ").toLowerCase();
}

/**
 * SAFE JSON PARSER — NO ANY
 */
function extractAmount(
  metadata: Prisma.JsonValue | null
): number | null {
  if (
    metadata &&
    typeof metadata === "object" &&
    !Array.isArray(metadata) &&
    "amount" in metadata
  ) {
    const value = (metadata as Record<string, unknown>).amount;
    return typeof value === "number" ? value : null;
  }
  return null;
}