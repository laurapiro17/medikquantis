import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const calcs = [
  { slug: "cha2ds2vasc", key: "cha2ds2vasc" },
  { slug: "hasbled", key: "hasbled" },
  { slug: "orbit", key: "orbit" },
  { slug: "ehra", key: "ehra" },
  { slug: "heart", key: "heart" },
  { slug: "grace", key: "grace" },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("home.heading")}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {t("home.subheading")}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {calcs.map(({ slug, key }) => (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              className="glass-panel block p-5 transition hover:border-trust-500 hover:shadow-md dark:hover:border-neon/50 dark:hover:shadow-neon-soft"
            >
              <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-neon/80">
                {t(`${key}.title` as "cha2ds2vasc.title")}
              </h2>
              <p className="mt-2 text-base text-slate-900 dark:text-slate-100">
                {t(`${key}.subtitle` as "cha2ds2vasc.subtitle")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
