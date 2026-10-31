import { NextRequest, NextResponse } from "next/server";
import { publishScheduledContent } from "@/lib/scheduler";

export async function GET(req: NextRequest) {
  // Check authorization header if CRON_SECRET is configured
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await publishScheduledContent();

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    ...result,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

