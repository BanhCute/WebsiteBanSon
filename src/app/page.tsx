"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Tránh hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Không render gì cho đến khi component đã mount
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Đang tải...</div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/*Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center ">
          <div className="text-2xl font-bold text-blue-600">
            Website Bán Sơn
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="/products" className="hover:text-blue-600 transition">
              Sản phẩm
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition">
              Giới thiệu
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition">
              Liên hệ
            </Link>

            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Xin chào, {session.user?.name}
                </span>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Tài khoản
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Sơn Chất Lượng Cao
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sơn đa dạng với chất lượng cao, giá cả hợp lý.
            Từ sơn nội thất đến ngoại thất, chúng tôi có tất cả những gì bạn
            cần.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Xem sản phẩm
            </Link>
            {!session && (
              <Link
                href="/register"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
              >
                Đăng ký ngay
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tại sao chọn chúng tôi?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Đa dạng màu sắc</h3>
            <p className="text-gray-600">
              Hàng trăm màu sắc khác nhau để bạn lựa chọn
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Chất lượng cao</h3>
            <p className="text-gray-600">
              Sản phẩm được kiểm định chất lượng nghiêm ngặt
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
            <p className="text-gray-600">Giao hàng trong vòng 24h tại Hà Nội</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Website Bán Sơn. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
      />
    </div>
  );
}
