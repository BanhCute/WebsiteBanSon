export const runtime = "nodejs";

import { requireAdmin } from "@/lib/api-guard";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống!"),
});
//GET
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: " Lỗi server" }, { status: 500 });
  }
}
//POST - tao category (admin)
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const json = await request.json();
    const body = categorySchema.parse(json);

    //kiem tra category ton tai chua
    const existing = await prisma.category.findUnique({
      where: { name: body.name },
    });
    if (existing) {
      return NextResponse.json(
        { error: " Danh mục đã tồn tại !" },
        { status: 400 }
      );
    }
    const category = await prisma.category.create({
      data: { name: body.name },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Lỗi tạo danh mục!" },
      { status: 400 }
    );
  }
}
