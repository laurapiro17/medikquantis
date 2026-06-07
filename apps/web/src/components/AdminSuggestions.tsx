"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface Suggestion {
  id: string;
  createdAt: number;
  calcName: string;
  specialty?: string;
  context?: string;
  contactEmail?: string;
  locale: string;
  ipHash: string;
  userAgent?: string;
}

const STORAGE_KEY = "medikquantis-admin-key";

export function AdminSuggestions() {
  const t = useTranslations();
  const [key, setKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [rows, setRows] = useState<Suggestion[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Restore key from sessionStorage so refreshes don't re-prompt.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setKey(stored);
    } catch {
      // Storage blocked — user will simply have to re-enter the key.
    }
  }, []);

  const fetchRows = useCallback(async (adminKey: string) => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/suggestions", {
        headers: { "X-Admin-Key": adminKey },
      });
      if (r.status === 401) {
        setError(t("admin.invalid_key"));
        setKey(null);
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // Storage blocked — no-op.
        }
        return;
      }
      if (!r.ok) {
        setError(`HTTP ${r.status}`);
        return;
      }
      const data = (await r.json()) as { suggestions: Suggestion[] };
      setRows(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "fetch-failed");
    } finally {
      setBusy(false);
    }
  }, [t]);

  useEffect(() => {
    if (key) void fetchRows(key);
  }, [key, fetchRows]);

  async function deleteRow(id: string) {
    if (!key) return;
    if (!confirm(t("admin.confirm_delete"))) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/suggestions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": key },
      });
      await fetchRows(key);
    } finally {
      setBusy(false);
    }
  }

  if (!key) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!keyInput.trim()) return;
          try {
            sessionStorage.setItem(STORAGE_KEY, keyInput.trim());
          } catch {
            // Storage blocked — key still lives in component state.
          }
          setKey(keyInput.trim());
        }}
        className="glass-panel space-y-4 p-6"
      >
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {t("admin.prompt")}
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
          placeholder={t("admin.key_placeholder")}
        />
        {error && (
          <p className="text-xs text-cardio-600 dark:text-cardio-500">{error}</p>
        )}
        <button
          type="submit"
          className="rounded-md bg-trust-600 px-4 py-2 text-sm font-medium text-white dark:bg-neon dark:text-[#0c0f10]"
        >
          {t("admin.continue")}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {rows
            ? t("admin.count", { count: rows.length })
            : t("admin.loading")}
        </p>
        <button
          type="button"
          onClick={() => key && fetchRows(key)}
          disabled={busy}
          className="text-xs text-trust-600 hover:underline disabled:opacity-50 dark:text-neon"
        >
          {t("admin.refresh")}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-cardio-200 bg-cardio-50 p-3 text-xs text-cardio-700 dark:border-cardio-500/30 dark:bg-cardio-500/10 dark:text-cardio-500">
          {error}
        </div>
      )}

      {rows && rows.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("admin.empty")}
        </p>
      )}

      {rows && rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="glass-panel space-y-2 p-4 text-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-50">
                  {row.calcName}
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  {new Date(row.createdAt).toISOString().replace("T", " ").slice(0, 16)}
                </span>
              </div>
              {row.specialty && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-mono uppercase tracking-widest text-slate-400">
                    {t("admin.specialty")}:
                  </span>{" "}
                  {row.specialty}
                </p>
              )}
              {row.context && (
                <p className="whitespace-pre-line text-xs text-slate-700 dark:text-slate-300">
                  {row.context}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>locale {row.locale}</span>
                <span>ipHash {row.ipHash}</span>
                {row.contactEmail && (
                  <a
                    href={`mailto:${row.contactEmail}`}
                    className="text-trust-600 hover:underline dark:text-neon"
                  >
                    {row.contactEmail}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => deleteRow(row.id)}
                  disabled={busy}
                  className="ml-auto text-cardio-600 hover:underline disabled:opacity-50 dark:text-cardio-500"
                >
                  {t("admin.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
