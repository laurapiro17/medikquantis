"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

interface CalcEntry {
  id: string;
  i18nKey: string;
  specialty: string;
}

// Global ⌘K / Ctrl+K command palette: jump to any calculator from any page in
// one gesture — the cross-calculator navigation MDCalc relies on at the point
// of care. Renders a compact trigger (for discoverability + touch) plus the
// modal itself. Search corpus mirrors the home Catalog (title, subtitle,
// specialty, id), resolved in the current locale.
const MAX_RESULTS = 8;

export function CommandPalette({ calcs }: { calcs: readonly CalcEntry[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    return calcs.map((c) => {
      const title = t(`${c.i18nKey}.title` as "cha2ds2vasc.title");
      const subtitle = t(`${c.i18nKey}.subtitle` as "cha2ds2vasc.subtitle");
      const specialtyLabel = t(
        `specialties.${c.specialty}` as "specialties.cardiology",
      );
      const haystack = [title, subtitle, specialtyLabel, c.id]
        .join(" ")
        .toLowerCase();
      return { ...c, title, subtitle, specialtyLabel, haystack };
    });
  }, [calcs, t]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    const list = q ? items.filter((i) => i.haystack.includes(q)) : items;
    return list.slice(0, MAX_RESULTS);
  }, [items, q]);

  const close = useCallback(() => setOpen(false), []);

  // ⌘K / Ctrl+K toggles the palette from anywhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // On open: reset query/selection, focus the input, lock body scroll.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keep the active index within the (shrinking) result set.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  const go = useCallback(
    (id: string) => {
      close();
      router.push(`/${id}`);
    },
    [close, router],
  );

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[active];
      if (target) go(target.id);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-500 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-400 dark:hover:border-neon/50 dark:hover:text-neon"
        aria-label={t("home.search_placeholder")}
      >
        <SearchIcon />
        <span className="hidden sm:inline">{t("home.search_placeholder")}</span>
        <kbd className="ml-1 hidden rounded border border-slate-300 px-1 font-sans text-[10px] text-slate-400 sm:inline dark:border-white/15 dark:text-slate-500">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label={t("home.search_placeholder")}
        >
          <button
            type="button"
            onClick={close}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-label={t("sidebar.close_label")}
            tabIndex={-1}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-fade-in dark:border-white/10 dark:bg-[#0c0f10]">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={t("home.search_placeholder")}
              aria-label={t("home.search_placeholder")}
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="cmdk-listbox"
              aria-activedescendant={results[active] ? `cmdk-opt-${results[active].id}` : undefined}
              className="w-full border-b border-slate-200 bg-transparent px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {results.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                {t("home.search_empty")}
              </p>
            ) : (
              <ul id="cmdk-listbox" className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
                {results.map((item, i) => (
                  <li key={item.id} id={`cmdk-opt-${item.id}`} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition ${
                        i === active
                          ? "bg-trust-50 dark:bg-neon/10"
                          : "hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                          {item.title}
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {item.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                        {item.specialtyLabel}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
