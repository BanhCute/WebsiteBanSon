import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

const prisma = new PrismaClient();

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: { category: true, inventory: true },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        {session?.user?.role === "admin" && (
          <Link
            href="/products/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Thêm sản phẩm
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Chưa có sản phẩm nào.</p>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Quay lại trang chủ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLoggedIn={!!session}
            />
          ))}
        </div>
      )}
    </div>
  );
}
