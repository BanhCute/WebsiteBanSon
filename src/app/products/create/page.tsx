"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";

type ProductForm = {
  name: string;
  description: string;
  price: number;
  categoryID: number;
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
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
    setLoading(false);
  };
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className=" block text-sm font-medium mb-1">
            Tên sản phẩm
          </label>
          <input
            {...register("name")}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            {...register("description")}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Giá</label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Đang tạo..." : "Tạo sản phẩm"}
        </button>
      </form>
    </div>
  );
}
