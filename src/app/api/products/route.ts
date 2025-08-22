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
      include: { category: true, inventory: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST: admin
export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    const adminCheck = await requireAdmin();
    if (adminCheck.error) {
      console.log("Admin check failed:", adminCheck.error);
      return adminCheck.error;
    }

    const json = await request.json();
    console.log("Received data:", json); // Debug log

    // Validate data
    const body = productSchema.parse({
      ...json,
      price: Number(json.price),
      categoryId: Number(json.categoryId),
    });

    console.log("Validated data:", body); // Debug log

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Danh mục không tồn tại" },
        { status: 400 }
      );
    }

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

    console.log("Product created:", product); // Debug log
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    console.error("API Error:", e); // Debug log
    return NextResponse.json(
      { error: e?.message || "Lỗi tạo sản phẩm" },
      { status: 400 }
    );
  }
}
