"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Thay đổi từ next/router sang next/navigation

type ProductForm = {
  name: string;
  description: string;
  price: number;
  categoryId: number; // Sửa từ categoryID thành categoryId để khớp với schema
};

type Category = {
  id: number;
  name: string;
};

export default function CreateProductPage() {
  const { register, handleSubmit } = useForm<ProductForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();
  //lay categories tu api
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setError("Không thể tải danh mục!");
        }
      } catch (error) {
        setError("Lỗi kết nối server!");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    setError("");
    try {
      console.log("Sending data:", data);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        router.push("/products");
      } else {
        console.error("Lỗi tạo sản phẩm");
      }
    } catch (error) {
      setError("Lỗi kết nối server!");
      console.error("Lỗi:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
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
            disabled={loadingCategories}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">
              {loadingCategories ? "Đang tải..." : "Chọn danh mục"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
