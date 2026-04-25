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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      saveToken(response.data.access_token);
      router.push("/dashboard");
    } catch {
      setError("No pudimos iniciar sesión. Revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0d09] text-[#f7f0e6]">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2b2418] via-[#14110d] to-black" />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,#d8c08a,transparent_25%),radial-gradient(circle_at_80%_70%,#6f7d4b,transparent_25%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#d8c08a]">
                OpsPulseQuintonil
              </p>
              <h1 className="mt-8 max-w-xl text-6xl font-semibold leading-tight">
                Operación clara para hospitalidad de alto nivel.
              </h1>
            </div>

            <div className="max-w-lg rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-lg text-[#f7f0e6]">
                Reportes diarios, eventos, KPIs y supervisión ejecutiva en una
                sola plataforma.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#1a1814] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d8c08a]">
              acceso privado
            </p>
            <h2 className="mt-4 text-4xl font-semibold">Iniciar sesión</h2>
            <p className="mt-3 text-[#c7bda9]">
              Entra para gestionar reportes, usuarios y seguimiento operativo.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm text-[#c7bda9]">Email</span>
                <input
                  className="premium-input mt-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </label>

              <label className="block">
                <span className="text-sm text-[#c7bda9]">Password</span>
                <input
                  className="premium-input mt-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-[#d8c08a] px-4 py-3 font-medium text-black disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
