import { setRequestLocale, getTranslations } from "next-intl/server";
import { SuggestForm } from "@/components/SuggestForm";

export default async function SuggestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium text-trust-600 dark:text-neon/80">
          {t("suggest.eyebrow")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          {t("suggest.heading")}
        </h1>
        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
          {t("suggest.intro")}
        </p>
      </div>

      <SuggestForm />
    </div>
  );
}
