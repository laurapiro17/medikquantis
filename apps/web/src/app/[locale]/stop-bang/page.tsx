import { setRequestLocale, getTranslations } from "next-intl/server";
import { stopBang } from "@medcalc/calculators";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";
import { CalcJsonLd } from "@/components/CalcJsonLd";
import { CalcContent } from "@/components/CalcContent";
import { CalcByline } from "@/components/CalcByline";
import { CalcReferences } from "@/components/CalcReferences";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("stop-bang", props.params);
}

export default async function StopBangPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <CalcJsonLd id="stop-bang" locale={locale} />
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("stopBang.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("stopBang.subtitle")}
        </h1>
      </div>

      <DynamicCalcForm calcId="stop-bang" />

      <CalcContent id="stop-bang" locale={locale} />

      <CalcByline locale={locale} />

      <CalcReferences
        references={stopBang.calculator.references}
        label={t("common.references")}
      />
    </div>
  );
}
