import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { serviceContent, serviceOrder } from "@/data/public-content";
import {
  filterTestimonials,
  publicTestimonials,
  testimonialSummary,
  type Testimonial,
  type ReviewFilters,
} from "@/lib/testimonials";
import { usePublicTestimonials } from "@/lib/testimonial-data";

export const trustPrinciples = [
  {
    title: "Apimtis ir kaina prieš pradedant",
    text: "Pirmiausia aptariame poreikį, darbų apimtį ir pasiūlymą. Prie papildomų darbų pereiname juos suderinę.",
    link: "/kontaktai?intent=project",
    action: "Aptarti projektą",
  },
  {
    title: "Sprendimą galima išbandyti",
    text: "Parodome naudojimo eigą: ką pasirenka klientas, kas pasiekia komandą ir koks veiksmas laukia toliau.",
    link: "/sprendimai",
    action: "Išbandyti pavyzdžius",
  },
  {
    title: "Aiškus perdavimas ir priežiūra",
    text: "Parodome, kaip naudotis sukurtu sprendimu. Atnaujinimų ir tolesnės priežiūros apimtį aptariame atskirai.",
    link: "/apie#kaip-dirbame",
    action: "Apie darbo eigą",
  },
];
export function TrustPrinciples() {
  return (
    <div className="trust-principles">
      {trustPrinciples.map((item) => (
        <article key={item.title}>
          <Check size={20} aria-hidden />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <Link className="studio-text-link" to={item.link}>
            {item.action}
            <ArrowUpRight size={16} aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
export function TestimonialCard({ review }: { review: Testimonial }) {
  const id = useId(),
    [expanded, setExpanded] = useState(false);
  const sourceLabels = {
    google: "Google",
    direct: "Tiesioginis atsiliepimas",
    facebook: "Facebook",
    synthetic: "Sintetinis testas",
  };
  return (
    <article
      className={`testimonial-card${review.synthetic ? " synthetic-card" : ""}`}
    >
      <div
        className="testimonial-rating"
        aria-label={`Įvertinimas: ${review.rating} iš 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            aria-hidden
            fill={star <= review.rating ? "currentColor" : "none"}
          />
        ))}
        <span aria-hidden>{review.rating}/5</span>
      </div>
      {review.synthetic && (
        <strong className="synthetic-badge">Sintetinis testinis įrašas</strong>
      )}
      <blockquote id={`${id}-quote`}>
        {expanded && review.fullQuote ? review.fullQuote : review.quote}
      </blockquote>
      {review.fullQuote && (
        <button
          type="button"
          className="review-expand"
          aria-expanded={expanded}
          aria-controls={`${id}-quote`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Rodyti trumpiau" : "Skaityti visą atsiliepimą"}
        </button>
      )}
      <div className="testimonial-author">
        <strong>{review.name}</strong>
        {(review.company || review.role) && (
          <span>
            {[review.role, review.company].filter(Boolean).join(" · ")}
          </span>
        )}
        <span>
          {review.service === "nfc-product"
            ? "NFC ir QR kortelės"
            : serviceContent[review.service]?.title}
        </span>
      </div>
      <div className="testimonial-source">
        <time dateTime={review.publishedAt}>
          {new Intl.DateTimeFormat("lt-LT", { timeZone: "UTC" }).format(
            new Date(`${review.publishedAt}T00:00:00Z`),
          )}
        </time>
        {review.sourceUrl ? (
          <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">
            {sourceLabels[review.source]}
            <span className="sr-only"> (atsidaro naujame lange)</span>
            <ArrowUpRight size={14} aria-hidden />
          </a>
        ) : (
          <span>{sourceLabels[review.source]}</span>
        )}
      </div>
    </article>
  );
}
export function TrustSection() {
  const { reviews } = usePublicTestimonials();
  const selection = [...reviews]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);
  return (
    <section className="studio-section home-trust" id="pasitikejimas">
      <div className="studio-container">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow">Bendras darbas</p>
            <h2>
              {selection.length
                ? "Ką sako klientai"
                : "Ką sutariame prieš pradėdami"}
            </h2>
            <p className="studio-section-description">
              {selection.length
                ? "Atsiliepimai apie sukurtas svetaines, sistemas ir bendrą darbą."
                : "Aiški darbų apimtis, išbandoma eiga ir sutartas perdavimas."}
            </p>
          </div>
          {selection.length > 0 && (
            <Link to="/atsiliepimai" className="studio-text-link">
              Visi atsiliepimai
              <ArrowUpRight size={17} aria-hidden />
            </Link>
          )}
        </div>
        {selection.length ? (
          <div className="testimonial-grid">
            {selection.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <TrustPrinciples />
        )}
      </div>
    </section>
  );
}
export function TestimonialBrowser({
  reviews,
  syntheticPreview = false,
}: {
  reviews: Testimonial[];
  syntheticPreview?: boolean;
}) {
  const id = useId();
  const [filters, setFilters] = useState<ReviewFilters>({ sort: "newest" }),
    [page, setPage] = useState(1),
    [visible, setVisible] = useState(12),
    [view, setView] = useState("pages");
  const data = useMemo(
    () =>
      syntheticPreview
        ? reviews.filter(
            (value) => value.synthetic && value.source === "synthetic",
          )
        : publicTestimonials(reviews),
    [reviews, syntheticPreview],
  );
  const filtered = useMemo(
    () => filterTestimonials(data, filters),
    [data, filters],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 12)),
    currentPage = Math.min(page, pages);
  const displayed =
    view === "more"
      ? filtered.slice(0, visible)
      : filtered.slice((currentPage - 1) * 12, currentPage * 12);
  const summary = syntheticPreview ? null : testimonialSummary(data);
  function update(key: keyof ReviewFilters, value: string) {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
    setVisible(12);
  }
  return (
    <div className="testimonial-browser">
      {syntheticPreview && (
        <div className="synthetic-notice">
          <strong>Tik dizaino ir techniniams testams</strong>
          <p>
            200 sintetinių įrašų. Tai nėra tikrų klientų nuomonės. Įvertinimai
            ir vardai yra testiniai; bendras klientų įvertinimas
            neskaičiuojamas.
          </p>
        </div>
      )}
      {summary && (
        <p className="testimonial-summary">
          {summary.count} patvirtinti atsiliepimai · vidutinis įvertinimas{" "}
          {summary.rating.toFixed(1)} / 5
        </p>
      )}
      <div className="review-filters">
        <label htmlFor={`${id}-query`}>
          Paieška
          <input
            id={`${id}-query`}
            type="search"
            value={filters.query || ""}
            onChange={(event) => update("query", event.target.value)}
            placeholder="Ieškoti atsiliepimų"
          />
        </label>
        <label htmlFor={`${id}-service`}>
          Paslauga
          <select
            id={`${id}-service`}
            value={filters.service || ""}
            onChange={(event) => update("service", event.target.value)}
          >
            <option value="">Visos paslaugos</option>
            {serviceOrder.map((slug) => (
              <option key={slug} value={slug}>
                {serviceContent[slug].title}
              </option>
            ))}
            <option value="nfc-product">NFC ir QR kortelės</option>
          </select>
        </label>
        <label htmlFor={`${id}-rating`}>
          Įvertinimas
          <select
            id={`${id}-rating`}
            value={filters.rating || ""}
            onChange={(event) => update("rating", event.target.value)}
          >
            <option value="">Visi įvertinimai</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} iš 5
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${id}-sort`}>
          Rikiuoti
          <select
            id={`${id}-sort`}
            value={filters.sort}
            onChange={(event) => update("sort", event.target.value)}
          >
            <option value="newest">Naujausi pirmiau</option>
            <option value="oldest">Seniausi pirmiau</option>
            <option value="highest">Aukščiausiai įvertinti</option>
            <option value="lowest">Žemiausiai įvertinti</option>
          </select>
        </label>
        <label htmlFor={`${id}-view`}>
          Rodinys
          <select
            id={`${id}-view`}
            value={view}
            onChange={(event) => {
              setView(event.target.value);
              setPage(1);
              setVisible(12);
            }}
          >
            <option value="pages">Puslapiai</option>
            <option value="more">Rodyti daugiau</option>
          </select>
        </label>
      </div>
      <p role="status" className="review-results">
        Rasta: {filtered.length}. Rodoma{" "}
        {displayed.length
          ? view === "more"
            ? 1
            : (currentPage - 1) * 12 + 1
          : 0}
        –
        {view === "more"
          ? displayed.length
          : (currentPage - 1) * 12 + displayed.length}
        .
      </p>
      {displayed.length ? (
        <div className="testimonial-grid">
          {displayed.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="review-empty">
          <h2>Pagal šiuos pasirinkimus atsiliepimų nerasta</h2>
          <p>Pakeiskite paiešką ar filtrus.</p>
          <button
            type="button"
            className="studio-button secondary"
            onClick={() => {
              setFilters({ sort: "newest" });
              setPage(1);
              setVisible(12);
            }}
          >
            Išvalyti filtrus
          </button>
        </div>
      )}
      {filtered.length > 12 &&
        (view === "more" ? (
          <button
            type="button"
            className="studio-button secondary review-more"
            disabled={visible >= filtered.length}
            onClick={() => setVisible((value) => value + 12)}
          >
            {visible >= filtered.length
              ? "Visi įrašai parodyti"
              : "Rodyti daugiau"}
          </button>
        ) : (
          <nav className="review-pagination" aria-label="Atsiliepimų puslapiai">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Ankstesnis
            </button>
            <span aria-current="page">
              {currentPage} / {pages}
            </span>
            <button
              type="button"
              disabled={currentPage === pages}
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
            >
              Kitas
            </button>
          </nav>
        ))}
    </div>
  );
}
