# MedikQuantis

[![CI](https://github.com/laurapiro17/medikquantis/actions/workflows/ci.yml/badge.svg)](https://github.com/laurapiro17/medikquantis/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-medikquantis.me-93c5fd)](https://medikquantis.me)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20562617.svg)](https://doi.org/10.5281/zenodo.20562617)

**[medikquantis.me](https://medikquantis.me)** — 48 clinical calculators across 16 specialties in Catalan, Spanish and English. Open source, cited from the original papers, with a clinician/patient dual mode, a free REST API and SMART on FHIR support.

## Question

Why do clinicians in Spain still use English-only calculator tools, with no patient-facing mode and no transparent path from input to recommendation?

## Background

MDCalc and MedCalc are the global standards for clinical calculators, but neither offers Catalan/Spanish localisation done by a clinician, neither serves a parallel patient-friendly explanation, and neither publishes the calculation logic as open source code. MedikQuantis fills that gap across 16 specialties (cardiology, nephrology, neurology, ICU/sepsis, gastroenterology, infectious disease, surgery, geriatrics and more).

## What it is

- **Multilingual** clinical calculators (CA/ES/EN), localised by native speakers rather than machine-translated.
- **Dual-mode UI**: clinician compact view and patient narrative view on every calculator.
- **Cited**: each calculator embeds its PubMed reference; the result panel surfaces the ESC evidence grade.
- **Open**: source under MIT, calculations run client-side, no tracking, no cookies (beyond the theme toggle in localStorage).

## What it is NOT

- NOT a diagnostic tool or a substitute for medical assessment.
- NOT issuing personalised therapeutic recommendations.
- NOT yet validated in local populations; the scores are the originals from the authors.

## Calculators

**48 calculators across 16 specialties** — full searchable catalog at **[medikquantis.me](https://medikquantis.me)**.

Cardiology (CHA₂DS₂-VASc, HAS-BLED, ORBIT, EHRA, HEART, GRACE, TIMI, NYHA, SCORE2/OP, ASCVD) · Pulmonology/PE (Wells-PE, PERC, CURB-65) · ICU/sepsis (qSOFA, SOFA, APACHE II) · Neurology (GCS, NIHSS) · Gastro/Hepatology (MELD-3, Child-Pugh, Glasgow-Blatchford, Hinchey) · Nephrology (CKD-EPI 2021, Anion Gap, FENa, corrected Ca/Na) · Endocrine/Nutrition (Harris-Benedict, FINDRISC) · Infectious disease (Centor, LRINEC, Pitt, Duke) · Surgery/risk (RCRI, ASA-PS, Caprini, Wells-DVT) · Geriatrics (Charlson, Norton, Braden, Barthel) · Derm/Rheumatology (BASDAI, DAS28, PASI, SCORAD) · Urology (IPSS) · and more.

Every calculator is also available via the **free REST API** (OpenAPI/Swagger documented).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- next-intl for i18n
- Zod for input validation
- Vitest unit tests, CI-gated on every push
- Deployed to Vercel (free tier)

## Structure

```
medikquantis/
├── packages/calculators/      Framework-agnostic calculator logic
├── apps/web/                  Next.js application
└── scripts/                   i18n parity check, etc.
```

## Reproduce locally

```
pnpm install
pnpm dev           # http://localhost:3000
pnpm test          # Vitest across all packages
pnpm typecheck     # strict TS across all packages
pnpm lint:i18n     # CA/ES/EN message-key parity
pnpm build         # production Next.js build
```

## License

MIT — see [LICENSE](LICENSE). This software is informational only and is not intended to diagnose, treat, cure or prevent any disease.

## Citation

If you use MedikQuantis in academic work, see [`docs/CITING.md`](docs/CITING.md)
for ready-to-paste Methods paragraphs in English, Catalan and Spanish, plus
a BibTeX entry.

GitHub renders the [`CITATION.cff`](CITATION.cff) file natively — look for
the "Cite this repository" button on the repo page. Reference managers
(Zotero, EndNote, BibTeX) import it automatically.

Each released version is archived on Zenodo with its own DOI. Always cite
the **specific version** you used so your paper remains reproducible.
