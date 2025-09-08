"use client";

import { headers } from "next/headers";
import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const addToCart = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantiny: qty }),
      });
      if (res.ok) {
        setMsg("Đã thêm vào giỏ hàng!");
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error || "Không thể thêm vào giỏ");
      }
    } catch {
      setMsg("Lỗi kết nối server");
    }
    setLoading(false);
  };
  return (
    <div className="mt-4 flex items-center gap-3">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="w-20 border rounded px-2 py-1"
      />
      <button
        onClick={addToCart}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>
      {msg && <span className="text-sm text-gray-600">{msg}</span>}
    </div>
  );
}
