import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request) {
  const data = await req.json();
  const { userId, itemId } = data;

  if (!userId || !itemId) {
    return NextResponse.json({ error: "Missing userId or itemId" }, { status: 400 });
  }

  try {
    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: Number(userId) },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove the cart item completely
    const deletedCartItem = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        itemId: Number(itemId),
      },
    });

    if (deletedCartItem.count === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item removed from cart successfully" });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}

