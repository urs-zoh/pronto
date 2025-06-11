import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        workingHours: true,
        items: true,
        orders: true,
        businessOrderHistories: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error("[BUSINESS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Extract fields to update - validate and sanitize as needed
    const { name, email, address, zip_code, password } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = { name, email, address, zip_code };

    // If password is provided, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    // Remove undefined keys (optional)
    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedBusiness, { status: 200 });
  } catch (error) {
    console.error("[BUSINESS_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedBusiness = await prisma.business.delete({
      where: { id },
    });

    return NextResponse.json(deletedBusiness, { status: 200 });
  } catch (error) {
    console.error("[BUSINESS_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}