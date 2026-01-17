import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

type TimeRange = "7d" | "30d" | "all";

async function getStats(params?: { range?: string; month?: string }) {
  const now = new Date();
  const rangeParam = params?.range as TimeRange | undefined;
  const monthParam = params?.month;

  let start: Date | undefined;
  let end: Date | undefined;
  let rangeLabel = "Toàn thời gian";

  if (monthParam) {
    const parts = monthParam.split("-");
    if (parts.length === 2) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      if (!Number.isNaN(year) && !Number.isNaN(month)) {
        start = new Date(year, month, 1);
        end = new Date(year, month + 1, 1);
        rangeLabel = `Tháng ${month + 1}/${year}`;
      }
    }
  } else if (rangeParam === "7d") {
    start = new Date(now);
    start.setDate(start.getDate() - 7);
    rangeLabel = "7 ngày gần đây";
  } else if (rangeParam === "30d") {
    start = new Date(now);
    start.setDate(start.getDate() - 30);
    rangeLabel = "30 ngày gần đây";
  }

  const orderWhere: any = { isDeleted: false };
  if (start) {
    orderWhere.createdAt = { gte: start, lt: end || now };
  }

  const [
    productCount,
    categoryCount,
    orderCount,
    totalRevenueAgg,
    pendingOrders,
    orders,
  ] = await Promise.all([
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.category.count(),
    prisma.order.count({ where: orderWhere }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: orderWhere,
    }),
    prisma.order.count({ where: { status: "pending", isDeleted: false } }),
    prisma.order.findMany({
      where: orderWhere,
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, total: true },
    }),
  ]);

  const dailyMap = new Map<string, number>();
  for (const order of orders) {
    const created =
      order.createdAt instanceof Date
        ? order.createdAt
        : new Date(order.createdAt as any);
    const key = created.toISOString().slice(0, 10);
    const current = dailyMap.get(key) || 0;
    dailyMap.set(key, current + Number(order.total));
  }

  const dailyRevenue = Array.from(dailyMap.entries()).map(([date, total]) => ({
    date,
    total,
  }));

  const totalRevenue = totalRevenueAgg._sum.total || 0;

  return {
    productCount,
    categoryCount,
    orderCount,
    totalRevenue,
    pendingOrders,
    dailyRevenue,
    rangeLabel,
  };
}

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;

  const rangeParam =
    typeof resolvedSearchParams?.range === "string"
      ? resolvedSearchParams.range
      : undefined;
  const monthParam =
    typeof resolvedSearchParams?.month === "string"
      ? resolvedSearchParams.month
      : undefined;

  const stats = await getStats({ range: rangeParam, month: monthParam });

  const maxDaily =
    stats.dailyRevenue.length > 0
      ? Math.max(...stats.dailyRevenue.map((d) => d.total))
      : 0;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Thống kê tổng quan</h1>
        <Link href="/admin" className="text-blue-600 hover:underline text-sm">
          ← Quay lại Admin
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/stats?range=7d"
          className={`px-3 py-1 rounded border text-sm ${
            rangeParam === "7d"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          7 ngày
        </Link>
        <Link
          href="/admin/stats?range=30d"
          className={`px-3 py-1 rounded border text-sm ${
            rangeParam === "30d"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          30 ngày
        </Link>
        <Link
          href="/admin/stats?range=all"
          className={`px-3 py-1 rounded border text-sm ${
            !rangeParam || rangeParam === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          Toàn thời gian
        </Link>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Khoảng thời gian: {stats.rangeLabel}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Sản phẩm đang bán</p>
          <p className="text-3xl font-bold">{stats.productCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Danh mục</p>
          <p className="text-3xl font-bold">{stats.categoryCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Tổng đơn hàng</p>
          <p className="text-3xl font-bold">{stats.orderCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-2">Đơn đang chờ xử lý</p>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm text-gray-500 mb-2">Tổng doanh thu</p>
        <p className="text-4xl font-bold text-green-600 mb-4">
          {stats.totalRevenue.toLocaleString()}đ
        </p>
        {stats.dailyRevenue.length === 0 ? (
          <p className="text-sm text-gray-500">
            Không có đơn hàng trong khoảng thời gian này.
          </p>
        ) : (
          <div className="space-y-2">
            {stats.dailyRevenue.map((d) => {
              const widthPercent =
                maxDaily > 0 ? Math.max((d.total / maxDaily) * 100, 5) : 0;
              return (
                <div key={d.date}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{new Date(d.date).toLocaleDateString("vi-VN")}</span>
                    <span>{d.total.toLocaleString()}đ</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded">
                    <div
                      className="h-2 bg-green-500 rounded"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
