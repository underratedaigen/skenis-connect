import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { MotionProvider, MotionPreference } from "@/motion/motion-provider";
import {
  navigation,
  serviceContent,
  serviceOrder,
} from "@/data/public-content";
import { trackConversion } from "@/lib/conversion-events";

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
  const ctaPath = "/kontaktai?intent=project";
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
          data-conversion={"navigation_project"}
        >
          Aptarti projektą <ArrowUpRight size={16} aria-hidden />
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
            data-conversion="mobile_project"
          >
            Aptarti projektą <ArrowRight size={18} aria-hidden />
          </Link>
          <nav
            className="mobile-service-links"
            aria-label="Paslaugos mobiliajame meniu"
          >
            <strong>Mūsų paslaugos</strong>
            {serviceOrder.map((slug) => (
              <Link key={slug} to={`/paslaugos/${slug}`}>
                {serviceContent[slug].title}
              </Link>
            ))}
          </nav>
          <Link className="studio-mobile-product" to="/google-atsiliepimai">
            Ieškote NFC / QR kortelių? <ArrowUpRight size={16} aria-hidden />
          </Link>
        </div>
      )}
    </header>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return <MotionProvider><PublicLayoutBody>{children}</PublicLayoutBody></MotionProvider>;
}

function PublicLayoutBody({ children }: { children: ReactNode }) {
  return (
    <>
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
    </>
  );
}

function Footer() {
  const { pathname } = useLocation();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const service = pathname.match(/^\/paslaugos\/([^/]+)$/)?.[1];
  const cta = `/kontaktai?intent=project${service && serviceContent[service] ? `&service=${service}` : ''}`;
  return (
    <footer className="studio-footer" data-theme="dark">
      <div className="studio-container">
        <div className="moto-footer-cta">
          <p className="studio-eyebrow">Pradėkime nuo pokalbio</p>
          <h2>Aptarkime jūsų<br />svetainę ar sistemą.</h2>
          <Link to={cta} className="studio-button light" data-conversion="footer_project">Aptarti projektą <ArrowUpRight size={20} aria-hidden /></Link>
        </div>
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" aria-label="Skenis – pradžia">
              <BrandLogo inverse />
            </Link>
            <p>Svetainės, verslo sistemos ir automatizavimas.</p>
          </div>
          <div className="footer-link-groups">
            <details open={desktop}>
              <summary>
                Svetainė <span aria-hidden>+</span>
              </summary>
              <nav aria-label="Footer navigacija">
                <Link to="/paslaugos">Paslaugos</Link>
                <Link to="/sprendimai">Pavyzdžiai</Link>
                <Link to="/apie">Apie Skenis</Link>
                <Link to="/atsiliepimai">Darbo principai ir atsiliepimai</Link>
                <Link to="/kontaktai">Kontaktai</Link>
              </nav>
            </details>
            <details open={desktop}>
              <summary>
                Ką kuriame <span aria-hidden>+</span>
              </summary>
              <nav aria-label="Footer paslaugos">
                {serviceOrder.map((slug) => (
                  <Link key={slug} to={`/paslaugos/${slug}`}>
                    {serviceContent[slug].title}
                  </Link>
                ))}
                <Link to="/google-atsiliepimai">NFC ir QR kortelės</Link>
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
          <MotionPreference />
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
