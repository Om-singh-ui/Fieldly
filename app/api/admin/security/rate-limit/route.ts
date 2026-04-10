// app/api/admin/security/rate-limit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { z } from "zod";

interface RateLimitEndpoint {
  maxRequests: number;
  windowSeconds: number;
  enabled: boolean;
}

interface RateLimitConfig {
  [endpoint: string]: RateLimitEndpoint;
}

const updateRateLimitSchema = z.object({
  endpoint: z.string().min(1),
  maxRequests: z.number().min(1).max(10000),
  windowSeconds: z.number().min(1).max(3600),
  enabled: z.boolean().optional(),
});

const defaultConfig: RateLimitConfig = {
  global: { maxRequests: 100, windowSeconds: 60, enabled: true },
  admin: { maxRequests: 200, windowSeconds: 60, enabled: true },
  api: { maxRequests: 1000, windowSeconds: 60, enabled: true },
  auth: { maxRequests: 10, windowSeconds: 60, enabled: true },
};

function parseRateLimitConfig(value: unknown): RateLimitConfig {
  if (typeof value === 'object' && value !== null) {
    const config: RateLimitConfig = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (typeof val === 'object' && val !== null) {
        const e = val as Record<string, unknown>;
        if (typeof e.maxRequests === 'number' && typeof e.windowSeconds === 'number' && typeof e.enabled === 'boolean') {
          config[key] = { maxRequests: e.maxRequests, windowSeconds: e.windowSeconds, enabled: e.enabled };
        }
      }
    }
    return Object.keys(config).length > 0 ? config : defaultConfig;
  }
  return defaultConfig;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();

    const rateLimitConfig = await prisma.adminConfig.findUnique({ where: { key: "rate_limit_config" } });
    const config = rateLimitConfig?.value ? parseRateLimitConfig(rateLimitConfig.value) : defaultConfig;

    const activeRateLimits = await prisma.rateLimit.findMany({
      where: { resetAt: { gt: new Date() }, count: { gt: 0 } },
      orderBy: { count: "desc" },
      take: 50,
    });

    const violations = await prisma.securityEvent.findMany({
      where: { type: "RATE_LIMIT_EXCEEDED", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_RATE_LIMITS",
      entity: "SECURITY",
      metadata: { ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({
      config,
      activeRateLimits: activeRateLimits.map(r => ({ ...r, resetAt: r.resetAt.toISOString() })),
      violations: violations.map(v => ({ ...v, createdAt: v.createdAt.toISOString() })),
      stats: { activeLimits: activeRateLimits.length, violations24h: violations.length },
    });
  } catch (error) {
    console.error("Rate limit fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch rate limit data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const headersList = await headers();
    const validated = updateRateLimitSchema.parse(await req.json());

    const rateLimitConfig = await prisma.adminConfig.findUnique({ where: { key: "rate_limit_config" } });
    const currentConfig = rateLimitConfig?.value ? parseRateLimitConfig(rateLimitConfig.value) : { ...defaultConfig };
    
    const updatedConfig = {
      ...currentConfig,
      [validated.endpoint]: {
        maxRequests: validated.maxRequests,
        windowSeconds: validated.windowSeconds,
        enabled: validated.enabled !== false,
      },
    };

    await prisma.adminConfig.upsert({
      where: { key: "rate_limit_config" },
      update: { value: JSON.parse(JSON.stringify(updatedConfig)), updatedBy: admin.id },
      create: { key: "rate_limit_config", value: JSON.parse(JSON.stringify(updatedConfig)), category: "SECURITY", description: "Rate limit configuration", updatedBy: admin.id },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "UPDATE_RATE_LIMIT",
      entity: "SECURITY",
      changes: { endpoint: validated.endpoint, config: JSON.parse(JSON.stringify(updatedConfig[validated.endpoint])) },
      metadata: { ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({ success: true, config: updatedConfig[validated.endpoint] });
  } catch (error) {
    console.error("Rate limit update error:", error);
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed to update rate limit" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { key } = await req.json();

    if (key) await prisma.rateLimit.update({ where: { key }, data: { count: 0 } });
    else await prisma.rateLimit.updateMany({ data: { count: 0 } });

    await logDetailedAction({
      adminId: admin.id,
      action: "RESET_RATE_LIMITS",
      entity: "SECURITY",
      metadata: { key: key || "all", ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({ success: true, message: key ? `Rate limit reset for ${key}` : "All rate limits reset" });
  } catch (error) {
    console.error("Rate limit reset error:", error);
    return NextResponse.json({ error: "Failed to reset rate limits" }, { status: 500 });
  }
}