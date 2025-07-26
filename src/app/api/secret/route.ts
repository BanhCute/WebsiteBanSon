"use client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Bạn chưa đăng nhập!", { status: 401 });
  }

  return new Response("Đây là API bí mật chỉ user đăng nhập mới xem được!");
}
