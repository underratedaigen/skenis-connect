import { useEffect, useState } from "react";
import { AdminError } from "@/components/admin/panels";
import { listAdminTestimonials, saveTestimonial } from "@/lib/testimonial-data";
import {
  testimonialSchema,
  testimonialServices,
  type Testimonial,
} from "@/lib/testimonials";
import { serviceContent } from "@/data/public-content";

function blankReview(): Testimonial {
  return {
    id: crypto.randomUUID(),
    name: "",
    company: "",
    role: "",
    service: "svetaines",
    rating: 5,
    quote: "",
    fullQuote: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    source: "direct",
    sourceUrl: "",
    verified: false,
    featured: false,
    synthetic: false,
    status: "draft",
    consent: false,
  };
}
export function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]),
    [draft, setDraft] = useState<Testimonial>(blankReview),
    [editing, setEditing] = useState(false),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    document.title = "Atsiliepimų valdymas | Skenis";
    listAdminTestimonials()
      .then((data) => {
        if (active) setRows(data);
      })
      .catch(() => {
        if (active)
          setError(
            "Atsiliepimų lentelė nepasiekiama. Prieš naudojimą pritaikykite testimonials migraciją.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  function update<K extends keyof Testimonial>(key: K, value: Testimonial[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setNotice("");
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const parsed = testimonialSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues.map((issue) => issue.message).join(" "));
      return;
    }
    setSaving(true);
    try {
      const saved = await saveTestimonial(parsed.data, editing);
      setRows((previous) => [
        saved,
        ...previous.filter((value) => value.id !== saved.id),
      ]);
      setDraft(saved);
      setEditing(true);
      setNotice(
        saved.status === "published"
          ? "Patvirtintas atsiliepimas publikuotas."
          : "Atsiliepimas išsaugotas. Viešai rodomi tik patikrinti įrašai su leidimu.",
      );
    } catch (value) {
      setError(value instanceof Error ? value.message : "Nepavyko išsaugoti.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Klientų atsiliepimai</h1>
          <p className="mt-2 text-sm text-slate-600">
            Įrašykite tik autentišką kliento tekstą. Viešinimui reikalingas
            patikrinimas ir leidimas.
          </p>
        </div>
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => {
            setDraft(blankReview());
            setEditing(false);
            setError("");
            setNotice("");
          }}
        >
          Naujas atsiliepimas
        </button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-lg font-semibold">Įrašai ({rows.length})</h2>
          {loading && <p role="status">Įkeliama…</p>}
          {!loading && !rows.length && (
            <p className="mt-4 text-sm">
              Įrašų dar nėra. Sintetiniai įrašai į šią sistemą nekeliami.
            </p>
          )}
          <ul className="mt-4 grid gap-3">
            {rows.map((review) => (
              <li key={review.id}>
                <button
                  type="button"
                  aria-pressed={editing && draft.id === review.id}
                  className="w-full rounded-md border border-line p-3 text-left focus-ring"
                  onClick={() => {
                    setDraft(review);
                    setEditing(true);
                    setError("");
                    setNotice("");
                  }}
                >
                  <strong>{review.name}</strong>
                  <span className="ml-2 text-sm">
                    {review.rating}/5 ·{" "}
                    {review.status === "published"
                      ? "Publikuotas"
                      : review.status === "archived"
                        ? "Archyvuotas"
                        : "Juodraštis"}
                  </span>
                  <p className="mt-1 text-sm text-slate-600">
                    {review.quote.slice(0, 100)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <form
          onSubmit={submit}
          className="grid gap-4 rounded-lg border border-line bg-white p-5"
        >
          <h2 className="text-lg font-semibold">
            {editing ? "Redaguoti atsiliepimą" : "Naujas atsiliepimas"}
          </h2>
          <label className="grid gap-1">
            Kliento vardas / viešinamas pavadinimas
            <input
              className="admin-input"
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              required
              maxLength={120}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              Įmonė (neprivaloma)
              <input
                className="admin-input"
                value={draft.company || ""}
                onChange={(e) => update("company", e.target.value)}
                maxLength={160}
              />
            </label>
            <label className="grid gap-1">
              Pareigos (neprivaloma)
              <input
                className="admin-input"
                value={draft.role || ""}
                onChange={(e) => update("role", e.target.value)}
                maxLength={120}
              />
            </label>
          </div>
          <label className="grid gap-1">
            Paslauga
            <select
              className="admin-input"
              value={draft.service}
              onChange={(e) =>
                update("service", e.target.value as Testimonial["service"])
              }
            >
              {testimonialServices.map((slug) => (
                <option key={slug} value={slug}>
                  {slug === "nfc-product"
                    ? "NFC ir QR kortelės"
                    : serviceContent[slug].title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              Įvertinimas
              <select
                className="admin-input"
                value={draft.rating}
                onChange={(e) => update("rating", Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} iš 5
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              Atsiliepimo data
              <input
                className="admin-input"
                type="date"
                required
                value={draft.publishedAt}
                onChange={(e) => update("publishedAt", e.target.value)}
              />
            </label>
          </div>
          <label className="grid gap-1">
            Trumpas tekstas
            <textarea
              className="admin-input"
              rows={4}
              required
              minLength={10}
              maxLength={800}
              value={draft.quote}
              onChange={(e) => update("quote", e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            Visas tekstas (neprivaloma)
            <textarea
              className="admin-input"
              rows={5}
              maxLength={4000}
              value={draft.fullQuote || ""}
              onChange={(e) => update("fullQuote", e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            Šaltinis
            <select
              className="admin-input"
              value={draft.source}
              onChange={(e) =>
                update("source", e.target.value as Testimonial["source"])
              }
            >
              <option value="direct">Tiesioginis</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
            </select>
          </label>
          <label className="grid gap-1">
            Šaltinio nuoroda (neprivaloma)
            <input
              className="admin-input"
              type="url"
              placeholder="https://"
              value={draft.sourceUrl || ""}
              onChange={(e) => update("sourceUrl", e.target.value)}
            />
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={draft.verified}
              onChange={(e) => update("verified", e.target.checked)}
            />
            Patikrinau atsiliepimo autentiškumą
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={draft.consent}
              onChange={(e) => update("consent", e.target.checked)}
            />
            Yra leidimas viešinti tekstą ir autoriaus duomenis
          </label>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => update("featured", e.target.checked)}
            />
            Rodyti pagrindiniame puslapyje pirmiau
          </label>
          <label className="grid gap-1">
            Būsena
            <select
              className="admin-input"
              value={draft.status}
              onChange={(e) =>
                update("status", e.target.value as Testimonial["status"])
              }
            >
              <option value="draft">Juodraštis</option>
              <option value="published">Publikuoti</option>
              <option value="archived">Archyvuoti (paslėpti)</option>
            </select>
          </label>
          {error && <AdminError message={error} />}
          {notice && (
            <p role="status" className="text-sm text-emerald-800">
              {notice}
            </p>
          )}
          <button className="admin-button" disabled={saving || loading}>
            {saving ? "Saugoma…" : "Išsaugoti atsiliepimą"}
          </button>
        </form>
      </div>
    </>
  );
}
