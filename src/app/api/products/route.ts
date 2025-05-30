import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const data = await req.json();

  const {
    businessId,
    name,
    image_url,
    price,
    unit,
    amount_per_unit,
    stock_quantity,
  } = data;

  try {
    const product = await prisma.item.create({
      data: {
        businessId,
        name,
        image_url,
        price,
        unit,
        amount_per_unit,
        stock_quantity,
      },
    });

    return NextResponse.json(product);

  } catch (err) {
    console.log({ businessId, name, image_url, price, unit, amount_per_unit, stock_quantity });
    console.error("Error creating product:", err); // Add this
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
  }

  const products = await prisma.item.findMany({
    where: { businessId: Number(businessId) },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(products);
}