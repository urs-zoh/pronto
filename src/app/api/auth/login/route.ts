import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, type } = body;

  if (!email || !password || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let user;
  if (type === "user") {
    user = await prisma.user.findUnique({ where: { email } });
  } else if (type === "business") {
    user = await prisma.business.findUnique({ where: { email } });
  } else {
    return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ error: "Invalid email" }, { status: 401 });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = generateToken({ id: user.id, email: user.email, type });

  return NextResponse.json({ token, user: { id: user.id, email: user.email, type } });
}