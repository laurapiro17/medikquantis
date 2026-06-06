"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Sidebar } from "./Sidebar";

interface CalcEntry {
  id: string;
  i18nKey: string;
  specialty: string;
  isPopular: boolean;
}

interface LayoutShellProps {
  calcs: readonly CalcEntry[];
  popularIds: readonly string[];
  header: ReactNode;
  disclaimer: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function LayoutShell({
  calcs,
  popularIds,
  header,
  disclaimer,
  footer,
  children,
}: LayoutShellProps) {
  const t = useTranslations();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const close = useCallback(() => setDrawerOpen(false), []);

  // Esc closes the drawer; body scroll locked while open so the drawer
  // itself remains the only scrollable region.
  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawerOpen, close]);

  return (
    <>
      <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        {/* Sticky desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white/70 backdrop-blur-md lg:block dark:border-white/10 dark:bg-[#0c0f10]/70">
          <Sidebar calcs={calcs} popularIds={popularIds} />
        </aside>

        <div className="flex min-h-screen flex-col">
          {/* Header with hamburger (mobile only) */}
          <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#111415]/60">
            <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-md border border-slate-300 p-2 text-slate-600 transition hover:border-trust-500 hover:text-trust-700 lg:hidden dark:border-white/15 dark:text-slate-300 dark:hover:border-neon/50 dark:hover:text-neon"
                aria-label={t("sidebar.toggle_label")}
                aria-expanded={drawerOpen}
                aria-controls="medikquantis-drawer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
              <div className="flex flex-1 items-center justify-between gap-2">
                {header}
              </div>
            </div>
          </div>

          {disclaimer}
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
            {children}
          </main>
          {footer}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("sidebar.label")}
        >
          <button
            type="button"
            onClick={close}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-label={t("sidebar.close_label")}
          />
          <div
            id="medikquantis-drawer"
            className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-slate-200 bg-white shadow-xl animate-fade-in dark:border-white/10 dark:bg-[#0c0f10]"
          >
            <Sidebar calcs={calcs} popularIds={popularIds} onNavigate={close} />
          </div>
        </div>
      )}
    </>
  );
}
