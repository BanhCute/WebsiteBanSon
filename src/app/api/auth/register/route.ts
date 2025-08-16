import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    //Check email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng!" },
        { status: 400 }
      );
    }
    //Ma Hoa
    const hashedPassword = await bcrypt.hash(password, 12);

    //Tao user moi

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });
    //tao gio hang cho user moi

    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });
    return NextResponse.json(
      { message: "Đăng ký thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ error: "Lỗi server!" }, { status: 500 });
  }
}
