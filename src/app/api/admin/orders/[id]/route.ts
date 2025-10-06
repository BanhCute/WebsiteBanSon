export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/api-guard";
import { z } from "zod";

const prisma = new PrismaClient();

const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  shippingFee: z.number().nonnegative().optional(),
});

// PUT: cập nhật đơn hàng (admin)
export async function PUT(req: NextRequest, { params }: any) {
  const id = Number(params.id);
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const id = Number(params.id);
    const json = await req.json();
    const body = updateOrderSchema.parse(json);

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...body,
        updatedBy: 1, // ID admin (có thể lấy từ session sau)
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Lỗi cập nhật" },
      { status: 400 }
    );
  }
}
