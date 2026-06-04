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
    <div className="flex gap-1 text-sm">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          disabled={isPending || locale === currentLocale}
          className={
            locale === currentLocale
              ? "rounded bg-slate-900 px-2 py-1 font-medium text-white"
              : "rounded px-2 py-1 text-slate-600 hover:bg-slate-100"
          }
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
