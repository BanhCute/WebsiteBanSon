"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Navigation() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Website Bán Sơn
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/products" className="hover:text-blue-600 transition">
            Sản phẩm
          </Link>

          {session ? (
            <>
              <Link href="/cart" className="hover:text-blue-600 transition">
                Giỏ hàng
              </Link>
              <Link href="/orders" className="hover:text-blue-600 transition">
                Đơn hàng
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-blue-600 transition"
              >
                Tài khoản
              </Link>
              {session.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-gray-600">
                Xin chào, {session.user?.name}
              </span>
              <Link
                href="/api/auth/signout"
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Đăng xuất
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
