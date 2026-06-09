import { setRequestLocale, getTranslations } from "next-intl/server";
import { orbit } from "@medcalc/calculators";
import { OrbitForm } from "@/components/OrbitForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("orbit", props.params);
}

export default async function OrbitPage({
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
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("orbit.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("orbit.subtitle")}
        </h1>
      </div>

      <OrbitForm />

      <details className="glass-panel p-4 text-sm text-slate-600 dark:text-slate-300">
        <summary className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("common.references")}
        </summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {orbit.calculator.references.map((r) => (
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
