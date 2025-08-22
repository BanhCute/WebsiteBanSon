"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type Category = {
  id: number;
  name: string;
};

type CategoryForm = {
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { register, handleSubmit, reset } = useForm<CategoryForm>();

  //lay categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      setError("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  //tao category moi

  const onSubmit = async (data: CategoryForm) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        reset();
        fetchCategories();
      } else {
        const result = await response.json();
        setError(result.error || "Lỗi tạo danh mục");
      }
    } catch (error) {
      setError("Lỗi kết nối server");
    }
  };
  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý danh mục</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form tạo category */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Thêm danh mục mới</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
          <input
            {...register("name", { required: "Vui lòng nhập tên danh mục" })}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tên danh mục"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Thêm
          </button>
        </form>
      </div>

      {/* Danh sách categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Danh sách danh mục</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center p-3 border rounded"
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">ID: {category.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
