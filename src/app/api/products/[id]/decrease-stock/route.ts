import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      console.error("Missing userId in request");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      console.error("Cart is empty or not found for userId:", userId);
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Check stock availability
    for (const cartItem of cart.cartItems) {
      if (cartItem.item.stock_quantity < cartItem.quantity) {
        console.error(
          `Item "${cartItem.item.name}" has only ${cartItem.item.stock_quantity} left in stock.`
        );
        return NextResponse.json(
          {
            error: `Item "${cartItem.item.name}" has only ${cartItem.item.stock_quantity} left in stock.`,
          },
          { status: 400 }
        );
      }
    }

    // Group items by business
    const itemsByBusiness = cart.cartItems.reduce((acc, ci) => {
      const businessId = ci.item.businessId;
      if (!acc[businessId]) acc[businessId] = [];
      acc[businessId].push(ci);
      return acc;
    }, {} as Record<number, typeof cart.cartItems>);

    const createdOrders = [];

    for (const [businessIdStr, cartItems] of Object.entries(itemsByBusiness)) {
      const businessId = parseInt(businessIdStr);

      const totalAmount = cartItems.reduce((sum, ci) => {
        return sum + Number(ci.item.price) * ci.quantity;
      }, 0);

      const order = await prisma.order.create({
        data: {
          userId,
          businessId,
          total_amount: totalAmount,
          status: "pending",
          orderItems: {
            create: cartItems.map((ci) => ({
              itemId: ci.item.id,
              quantity: ci.quantity,
              price_per_unit: ci.item.price,
              unit: ci.item.unit,
            })),
          },
          userOrderHistories: {
            create: {
              userId,
            },
          },
          businessOrderHistories: {
            create: {
              businessId,
            },
          },
        },
      });

      // Decrease stock
      for (const ci of cartItems) {
        await prisma.item.update({
          where: { id: ci.item.id },
          data: {
            stock_quantity: {
              decrement: ci.quantity,
            },
          },
        });
      }

      createdOrders.push(order);
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    console.log("Cart cleared after checkout");
    return NextResponse.json({ success: true, orders: createdOrders });
  } catch (error) {
    console.error("Checkout error:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}