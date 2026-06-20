// Content-review metadata. Only `lastReviewedIso` is currently rendered
// (schema.org lastReviewed). The named reviewer (name/ORCID/affiliation) is
// intentionally NOT shown on the public site for now — the calculator byline,
// the methodology page and the structured data attribute authorship to the
// MedikQuantis project instead. The identity is kept here so the named byline
// can be re-enabled in one place once the project has more traction.

export const REVIEWER = {
  name: "Laura Piñero Roig",
  orcidId: "0009-0008-3390-4029",
  orcidUrl: "https://orcid.org/0009-0008-3390-4029",
  affiliation: "Universitat de Barcelona",
  // ISO date for schema.org lastReviewed (the human-readable label per locale
  // lives in messages/*.json under common.last_reviewed_value).
  lastReviewedIso: "2026-06-01",
} as const;
