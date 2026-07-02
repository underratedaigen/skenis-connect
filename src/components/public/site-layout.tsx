import { AnimatePresence, motion } from "framer-motion";
import { Lock, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const navLinks: { href: string; label: string; route?: boolean }[] = [
  { href: "/#kaip-veikia", label: "Kaip veikia" },
  { href: "/#produktai", label: "Produktai" },
  { href: "/#privalumai", label: "Privalumai" },
  { href: "/kontaktai", label: "Kontaktai", route: true }
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
        <Link to="/" className="text-xl font-bold tracking-normal text-ink">
          Skenis.lt
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((item) =>
            item.route ? (
              <Link key={item.href} to={item.href} className="transition hover:text-brand-700">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="transition hover:text-brand-700">
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/#uzsakymas"
            className="hidden rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:inline-flex"
          >
            Užsakyti
          </a>
          <button
            type="button"
            aria-label="Atidaryti meniu"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-gray-100 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="sheet"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white p-6 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-ink">Skenis.lt</span>
                <button
                  type="button"
                  aria-label="Uždaryti meniu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-gray-100"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((item) =>
                  item.route ? (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-gray-50 hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-gray-50 hover:text-brand-700"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>
              <a
                href="/#uzsakymas"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Užsakyti
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
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
          <Link
            to="/admin/login"
            aria-label="Admin"
            title="Admin"
            className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-white hover:text-white"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
