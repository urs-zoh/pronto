import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId parameter", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { created_at: "desc" },
    include: {
      orderItems: {
        include: {
          item: {
            include: {
              business: {
                include: {
                  workingHours: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Convert Decimal fields to number
  const safeOrders = orders.map((order) => ({
    ...order,
    total_amount: Number(order.total_amount),
  }));

  return Response.json(safeOrders);
}