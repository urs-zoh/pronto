import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  const data = await req.json();
  const { userId, itemId, quantity } = data;

  if (!userId || !itemId || quantity === undefined) {
    return NextResponse.json({ error: "Missing userId, itemId, or quantity" }, { status: 400 });
  }

  if (quantity < 0) {
    return NextResponse.json({ error: "Quantity cannot be negative" }, { status: 400 });
  }

  try {
    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: Number(userId) },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          itemId: Number(itemId),
        },
      });
      return NextResponse.json({ message: "Item removed from cart" });
    } else {
      // Update or create cart item
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          itemId: Number(itemId),
        },
      });

      let cartItem;
      if (existingCartItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: Number(quantity) },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            itemId: Number(itemId),
            quantity: Number(quantity),
          },
        });
      }

      return NextResponse.json(cartItem);
    }
  } catch (err) {
    console.error("Error updating cart item:", err);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}