import { setRequestLocale, getTranslations } from "next-intl/server";
import { isthDic } from "@medcalc/calculators";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";
import { CalcJsonLd } from "@/components/CalcJsonLd";
import { CalcContent } from "@/components/CalcContent";
import { CalcByline } from "@/components/CalcByline";
import { CalcReferences } from "@/components/CalcReferences";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("isth-dic", props.params);
}

export default async function IsthDicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <CalcJsonLd id="isth-dic" locale={locale} />
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("isthDic.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("isthDic.subtitle")}
        </h1>
      </div>

      <DynamicCalcForm calcId="isth-dic" />

      <CalcContent id="isth-dic" locale={locale} />

      <CalcByline locale={locale} />

      <CalcReferences
        references={isthDic.calculator.references}
        label={t("common.references")}
      />
    </div>
  );
}
