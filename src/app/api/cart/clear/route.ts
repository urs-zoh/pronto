import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request) {
  const data = await req.json();
  const { userId } = data;

  if (!userId) {
    console.error("Missing userId in request");
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: Number(userId) },
    });

    if (!cart) {
      console.error("Cart not found for userId:", userId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}