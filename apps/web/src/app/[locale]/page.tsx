import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  cha2ds2vasc,
  hasbled,
  orbit,
  ehra,
  heart,
  grace,
  timi,
  nyha,
  ckdEpi2021,
  wellsPe,
  meld3,
  perc,
  qsofa,
} from "@medcalc/calculators";
import { Link } from "@/i18n/navigation";

const calcs = [
  { slug: "cha2ds2vasc", key: "cha2ds2vasc", calc: cha2ds2vasc.calculator },
  { slug: "hasbled", key: "hasbled", calc: hasbled.calculator },
  { slug: "orbit", key: "orbit", calc: orbit.calculator },
  { slug: "ehra", key: "ehra", calc: ehra.calculator },
  { slug: "heart", key: "heart", calc: heart.calculator },
  { slug: "grace", key: "grace", calc: grace.calculator },
  { slug: "timi", key: "timi", calc: timi.calculator },
  { slug: "nyha", key: "nyha", calc: nyha.calculator },
  { slug: "ckd-epi-2021", key: "ckdEpi2021", calc: ckdEpi2021.calculator },
  { slug: "wells-pe", key: "wellsPe", calc: wellsPe.calculator },
  { slug: "meld-3", key: "meld3", calc: meld3.calculator },
  { slug: "perc", key: "perc", calc: perc.calculator },
  { slug: "qsofa", key: "qsofa", calc: qsofa.calculator },
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
        {calcs.map(({ slug, key, calc }) => (
          <li key={slug}>
            <Link
              href={`/${slug}`}
              className="glass-panel block p-5 transition hover:border-trust-500 hover:shadow-md dark:hover:border-neon/50 dark:hover:shadow-neon-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-neon/80">
                  {t(`${key}.title` as "cha2ds2vasc.title")}
                </h2>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:bg-white/5 dark:text-slate-400">
                  {t(`specialties.${calc.specialty}` as "specialties.cardiology")}
                </span>
              </div>
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
