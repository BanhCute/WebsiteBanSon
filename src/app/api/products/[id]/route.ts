export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/api-guard";
import { z } from "zod";

const prisma = new PrismaClient();

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  colors: z.any().optional(),
  categoryId: z.number().int().optional(),
});

// GET /api/products/:id
export async function GET(_req: Request, ctx: any) {
  const id = Number(ctx.params.id);
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true, inventory: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  }
  return NextResponse.json(product);
}

// PUT /api/products/:id (admin)
export async function PUT(req: NextRequest, ctx: any) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const id = Number(ctx.params.id);
    const json = await req.json();
    const body = updateSchema.parse({
      ...json,
      price: json.price != null ? Number(json.price) : undefined,
      categoryId: json.categoryId != null ? Number(json.categoryId) : undefined,
    });
    const updated = await prisma.product.update({ where: { id }, data: body });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Lỗi cập nhật" },
      { status: 400 }
    );
  }
}

// DELETE /api/products/:id (admin) - soft delete
export async function DELETE(_req: NextRequest, ctx: any) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const id = Number(ctx.params.id);
    const deleted = await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
    return NextResponse.json(deleted);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Lỗi xóa" },
      { status: 400 }
    );
  }
}
