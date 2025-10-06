export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/api-guard";
import { z } from "zod";

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  colors: z.any().optional(),
  categoryId: z.number().int(),
});

// GET
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: true,
        inventory: true, // Đảm bảo có dòng này
      },
    });
    console.log("Products with inventory:", products); // Debug log
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST: admin
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const json = await request.json();
    const body = productSchema.parse({
      ...json,
      price: Number(json.price),
      categoryId: Number(json.categoryId),
    });

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        colors: body.colors || [],
        categoryId: body.categoryId,
      },
    });

    // Tạo inventory rỗng cho product mới
    await prisma.inventory.create({
      data: { productId: product.id, stock: 0 },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Lỗi tạo sản phẩm" },
      { status: 400 }
    );
  }
}
