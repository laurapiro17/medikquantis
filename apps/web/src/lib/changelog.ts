// Versioned, citable release history. Each released version is archived on
// Zenodo under a concept DOI, so a specific calculator state can be cited in
// research — something a closed commercial tool can't offer. When a guideline
// changes a cut-off, add a new release entry here + its localized items array
// under the `changelog` i18n namespace.
export interface Release {
  version: string;
  /** ISO date (YYYY-MM-DD) the version was released. */
  date: string;
  /** i18n key (under `changelog`) for this release's bullet items array. */
  itemsKey: "changelog.v1_items";
}

export const DOI = "10.5281/zenodo.20562618";
export const DOI_URL = `https://doi.org/${DOI}`;

// Newest first.
export const RELEASES: readonly Release[] = [
  { version: "1.0.0", date: "2026-06-05", itemsKey: "changelog.v1_items" },
];

// Static citation (CITATION.cff mirror) for the "How to cite" block.
export const CITATION =
  "Piñero Roig, L. (2026). MedikQuantis: Multilingual clinical calculators " +
  "with patient-mode explanations (Version 1.0.0) [Software]. Zenodo. " +
  DOI_URL;
