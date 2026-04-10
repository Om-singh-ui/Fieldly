// lib/server/ip-validator.ts
import { prisma } from "@/lib/prisma";

export async function validateIP(ipAddress: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development") {
    if (ipAddress === "::1" || ipAddress === "127.0.0.1" || ipAddress === "unknown") {
      return true;
    }
  }

  const whitelistConfig = await prisma.adminConfig.findUnique({
    where: { key: "ip_whitelist" },
  });

  if (!whitelistConfig?.value) {
    return ipAddress === "::1" || ipAddress === "127.0.0.1";
  }

  const whitelist = (whitelistConfig.value as { ip: string }[]).map(item => item.ip);
  return whitelist.includes(ipAddress);
}