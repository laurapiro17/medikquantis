// Single source of truth for the content-review byline shown on every
// calculator page (and mirrored into JSON-LD as author/reviewedBy).
//
// Honesty matters for medical E-E-A-T: this names the person who curated and
// reviewed the *content/implementation*. Clinical authority for each score
// stays with its original authors + the cited guidelines (see each page's
// References). To change the byline (e.g. to an editorial team, or to add a
// physician reviewer), edit only this file — the visible byline, the
// localized role label, and the structured data all read from here.

export const REVIEWER = {
  name: "Laura Piñero Roig",
  orcidId: "0009-0008-3390-4029",
  orcidUrl: "https://orcid.org/0009-0008-3390-4029",
  affiliation: "Universitat de Barcelona",
  // ISO date for schema.org lastReviewed (the human-readable label per locale
  // lives in messages/*.json under common.last_reviewed_value).
  lastReviewedIso: "2026-06-01",
} as const;
