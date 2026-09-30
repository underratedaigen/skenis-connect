import { PublicLayout } from "@/components/public/site-layout";
import { Seo } from "@/components/public/seo";
import { TestimonialBrowser } from "@/components/public/testimonials";
import { testimonialSchema } from "@/lib/testimonials";
import fixture from "@/data/fixtures/testimonials.synthetic.json";
const reviews = fixture.map((value) => testimonialSchema.parse(value));
export default function TestimonialsPreviewPage() {
  return (
    <PublicLayout>
      <Seo
        title="Sintetinių atsiliepimų testavimas | Skenis"
        description="Privati kūrimo aplinkos peržiūra su 200 pažymėtų sintetinių testinių įrašų."
        path="/testavimas/atsiliepimai"
        noIndex
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="studio-container studio-page-intro review-test-page"
      >
        <h1>Atsiliepimų komponentų testavimas</h1>
        <TestimonialBrowser reviews={reviews} syntheticPreview />
      </main>
    </PublicLayout>
  );
}
