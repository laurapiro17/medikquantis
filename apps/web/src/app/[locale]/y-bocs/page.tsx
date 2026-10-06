import { setRequestLocale, getTranslations } from "next-intl/server";
import { ybocs } from "@medcalc/calculators";
import { YbocsForm } from "@/components/YbocsForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";
import { CalcJsonLd } from "@/components/CalcJsonLd";
import { CalcContent } from "@/components/CalcContent";
import { CalcByline } from "@/components/CalcByline";
import { CalcReferences } from "@/components/CalcReferences";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("y-bocs", props.params);
}

export default async function YbocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <CalcJsonLd id="y-bocs" locale={locale} />
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          {t("ybocs.title")}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{t("ybocs.subtitle")}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {t("ybocs.assessment_note")}{" "}
          <a href="https://ocdscales.com/" target="_blank" rel="noreferrer"
            className="text-trust-600 underline dark:text-neon">
            {t("ybocs.instrument_link")}
          </a>
        </p>
      </div>
      <YbocsForm />
      <CalcContent id="y-bocs" locale={locale} />
      <CalcByline locale={locale} />
      <CalcReferences references={ybocs.calculator.references} label={t("common.references")} />
    </div>
  );
}
