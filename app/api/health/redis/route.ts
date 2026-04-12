// app/api/health/redis/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  if (!redis) {
    return NextResponse.json({ status: "Redis not configured" }, { status: 503 });
  }

  try {
    await redis.ping();
    return NextResponse.json({ status: "healthy", timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: String(error) }, { status: 503 });
  }
}