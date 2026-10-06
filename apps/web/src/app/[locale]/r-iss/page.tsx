import { setRequestLocale, getTranslations } from "next-intl/server";
import { rIss } from "@medcalc/calculators";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";
import { CalcJsonLd } from "@/components/CalcJsonLd";
import { CalcContent } from "@/components/CalcContent";
import { CalcByline } from "@/components/CalcByline";
import { CalcReferences } from "@/components/CalcReferences";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("r-iss", props.params);
}

export default async function RIssPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <CalcJsonLd id="r-iss" locale={locale} />
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("rIss.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("rIss.subtitle")}
        </h1>
      </div>

      <DynamicCalcForm calcId="r-iss" />

      <CalcContent id="r-iss" locale={locale} />

      <CalcByline locale={locale} />

      <CalcReferences
        references={rIss.calculator.references}
        label={t("common.references")}
      />
    </div>
  );
}
