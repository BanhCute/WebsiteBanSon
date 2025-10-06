"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: { name: string };
  inventory: { id: number; productId: number; stock: number }[] | null; // Sửa thành array
};

type ProductCardProps = {
  product: Product;
  isLoggedIn: boolean;
};

export default function ProductCard({ product, isLoggedIn }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Debug log để xem dữ liệu
  console.log(`Product ${product.id} inventory:`, product.inventory);

  const addToCart = async () => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    setAdding(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (response.ok) {
        alert("Đã thêm vào giỏ hàng!");
      } else {
        const data = await response.json();
        alert(data.error || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
    setAdding(false);
  };

  // Lấy stock từ inventory array
  const inventory = product.inventory?.[0]; // Lấy inventory đầu tiên
  const stock = inventory?.stock || 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Hình ảnh sản phẩm tạm */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Hình ảnh sản phẩm</span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description || "Chưa có mô tả"}
        </p>
        <p className="text-blue-600 font-bold text-lg mb-2">
          {product.price.toLocaleString()}đ
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Danh mục: {product.category.name}
        </p>

        {/* Debug: Hiển thị thông tin inventory */}
        <div className="text-sm text-gray-500 mb-3">
          <p>
            Tồn kho: {stock}
            {/* (Debug: inventory ={" "}
            {JSON.stringify(product.inventory)}) */}
          </p>
        </div>

        {/* Chọn số lượng và nút thêm vào giỏ */}
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium">Số lượng:</label>
          <input
            type="number"
            min="1"
            max={stock || 999}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-16 border rounded px-2 py-1 text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-center hover:bg-gray-200 transition"
          >
            Xem chi tiết
          </Link>

          {isLoggedIn ? (
            <button
              onClick={addToCart}
              disabled={adding || isOutOfStock}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {adding ? "Đang thêm..." : "Thêm vào giỏ"}
            </button>
          ) : (
            <Link
              href="/login"
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-center hover:bg-blue-700 transition"
            >
              Đăng nhập để mua
            </Link>
          )}
        </div>

        {isOutOfStock && <p className="text-red-500 text-sm mt-2">Hết hàng</p>}
      </div>
    </div>
  );
}
