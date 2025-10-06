import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

// Nếu bạn muốn luôn chạy server-side cho trang này:
// export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function ProductDetailPage({ params }: any) {
  const id = Number(params.id);
  if (!id || Number.isNaN(id)) notFound();

  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: { category: true, inventory: true },
  });

  if (!product) notFound();

  // colors lưu JSON (mảng màu), có thể là string[] hoặc object[]
  const colors = Array.isArray(product.colors) ? (product.colors as any[]) : [];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <a href="/products" className="text-blue-600 hover:underline">
          ← Quay lại danh sách
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Hình minh họa tạm */}
        <div className="w-full h-64 bg-gray-100 rounded" />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-2">
            Thương hiệu: {product.category?.name || "Không có"}
          </p>
          <p className="text-blue-600 font-semibold text-xl mb-4">
            {product.price.toLocaleString()}đ
          </p>

          {Array.isArray(product.inventory) && product.inventory.length > 0 && (
            <p className="text-sm text-gray-500 mb-2">
              Tồn kho: {product.inventory[0].stock}
            </p>
          )}

          {colors.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Màu sắc:</div>
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => {
                  const label = typeof c === "string" ? c : c?.name || "Màu";
                  const swatch = typeof c === "string" ? c : c?.hex || "#ccc";
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2 py-1 border rounded"
                    >
                      <span
                        className="inline-block w-4 h-4 rounded"
                        style={{ backgroundColor: swatch }}
                        title={label}
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-gray-700 leading-7 whitespace-pre-wrap">
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
