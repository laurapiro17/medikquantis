"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

interface SidebarEntry {
  id: string;
  i18nKey: string;
  specialty: string;
  isPopular: boolean;
}

interface SidebarProps {
  calcs: readonly SidebarEntry[];
  popularIds: readonly string[];
  onNavigate?: () => void; // Closes the mobile drawer after a link click.
  onCollapse?: () => void; // Desktop only — collapse the sidebar.
}

const DOI = "10.5281/zenodo.20562617";
const REPO_URL = "https://github.com/laurapiro17/medikquantis";

export function Sidebar({ calcs, popularIds, onNavigate, onCollapse }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname() ?? "";
  const [query, setQuery] = useState("");

  // Pre-resolve labels once per calc so search + grouping use the same
  // i18n-rendered strings the user sees.
  const items = useMemo(() => {
    return calcs.map((c) => {
      const title = t(`${c.i18nKey}.title` as "cha2ds2vasc.title");
      const specialtyLabel = t(
        `specialties.${c.specialty}` as "specialties.cardiology",
      );
      const haystack = [title, specialtyLabel, c.id].join(" ").toLowerCase();
      return { ...c, title, specialtyLabel, haystack };
    });
  }, [calcs, t]);

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((i) => i.haystack.includes(q)) : items;

  // The "Popular" section preserves the curator-defined order of
  // POPULAR_CALC_IDS rather than alphabetical / specialty order.
  const popularItems = popularIds
    .map((id) => items.find((i) => i.id === id))
    .filter((x): x is (typeof items)[number] => x !== undefined)
    .filter((i) => (q ? filtered.includes(i) : true));

  // Group the rest by specialty (preserve first-appearance order).
  const grouped = filtered.reduce<
    Map<string, { label: string; entries: typeof filtered }>
  >((acc, item) => {
    const existing = acc.get(item.specialty);
    if (existing) existing.entries.push(item);
    else acc.set(item.specialty, { label: item.specialtyLabel, entries: [item] });
    return acc;
  }, new Map());

  // The path ends with `/<calcId>` once next-intl strips the locale prefix.
  function isActive(calcId: string): boolean {
    return pathname.endsWith(`/${calcId}`);
  }

  return (
    <nav
      aria-label={t("sidebar.label")}
      className="flex h-full w-[264px] flex-col gap-5 overflow-y-auto px-4 py-5 text-sm"
    >
      <div className="flex items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("home.search_placeholder")}
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-trust-500 focus:outline-none focus:ring-1 focus:ring-trust-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-neon/60 dark:focus:ring-neon/30"
          aria-label={t("home.search_placeholder")}
        />
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="hidden shrink-0 rounded-md border border-slate-300 p-1.5 text-slate-500 transition hover:border-trust-500 hover:text-trust-700 lg:block dark:border-white/15 dark:text-slate-400 dark:hover:border-neon/50 dark:hover:text-neon"
            aria-label={t("sidebar.collapse_label")}
            title={t("sidebar.collapse_label")}
          >
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {popularItems.length > 0 && (
        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span aria-hidden>★</span>
            {t("sidebar.popular_heading")}
          </h2>
          <ul className="space-y-1">
            {popularItems.map((item) => (
              <li key={`pop-${item.id}`}>
                <Link
                  href={`/${item.id}`}
                  onClick={onNavigate}
                  className={`block rounded-md px-2 py-1.5 text-xs transition ${
                    isActive(item.id)
                      ? "bg-trust-50 font-medium text-trust-700 dark:bg-neon/10 dark:text-neon"
                      : "text-slate-700 hover:bg-slate-100 hover:text-trust-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-neon"
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t("sidebar.browse_by_specialty")}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("home.search_empty")}
          </p>
        ) : (
          <div className="space-y-3">
            {Array.from(grouped.entries()).map(([specialty, { label, entries }]) => (
              <div key={specialty} className="space-y-1">
                <h3 className="px-2 text-[10px] font-semibold text-slate-500 dark:text-slate-500">
                  {label}
                </h3>
                <ul className="space-y-0.5">
                  {entries.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/${item.id}`}
                        onClick={onNavigate}
                        className={`block rounded-md px-2 py-1 text-xs transition ${
                          isActive(item.id)
                            ? "bg-trust-50 font-medium text-trust-700 dark:bg-neon/10 dark:text-neon"
                            : "text-slate-700 hover:bg-slate-100 hover:text-trust-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-neon"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-auto space-y-2 border-t border-slate-200 pt-3 text-[10px] text-slate-500 dark:border-white/10 dark:text-slate-400">
        <a
          href={`https://doi.org/${DOI}`}
          target="_blank"
          rel="noreferrer"
          className="block font-mono hover:text-trust-600 dark:hover:text-neon"
        >
          DOI {DOI}
        </a>
        <a
          href="/api/v1/docs"
          className="block hover:text-trust-600 dark:hover:text-neon"
        >
          {t("site.nav_api")}
        </a>
        <Link
          href="/suggest"
          onClick={onNavigate}
          className="block hover:text-trust-600 dark:hover:text-neon"
        >
          {t("suggest.eyebrow")}
        </Link>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="block hover:text-trust-600 dark:hover:text-neon"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </nav>
  );
}
