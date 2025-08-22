import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function ProducsPage() {
  const session = await getServerSession(authOptions);
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: { category: true },
  });
  return (
    <div className=" container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold ">Danh sách sản phẩm</h1>
        {session?.user?.role === "admin" && (
          <Link
            href="/products/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Thêm sản phẩm
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <h3 className="font-semibold "> {product.name}</h3>
            <p className="text-gray-600"> {product.description}</p>
            <p className="text-blue-600 font-bold">
              {product.price.toLocaleString()}đ
            </p>
            <p className="text-sm text-gray-500">{product.category.name}</p>
          </div>
        ))}
      </div>
      <Link
        href="/"
        className="bg-blue-600 text-white px-4 py-2  rounded hover:bg-blue-700 transition"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}
