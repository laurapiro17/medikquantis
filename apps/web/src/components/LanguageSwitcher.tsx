"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(locale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div className="flex gap-1 text-xs">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          disabled={isPending || locale === currentLocale}
          className={
            locale === currentLocale
              ? "rounded-full bg-slate-900 px-2.5 py-1 font-medium text-white dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft"
              : "rounded-full border border-slate-300 px-2.5 py-1 text-slate-600 transition hover:border-trust-500 hover:text-trust-600 dark:border-white/15 dark:text-slate-300 dark:hover:border-neon dark:hover:text-neon"
          }
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
