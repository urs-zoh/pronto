import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
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

    // Get all cart items with item details and business info
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        item: {
          include: {
            business: {
              include: {
                workingHours: {
                  where: {
                    day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { id: "desc" },
    });

    // Transform the data to match your ProductResponse interface
    const response = cartItems.map(cartItem => {
      const todayHours = cartItem.item.business.workingHours[0] || null;
      
      return {
        id: cartItem.item.id,
        name: cartItem.item.name,
        image_url: cartItem.item.image_url,
        price: Number(cartItem.item.price),
        unit: cartItem.item.unit,
        amount_per_unit: cartItem.item.amount_per_unit,
        stock_quantity: cartItem.item.stock_quantity,
        in_stock: cartItem.item.stock_quantity > 0,
        cart_quantity: cartItem.quantity,
        business: {
          id: cartItem.item.business.id,
          name: cartItem.item.business.name,
          address: cartItem.item.business.address,
          zip_code: cartItem.item.business.zip_code,
          working_hours_today: todayHours ? {
            opens_at: todayHours.opens_at,
            closes_at: todayHours.closes_at
          } : null
        }
      };
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}