import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name, type, unitType } = body;

  if (!email || !password || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let existing;
  if (type === "business") {
    existing = await prisma.business.findUnique({ where: { email } });
  } else if (type === "user") {
    existing = await prisma.user.findUnique({ where: { email } });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (existing) {
    return NextResponse.json({ error: "Email already used" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  let newUser;
  if (type === "business") {
    newUser = await prisma.business.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: body.role,
        address: body.address,
        zip_code: body.zip_code,
        ...(unitType ? { unitType } : {}),
      },
    });
  } else {
    newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: body.role,
        zip_code: body.zip_code,
      },
    });
  }

  return NextResponse.json({ id: newUser.id, email: newUser.email });
}