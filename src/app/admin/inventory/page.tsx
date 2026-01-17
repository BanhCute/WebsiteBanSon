"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Admin Inventory Management Page

type InventoryItem = {
  id: number;
  productId: number;
  stock: number;
  product: {
    id: number;
    name: string;
    price: number;
    category: {
      name: string;
    };
  };
};

export default function AdminInventoryPage() {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [editingStock, setEditingStock] = useState<{
    [key: number]: number;
  }>({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();

      if (res.ok) {
        console.log("Inventory data:", data);
        setInventories(data);
        // Khởi tạo editingStock với giá trị hiện tại
        const initialEditing: { [key: number]: number } = {};
        data.forEach((item: InventoryItem) => {
          initialEditing[item.productId] = item.stock;
        });
        setEditingStock(initialEditing);
        setError(""); // Clear error on success
      } else {
        const errorMsg = data.error || "Không thể tải dữ liệu tồn kho";
        console.error("API Error:", errorMsg, res.status);
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Lỗi tải inventory:", error);
      setError(
        "Lỗi kết nối server. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: number) => {
    const newStock = editingStock[productId];
    if (newStock === undefined || newStock < 0) {
      setError("Số lượng không hợp lệ");
      return;
    }

    setUpdating(productId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock: newStock }),
      });

      if (res.ok) {
        await fetchInventories();
        setSuccess("Cập nhật tồn kho thành công");
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Không thể cập nhật tồn kho");
      }
    } catch (error) {
      setError("Lỗi kết nối server");
    } finally {
      setUpdating(null);
    }
  };

  const handleStockChange = (productId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, numValue),
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Quản lý tồn kho</h1>
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">
            ← Quay lại Admin
          </Link>
        </div>
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tồn kho</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          ← Quay lại Admin
        </Link>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {inventories.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-2">
            {error
              ? `Không thể tải dữ liệu tồn kho: ${error}`
              : "Chưa có sản phẩm nào trong kho."}
          </p>
          {!error && (
            <Link
              href="/products/create"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Thêm sản phẩm mới
            </Link>
          )}
          {error && (
            <button
              onClick={fetchInventories}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : inventories.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho hiện tại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventories.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product.price.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.stock}
                        {item.stock === 0 && (
                          <span className="ml-2 text-red-600 text-xs">
                            (Hết hàng)
                          </span>
                        )}
                        {item.stock > 0 && item.stock < 10 && (
                          <span className="ml-2 text-yellow-600 text-xs">
                            (Sắp hết)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={editingStock[item.productId] ?? item.stock}
                        onChange={(e) =>
                          handleStockChange(item.productId, e.target.value)
                        }
                        className="w-24 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={updating === item.productId}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => updateStock(item.productId)}
                        disabled={
                          updating === item.productId ||
                          editingStock[item.productId] === item.stock
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        {updating === item.productId
                          ? "Đang cập nhật..."
                          : "Cập nhật"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mt-6 text-sm text-gray-600">
        <p>
          <span className="text-red-600">●</span> Hết hàng (0 sản phẩm)
        </p>
        <p>
          <span className="text-yellow-600">●</span> Sắp hết (dưới 10 sản phẩm)
        </p>
      </div>
    </div>
  );
}
