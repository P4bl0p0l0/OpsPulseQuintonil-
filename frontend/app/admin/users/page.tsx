"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  restaurant_id: number | null;
  is_active: boolean;
  must_change_password: boolean;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "Temporal12345!",
    role: "restaurant_manager",
    restaurant_id: "1",
  });

  useEffect(() => {
    async function loadUsersOnMount() {
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
      } catch {
        setError("No tienes permiso para ver usuarios o tu sesión expiró.");
      }
    }

    void loadUsersOnMount();
  }, [router]);

  async function refreshUsers() {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const response = await api.get("/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(response.data);
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
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
        "/users",
        {
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role,
          restaurant_id:
            form.role === "restaurant_manager"
              ? Number(form.restaurant_id)
              : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({
        full_name: "",
        email: "",
        password: "Temporal12345!",
        role: "restaurant_manager",
        restaurant_id: "1",
      });

      await refreshUsers();
    } catch {
      setError("No se pudo crear el usuario. Revisa email, rol o permisos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#11100d] px-6 py-8 text-[#f7f0e6]">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 text-sm text-[#b8a98d] hover:text-white"
        >
          ← Volver
        </button>

        <header>
          <p className="text-sm uppercase tracking-[0.3em] text-[#b8a98d]">
            OpsPulseQuintonil
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Usuarios y accesos</h1>
          <p className="mt-3 max-w-2xl text-[#c7bda9]">
            Crea perfiles por rol: master, dueños, dirección general y gerentes.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={createUser}
            className="rounded-3xl border border-white/10 bg-[#1a1814] p-6 shadow-2xl"
          >
            <h2 className="text-xl font-semibold">Crear usuario</h2>

            <div className="mt-5 space-y-4">
              <Field label="Nombre completo">
                <input
                  className="premium-input"
                  value={form.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  required
                />
              </Field>

              <Field label="Email">
                <input
                  className="premium-input"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  type="email"
                  required
                />
              </Field>

              <Field label="Password temporal">
                <input
                  className="premium-input"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                />
              </Field>

              <Field label="Rol">
                <select
                  className="premium-input"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                >
                  <option value="master_admin">Master admin</option>
                  <option value="owner">Dueño</option>
                  <option value="general_director">Dirección general</option>
                  <option value="restaurant_manager">Gerente restaurante</option>
                </select>
              </Field>

              {form.role === "restaurant_manager" && (
                <Field label="Restaurante ID">
                  <input
                    className="premium-input"
                    value={form.restaurant_id}
                    onChange={(e) =>
                      updateField("restaurant_id", e.target.value)
                    }
                    type="number"
                    required
                  />
                </Field>
              )}

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                disabled={saving}
                className="w-full rounded-2xl bg-[#d8c08a] px-4 py-3 font-medium text-black disabled:opacity-60"
              >
                {saving ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-white/10 bg-[#1a1814] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold">Usuarios existentes</h2>

            <div className="mt-5 space-y-3">
              {users.filter((user) => user.is_active).map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-white/10 bg-[#11100d] p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-[#b8a98d]">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        {user.role}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        Restaurante {user.restaurant_id ?? "global"}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[#c7bda9]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
