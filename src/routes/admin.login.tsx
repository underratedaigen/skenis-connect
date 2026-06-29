import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type React from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin prisijungimas | Skenis.lt" },
      {
        name: "description",
        content: "Skenis.lt administravimo sistemos prisijungimas."
      }
    ]
  }),
  component: AdminLoginPage
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError("Neteisingas el. paštas arba slaptažodis.");
      setLoading(false);
      return;
    }

    await navigate({ to: "/admin" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-5 py-12">
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-7 shadow-panel">
        <Link to="/" className="text-sm font-semibold text-brand-700">
          Skenis.lt
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-normal">Admin prisijungimas</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Prisijunkite, kad galėtumėte generuoti QR kodus, valdyti nukreipimus
          ir matyti užklausas.
        </p>

        {error ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-7 grid gap-4">
          <label className="grid gap-2">
            <span className="admin-label">El. paštas</span>
            <input
              className="admin-input"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Slaptažodis</span>
            <input
              className="admin-input"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="admin-button mt-2" disabled={loading}>
            {loading ? "Jungiamasi..." : "Prisijungti"}
          </button>
        </form>
      </div>
    </main>
  );
}
