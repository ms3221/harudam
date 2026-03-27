"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-warm-800 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-cream-100 text-center mb-2">
          하루담 관리자
        </h1>
        <p className="text-warm-400 text-center text-sm mb-8">
          비밀번호를 입력해주세요
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-4 py-3 bg-warm-700 border border-warm-600 rounded-lg text-cream-100 placeholder-warm-500 focus:outline-none focus:border-green-500 transition-colors"
          autoFocus
        />

        {error && (
          <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-warm-600 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
