"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

export default function Navigation() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 1) ĐÁNH DẤU ĐÃ MOUNT (bạn bị thiếu đoạn này nên Nav biến mất)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2) Lấy lại số lượng giỏ
  const fetchCartCount = useCallback(async () => {
    if (!session) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const count = (data?.items || []).reduce(
          (s: number, i: any) => s + (i.quantity || 0),
          0
        );
        setCartCount(count);
      } else if (res.status === 401) {
        setCartCount(0);
      }
    } catch {
      // ignore
    }
  }, [session]);

  // 3) Load lần đầu và khi đăng nhập/đăng xuất
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // 4) Lắng nghe sự kiện cập nhật giỏ
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.delta) setCartCount((c) => c + Number(detail.delta)); // cập nhật lạc quan
      fetchCartCount(); // đồng bộ lại
    };
    window.addEventListener("cart:updated", handler as EventListener);
    return () =>
      window.removeEventListener("cart:updated", handler as EventListener);
  }, [fetchCartCount]);

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
              <Link
                href="/cart"
                className="relative hover:text-blue-600 transition"
              >
                Giỏ hàng
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2 py-[2px]">
                    {cartCount}
                  </span>
                )}
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
