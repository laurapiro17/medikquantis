// Curated list of calculators that get used most across rotations
// (cardio AFiB workflow, ED chest-pain triage, pneumonia severity, head
// trauma, comorbidity adjustment, biochem corrections, eGFR).
//
// Order matters — it determines display order in the sidebar and on the
// home "Popular" section. Hand-curated until Vercel Analytics has enough
// real `calc_computed` events to derive empirically (~Jul 2026).
export const POPULAR_CALC_IDS = [
  "cha2ds2vasc",
  "heart",
  "sofa",
  "wells-pe",
  "curb-65",
  "nihss",
  "gcs",
  "apache-2",
  "charlson",
  "ckd-epi-2021",
  "calcium-corrected",
  "wells-dvt",
] as const;

export type PopularCalcId = (typeof POPULAR_CALC_IDS)[number];

export function isPopular(id: string): boolean {
  return (POPULAR_CALC_IDS as readonly string[]).includes(id);
}
