import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type React from "react";
import { getAdminAccessToken } from "@/lib/client-auth";
import { createBatch } from "@/lib/admin/batches.functions";
import { productTypeLabels } from "@/lib/labels";

export const Route = createFileRoute("/_authenticated/admin/batches/new")({
  head: () => ({
    meta: [{ title: "Generuoti QR partiją | Skenis.lt" }]
  }),
  component: NewBatchPage
});

function NewBatchPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const accessToken = await getAdminAccessToken();
      const result = await createBatch({
        data: {
          accessToken,
          name: form.get("name"),
          quantity: form.get("quantity"),
          productType: form.get("productType"),
          tokenPrefix: form.get("tokenPrefix"),
          note: form.get("note"),
          manufacturerNote: form.get("manufacturerNote")
        }
      });

      await navigate({
        to: "/admin/batches/$id",
        params: { id: result.batchId },
        search: { created: "1" }
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nepavyko sugeneruoti partijos.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Generuoti QR partiją</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sugeneruokite nuolatines Skenis trumpas nuorodas fizinių kortelių ar
          stendų gamybai. Visi nauji QR kodai pradedami kaip nepriskirti.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="admin-label">Partijos pavadinimas</span>
            <input
              className="admin-input"
              name="name"
              placeholder="2026-07 pirmas gamybos užsakymas"
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="admin-label">Kiekis</span>
              <select className="admin-input" name="quantity" defaultValue="50">
                {[1, 10, 50, 100, 500, 1000].map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="admin-label">Produkto tipas</span>
              <select className="admin-input" name="productType" defaultValue="CARD">
                <option value="CARD">{productTypeLabels.CARD}</option>
                <option value="STAND">{productTypeLabels.STAND}</option>
                <option value="NFC_CARD">{productTypeLabels.NFC_CARD}</option>
                <option value="OTHER">{productTypeLabels.OTHER}</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="admin-label">Token prefiksas arba žyma</span>
              <input className="admin-input" name="tokenPrefix" maxLength={12} placeholder="PVZ_" />
              <span className="text-xs text-slate-500">
                Tik raidės, skaičiai, brūkšnys ir pabraukimas.
              </span>
            </label>

            <label className="grid gap-2">
              <span className="admin-label">Vidinė pastaba</span>
              <input className="admin-input" name="note" placeholder="Pvz. juodas QR lipdukas" />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="admin-label">Pastaba gamintojui</span>
            <textarea
              className="admin-input min-h-28 resize-y"
              name="manufacturerNote"
              placeholder="Maketo, matmenų ar gamybos komentarai."
            />
          </label>

          <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-700">
            Kiekvienas sugeneruotas tokenas taps nuolatine nuoroda formatu
            https://skenis.lt/r/token. Vėliau keičiamas tik galutinis
            nukreipimo adresas.
          </div>

          <button className="admin-button w-full sm:w-fit" disabled={loading}>
            {loading ? "Generuojama..." : "Generuoti"}
          </button>
        </div>
      </form>
    </div>
  );
}
