import { useState } from "react";
import type React from "react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { productTypeLabels } from "@/lib/labels";
import { leadCreateSchema } from "@/lib/validation";

function blankToNull(value: string | undefined) {
  return value?.trim() ? value.trim() : null;
}

export function LeadForm({
  initialProductType = "CARD",
  initialQuantity = 25
}: {
  initialProductType?: string;
  initialQuantity?: number;
} = {}) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = leadCreateSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Patikrinkite formos laukus.");
      setLoading(false);
      return;
    }

    const data = parsed.data;

    if (!isSupabaseConfigured) {
      toast.error("Supabase aplinkos kintamieji dar nesukonfigūruoti.");
      setLoading(false);
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
      toast.error(error.message || "Nepavyko išsiųsti užklausos. Bandykite dar kartą.");
      setLoading(false);
      return;
    }

    form.reset();
    toast.success("Užklausa išsiųsta. Susisieksime dėl maketo, kiekio ir gamybos termino.");
    setLoading(false);
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
            defaultValue={initialQuantity}
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="label">Produkto tipas</span>
          <select className="input" name="productType" defaultValue={initialProductType}>
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

      <button className="button-primary w-full sm:w-fit" disabled={loading}>
        {loading ? "Siunčiama..." : "Pateikti užklausą"}
      </button>
    </form>
  );
}
