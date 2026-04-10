// lib/server/session-manager.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function createAdminSession(
  adminId: string,
  ipAddress: string,
  userAgent?: string
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12); // 12 hour session

  const session = await prisma.adminSession.create({
    data: {
      adminId,
      token,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });

  return session;
}

export async function validateAdminSession(adminId: string): Promise<boolean> {
  const session = await prisma.adminSession.findFirst({
    where: {
      adminId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (session) {
    await prisma.adminSession.update({
      where: { id: session.id },
      data: { lastActive: new Date() },
    });
    return true;
  }

  return false;
}

export async function revokeAdminSession(sessionId: string, revokedBy: string) {
  return prisma.adminSession.update({
    where: { id: sessionId },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
      revokedBy,
    },
  });
}

export async function revokeAllAdminSessions(adminId: string, revokedBy: string) {
  return prisma.adminSession.updateMany({
    where: {
      adminId,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
      revokedBy,
    },
  });
}