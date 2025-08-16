"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import ConfirmModal from "@/components/ConfirmModal";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Tránh hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  // Nếu chưa đăng nhập, chuyển về trang login
  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router, mounted]);

  // Loading khi đang kiểm tra session hoặc chưa mount
  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  if (!session) {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            Website Bán Sơn
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="hover:text-blue-600 transition">
              Trang chủ
            </Link>
            <Link href="/products" className="hover:text-blue-600 transition">
              Sản phẩm
            </Link>
            <Link href="/cart" className="hover:text-blue-600 transition">
              Giỏ hàng
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Xin chào, {session.user?.name}
              </span>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Thông tin tài khoản
          </h1>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Thông tin cá nhân
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <p className="text-lg text-gray-900">{session.user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{session.user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <p className="text-lg text-gray-900 capitalize">
                  {session.user?.role || "Người dùng"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Đơn hàng của tôi
              </h3>
              <p className="text-gray-600 mb-4">
                Xem lịch sử đơn hàng và trạng thái giao hàng
              </p>
              <Link
                href="/orders"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Xem đơn hàng
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Giỏ hàng
              </h3>
              <p className="text-gray-600 mb-4">
                Quản lý sản phẩm trong giỏ hàng
              </p>
              <Link
                href="/cart"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Xem giỏ hàng
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Cập nhật thông tin
              </h3>
              <p className="text-gray-600 mb-4">
                Thay đổi thông tin cá nhân và mật khẩu
              </p>
              <Link
                href="/profile/edit"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Cập nhật
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              Đơn hàng gần đây
            </h3>
            <div className="text-center py-8 text-gray-500">
              <p>Bạn chưa có đơn hàng nào.</p>
              <Link
                href="/products"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Mua sắm ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

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
