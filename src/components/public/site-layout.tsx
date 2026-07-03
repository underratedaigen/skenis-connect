import { AnimatePresence, motion } from "framer-motion";
import { Lock, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/custom-cursor";
import { cn } from "@/lib/utils";

const navLinks: { href: string; label: string; route?: boolean }[] = [
  { href: "/#kaip-veikia", label: "Kaip veikia" },
  { href: "/#produktas", label: "Produktas" },
  { href: "/#privalumai", label: "Privalumai" },
  { href: "/#kam-tinka", label: "Kam tinka" },
  { href: "/#kaina", label: "Kaina" },
  { href: "/#duk", label: "DUK" }
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
        "sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[0_10px_40px_rgba(16,24,32,0.08)]"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3">
        <Link to="/" className="flex items-center">
          <img src="/skenis-logo.png" alt="Skenis" className="h-12 w-auto" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 rounded-full border border-line bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur lg:flex">
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
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-black text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:inline-flex"
          >
            Gauti pasiūlymą
          </a>
          <button
            type="button"
            aria-label="Atidaryti meniu"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 text-ink shadow-sm transition hover:bg-white lg:hidden"
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
              className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="sheet"
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="fixed inset-x-3 top-3 z-50 flex max-h-[calc(100vh-1.5rem)] flex-col overflow-y-auto rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              <div className="flex items-center justify-between">
               <img src="/skenis-logo.png" alt="Skenis" className="h-12 w-auto" />
                <button
                  type="button"
                  aria-label="Uždaryti meniu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-gray-100"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <nav className="mt-7 grid gap-2">
                {navLinks.map((item) =>
                  item.route ? (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-line bg-white px-4 py-3 text-base font-black text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-line bg-white px-4 py-3 text-base font-black text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>
              <a
                href="/#uzsakymas"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-ink px-5 py-4 text-sm font-black text-white shadow-lg shadow-black/10 transition hover:bg-black"
              >
                Gauti pasiūlymą
              </a>
              <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-6 text-brand-800">
                NFC + QR kortelės su keičiama nuoroda, individualiais kodais ir skenavimų statistika.
              </p>
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
      <CustomCursor />
      <Navbar />
      {children}
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b0f14",
            color: "#ffffff",
            border: "1px solid rgba(45,212,191,0.35)"
          },
          className: "font-sans"
        }}
      />
    </div>
  );
}

function Footer() {
  return (
    <footer data-sticky-hide className="relative bg-ink pb-[env(safe-area-inset-bottom)] text-white">
      <div className="h-1 w-full bg-[linear-gradient(90deg,#4285F4,#34A853,#FBBC05,#EA4335)] opacity-80" aria-hidden />
      
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 pb-16 md:grid-cols-[1fr_auto] md:pb-12">
        <div>
          <img src="/skenis-logo.png" alt="Skenis" className="h-14 w-auto brightness-0 invert" />
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            NFC + QR kortelės realiems klientų Google atsiliepimams rinkti su
            keičiama nuoroda, individualiais kodais ir skenavimų statistika.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Skenis nėra oficialus Google produktas. Google yra Google LLC prekės ženklas.
            Kortelė nukreipia į įmonės Google atsiliepimų puslapį.
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
