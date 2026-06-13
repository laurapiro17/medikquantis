import type { MetadataRoute } from "next";

// Web app manifest — makes MedikQuantis installable and is one of the
// installability criteria (alongside the service worker in public/sw.js and
// HTTPS). Next serves this at /manifest.webmanifest and auto-injects the
// <link rel="manifest"> tag.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MedikQuantis — Clinical calculators",
    short_name: "MedikQuantis",
    description:
      "Free, open-source clinical calculators and risk scores, grounded in primary literature.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0c0f10",
    theme_color: "#0c0f10",
    categories: ["medical", "health", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
