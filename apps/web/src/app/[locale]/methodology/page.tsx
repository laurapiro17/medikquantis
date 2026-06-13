import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/page-metadata";
import { REVIEWER } from "@/lib/reviewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    pathSegment: "methodology",
    locale,
    title: t("methodology.heading"),
    description: t("methodology.intro"),
  });
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const sections = [
    { h: "methodology.sources_heading", b: "methodology.sources_body" },
    { h: "methodology.review_heading", b: "methodology.review_body" },
    { h: "methodology.updates_heading", b: "methodology.updates_body" },
    { h: "methodology.privacy_heading", b: "methodology.privacy_body" },
    { h: "methodology.open_heading", b: "methodology.open_body" },
    { h: "methodology.limitations_heading", b: "methodology.limitations_body" },
  ] as const;

  return (
    <article className="max-w-3xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("methodology.heading")}
        </h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
          {t("methodology.intro")}
        </p>
      </header>

      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t(s.h)}
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{t(s.b)}</p>
          {s.h === "methodology.review_heading" && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {REVIEWER.name} —{" "}
              <a
                href={REVIEWER.orcidUrl}
                target="_blank"
                rel="noreferrer"
                className="text-trust-600 underline dark:text-neon"
              >
                ORCID {REVIEWER.orcidId}
              </a>
            </p>
          )}
          {s.h === "methodology.open_heading" && (
            <p className="mt-2 text-sm">
              <a
                href="https://github.com/laurapiro17/medikquantis"
                target="_blank"
                rel="noreferrer"
                className="text-trust-600 underline dark:text-neon"
              >
                GitHub
              </a>{" "}
              ·{" "}
              <a
                href="/api/v1/docs"
                className="text-trust-600 underline dark:text-neon"
              >
                API
              </a>
            </p>
          )}
        </section>
      ))}
    </article>
  );
}
