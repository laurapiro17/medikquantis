import { setRequestLocale, getTranslations } from "next-intl/server";
import { childPugh } from "@medcalc/calculators";
import { ChildPughForm } from "@/components/ChildPughForm";

export default async function ChildPughPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-neon">
          {t("childPugh.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("childPugh.subtitle")}
        </h1>
      </div>

      <ChildPughForm />

      <details className="glass-panel p-4 text-sm text-slate-600 dark:text-slate-300">
        <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">
          {t("common.references")}
        </summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {childPugh.calculator.references.map((r) => (
            <li key={r.pmid}>
              {r.citation}{" "}
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                target="_blank"
                rel="noreferrer"
                className="text-trust-600 underline dark:text-neon"
              >
                PMID:{r.pmid}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
