"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  mapToCha2ds2vasc,
  encodeInputsParam,
  type MappingResult,
} from "@/lib/fhir-mapping";

// Default public sandbox (SMART Health IT, FHIR R4). Override in the field for
// a real EHR. EHR launch (iss + launch query params) is auto-detected by
// fhirclient; this field is for standalone launch.
const DEFAULT_FHIR = "https://launch.smarthealthit.org/v/r4/fhir";
const CLIENT_ID = "medikquantis_demo";
const SCOPE =
  "launch/patient patient/Patient.read patient/Condition.read openid fhirUser";

type Status = "idle" | "connecting" | "loading" | "ready" | "error";

const FLAG_FIELDS = [
  "chf",
  "hypertension",
  "diabetes",
  "strokeOrTia",
  "vascularDisease",
] as const;

export function SmartLaunch({ locale }: { locale: string }) {
  const t = useTranslations();
  const [status, setStatus] = useState<Status>("idle");
  const [endpoint, setEndpoint] = useState(DEFAULT_FHIR);
  const [result, setResult] = useState<MappingResult | null>(null);

  // If we're returning from the OAuth redirect (or a launch is in progress),
  // complete the handshake, fetch Patient + Conditions and map them.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const inFlow =
      params.has("code") ||
      params.has("state") ||
      params.has("launch") ||
      !!sessionStorage.getItem("SMART_KEY");
    if (!inFlow) return;

    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const FHIR = (await import("fhirclient")).default;
        const client = await FHIR.oauth2.ready();
        const patient = await client.patient.read();
        const conditions = (await client.request(
          `Condition?patient=${client.patient.id}`,
          { flat: true },
        )) as unknown[];
        const mapped = mapToCha2ds2vasc(
          patient as never,
          (Array.isArray(conditions) ? conditions : []) as never,
          new Date(),
        );
        if (!cancelled) {
          setResult(mapped);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setStatus("connecting");
    try {
      const FHIR = (await import("fhirclient")).default;
      FHIR.oauth2.authorize({
        iss: endpoint,
        clientId: CLIENT_ID,
        scope: SCOPE,
        redirectUri: window.location.pathname,
      });
      // authorize() navigates away; nothing after this runs on success.
    } catch {
      setStatus("error");
    }
  }, [endpoint]);

  const openCalc = useCallback(() => {
    if (!result) return;
    const p = encodeInputsParam(result.inputs);
    window.location.assign(`/${locale}/cha2ds2vasc?p=${p}`);
  }, [result, locale]);

  if (status === "ready" && result) {
    const { inputs, matched } = result;
    const detected = FLAG_FIELDS.filter((f) => inputs[f]);
    return (
      <div className="space-y-6">
        <section className="glass-panel p-5">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("smart.patient_heading")}
          </h2>
          <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">
            {t("cha2ds2vasc.fields.age")}: <strong>{inputs.age}</strong> ·{" "}
            {t("cha2ds2vasc.fields.sex")}:{" "}
            <strong>
              {inputs.sex === "female" ? t("common.female") : t("common.male")}
            </strong>
          </p>
        </section>

        <section className="glass-panel p-5">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("smart.detected_heading")}
          </h2>
          {detected.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {t("smart.none_detected")}
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {detected.map((f) => (
                <li key={f} className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {t(`cha2ds2vasc.fields.${f}` as "cha2ds2vasc.fields.chf")}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {(matched[f] ?? []).join("; ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button
          type="button"
          onClick={openCalc}
          className="rounded-md bg-trust-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-trust-700 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
        >
          {t("smart.open_calc")}
        </button>

        <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          {t("smart.prototype_note")}
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {t("smart.loading_patient")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block max-w-xl">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("smart.endpoint_label")}
        </span>
        <input
          type="url"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="input-underline mt-1 w-full font-mono text-sm"
          spellCheck={false}
        />
      </label>

      <button
        type="button"
        onClick={connect}
        disabled={status === "connecting"}
        className="rounded-md bg-trust-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-trust-700 disabled:opacity-50 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
      >
        {status === "connecting" ? t("smart.connecting") : t("smart.connect")}
      </button>

      {status === "error" && (
        <p className="text-sm text-cardio-700 dark:text-cardio-500">
          {t("smart.error")}
        </p>
      )}

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("smart.prototype_note")}
      </p>
    </div>
  );
}
