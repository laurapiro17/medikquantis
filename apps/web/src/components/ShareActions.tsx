"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

interface ShareActionsProps {
  shareableInputs?: Record<string, unknown>;
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

export function ShareActions({ shareableInputs }: ShareActionsProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (shareableInputs && Object.keys(shareableInputs).length > 0) {
      url.searchParams.set("p", encodeInputs(shareableInputs));
    }
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API rejected (insecure context, permission, etc.) —
      // fall back to a textarea select-and-copy.
      const ta = document.createElement("textarea");
      ta.value = url.toString();
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } finally {
        document.body.removeChild(ta);
      }
    }
  }, [shareableInputs]);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  return (
    <div
      data-no-print
      className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10"
    >
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-neon/50 dark:hover:text-neon"
      >
        {copied ? t("common.share_copied") : t("common.share_copy")}
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-neon/50 dark:hover:text-neon"
      >
        {t("common.share_print")}
      </button>
    </div>
  );
}
