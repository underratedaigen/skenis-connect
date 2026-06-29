import type React from "react";
import { Link } from "react-router-dom";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <Link to="/" className="text-xl font-bold tracking-normal text-ink">
            Skenis.lt
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="/#kaip-veikia" className="transition hover:text-brand-700">
              Kaip veikia
            </a>
            <a href="/#produktai" className="transition hover:text-brand-700">
              Produktai
            </a>
            <a href="/#privalumai" className="transition hover:text-brand-700">
              Privalumai
            </a>
            <Link to="/kontaktai" className="transition hover:text-brand-700">
              Kontaktai
            </Link>
            <Link to="/admin/login" className="transition hover:text-brand-700">
              Admin
            </Link>
          </nav>
          <a href="/#uzsakymas" className="button-primary hidden sm:inline-flex">
            Užsakyti
          </a>
        </div>
      </header>
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xl font-bold">Skenis.lt</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Programuojamos akrilinės QR kortelės ir stendai realiems klientų
            atsiliepimams rinkti.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Google yra atitinkamo savininko prekės ženklas. Skenis nėra susijęs
            su Google.
          </p>
        </div>
        <nav className="grid gap-2 text-sm text-slate-300">
          <Link to="/privatumo-politika" className="transition hover:text-white">
            Privatumo politika
          </Link>
          <Link to="/taisykles" className="transition hover:text-white">
            Taisyklės
          </Link>
          <Link to="/kontaktai" className="transition hover:text-white">
            Kontaktai
          </Link>
          <a href="https://skenis.lt" className="transition hover:text-white">
            skenis.lt
          </a>
        </nav>
      </div>
    </footer>
  );
}
