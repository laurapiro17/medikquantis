import { setRequestLocale, getTranslations } from "next-intl/server";
import { Cha2ds2vascForm } from "@/components/Cha2ds2vascForm";
import { HasBledForm } from "@/components/HasBledForm";

export default async function ComparePage({
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
        <p className="font-mono text-xs uppercase tracking-widest text-trust-600 dark:text-neon/80">
          {t("compare.title")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          {t("compare.subtitle")}
        </h1>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {t("compare.intro")}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-neon/80">
            {t("compare.stroke_heading")}
          </h2>
          <Cha2ds2vascForm />
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-neon/80">
            {t("compare.bleeding_heading")}
          </h2>
          <HasBledForm />
        </section>
      </div>

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("compare.footer_note")}
      </p>
    </div>
  );
}
