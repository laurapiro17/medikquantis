"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";

interface ShareActionsProps {
  shareableInputs?: Record<string, unknown>;
  tier?: "low" | "moderate" | "high";
  mode?: "clinician" | "patient";
  // Plain-text clinical summary of the result, ready to paste into an EHR.
  // Built by ResultPanel (clinician mode only). When present, a "Copy result"
  // button is shown; the canonical URL + attribution are appended at copy time.
  resultSummary?: string;
}

// Extract the locale segment (`en`, `es`, `ca`) from the current URL path,
// independent of next-intl wiring. Returns "unknown" if we cannot tell —
// we never want analytics to throw.
function detectLang(): string {
  if (typeof window === "undefined") return "unknown";
  const first = window.location.pathname.split("/").filter(Boolean)[0];
  if (first === "en" || first === "es" || first === "ca") return first;
  return "unknown";
}

// `permalink` = user landed here via a shared `?p=` link (= someone else
// computed this case and shared it). `manual` = user filled the form on
// their own. The distinction tells us how much value Copy-link generates.
function detectSource(): "manual" | "permalink" {
  if (typeof window === "undefined") return "manual";
  return new URLSearchParams(window.location.search).has("p")
    ? "permalink"
    : "manual";
}

// Encodes the form inputs into a single compact URL query param.
// Base64url is shorter than url-encoded JSON for nested objects and
// avoids parameter-name collisions across calculators (every calc just
// gets one `p=` blob to round-trip).
function encodeInputs(inputs: Record<string, unknown>): string {
  const json = JSON.stringify(inputs);
  if (typeof window === "undefined") return "";
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Copy arbitrary text to the clipboard with a textarea fallback for
// insecure contexts / denied permissions. Returns true on success.
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

export function ShareActions({
  shareableInputs,
  tier,
  mode,
  resultSummary,
}: ShareActionsProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const [resultCopied, setResultCopied] = useState(false);

  // Fire once when this component first appears — i.e. when a result has
  // just been rendered. Vercel auto-captures the path (so we already know
  // which calculator), this event adds the engagement dimensions.
  useEffect(() => {
    track("calc_computed", {
      tier: tier ?? "unknown",
      source: detectSource(),
      lang: detectLang(),
      mode: mode ?? "unknown",
    });
    // Intentionally no deps — we only want to track one event per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (shareableInputs && Object.keys(shareableInputs).length > 0) {
      url.searchParams.set("p", encodeInputs(shareableInputs));
    }
    if (await copyText(url.toString())) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }, [shareableInputs]);

  // Copy the EHR-pasteable clinical summary, with the canonical (param-free)
  // URL + attribution appended so the note is traceable to its source.
  const handleCopyResult = useCallback(async () => {
    if (typeof window === "undefined" || !resultSummary) return;
    const source = `${window.location.origin}${window.location.pathname}`;
    const text = `${resultSummary}\n\n${t("common.result_source")} — ${source}`;
    if (await copyText(text)) {
      setResultCopied(true);
      window.setTimeout(() => setResultCopied(false), 1800);
    }
  }, [resultSummary, t]);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  return (
    <div
      data-no-print
      className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10"
    >
      {resultSummary && (
        <button
          type="button"
          onClick={() => {
            track("result_copied", {
              tier: tier ?? "unknown",
              lang: detectLang(),
            });
            void handleCopyResult();
          }}
          className="rounded-md bg-trust-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-trust-700 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
        >
          {resultCopied
            ? t("common.copy_result_copied")
            : t("common.copy_result")}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          track("permalink_copied", {
            tier: tier ?? "unknown",
            lang: detectLang(),
          });
          void handleCopy();
        }}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-neon/50 dark:hover:text-neon"
      >
        {copied ? t("common.share_copied") : t("common.share_copy")}
      </button>
      <button
        type="button"
        onClick={() => {
          track("result_printed", { tier: tier ?? "unknown" });
          handlePrint();
        }}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-neon/50 dark:hover:text-neon"
      >
        {t("common.share_print")}
      </button>
    </div>
  );
}
