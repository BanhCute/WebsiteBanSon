"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Thay đổi từ next/router sang next/navigation

type ProductForm = {
  name: string;
  description: string;
  price: number;
  categoryId: number; // Sửa từ categoryID thành categoryId để khớp với schema
};

export default function CreateProductPage() {
  const { register, handleSubmit } = useForm<ProductForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/products");
      } else {
        console.error("Lỗi tạo sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
          <input
            {...register("name", { required: "Vui lòng nhập tên sản phẩm" })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Nhập mô tả sản phẩm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Giá</label>
          <input
            {...register("price", {
              valueAsNumber: true,
              required: "Vui lòng nhập giá sản phẩm",
            })}
            type="number"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập giá sản phẩm"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <select
            {...register("categoryId", {
              valueAsNumber: true,
              required: "Vui lòng chọn danh mục",
            })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Chọn danh mục</option>
            <option value="1">Sơn nội thất</option>
            <option value="2">Sơn ngoại thất</option>
            <option value="3">Sơn chống thấm</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Đang tạo..." : "Tạo sản phẩm"}
        </button>
      </form>
    </div>
  );
}
