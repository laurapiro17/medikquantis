# MedikQuantis

[![CI](https://github.com/laurapiro17/medikquantis/actions/workflows/ci.yml/badge.svg)](https://github.com/laurapiro17/medikquantis/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Clinical calculators in Catalan, Spanish and English — open source, cited evidence, patient mode. Starting with cardiology.

## Question

Why do clinicians in Spain still use English-only calculator tools, with no patient-facing mode and no transparent path from input to recommendation?

## Background

MDCalc and MedCalc are the global standards for clinical calculators, but neither offers Catalan/Spanish localisation done by a clinician, neither serves a parallel patient-friendly explanation, and neither publishes the calculation logic as open source code. MedikQuantis fills that gap, starting with cardiology and growing across other medical fields.

## What it is

- **Multilingual** clinical calculators (CA/ES/EN), translated by a medical student rather than machine-translated.
- **Dual-mode UI**: clinician compact view and patient narrative view on every calculator.
- **Cited**: each calculator embeds its PubMed reference; the result panel surfaces the ESC evidence grade.
- **Open**: source under MIT, calculations run client-side, no tracking, no cookies (beyond the theme toggle in localStorage).

## What it is NOT

- NOT a diagnostic tool or a substitute for medical assessment.
- NOT issuing personalised therapeutic recommendations.
- NOT yet validated in local populations; the scores are the originals from the authors.

## Calculators (current)

| Calc | Domain | Score range |
|---|---|---|
| CHA₂DS₂-VASc | AFiB stroke risk | 0–9 |
| HAS-BLED | AFiB bleeding risk (warfarin era) | 0–9 |
| ORBIT | AFiB bleeding risk (DOAC era) | 0–7 |
| EHRA | AFiB symptom classification | I/IIa/IIb/III/IV |
| HEART | Chest pain → ACS risk in the ED | 0–10 |
| GRACE | In-hospital mortality in ACS | 0–372 |
| TIMI | 14-day MACE in UA/NSTEMI | 0–7 |
| NYHA | Heart failure functional class | I/II/III/IV |

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- next-intl for i18n
- Zod for input validation
- Vitest for unit tests (101 currently green)
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
