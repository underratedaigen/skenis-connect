import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ContactPage,
  HomePage,
  NotFoundPage,
  PrivacyPage,
  TermsPage
} from "@/pages/public-pages";
import { RedirectPage } from "@/pages/redirect-page";

const AdminGuard = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.AdminGuard }))
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.AdminDashboardPage }))
);
const BatchDetailPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.BatchDetailPage }))
);
const LeadsPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.LeadsPage }))
);
const LinkDetailPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.LinkDetailPage }))
);
const LinksPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.LinksPage }))
);
const LoginPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.LoginPage }))
);
const NewBatchPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.NewBatchPage }))
);
const QrPreviewPage = lazy(() =>
  import("@/pages/admin-pages").then((module) => ({ default: module.QrPreviewPage }))
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

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
    </BrowserRouter>
  );
}

export default App;
