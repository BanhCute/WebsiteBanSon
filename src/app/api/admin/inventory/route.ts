export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/api-guard";
import { z } from "zod";

const prisma = new PrismaClient();

const updateInventorySchema = z.object({
  productId: z.number().int(),
  stock: z.number().int().min(0, "Số lượng tồn kho không được âm"),
});

// GET: Lấy tất cả inventory với thông tin sản phẩm
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        product: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(inventories);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT: Cập nhật stock cho sản phẩm
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const json = await req.json();
    const body = updateInventorySchema.parse({
      productId: Number(json.productId),
      stock: Number(json.stock),
    });

    // Kiểm tra sản phẩm có tồn tại không
    const product = await prisma.product.findUnique({
      where: { id: body.productId, isDeleted: false },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    // Cập nhật hoặc tạo inventory
    const inventory = await prisma.inventory.upsert({
      where: { productId: body.productId },
      update: { stock: body.stock },
      create: {
        productId: body.productId,
        stock: body.stock,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(inventory);
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json(
        { error: e.errors[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: e?.message || "Lỗi cập nhật tồn kho" },
      { status: 400 }
    );
  }
}
