import { setRequestLocale, getTranslations } from "next-intl/server";
import { AdminSuggestions } from "@/components/AdminSuggestions";

export default async function AdminSuggestionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-trust-600 dark:text-neon/80">
          {t("admin.eyebrow")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("admin.heading")}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t("admin.subheading")}
        </p>
      </div>
      <AdminSuggestions />
    </div>
  );
}

// Discourage indexing of the admin route.
export const metadata = {
  robots: { index: false, follow: false },
};
