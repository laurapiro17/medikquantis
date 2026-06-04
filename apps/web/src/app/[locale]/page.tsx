import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t("home.heading")}</h1>
        <p className="mt-2 text-slate-600">{t("home.subheading")}</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/cha2ds2vasc"
            className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-trust-500 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {t("cha2ds2vasc.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("cha2ds2vasc.subtitle")}
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/hasbled"
            className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-trust-500 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {t("hasbled.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("hasbled.subtitle")}
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
