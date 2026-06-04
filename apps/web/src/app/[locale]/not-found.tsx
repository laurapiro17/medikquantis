import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-sm font-medium text-trust-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        {t("notfound.heading")}
      </h1>
      <p className="mt-3 text-slate-600">{t("notfound.body")}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-trust-600 px-4 py-2 text-sm font-medium text-white hover:bg-trust-700"
      >
        {t("notfound.cta")}
      </Link>
    </div>
  );
}
