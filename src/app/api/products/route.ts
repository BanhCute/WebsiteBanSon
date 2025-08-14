import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { TelemetryPlugin } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin";

const prisma = new PrismaClient();

// GET
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      include: { category: true, inventory: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server " }, { status: 500 });
  }
}
//POSt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        colors: body.colors,
        categoryId: body.categoryId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo sản phẩm " }, { status: 400 });
  }
}
