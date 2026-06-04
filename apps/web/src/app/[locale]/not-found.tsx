import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-trust-600 dark:text-neon">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-50">
        {t("notfound.heading")}
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        {t("notfound.body")}
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-trust-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-trust-700 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
      >
        {t("notfound.cta")}
      </Link>
    </div>
  );
}
