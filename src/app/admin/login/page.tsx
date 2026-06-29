import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-5 py-12">
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-7 shadow-panel">
        <Link href="/" className="text-sm font-semibold text-brand-700">
          Skenis.lt
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-normal">Admin prisijungimas</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Prisijunkite, kad galėtumėte generuoti QR kodus, valdyti nukreipimus
          ir matyti užklausas.
        </p>

        {searchParams.error ? (
          <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Neteisingas el. paštas arba slaptažodis.
          </p>
        ) : null}

        <form action={loginAction} className="mt-7 grid gap-4">
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
          <button className="admin-button mt-2">Prisijungti</button>
        </form>
      </div>
    </main>
  );
}
