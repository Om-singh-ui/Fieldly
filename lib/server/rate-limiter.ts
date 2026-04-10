// lib/server/rate-limiter.ts
import { prisma } from "@/lib/prisma";

export async function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowSeconds: number = 60
): Promise<boolean> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);

  const rateLimit = await prisma.rateLimit.upsert({
    where: { key },
    update: {
      count: { increment: 1 },
    },
    create: {
      key,
      endpoint: "admin",
      count: 1,
      resetAt,
    },
  });

  // Reset if window expired
  if (rateLimit.resetAt < now) {
    await prisma.rateLimit.update({
      where: { key },
      data: {
        count: 1,
        resetAt,
      },
    });
    return false;
  }

  return rateLimit.count > maxRequests;
}