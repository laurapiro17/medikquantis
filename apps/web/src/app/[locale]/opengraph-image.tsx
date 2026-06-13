import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
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
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(0,105,112,0.55), #0b0f14 65%)",
          color: "#e6f7ff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#00f0ff",
              boxShadow: "0 0 18px #00f0ff",
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#00f0ff",
              fontWeight: 600,
            }}
          >
            MedikQuantis
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
              color: "#9fbac8",
              maxWidth: 950,
            }}
          >
            {t("hero_subheading")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#9fbac8",
            borderTop: "1px solid rgba(0,240,255,0.2)",
            paddingTop: 24,
          }}
        >
          <span>13 calculators · 5 specialties · CA · ES · EN</span>
          <span style={{ fontFamily: "monospace", color: "#00f0ff" }}>
            DOI 10.5281/zenodo.20562617
          </span>
        </div>
      </div>
    ),
    size,
  );
}
