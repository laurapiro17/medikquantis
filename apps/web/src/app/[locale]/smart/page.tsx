import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SmartLaunch } from "@/components/SmartLaunch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("smart.heading"),
    // Interactive launch surface, not indexable content.
    robots: { index: false, follow: false },
  };
}

export default async function SmartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="max-w-2xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("smart.heading")}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          {t("smart.intro")}
        </p>
      </header>

      <SmartLaunch locale={locale} />
    </div>
  );
}
