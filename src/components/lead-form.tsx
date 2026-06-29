"use client";

import { useState } from "react";
import { productTypeLabels } from "@/lib/labels";

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

export function LeadForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setState({
        status: "error",
        message: body?.message || "Nepavyko išsiųsti užklausos. Bandykite dar kartą."
      });
      return;
    }

    form.reset();
    setState({
      status: "success"
    });
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
        <textarea className="input min-h-28 resize-y" name="message" />
      </label>

      {state.status === "error" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <p className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Užklausa išsiųsta. Susisieksime dėl maketo, kiekio ir gamybos termino.
        </p>
      ) : null}

      <button className="button-primary w-full sm:w-fit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Siunčiama..." : "Pateikti užklausą"}
      </button>
    </form>
  );
}
