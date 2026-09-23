import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { trackConversion } from "@/lib/conversion-events";
import {
  studioLeadSchema,
  studioServiceOptions,
  toStudioLeadPayload,
  type StudioLeadIntent,
} from "@/lib/studio-lead";

type FormStatus = "idle" | "loading" | "success" | "error";

export function StudioContactForm({
  initialService = "kita",
  intent = "demo",
}: {
  initialService?: string;
  intent?: StudioLeadIntent;
}) {
  const id = useId();
  const statusRef = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [service, setService] = useState(
    studioServiceOptions.some((option) => option.value === initialService)
      ? initialService
      : "kita",
  );

  useEffect(() => {
    setService(
      studioServiceOptions.some((option) => option.value === initialService)
        ? initialService
        : "kita",
    );
  }, [initialService]);

  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  function fieldAttributes(name: string) {
    return {
      id: `${id}-${name}`,
      "aria-invalid": errors[name] ? (true as const) : undefined,
      "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    };
  }

  function fieldError(name: string) {
    return errors[name] ? (
      <span id={`${id}-${name}-error`} className="studio-form-field-error">
        {errors[name]}
      </span>
    ) : null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const parsed = studioLeadSchema.safeParse(
      Object.fromEntries(new FormData(form).entries()),
    );
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const name = String(issue.path[0]);
        if (!nextErrors[name]) nextErrors[name] = issue.message;
      });
      setErrors(nextErrors);
      setStatus("idle");
      const firstField = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (firstField instanceof HTMLElement) firstField.focus();
      return;
    }

    sending.current = true;
    setErrors({});
    setStatus("loading");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      // Load the existing integration only when needed by a visitor.
      const { isSupabaseConfigured, supabase } =
        await import("@/integrations/supabase/client");
      if (!isSupabaseConfigured)
        throw new Error("Lead integration unavailable");
      const { error } = await supabase
        .from("leads")
        .insert(toStudioLeadPayload(parsed.data, intent))
        .abortSignal(controller.signal);
      if (error) throw error;

      setStatus("success");
      trackConversion("form_submit", { service: parsed.data.service, intent });
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      sending.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        className="studio-form-success"
        role="status"
        tabIndex={-1}
        ref={statusRef}
      >
        <span className="studio-form-success-icon">
          <Check size={24} aria-hidden="true" />
        </span>
        <h3>Užklausą gavome.</h3>
        <p>
          Ačiū, kad papasakojote apie savo verslą. Susisieksime jūsų nurodytu
          el. paštu arba telefonu ir aptarsime kitą žingsnį.
        </p>
        {intent === "demo" && (
          <p>
            Jei projektui tiks pradinis pavyzdys, kartu suderinsime jo apimtį.
          </p>
        )}
        <button
          type="button"
          className="studio-form-another"
          onClick={() => setStatus("idle")}
        >
          Pateikti kitą užklausą <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form
      className="studio-form"
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "loading"}
    >
      <div className="studio-form-row">
        <div className="studio-form-field">
          <label htmlFor={`${id}-name`}>Jūsų vardas</label>
          <input
            {...fieldAttributes("name")}
            name="name"
            autoComplete="name"
            placeholder="Vardas"
            maxLength={120}
            required
          />
          {fieldError("name")}
        </div>
        <div className="studio-form-field">
          <label htmlFor={`${id}-contact`}>El. paštas arba telefonas</label>
          <input
            {...fieldAttributes("contact")}
            name="contact"
            type="text"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Kaip su jumis susisiekti?"
            maxLength={180}
            required
          />
          {fieldError("contact")}
        </div>
      </div>
      <div className="studio-form-field">
        <label htmlFor={`${id}-service`}>Kuo galime padėti?</label>
        <select
          {...fieldAttributes("service")}
          name="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
          required
        >
          {studioServiceOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldError("service")}
      </div>
      <div className="studio-form-field">
        <label htmlFor={`${id}-message`}>Trumpai apie jūsų idėją</label>
        <textarea
          {...fieldAttributes("message")}
          name="message"
          placeholder="Ką norėtumėte pagerinti? Galbūt kažkas užima per daug laiko arba neveikia taip, kaip norėtųsi."
          rows={4}
          maxLength={2000}
          required
        />
        {fieldError("message")}
      </div>
      <div className="studio-form-row optional-fields">
        <div className="studio-form-field">
          <label htmlFor={`${id}-companyName`}>
            Įmonė <span>(nebūtina)</span>
          </label>
          <input
            {...fieldAttributes("companyName")}
            name="companyName"
            autoComplete="organization"
            placeholder="Įmonės pavadinimas"
            maxLength={180}
          />
          {fieldError("companyName")}
        </div>
        <div className="studio-form-field">
          <label htmlFor={`${id}-website`}>
            Jūsų svetainė <span>(nebūtina)</span>
          </label>
          <input
            {...fieldAttributes("website")}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="imone.lt"
            maxLength={500}
          />
          {fieldError("website")}
        </div>
      </div>
      <div className="studio-form-honeypot" hidden aria-hidden="true">
        <label htmlFor={`${id}-faxNumber`}>Palikite šį lauką tuščią</label>
        <input
          id={`${id}-faxNumber`}
          name="faxNumber"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="studio-form-consent">
        <label htmlFor={`${id}-privacy`}>
          <input
            {...fieldAttributes("privacy")}
            type="checkbox"
            name="privacy"
            required
          />
          <span>
            Susipažinau su{" "}
            <Link
              to="/privatumo-politika"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Privatumo politika (atsidaro naujame skirtuke)"
            >
              privatumo politika
            </Link>{" "}
            ir sutinku, kad su manimi būtų susisiekta dėl šios užklausos.
          </span>
        </label>
        {fieldError("privacy")}
      </div>
      {errors.faxNumber && (
        <p className="studio-form-field-error" role="alert">
          {errors.faxNumber}
        </p>
      )}
      {status === "error" && (
        <div
          className="studio-form-error"
          ref={statusRef}
          role="alert"
          tabIndex={-1}
        >
          <p>
            Užklausos išsiųsti nepavyko. Jūsų įrašyta informacija išsaugota
            formoje. Bandykite dar kartą arba parašykite{" "}
            <a
              href="mailto:skenis.info@gmail.com"
              onClick={() =>
                trackConversion("email_click", { source: "form_error" })
              }
            >
              skenis.info@gmail.com
            </a>
            .
          </p>
        </div>
      )}
      <button
        className="studio-form-submit"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <LoaderCircle
              className="studio-form-spinner"
              size={18}
              aria-hidden="true"
            />{" "}
            Siunčiama…
          </>
        ) : (
          <>
            {intent === "demo" ? "Gauti nemokamą pavyzdį" : "Aptarti projektą"}
            <ArrowUpRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <p className="studio-form-note">
        Jokių įsipareigojimų. Pirmiausia išsiaiškinsime, kuo galime būti
        naudingi.
      </p>
    </form>
  );
}
