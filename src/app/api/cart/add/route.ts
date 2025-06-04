import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json();
  const { userId, itemId, quantity = 1 } = data;

  if (!userId || !itemId) {
    return NextResponse.json({ error: "Missing userId or itemId" }, { status: 400 });
  }

  try {
    // First, find or create the user's cart
    let cart = await prisma.cart.findFirst({
      where: { userId: Number(userId) },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: Number(userId),
        },
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        itemId: Number(itemId),
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Update existing cart item quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + Number(quantity),
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          itemId: Number(itemId),
          quantity: Number(quantity),
        },
      });
    }

    return NextResponse.json(cartItem);
  } catch (err) {
    console.error("Error adding item to cart:", err);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}