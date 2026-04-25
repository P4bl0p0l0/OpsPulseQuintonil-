"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function NewDailyReportPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    report_date: "2026-04-23",
    shift: "cierre",
    staff_status: "completo",
    sales_amount: "0",
    incidents_summary: "",
    inventory_issues: "",
    maintenance_issues: "",
    cleanliness_status: "óptimo",
    day_status: "green",
    general_comments: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await api.post(
        "/daily-reports",
        {
          ...form,
          sales_amount: Number(form.sales_amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/dashboard");
    } catch {
      setError("No se pudo guardar el reporte. Revisa los datos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm text-neutral-400 hover:text-white"
        >
          ← Volver al dashboard
        </button>

        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
          <p className="text-sm text-neutral-400">OpsPulseQuintonil</p>
          <h1 className="mt-2 text-3xl font-semibold">Nuevo reporte diario</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-neutral-300">Fecha</label>
              <input
                type="date"
                value={form.report_date}
                onChange={(e) => updateField("report_date", e.target.value)}
                className="input mt-2"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Turno</label>
              <select
                value={form.shift}
                onChange={(e) => updateField("shift", e.target.value)}
                className="input mt-2"
              >
                <option value="apertura">Apertura</option>
                <option value="comida">Comida</option>
                <option value="cierre">Cierre</option>
                <option value="completo">Completo</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-300">Estado del personal</label>
              <select
                value={form.staff_status}
                onChange={(e) => updateField("staff_status", e.target.value)}
                className="input mt-2"
              >
                <option value="completo">Completo</option>
                <option value="faltantes">Con faltantes</option>
                <option value="incidencias">Con incidencias</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-300">Ventas</label>
              <input
                type="number"
                value={form.sales_amount}
                onChange={(e) => updateField("sales_amount", e.target.value)}
                className="input mt-2"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Incidencias</label>
              <textarea
                value={form.incidents_summary}
                onChange={(e) => updateField("incidents_summary", e.target.value)}
                className="textarea mt-2"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Inventario</label>
              <textarea
                value={form.inventory_issues}
                onChange={(e) => updateField("inventory_issues", e.target.value)}
                className="textarea mt-2"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Mantenimiento</label>
              <textarea
                value={form.maintenance_issues}
                onChange={(e) => updateField("maintenance_issues", e.target.value)}
                className="textarea mt-2"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Limpieza / orden</label>
              <select
                value={form.cleanliness_status}
                onChange={(e) => updateField("cleanliness_status", e.target.value)}
                className="input mt-2"
              >
                <option value="óptimo">Óptimo</option>
                <option value="aceptable">Aceptable</option>
                <option value="requiere atención">Requiere atención</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-300">Semáforo del día</label>
              <select
                value={form.day_status}
                onChange={(e) => updateField("day_status", e.target.value)}
                className="input mt-2"
              >
                <option value="green">Verde</option>
                <option value="yellow">Amarillo</option>
                <option value="red">Rojo</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-neutral-300">Comentarios generales</label>
              <textarea
                value={form.general_comments}
                onChange={(e) => updateField("general_comments", e.target.value)}
                className="textarea mt-2"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              disabled={saving}
              className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-black disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Enviar reporte"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
