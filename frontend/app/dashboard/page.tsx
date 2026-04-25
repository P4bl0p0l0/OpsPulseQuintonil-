"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

type UserMe = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  restaurant_id: number | null;
  is_active: boolean;
};

type DailyReport = {
  id: number;
  report_date: string;
  shift: string | null;
  staff_status: string | null;
  sales_amount: string | null;
  day_status: string;
  general_comments: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMe | null>(null);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [meResponse, reportsResponse] = await Promise.all([
          api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/daily-reports/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(meResponse.data);
        setReports(reportsResponse.data);
      } catch {
        clearToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [router]);

  function logout() {
    clearToken();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Cargando dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-400">OpsPulseQuintonil</p>
            <h1 className="mt-1 text-3xl font-semibold">Dashboard operativo</h1>
            <p className="mt-2 text-neutral-400">
              Bienvenido, {user?.full_name} · {user?.role}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/daily-report/new"
              className="rounded-2xl bg-white px-4 py-3 font-medium text-black"
            >
              Nuevo reporte
            </Link>
            <button
              onClick={logout}
              className="rounded-2xl border border-white/10 px-4 py-3 text-neutral-200"
            >
              Salir
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Reportes capturados</p>
            <p className="mt-3 text-4xl font-semibold">{reports.length}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Restaurante ID</p>
            <p className="mt-3 text-4xl font-semibold">{user?.restaurant_id}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">Estado de usuario</p>
            <p className="mt-3 text-4xl font-semibold">
              {user?.is_active ? "Activo" : "Inactivo"}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-xl font-semibold">Mis reportes recientes</h2>

          <div className="mt-5 space-y-3">
            {reports.length === 0 && (
              <p className="text-neutral-400">Todavía no hay reportes.</p>
            )}

            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-white/10 bg-neutral-950 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {report.report_date} · {report.shift || "sin turno"}
                    </p>
                    <p className="text-sm text-neutral-400">
                      Personal: {report.staff_status || "sin dato"} · Estado:{" "}
                      {report.day_status}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-300">
                    Ventas: ${report.sales_amount || "0"}
                  </p>
                </div>

                {report.general_comments && (
                  <p className="mt-3 text-sm text-neutral-400">
                    {report.general_comments}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
