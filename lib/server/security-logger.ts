// lib/server/security-logger.ts
import { prisma } from "@/lib/prisma";

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

interface SecurityEventParams {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: JsonObject;
}

export async function logSecurityEvent(params: SecurityEventParams): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        type: params.type,
        severity: params.severity,
        userId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        metadata: params.metadata || {},
      },
    });

    if (params.severity === "CRITICAL") {
      await sendSecurityAlert(params);
    }
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

async function sendSecurityAlert(params: SecurityEventParams): Promise<void> {
  const webhookUrl = process.env.SECURITY_ALERT_WEBHOOK_URL;
  
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🚨 CRITICAL SECURITY EVENT: ${params.type}`,
          attachments: [{
            color: "danger",
            fields: [
              { title: "Type", value: params.type, short: true },
              { title: "IP Address", value: params.ipAddress, short: true },
              { title: "User ID", value: params.userId || "N/A", short: true },
            ],
          }],
        }),
      });
    } catch (error) {
      console.error("Failed to send security alert:", error);
    }
  } else {
    console.error("🚨 CRITICAL SECURITY EVENT:", params);
  }
}