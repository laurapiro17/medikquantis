import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    pathSegment: "privacy",
    locale,
    title: t("privacy.heading"),
    description: t("privacy.summary"),
  });
}

interface Section {
  heading: string;
  body: string;
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const sectionsRaw = t.raw("privacy.sections");
  const sections = Array.isArray(sectionsRaw) ? (sectionsRaw as Section[]) : [];

  return (
    <article className="space-y-8 max-w-3xl">
      <header>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("privacy.updated")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("privacy.heading")}
        </h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
          {t("privacy.summary")}
        </p>
      </header>

      <div className="space-y-6">
        {sections.map((s, i) => (
          <section key={i} className="glass-panel p-5">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              {s.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
