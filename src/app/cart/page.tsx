"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  quantity: number;
  product: { id: number; name: string; price: number };
};
type Cart = { items: CartItem[] };

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      setCart(data || { items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const updateQty = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setMsg("");
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) load();
  };

  const removeItem = async (productId: number) => {
    setMsg("");
    const res = await fetch(`/api/cart?productId=${productId}`, {
      method: "DELETE",
    });
    if (res.ok) load();
  };

  if (loading) {
    return <div className="container mx-auto p-4">Đang tải giỏ hàng...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded p-6 text-center">
          <p>Giỏ hàng trống.</p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded p-3"
              >
                <div>
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.product.price.toLocaleString()}đ
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      updateQty(item.product.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    className="w-12 text-center border rounded py-1"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQty(
                        item.product.id,
                        Math.max(1, Number(e.target.value))
                      )
                    }
                  />
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      updateQty(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="ml-3 text-red-600 hover:underline"
                    onClick={() => removeItem(item.product.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-white rounded p-4 border">
            <div className="text-lg">
              Tổng tiền:{" "}
              <span className="font-bold text-blue-600">
                {total.toLocaleString()}đ
              </span>
            </div>
            <Link
              href="/orders"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={async (e) => {
                e.preventDefault();
                setMsg("");
                const res = await fetch("/api/orders", { method: "POST" });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                  setMsg("Đặt hàng thành công!");
                  await load();
                  window.location.href = "/orders";
                } else {
                  setMsg(data.error || "Không thể đặt hàng");
                }
              }}
            >
              Đặt hàng
            </Link>
          </div>

          {msg && <div className="mt-3 text-sm text-gray-700">{msg}</div>}
        </>
      )}
    </div>
  );
}
