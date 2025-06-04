/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        carts: true,
        orders: true,
        userOrderHistories: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't send password back to client
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const { name, email, zip_code, password, role } = body;

    // Validate role if provided
    let roleToUpdate: UserRole | undefined = undefined;
    if (role) {
      if (Object.values(UserRole).includes(role)) {
        roleToUpdate = role;
      } else {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
    }

    const dataToUpdate: any = { name, email, zip_code };
    if (roleToUpdate) dataToUpdate.role = roleToUpdate;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    // Remove password before sending back
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pwd, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("[USER_PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    // Remove password before sending back
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = deletedUser;

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}