"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Website Bán Sơn
        </Link>

        <div className="flex gap-4">
          <Link href="/products" className="hover:underline">
            Sản phẩm
          </Link>
          <Link href="/cart" className="hover:underline">
            Giỏ hàng
          </Link>

          {session ? (
            <div className="flex gap-2 items-center">
              <span>Xin chào, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
