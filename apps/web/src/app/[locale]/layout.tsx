import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { listCalcs, POPULAR_CALC_IDS } from "@medcalc/calculators";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LayoutShell } from "@/components/LayoutShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Logo } from "@/components/Logo";
import { BASE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

function isSupportedLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

// Inline bootstrap that applies the stored theme before React hydrates,
// to avoid a flash of the wrong theme on first paint. Content is a literal
// constant — no user input ever reaches this string, so the
// `dangerouslySetInnerHTML` below carries no injection surface. This is the
// same pattern used by next-themes for the same reason.
const themeBootstrapScript = `
(function() {
  try {
    var stored = localStorage.getItem('medcalc-theme');
    var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const description = t("tagline");
  const url = `${BASE_URL}/${locale}`;

  return {
    metadataBase: new URL(BASE_URL),
    // Google Search Console verification (URL-prefix property https://medikquantis.me).
    verification: { google: "rtO-153asYrqiPlrIPB_T1yPW15EYmS3naaaYamrlfc" },
    // `default` is used by pages without their own title (e.g. the homepage);
    // `template` wraps any page that sets a plain string title (the calculators).
    title: {
      default: t("seo_title"),
      template: `%s · ${title}`,
    },
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}`]),
        ),
        "x-default": `${BASE_URL}/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: title,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "site" });

  const sidebarCalcs = listCalcs().map((c) => ({
    id: c.id,
    i18nKey: c.i18nKey,
    specialty: c.specialty,
    isPopular: (POPULAR_CALC_IDS as readonly string[]).includes(c.id),
  }));

  const header = (
    <>
      <Link
        href="/"
        aria-label={t("title")}
        className="flex items-center gap-2 font-semibold tracking-tight"
      >
        <Logo className="h-7 w-auto" />
        <span className="text-slate-800 transition dark:text-slate-100">Medik</span>
        <span className="-ml-2 text-trust-600 transition dark:text-neon">Quantis</span>
      </Link>
      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle />
      </div>
    </>
  );

  const disclaimer = (
    <div className="border-b border-slate-200 px-4 py-1.5 text-center text-xs text-slate-400 dark:border-white/8 dark:text-slate-500">
      {t("disclaimer_banner")}
    </div>
  );

  const footer = (
    <footer className="mt-auto border-t border-slate-200 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-[#0c0f10]/60">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p>{t("tagline")}</p>
          <p className="text-xs">
            <span>{t("built_by")}</span> <span aria-hidden>·</span>{" "}
            <span>{t("open_source")}</span>{" "}
            <a
              href="https://github.com/laurapiro17/medikquantis"
              target="_blank"
              rel="noreferrer"
              className="text-trust-600 transition hover:underline dark:text-neon"
            >
              GitHub
            </a>
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link href="/compare" className="hover:text-trust-600 dark:hover:text-neon">
            {t("nav_compare")}
          </Link>
          <a href="/api/v1/docs" className="hover:text-trust-600 dark:hover:text-neon">
            {t("nav_api")}
          </a>
          <Link href="/about" className="hover:text-trust-600 dark:hover:text-neon">
            {t("nav_about")}
          </Link>
          <Link
            href="/methodology"
            className="hover:text-trust-600 dark:hover:text-neon"
          >
            {t("nav_methodology")}
          </Link>
          <Link
            href="/changelog"
            className="hover:text-trust-600 dark:hover:text-neon"
          >
            {t("nav_changelog")}
          </Link>
          <Link href="/privacy" className="hover:text-trust-600 dark:hover:text-neon">
            {t("nav_privacy")}
          </Link>
          <Link href="/terms" className="hover:text-trust-600 dark:hover:text-neon">
            {t("nav_terms")}
          </Link>
        </nav>
      </div>
    </footer>
  );

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <LayoutShell
            calcs={sidebarCalcs}
            popularIds={POPULAR_CALC_IDS}
            header={header}
            disclaimer={disclaimer}
            footer={footer}
          >
            {children}
          </LayoutShell>
        </NextIntlClientProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
