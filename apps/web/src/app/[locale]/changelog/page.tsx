import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/page-metadata";
import { RELEASES, DOI, DOI_URL, CITATION } from "@/lib/changelog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    pathSegment: "changelog",
    locale,
    title: t("changelog.heading"),
    description: t("changelog.intro"),
  });
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <article className="max-w-3xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("changelog.heading")}
        </h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
          {t("changelog.intro")}
        </p>
      </header>

      <div className="space-y-8">
        {RELEASES.map((rel) => {
          const items = t.raw(rel.itemsKey);
          const list = Array.isArray(items) ? (items as string[]) : [];
          return (
            <section
              key={rel.version}
              className="border-l-2 border-trust-500/40 pl-5 dark:border-neon/30"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="font-mono text-lg font-semibold text-slate-900 dark:text-slate-100">
                  v{rel.version}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t("changelog.released_label")} {rel.date}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {list.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-slate-400">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t("changelog.cite_heading")}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {t("changelog.cite_body")}
        </p>
        <p className="mt-3 rounded-md bg-white px-3 py-2 font-mono text-xs leading-relaxed text-slate-700 dark:bg-black/30 dark:text-slate-300">
          {CITATION}
        </p>
        <p className="mt-3 text-sm">
          <a
            href={DOI_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-trust-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-trust-700 dark:bg-neon dark:text-neon-ink dark:hover:bg-neon-soft"
          >
            DOI {DOI}
          </a>
        </p>
      </section>
    </article>
  );
}
