import { PublicLayout } from "@/components/public/site-layout";
import { Seo } from "@/components/public/seo";
import {
  TestimonialBrowser,
  TrustPrinciples,
} from "@/components/public/testimonials";
import { DemoCTA } from "@/components/public/studio-landing";
import { usePublicTestimonials } from "@/lib/testimonial-data";

export function TestimonialsPage() {
  const { reviews, state } = usePublicTestimonials();
  return (
    <PublicLayout>
      <Seo
        title="Darbo principai ir klientų atsiliepimai | Skenis"
        description="Kaip susitariame dėl svetainės ar sistemos darbų apimties, naudojimo eigos ir perdavimo. Patvirtinti klientų atsiliepimai, kai jie pateikti su leidimu viešinti."
        path="/atsiliepimai"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="studio-container studio-page-intro">
          <p className="studio-eyebrow">Bendras darbas</p>
          <h1>{reviews.length ? "Ką sako klientai" : "Darbo principai"}</h1>
          <p className="studio-page-lead">
            {reviews.length
              ? "Atsiliepimai apie sukurtas svetaines, sistemas ir bendrą darbą."
              : "Prieš pradėdami suderiname darbų apimtį, kainą ir eigą. Sukurtą sprendimą išbandome ir parodome, kaip juo naudotis."}
          </p>
        </section>
        <section className="studio-container review-page-content">
          {state === "loading" ? (
            <p role="status">Įkeliami atsiliepimai…</p>
          ) : state === "error" ? (
            <>
              <p role="status">Šiuo metu atsiliepimų nepavyko įkelti.</p>
              <TrustPrinciples />
            </>
          ) : reviews.length ? (
            <TestimonialBrowser reviews={reviews} />
          ) : (
            <TrustPrinciples />
          )}
        </section>
        <DemoCTA compact />
      </main>
    </PublicLayout>
  );
}
