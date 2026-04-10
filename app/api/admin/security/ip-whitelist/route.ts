// app/api/admin/security/ip-whitelist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { z } from "zod";

interface WhitelistedIP {
  ip: string;
  description?: string;
  addedAt: string;
  addedBy?: string;
  enabled: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

const addIPSchema = z.object({
  ipAddress: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/),
  description: z.string().min(3).max(200).optional(),
});

const updateIPSchema = z.object({
  description: z.string().min(3).max(200).optional(),
  enabled: z.boolean().optional(),
});

function parseWhitelist(value: unknown): WhitelistedIP[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is WhitelistedIP => 
      typeof item === 'object' && item !== null && 
      'ip' in item && typeof item.ip === 'string' &&
      'addedAt' in item && typeof item.addedAt === 'string' &&
      'enabled' in item && typeof item.enabled === 'boolean'
    );
  }
  return [];
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const headersList = await headers();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");

    const whitelistConfig = await prisma.adminConfig.findUnique({ where: { key: "ip_whitelist" } });
    let whitelistedIPs = whitelistConfig?.value ? parseWhitelist(whitelistConfig.value) : [];
    
    if (search) {
      whitelistedIPs = whitelistedIPs.filter(item => 
        item.ip.includes(search) || item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = whitelistedIPs.length;
    const paginatedIPs = whitelistedIPs.slice((page - 1) * limit, page * limit);

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_IP_WHITELIST",
      entity: "SECURITY",
      metadata: { ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({
      ips: paginatedIPs,
      stats: { total, enabled: whitelistedIPs.filter(ip => ip.enabled !== false).length, disabled: whitelistedIPs.filter(ip => ip.enabled === false).length },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("IP whitelist fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch IP whitelist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const headersList = await headers();
    const validated = addIPSchema.parse(await req.json());

    const whitelistConfig = await prisma.adminConfig.findUnique({ where: { key: "ip_whitelist" } });
    const whitelistedIPs = whitelistConfig?.value ? parseWhitelist(whitelistConfig.value) : [];
    
    if (whitelistedIPs.find(item => item.ip === validated.ipAddress)) {
      return NextResponse.json({ error: "IP already whitelisted" }, { status: 400 });
    }

    const newIP: WhitelistedIP = {
      ip: validated.ipAddress,
      description: validated.description || "",
      addedAt: new Date().toISOString(),
      addedBy: admin.id,
      enabled: true,
    };
    whitelistedIPs.push(newIP);

    await prisma.adminConfig.upsert({
      where: { key: "ip_whitelist" },
      update: { value: JSON.parse(JSON.stringify(whitelistedIPs)), updatedBy: admin.id },
      create: { key: "ip_whitelist", value: JSON.parse(JSON.stringify(whitelistedIPs)), category: "SECURITY", description: "Admin IP whitelist", updatedBy: admin.id },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "ADD_IP_WHITELIST",
      entity: "SECURITY",
      changes: { after: JSON.parse(JSON.stringify(newIP)) },
      metadata: { ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({ success: true, ip: newIP });
  } catch (error) {
    console.error("IP whitelist add error:", error);
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed to add IP" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const headersList = await headers();
    const ipToRemove = req.nextUrl.searchParams.get("ip");
    
    if (!ipToRemove) return NextResponse.json({ error: "IP required" }, { status: 400 });

    const whitelistConfig = await prisma.adminConfig.findUnique({ where: { key: "ip_whitelist" } });
    if (!whitelistConfig?.value) return NextResponse.json({ error: "Whitelist empty" }, { status: 404 });

    const whitelistedIPs = parseWhitelist(whitelistConfig.value);
    const removedIP = whitelistedIPs.find(item => item.ip === ipToRemove);
    const updatedWhitelist = whitelistedIPs.filter(item => item.ip !== ipToRemove);

    await prisma.adminConfig.update({
      where: { key: "ip_whitelist" },
      data: { value: JSON.parse(JSON.stringify(updatedWhitelist)), updatedBy: admin.id },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "REMOVE_IP_WHITELIST",
      entity: "SECURITY",
      changes: removedIP ? { before: JSON.parse(JSON.stringify(removedIP)) } : undefined,
      metadata: { ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("IP whitelist remove error:", error);
    return NextResponse.json({ error: "Failed to remove IP" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const headersList = await headers();
    const ipToUpdate = req.nextUrl.searchParams.get("ip");
    const validated = updateIPSchema.parse(await req.json());
    
    if (!ipToUpdate) return NextResponse.json({ error: "IP required" }, { status: 400 });

    const whitelistConfig = await prisma.adminConfig.findUnique({ where: { key: "ip_whitelist" } });
    if (!whitelistConfig?.value) return NextResponse.json({ error: "Whitelist not found" }, { status: 404 });

    const whitelistedIPs = parseWhitelist(whitelistConfig.value);
    const ipIndex = whitelistedIPs.findIndex(item => item.ip === ipToUpdate);
    if (ipIndex === -1) return NextResponse.json({ error: "IP not found" }, { status: 404 });

    const beforeUpdate = { ...whitelistedIPs[ipIndex] };
    if (validated.description !== undefined) whitelistedIPs[ipIndex].description = validated.description;
    if (validated.enabled !== undefined) whitelistedIPs[ipIndex].enabled = validated.enabled;
    whitelistedIPs[ipIndex].updatedAt = new Date().toISOString();
    whitelistedIPs[ipIndex].updatedBy = admin.id;

    await prisma.adminConfig.update({
      where: { key: "ip_whitelist" },
      data: { value: JSON.parse(JSON.stringify(whitelistedIPs)), updatedBy: admin.id },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "UPDATE_IP_WHITELIST",
      entity: "SECURITY",
      changes: { before: JSON.parse(JSON.stringify(beforeUpdate)), after: JSON.parse(JSON.stringify(whitelistedIPs[ipIndex])) },
      metadata: { ipAddress: headersList.get("x-forwarded-for") || "unknown" },
    });

    return NextResponse.json({ success: true, ip: whitelistedIPs[ipIndex] });
  } catch (error) {
    console.error("IP whitelist update error:", error);
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed to update IP" }, { status: 500 });
  }
}