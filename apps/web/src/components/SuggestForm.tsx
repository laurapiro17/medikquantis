"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

type Status = "idle" | "submitting" | "ok" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (t: string) => void; theme?: string },
      ) => string;
      reset: (id?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function SuggestForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [calcName, setCalcName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [context, setContext] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot — kept hidden
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Lazy-load the Turnstile script and render the widget into our slot
  // once it is available. The render call gives us a token via callback.
  useEffect(() => {
    if (!SITE_KEY) return; // Dev/test: no widget, server permissive.

    let cancelled = false;
    function mount() {
      if (cancelled || !turnstileRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: SITE_KEY!,
        callback: (token: string) => setTurnstileToken(token),
        theme: "auto",
      });
    }

    if (window.turnstile) {
      mount();
    } else {
      const id = "cf-turnstile-script";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
        s.async = true;
        s.defer = true;
        window.onTurnstileLoad = mount;
        document.head.appendChild(s);
      } else {
        window.onTurnstileLoad = mount;
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const r = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calcName,
          specialty: specialty || undefined,
          context: context || undefined,
          contactEmail: contactEmail || undefined,
          locale,
          website, // Honeypot value — should be empty.
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setStatus("error");
        setErrorMessage(data?.error ?? `HTTP ${r.status}`);
        return;
      }
      setStatus("ok");
      setCalcName("");
      setSpecialty("");
      setContext("");
      setContactEmail("");
      setTurnstileToken(null);
      if (widgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "submit-failed");
    }
  }

  if (status === "ok") {
    return (
      <div className="glass-panel animate-fade-in space-y-3 p-6">
        <h2 className="font-semibold text-emerald-700 dark:text-emerald-300">
          {t("suggest.success_heading")}
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {t("suggest.success_body")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm text-trust-600 hover:underline dark:text-neon"
        >
          {t("suggest.success_again")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel space-y-5 p-6">
      <Field label={t("suggest.fields.calcName")} required>
        <input
          type="text"
          value={calcName}
          onChange={(e) => setCalcName(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          className={inputClass}
        />
      </Field>

      <Field label={t("suggest.fields.specialty")}>
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          maxLength={60}
          placeholder={t("suggest.specialty_placeholder")}
          className={inputClass}
        />
      </Field>

      <Field label={t("suggest.fields.context")}>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder={t("suggest.context_placeholder")}
          className={inputClass}
        />
      </Field>

      <Field label={t("suggest.fields.contactEmail")}>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          maxLength={120}
          placeholder={t("suggest.email_placeholder")}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t("suggest.email_hint")}
        </p>
      </Field>

      {/* Honeypot — visually hidden, off-screen. Bots that auto-fill all
          inputs trip this; humans never see or touch it. */}
      <label className="hidden" aria-hidden>
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>

      {SITE_KEY && (
        <div className="space-y-1">
          <div ref={turnstileRef} className="min-h-[65px]" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("suggest.turnstile_hint")}
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-cardio-200 bg-cardio-50 p-3 text-xs text-cardio-700 dark:border-cardio-500/30 dark:bg-cardio-500/10 dark:text-cardio-500">
          {t("suggest.error_prefix")}: {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting" || !calcName.trim()}
          className="rounded-md bg-trust-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-trust-700 disabled:opacity-50 dark:bg-neon dark:text-[#0c0f10] dark:hover:bg-[#5cf5ff]"
        >
          {status === "submitting"
            ? t("suggest.submitting")
            : t("suggest.submit")}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-trust-500 focus:outline-none focus:ring-1 focus:ring-trust-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-neon/60 dark:focus:ring-neon/30";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
        {required && <span aria-hidden className="ml-1 text-cardio-600 dark:text-cardio-500">*</span>}
      </span>
      {children}
    </label>
  );
}
