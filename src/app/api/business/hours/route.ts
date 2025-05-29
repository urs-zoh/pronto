/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  type JwtPayload = { id: string; email: string; type: string };

  let payload: JwtPayload;
  try {
    const result = verifyToken(token); // must return { id, email, type }
    if (typeof result !== "object" || !result || !("type" in result)) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 403 });
    }
    payload = result as JwtPayload;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  if (payload.type !== "business") {
    return NextResponse.json({ error: "Only businesses can submit working hours" }, { status: 403 });
  }

  const body = await req.json();

  try {
    // Remove any existing hours before saving new ones
    await prisma.workingHour.deleteMany({
      where: { businessId: Number(payload.id) },
    });

    // Format the data and insert
    const newHours = body.map((entry: any) => ({
      businessId: payload.id,
      day: entry.day,
      opens_at: entry.is247 ? "00:00" : entry.from,
      closes_at: entry.is247 ? "23:59" : entry.to,
    }));

    await prisma.workingHour.createMany({ data: newHours });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ERROR] Saving working hours:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}