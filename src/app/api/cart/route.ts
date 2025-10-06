export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/lib/api-guard";

const prisma = new PrismaClient();

// GET: lấy giỏ hiện tại của user
export async function GET() {
  const { session, error } = await requireUser();
  if (error) return error;

  const cart = await prisma.cart.findUnique({
    where: { userId: Number(session!.user.id) },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, price: true } },
        },
      },
    },
  });

  return NextResponse.json(cart || { items: [] });
}

// POST: thêm vào giỏ { productId, quantity }
export async function POST(req: NextRequest) {
  const { session, error } = await requireUser();
  if (error) return error;

  const { productId, quantity = 1 } = await req.json();

  if (!productId || Number(quantity) <= 0) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  // đảm bảo có cart
  const cart = await prisma.cart.upsert({
    where: { userId: Number(session!.user.id) },
    update: {},
    create: { userId: Number(session!.user.id) },
  });

  // nếu đã có item thì tăng số lượng
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: Number(productId) },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + Number(quantity) },
    });
    return NextResponse.json(updated, { status: 200 });
  }

  const created = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: Number(productId),
      quantity: Number(quantity),
    },
  });

  return NextResponse.json(created, { status: 201 });
}

// PATCH: cập nhật số lượng { productId, quantity }
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireUser();
  if (error) return error;

  const { productId, quantity } = await req.json();
  if (!productId || quantity == null || Number(quantity) < 1) {
    return NextResponse.json(
      { error: "Số lượng không hợp lệ" },
      { status: 400 }
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: Number(session!.user.id) },
  });
  if (!cart)
    return NextResponse.json({ error: "Chưa có giỏ" }, { status: 404 });

  const updated = await prisma.cartItem.updateMany({
    where: { cartId: cart.id, productId: Number(productId) },
    data: { quantity: Number(quantity) },
  });

  return NextResponse.json({ updated: updated.count }, { status: 200 });
}

// DELETE: xóa item ?productId=...
export async function DELETE(req: NextRequest) {
  const { session, error } = await requireUser();
  if (error) return error;

  const productId = Number(new URL(req.url).searchParams.get("productId"));
  if (!productId) {
    return NextResponse.json({ error: "Thiếu productId" }, { status: 400 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: Number(session!.user.id) },
  });
  if (!cart) return NextResponse.json({ ok: true });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
