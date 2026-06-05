# MedikQuantis

[![CI](https://github.com/laurapiro17/medikquantis/actions/workflows/ci.yml/badge.svg)](https://github.com/laurapiro17/medikquantis/actions/workflows/ci.yml)

Multilingual cardiology clinical calculators with locally validated scoring.

> Domini: a triar entre `medikquantis.com` / `medikquantis.health` / `medikquantis.es` (els 10 TLDs principals estan lliures al 5 jun 2026). Repo: [github.com/laurapiro17/medikquantis](https://github.com/laurapiro17/medikquantis).

## Question

Why do clinicians in Spain still use English-only calculator tools for cardiology decisions, when the scoring systems they apply have never been formally validated in Spanish populations?

## Background

MDCalc and MedCalc are the global standards for clinical calculators, but neither offers Catalan/Spanish localisation, neither serves patient-friendly explanations, and neither couples each calculator with population-specific validation evidence. There is a defensible gap for a cardio-focused, Iberian-localised, scientifically grounded alternative.

## Contribution

- **Multilingual** clinical calculators (CA/ES/EN), correctly translated by a medical student rather than mechanically.
- **Dual-mode UI**: clinician compact view and patient explanation view per calculator.
- **Locally validated**: each calculator is paired with a planned validation paper using Spanish-population data (MIMIC-IV subset and IRB AFiB cohort).

## Scope (MVP v1)

Five AFiB-centric calculators:

- CHA₂DS₂-VASc — stroke risk
- HAS-BLED — bleeding risk on anticoagulation
- ORBIT — alternative bleeding risk
- EHRA symptom score — AFiB symptom severity
- HEART — chest pain → ACS risk

Three languages: Catalan · Spanish · English.
Two modes per calculator: clinician · patient.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- next-intl for i18n
- Zod for input validation
- Vitest for unit tests, Playwright for E2E
- Deployed to Vercel (free tier)

## Structure

```
medcalc-cardio/
├── packages/calculators/      Framework-agnostic calculator logic
├── apps/web/                  Next.js application (TBD)
├── papers/                    Planned validation papers (TBD)
└── docs/
```

## Status

In active scaffolding (W1, June 2026). See the project plan at `~/.claude/plans/a1-a4-pero-aun-no-snug-frost.md`.

## Reproduce

```
pnpm install
pnpm test          # runs Vitest across all packages
pnpm typecheck     # strict TS across all packages
```

## Citation

To appear once the first validation paper is submitted. Each calculator's reference list is embedded in `packages/calculators/src/<calc>.ts`.
