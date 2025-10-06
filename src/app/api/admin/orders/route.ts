export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/api-guard";

const prisma = new PrismaClient();

// GET: tất cả đơn hàng (admin)
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return NextResponse.json(orders);
}
