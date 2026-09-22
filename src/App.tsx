import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ServicesPage, ServiceDetailPage } from "@/pages/service-pages";
import { Seo } from "@/components/public/seo";
import {
  ContactPage,
  HomePage,
  NotFoundPage,
  PrivacyPage,
  TermsPage,
  AboutPage,
  SolutionsPage,
  ReviewProductPage,
} from "@/pages/public-pages";

const AdminGuard = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.AdminGuard,
  })),
);
const RedirectPage = lazy(() =>
  import("@/pages/redirect-page").then((module) => ({
    default: module.RedirectPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const BatchDetailPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.BatchDetailPage,
  })),
);
const BatchesPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.BatchesPage,
  })),
);
const LeadsPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.LeadsPage,
  })),
);
const LinkDetailPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.LinkDetailPage,
  })),
);
const LinksPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.LinksPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.LoginPage,
  })),
);
const NewBatchPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.NewBatchPage,
  })),
);
const QrPreviewPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({
    default: module.QrPreviewPage,
  })),
);

function RouteFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-5">
      <p className="rounded-lg border border-line bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
        Įkeliama...
      </p>
    </main>
  );
}

const legacyProductHashes = new Set([
  "#kaip-veikia",
  "#produktas",
  "#privalumai",
  "#kam-tinka",
  "#kaina",
  "#duk",
  "#uzsakymas",
  "#produktai",
]);

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === "/" && legacyProductHashes.has(hash)) {
      navigate(`/google-atsiliepimai${hash}`, { replace: true });
      return;
    }
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const scroll = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView({ block: "start", behavior: "instant" });
      return true;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [pathname, hash, navigate]);
  return /^\/(admin|r)(\/|$)/.test(pathname) ? (
    <Seo
      title="Skenis"
      description="Skenis administravimas ir NFC / QR nuorodos."
      path={pathname}
      noIndex
    />
  ) : null;
}

export function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paslaugos" element={<ServicesPage />} />
          <Route path="/paslaugos/:slug" element={<ServiceDetailPage />} />
          <Route path="/sprendimai" element={<SolutionsPage />} />
          <Route path="/apie" element={<AboutPage />} />
          <Route path="/google-atsiliepimai" element={<ReviewProductPage />} />
          <Route path="/kontaktai" element={<ContactPage />} />
          <Route path="/privatumo-politika" element={<PrivacyPage />} />
          <Route path="/taisykles" element={<TermsPage />} />
          <Route path="/r/:token" element={<RedirectPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={<AdminGuard>{() => <AdminDashboardPage />}</AdminGuard>}
          />
          <Route
            path="/admin/batches"
            element={<AdminGuard>{() => <BatchesPage />}</AdminGuard>}
          />
          <Route
            path="/admin/batches/new"
            element={<AdminGuard>{() => <NewBatchPage />}</AdminGuard>}
          />
          <Route
            path="/admin/batches/:id"
            element={<AdminGuard>{() => <BatchDetailPage />}</AdminGuard>}
          />
          <Route
            path="/admin/links"
            element={<AdminGuard>{() => <LinksPage />}</AdminGuard>}
          />
          <Route
            path="/admin/links/:token"
            element={<AdminGuard>{() => <LinkDetailPage />}</AdminGuard>}
          />
          <Route
            path="/admin/links/:token/qr"
            element={<AdminGuard>{() => <QrPreviewPage />}</AdminGuard>}
          />
          <Route
            path="/admin/leads"
            element={<AdminGuard>{() => <LeadsPage />}</AdminGuard>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
