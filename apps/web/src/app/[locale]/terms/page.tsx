import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/page-metadata";

interface Section {
  heading: string;
  body: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const sections = t.raw("terms.sections") as { heading: string; body: string }[];
  const description =
    Array.isArray(sections) && sections[0] ? sections[0].body : t("terms.heading");
  return buildPageMetadata({
    pathSegment: "terms",
    locale,
    title: t("terms.heading"),
    description,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const sectionsRaw = t.raw("terms.sections");
  const sections = Array.isArray(sectionsRaw) ? (sectionsRaw as Section[]) : [];

  return (
    <article className="space-y-8 max-w-3xl">
      <header>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("terms.updated")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("terms.heading")}
        </h1>
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
