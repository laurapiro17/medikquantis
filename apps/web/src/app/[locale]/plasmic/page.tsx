import { setRequestLocale, getTranslations } from "next-intl/server";
import { plasmic } from "@medcalc/calculators";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";
import { CalcJsonLd } from "@/components/CalcJsonLd";
import { CalcContent } from "@/components/CalcContent";
import { CalcByline } from "@/components/CalcByline";
import { CalcReferences } from "@/components/CalcReferences";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("plasmic", props.params);
}

export default async function PlasmicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <CalcJsonLd id="plasmic" locale={locale} />
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("plasmic.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("plasmic.subtitle")}
        </h1>
      </div>

      <DynamicCalcForm calcId="plasmic" />

      <CalcContent id="plasmic" locale={locale} />

      <CalcByline locale={locale} />

      <CalcReferences
        references={plasmic.calculator.references}
        label={t("common.references")}
      />
    </div>
  );
}
