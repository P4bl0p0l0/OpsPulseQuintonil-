"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@opspulsequintonil.com");
  const [password, setPassword] = useState("Admin12345!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      saveToken(response.data.access_token);
      router.push("/dashboard");
    } catch {
      setError("No pudimos iniciar sesión. Revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 shadow-2xl">
        <p className="text-sm text-neutral-400">OpsPulseQuintonil</p>
        <h1 className="mt-2 text-3xl font-semibold">Iniciar sesión</h1>
        <p className="mt-3 text-neutral-400">
          Accede para capturar reportes diarios y revisar operación.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-neutral-300">Email</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Password</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-black disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
