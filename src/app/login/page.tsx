"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// 1. Định nghĩa kiểu dữ liệu cho form
type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // 2. Khởi tạo form với React Hook Form
  const { register, handleSubmit } = useForm<LoginForm>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading khi submit
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  //Hien thi thong bao
  useEffect(() => {
    const messageParam = searchParams.get("message");
    if (messageParam) {
      setMessage(messageParam);
    }
  }, [searchParams]);
  // 3. Hàm xử lý khi submit form
  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Sai email hoặc mật khẩu!");
    } else {
      router.push("/dashboard");
    }
  };

  // 4. Giao diện
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      {/* Logo hoặc tên website */}
      <div className="mb-8 flex flex-col items-center">
        {/* Thay bằng logo thật nếu có */}
        <div className="text-3xl font-bold text-blue-700 mb-2">
          Website Bán Sơn
        </div>
        <div className="text-gray-500">
          Đăng nhập tài khoản để mua sơn chất lượng!
        </div>
      </div>
      {/* Form đăng nhập */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm flex flex-col gap-4 border border-blue-200"
      >
        {message && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
            {message}
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Nhập email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Nhập mật khẩu"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <div className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
        {/* Link về trang chủ */}
        <button
          type="button"
          className="text-blue-500 hover:underline text-sm mt-2"
          onClick={() => router.push("/")}
        >
          ← Quay về trang chủ
        </button>
      </form>
    </div>
  );
}
