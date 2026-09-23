import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { trackConversion } from "@/lib/conversion-events";

const navigation = [
  { to: "/paslaugos", label: "Paslaugos" },
  { to: "/sprendimai", label: "Sprendimai" },
  { to: "/#kaip-dirbame", label: "Kaip dirbame" },
  { to: "/apie", label: "Apie" },
  { to: "/kontaktai", label: "Kontaktai" },
];

export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`studio-logo${inverse ? " inverse" : ""}`}>
      <img
        src="/skenis-logo-compact.png"
        width="460"
        height="130"
        alt="Skenis"
      />
    </span>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const productPage =
    location.pathname.replace(/\/+$/, "") === "/google-atsiliepimai";
  const ctaPath = productPage
    ? "/google-atsiliepimai#kaina"
    : "/kontaktai?intent=demo";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash, location.search]);
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const background = [
      ...document.querySelectorAll<HTMLElement>("main, .studio-footer"),
    ];
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const links =
          panelRef.current?.querySelectorAll<HTMLElement>("a,button");
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === toggleRef.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const media = window.matchMedia("(min-width: 1100px)");
    const onResize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = original;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      toggleRef.current?.focus();
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className="studio-nav">
      <div className="studio-container studio-nav-inner">
        <Link to="/" aria-label="Skenis – pradžia" className="studio-brand">
          <BrandLogo />
        </Link>
        <nav aria-label="Pagrindinė navigacija" className="studio-desktop-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive && !item.to.includes("#") ? "active" : undefined
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to={ctaPath}
          className="studio-button studio-nav-cta"
          data-conversion={
            productPage ? "product_quantity_cta" : "navigation_demo"
          }
        >
          {productPage ? "Pasirinkti kortelių kiekį" : "Gauti nemokamą pavyzdį"}{" "}
          <ArrowUpRight size={16} aria-hidden />
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="studio-menu-button"
          aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>
      {open && (
        <div
          id="mobile-navigation"
          className="studio-mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Svetainės meniu"
        >
          <button
            type="button"
            className="studio-mobile-close"
            onClick={() => setOpen(false)}
          >
            Uždaryti meniu <X size={20} aria-hidden />
          </button>
          <nav aria-label="Mobilioji navigacija">
            {navigation.map((item, index) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <span className="studio-mono">0{index + 1}</span>
                {item.label}
                <ArrowUpRight size={21} aria-hidden />
              </Link>
            ))}
          </nav>
          <Link
            className="studio-button"
            to={ctaPath}
            data-conversion={
              productPage ? "product_quantity_cta" : "mobile_demo"
            }
          >
            {productPage
              ? "Pasirinkti kortelių kiekį"
              : "Gauti nemokamą pavyzdį"}{" "}
            <ArrowRight size={18} aria-hidden />
          </Link>
          <Link className="studio-mobile-product" to="/google-atsiliepimai">
            Ieškote NFC / QR kortelių? <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      )}
    </header>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="studio-site"
        onClick={(event) => {
          const target = (event.target as HTMLElement).closest<HTMLElement>(
            "[data-conversion]",
          );
          if (target?.dataset.conversion)
            trackConversion(target.dataset.conversion);
        }}
      >
        <a className="studio-skip" href="#main-content">
          Pereiti prie turinio
        </a>
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-right" />
      </div>
    </MotionConfig>
  );
}

function Footer() {
  return (
    <footer className="studio-footer">
      <div className="studio-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" aria-label="Skenis – pradžia">
              <BrandLogo inverse />
            </Link>
            <p>
              Mažiau rutinos.
              <br />
              Daugiau veikiančių sprendimų.
            </p>
          </div>
          <div className="footer-link-groups">
            <details>
              <summary>
                Svetainė <span aria-hidden>+</span>
              </summary>
              <nav aria-label="Footer navigacija">
                <Link to="/paslaugos">Paslaugos</Link>
                <Link to="/sprendimai">Sprendimai</Link>
                <Link to="/apie">Apie Skenis</Link>
                <Link to="/kontaktai">Kontaktai</Link>
              </nav>
            </details>
            <details>
              <summary>
                Ką kuriame <span aria-hidden>+</span>
              </summary>
              <nav aria-label="Footer paslaugos">
                <Link to="/paslaugos/svetaines">Svetainės</Link>
                <Link to="/paslaugos/registracijos">Registracijos</Link>
                <Link to="/paslaugos/verslo-sistemos">Verslo sistemos</Link>
                <Link to="/paslaugos/automatizacijos">Automatizacijos</Link>
                <Link to="/paslaugos/ai-sprendimai">AI sprendimai</Link>
                <Link to="/paslaugos/e-komercija">E. komercija</Link>
                <Link to="/google-atsiliepimai">NFC / QR kortelės</Link>
              </nav>
            </details>
          </div>
          <div className="footer-contacts">
            <a
              href="mailto:skenis.info@gmail.com"
              data-conversion="email_click"
            >
              skenis.info@gmail.com
              <ArrowUpRight size={17} aria-hidden />
            </a>
            <a href="tel:+37062357946" data-conversion="phone_click">
              +370 623 57 946
            </a>
            <a href="tel:+37062375231" data-conversion="phone_click">
              +370 623 75 231
            </a>
          </div>
        </div>
        <div className="studio-footer-bottom">
          <span>© {new Date().getFullYear()} Skenis</span>
          <div>
            <Link to="/privatumo-politika">Privatumo politika</Link>
            <Link to="/taisykles">Taisyklės</Link>
            <Link to="/admin/login">Administravimas</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
