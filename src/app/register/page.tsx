"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    setloading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      if (response.ok) {
        router.push("/login?message=Đăng ký thành công! Vui lòng đăng nhập.");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Có lỗi xảy ra khi đăng ký!");
      }
    } catch (error) {
      setError("Lỗi kết nối server!");
    }
    setloading(false);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="mb-8 flex flex-col items-center">
        <div className="text-3xl font-bold text-blue-700 mb-2 ">
          Website Bán Sơn
        </div>
        <div className="text-gray-500">
          Tạo tài khoản mới để mua sơn chất lượng!
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-4 border border-blue-200"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            {...register("name", { required: "Vui lòng nhập họ tên" })}
            type="text"
            placeholder="Nhập họ và tên"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            })}
            type="email"
            placeholder="Nhập email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <input
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
            type="password"
            placeholder="Nhập mật khẩu"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Xác nhận mật khẩu
          </label>
          <input
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu",
            })}
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <div className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
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
