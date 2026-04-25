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

const executiveRoles = ["master_admin", "owner", "general_director"];

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

  const canManageUsers = user ? executiveRoles.includes(user.role) : false;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#11100d] text-[#f7f0e6]">
        Cargando dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#11100d] px-6 py-8 text-[#f7f0e6]">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-white/10 bg-[#1a1814] p-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#d8c08a]">
                OpsPulseQuintonil
              </p>
              <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
                Dashboard operativo
              </h1>
              <p className="mt-3 text-[#c7bda9]">
                {user?.full_name} · {user?.role} · Restaurante{" "}
                {user?.restaurant_id ?? "global"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/daily-report/new"
                className="rounded-2xl bg-[#d8c08a] px-4 py-3 font-medium text-black"
              >
                Nuevo reporte
              </Link>

              {canManageUsers && (
                <Link
                  href="/admin/users"
                  className="rounded-2xl border border-[#d8c08a]/40 px-4 py-3 text-[#f7f0e6]"
                >
                  Usuarios y accesos
                </Link>
              )}

              <button
                onClick={logout}
                className="rounded-2xl border border-white/10 px-4 py-3 text-[#c7bda9]"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard label="Reportes capturados" value={reports.length} />
          <MetricCard label="Restaurante" value={user?.restaurant_id ?? "Global"} />
          <MetricCard label="Estatus" value={user?.is_active ? "Activo" : "Inactivo"} />
        </section>

        {canManageUsers && (
          <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#1a1814] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#d8c08a]">
              Vista ejecutiva
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Supervisión y control de accesos
            </h2>
            <p className="mt-2 text-[#c7bda9]">
              Tu rol permite administrar usuarios y preparar tableros ejecutivos.
            </p>
          </section>
        )}

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#1a1814] p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold">Mis reportes recientes</h2>

          <div className="mt-5 space-y-3">
            {reports.length === 0 && (
              <p className="text-[#c7bda9]">Todavía no hay reportes.</p>
            )}

            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-white/10 bg-[#11100d] p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {report.report_date} · {report.shift || "sin turno"}
                    </p>
                    <p className="text-sm text-[#b8a98d]">
                      Personal: {report.staff_status || "sin dato"} · Estado:{" "}
                      {report.day_status}
                    </p>
                  </div>
                  <p className="text-sm text-[#f7f0e6]">
                    Ventas: ${report.sales_amount || "0"}
                  </p>
                </div>

                {report.general_comments && (
                  <p className="mt-3 text-sm text-[#c7bda9]">
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

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#1a1814] p-6">
      <p className="text-sm text-[#b8a98d]">{label}</p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
    </div>
  );
}
