import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type React from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { productTypeLabels } from "@/lib/labels";
import { leadCreateSchema } from "@/lib/validation";

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

function blankToNull(value: string | undefined) {
  return value?.trim() ? value.trim() : null;
}

export function LeadForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = leadCreateSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      setState({
        status: "error",
        message: parsed.error.issues[0]?.message || "Patikrinkite formos laukus."
      });
      return;
    }

    const data = parsed.data;

    if (!isSupabaseConfigured) {
      setState({
        status: "error",
        message: "Supabase aplinkos kintamieji dar nesukonfigūruoti."
      });
      return;
    }

    const { error } = await supabase.from("leads").insert({
      name: data.name,
      company_name: data.companyName,
      email: data.email,
      phone: blankToNull(data.phone),
      quantity: data.quantity,
      product_type: data.productType,
      google_review_url: blankToNull(data.googleReviewUrl),
      message: blankToNull(data.message)
    });

    if (error) {
      setState({
        status: "error",
        message: error.message || "Nepavyko išsiųsti užklausos. Bandykite dar kartą."
      });
      return;
    }

    form.reset();
    setState({ status: "success" });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">Vardas</span>
          <input className="input" name="name" autoComplete="name" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Įmonės pavadinimas</span>
          <input className="input" name="companyName" autoComplete="organization" required />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">El. paštas</span>
          <input className="input" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Telefonas</span>
          <input className="input" name="phone" autoComplete="tel" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="label">Norimas kiekis</span>
          <input
            className="input"
            name="quantity"
            type="number"
            min={1}
            defaultValue={25}
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="label">Produkto tipas</span>
          <select className="input" name="productType" defaultValue="CARD">
            <option value="CARD">{productTypeLabels.CARD}</option>
            <option value="STAND">{productTypeLabels.STAND}</option>
            <option value="NFC_CARD">{productTypeLabels.NFC_CARD}</option>
            <option value="OTHER">{productTypeLabels.OTHER}</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="label">Google review nuoroda, jei jau turite</span>
        <input
          className="input"
          name="googleReviewUrl"
          type="url"
          placeholder="https://g.page/r/.../review"
        />
      </label>

      <label className="grid gap-2">
        <span className="label">Komentaras</span>
        <textarea
          className="input min-h-28 resize-y"
          name="message"
          placeholder="Kiek kortelių reikia, kur jos bus naudojamos, ar turite maketą?"
        />
      </label>

      {state.status === "error" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <div className="flex gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm leading-6 text-brand-700">
          <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Užklausa išsiųsta. Susisieksime dėl maketo, kiekio ir gamybos termino.</p>
        </div>
      ) : null}

      <button className="button-primary w-full sm:w-fit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Siunčiama..." : "Pateikti užklausą"}
      </button>
    </form>
  );
}
