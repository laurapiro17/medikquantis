"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface CatalogEntry {
  id: string;
  i18nKey: string;
  specialty: string;
}

interface CatalogProps {
  calcs: readonly CatalogEntry[];
}

// Color-code chips per specialty for fast visual scanning.
// Pairs chosen for: visible in both light and dark themes, semantically
// associated (red/heart for cardio, sky/water for nephro, etc.), and
// distinct from each other at small chip sizes.
const SPECIALTY_CHIP: Record<string, string> = {
  cardiology:
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  nephrology:
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  emergency:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  gastroenterology:
    "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
  intensive_care:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  pulmonology:
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  neurology:
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  endocrinology:
    "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  urology:
    "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
};

const DEFAULT_CHIP =
  "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400";

export function Catalog({ calcs }: CatalogProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");

  // Lowercase normalised search corpus per calc.
  // Memoised because the corpus only changes if the locale changes,
  // not on every keystroke.
  const items = useMemo(() => {
    return calcs.map((calc) => {
      const title = t(`${calc.i18nKey}.title` as "cha2ds2vasc.title");
      const subtitle = t(
        `${calc.i18nKey}.subtitle` as "cha2ds2vasc.subtitle",
      );
      const specialtyLabel = t(
        `specialties.${calc.specialty}` as "specialties.cardiology",
      );
      const haystack = [title, subtitle, specialtyLabel, calc.id]
        .join(" ")
        .toLowerCase();
      return { ...calc, title, subtitle, specialtyLabel, haystack };
    });
  }, [calcs, t]);

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((i) => i.haystack.includes(q)) : items;

  // Group by specialty; preserve first-appearance order so cardio stays first.
  const grouped = filtered.reduce<
    Map<string, { label: string; entries: typeof filtered }>
  >((acc, item) => {
    const existing = acc.get(item.specialty);
    if (existing) {
      existing.entries.push(item);
    } else {
      acc.set(item.specialty, {
        label: item.specialtyLabel,
        entries: [item],
      });
    }
    return acc;
  }, new Map());

  return (
    <div className="space-y-8">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("home.search_placeholder")}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-trust-500 focus:outline-none focus:ring-1 focus:ring-trust-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-neon/60 dark:focus:ring-neon/30"
          aria-label={t("home.search_placeholder")}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("home.search_empty")}
        </p>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(
            ([specialty, { label, entries }]) => (
              <section key={specialty} className="space-y-3">
                <h3 className="flex items-baseline justify-between border-b border-slate-200 pb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <span>{label}</span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    {entries.length}
                  </span>
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {entries.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/${item.id}`}
                        className="glass-panel block p-5 transition hover:border-trust-500 hover:shadow-md dark:hover:border-neon/50 dark:hover:shadow-neon-soft"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-neon/80">
                            {item.title}
                          </h4>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                              SPECIALTY_CHIP[item.specialty] ?? DEFAULT_CHIP
                            }`}
                          >
                            {item.specialtyLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-base text-slate-900 dark:text-slate-100">
                          {item.subtitle}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )}
        </div>
      )}
    </div>
  );
}
