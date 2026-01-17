"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type ProductForm = {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  colors: string;
};

type Category = {
  id: number;
  name: string;
};

type ProductResponse = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: number;
  colors: any;
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>();

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("ID sản phẩm không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();

        if (!productRes.ok) {
          setError(productData.error || "Không thể tải thông tin sản phẩm");
        } else {
          const product = productData as ProductResponse;
          const colorsValue = Array.isArray(product.colors)
            ? product.colors.join(", ")
            : "";
          reset({
            name: product.name,
            description: product.description || "",
            price: product.price,
            categoryId: product.categoryId,
            colors: colorsValue,
          });
        }

        if (categoryRes.ok) {
          setCategories(categoryData);
        } else {
          setError(
            (prev) =>
              prev || categoryData.error || "Không thể tải danh sách danh mục"
          );
        }
      } catch {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: ProductForm) => {
    setSaving(true);
    setError("");
    try {
      const colorsArray = data.colors
        ? data.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const payload = {
        ...data,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        colors: colorsArray,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok) {
        router.push("/admin/products");
      } else {
        setError(result.error || "Không thể cập nhật sản phẩm");
      }
    } catch {
      setError("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa sản phẩm</h1>

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
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
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
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
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
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Màu sắc</label>
          <input
            {...register("colors")}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ví dụ: đỏ, xanh, vàng"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}

