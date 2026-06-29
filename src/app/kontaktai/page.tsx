import Link from "next/link";
import { LeadForm } from "@/components/lead-form";

export default function ContactPage() {
  return (
    <main className="bg-mist">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Link href="/" className="text-sm font-semibold text-brand-700">
            Skenis.lt
          </Link>
          <h1 className="mt-8 text-4xl font-bold tracking-normal">Kontaktai</h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Parašykite, kiek QR kortelių ar stendų reikia jūsų verslui.
            Atsakysime dėl kainos, maketo ir gamybos eigos.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel sm:p-7">
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
