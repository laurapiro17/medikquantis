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
    pathSegment: "about",
    locale,
    title: t("about.heading"),
    description: t("about.intro"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const whatItIs = t.raw("about.what_it_is");
  const whatItIsnt = t.raw("about.what_it_isnt");
  const whatItIsList = Array.isArray(whatItIs) ? (whatItIs as string[]) : [];
  const whatItIsntList = Array.isArray(whatItIsnt) ? (whatItIsnt as string[]) : [];

  return (
    <article className="space-y-10 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("about.heading")}
        </h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
          {t("about.intro")}
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {t("about.who_heading")}
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          {t("about.who_body")}
        </p>
      </section>

      <section className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("about.what_it_is_heading")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {whatItIsList.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-slate-400">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("about.what_it_isnt_heading")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {whatItIsntList.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-slate-400">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {t("about.roadmap_heading")}
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          {t("about.roadmap_body")}
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {t("about.contact_heading")}
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          {t("about.contact_body")}{" "}
          <a
            href="https://github.com/laurapiro17/medikquantis/issues"
            target="_blank"
            rel="noreferrer"
            className="text-trust-600 underline dark:text-neon"
          >
            github.com/laurapiro17/medikquantis
          </a>
          .
        </p>
      </section>
    </article>
  );
}
