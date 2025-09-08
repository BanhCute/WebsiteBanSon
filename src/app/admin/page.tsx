import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý sản phẩm</h2>
          <Link
            href="/products/create"
            className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Thêm sản phẩm mới
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý sản phẩm</h2>
          <Link
            href="/admin/categories"
            className="block bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700 transition"
          >
            Thêm danh mục
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
          <Link
            href="/admin/orders"
            className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Xem đơn hàng
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
          <Link
            href="/admin/stats"
            className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Xem thống kê
          </Link>
        </div>
      </div>
    </div>
  );
}
