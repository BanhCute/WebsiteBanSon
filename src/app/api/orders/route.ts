export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/lib/api-guard";

const prisma = new PrismaClient();

// POST: tạo đơn từ giỏ
export async function POST() {
  const { session, error } = await requireUser();
  if (error) return error;

  const userId = Number(session!.user.id);
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
  }

  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: "pending",
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.product.price,
        })),
      },
    },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  });

  // Xóa cart sau khi tạo order thành công
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return NextResponse.json(order, { status: 201 });
}

// GET: đơn của user
export async function GET() {
  const { session, error } = await requireUser();
  if (error) return error;

  const orders = await prisma.order.findMany({
    where: { userId: Number(session!.user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { name: true } } } }, // thêm dòng này
    },
  });

  return NextResponse.json(orders);
}
