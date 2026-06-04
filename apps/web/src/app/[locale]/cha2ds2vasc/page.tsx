import { setRequestLocale, getTranslations } from "next-intl/server";
import { cha2ds2vasc } from "@medcalc/calculators";
import { Cha2ds2vascForm } from "@/components/Cha2ds2vascForm";

export default async function Cha2ds2vascPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {t("cha2ds2vasc.title")}
        </h1>
        <p className="mt-2 text-slate-600">{t("cha2ds2vasc.subtitle")}</p>
      </div>

      <Cha2ds2vascForm />

      <details className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-700">
          {t("common.references")}
        </summary>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {cha2ds2vasc.calculator.references.map((r) => (
            <li key={r.pmid}>
              {r.citation}{" "}
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                target="_blank"
                rel="noreferrer"
                className="text-trust-600 underline"
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
