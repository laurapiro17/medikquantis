import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { listCalcs } from "@medcalc/calculators";
import { routing, type Locale } from "@/i18n/routing";

// Node.js runtime (not "edge"): next-intl's getTranslations bundles the whole
// messages file, and as the i18n grew the edge bundle crossed Vercel's 1 MB
// Edge Function limit, failing the deploy. The Node serverless limit is far
// higher and next/og's ImageResponse runs fine here.
export const runtime = "nodejs";
export const alt = "MedikQuantis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function isSupportedLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export default async function OpenGraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isSupportedLocale(params.locale) ? params.locale : "en";
  const t = await getTranslations({ locale, namespace: "home" });

  // Derive the counts from the registry so this strapline never goes stale.
  const calcs = listCalcs();
  const calcCount = calcs.length;
  const specialtyCount = new Set(calcs.map((c) => c.specialty)).size;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          // Same palette as the site in dark mode: the #0c0f10 of the manifest
          // and the `neon` accent, rather than the cyan-on-teal this image used
          // to carry, which matched no other surface of the brand.
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(37,99,235,0.28), #0c0f10 65%)",
          color: "#f1f5f9",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* The MQ monogram, same geometry as components/Logo.tsx. */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={81} height={44} viewBox="0 0 59 32" fill="none">
            <path
              d="M4 26 L4 6 L16 26 L28 6 L28 26"
              stroke="#f1f5f9"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx={44.95}
              cy={16}
              r={10}
              stroke="#93c5fd"
              strokeWidth={4.1}
              strokeLinecap="round"
            />
            <path
              d="M48.70 24.4 L53.30 28.2"
              stroke="#93c5fd"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </svg>
          <span style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.6 }}>
            <span style={{ color: "#f1f5f9" }}>Medik</span>
            <span style={{ color: "#93c5fd" }}>Quantis</span>
          </span>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: "#ffffff",
            }}
          >
            {t("hero_heading")}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              color: "#94a3b8",
              maxWidth: 950,
            }}
          >
            {t("hero_subheading", { count: calcCount })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#94a3b8",
            borderTop: "1px solid rgba(147,197,253,0.22)",
            paddingTop: 24,
          }}
        >
          <span>
            {calcCount} calculators · {specialtyCount} specialties · CA · ES ·
            EN
          </span>
          <span style={{ fontFamily: "monospace", color: "#93c5fd" }}>
            DOI 10.5281/zenodo.20562617
          </span>
        </div>
      </div>
    ),
    size,
  );
}
