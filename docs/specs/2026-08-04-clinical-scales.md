# 17 clinical scales across six specialties

Date: 2026-08-04
Status: approved

## Goal

Add 17 clinical scales covering hematology, otorhinolaryngology, pulmonology,
neurology, gastroenterology and cardiology, and repair three existing
calculator pages that currently render no input fields.

## Why these scales

Selection criterion: a scale qualifies only if it is **both** a real ward /
on-call instrument **and** classic examinable material (4th year, MIR). Search
volume was explicitly rejected as a criterion.

Effort is weighted toward the gaps rather than spread evenly. Current catalogue,
by specialty:

| specialty | now | after |
|---|---|---|
| cardiology | 11 | 12 |
| gastroenterology | 3 | 5 |
| neurology | 2 | 5 |
| pulmonology | 1 | 4 |
| hematology | **0** | 4 |
| otorhinolaryngology | **0** | 4 |

Cardiology is already the richest chapter in the catalogue, so it gets one
addition covering its only clear gap. Hematology and ENT are empty and get four
each.

Note: Wells PE, PERC and Centor already exist but are filed under `emergency`,
not under pulmonology or ENT. They are **not** re-filed by this work — moving an
existing calculator between specialties changes its catalogue grouping and is
out of scope here.

## The scales

Point values, cut-offs and tier boundaries are taken from the primary source and
verified against it during implementation. The tables below fix the identity,
shape and specialty of each calculator, not its arithmetic.

### Hematology (4)

| id | scale | inputs | source |
|---|---|---|---|
| `isth-dic` | ISTH overt DIC score | 4 fields: platelets, fibrin marker, PT prolongation, fibrinogen | Taylor FB et al., Thromb Haemost 2001 |
| `4ts-hit` | 4Ts score for heparin-induced thrombocytopenia | 4 radios: thrombocytopenia, timing, thrombosis, oTher causes | Lo GK et al., J Thromb Haemost 2006 |
| `khorana` | Khorana score for chemotherapy-associated VTE | 5 fields: tumour site, platelets, haemoglobin/ESA, leukocytes, BMI | Khorana AA et al., Blood 2008 |
| `binet` | Binet staging for chronic lymphocytic leukaemia | 1 radio: stage A/B/C | Binet JL et al., Cancer 1981 |

### Otorhinolaryngology (4)

| id | scale | inputs | source |
|---|---|---|---|
| `stop-bang` | STOP-BANG for obstructive sleep apnoea | 8 booleans | Chung F et al., Anesthesiology 2008 |
| `epworth` | Epworth Sleepiness Scale | 8 radios, 0–3 each | Johns MW, Sleep 1991 |
| `snot-22` | SNOT-22 for chronic rhinosinusitis | 22 radios, 0–5 each | Hopkins C et al., Clin Otolaryngol 2009 |
| `house-brackmann` | House-Brackmann facial nerve grading | 1 radio: grade I–VI | House JW, Brackmann DE, Otolaryngol Head Neck Surg 1985 |

### Pulmonology (3)

| id | scale | inputs | source |
|---|---|---|---|
| `bode` | BODE index for COPD prognosis | 4 fields: BMI, FEV1 %, mMRC dyspnoea, 6-min walk distance | Celli BR et al., N Engl J Med 2004 |
| `lights-criteria` | Light's criteria, exudate vs transudate | 5 numbers: pleural and serum protein, pleural and serum LDH, serum LDH upper limit of normal | Light RW et al., Ann Intern Med 1972 |

Light's criteria is a rule, not a score: the effusion is an exudate if **any**
of its three ratios is exceeded. `formula` returns the count of criteria met
(0–3) so it fits `CalcDefinition`, and `interpret` reports exudate for ≥ 1 and
transudate for 0. `scoreRange` is `{ min: 0, max: 3 }`. The tier is therefore
binary in meaning even though the score is ordinal.

| `cat-copd` | COPD Assessment Test | 8 radios, 0–5 each | Jones PW et al., Eur Respir J 2009 |

### Neurology (3)

| id | scale | inputs | source |
|---|---|---|---|
| `abcd2` | ABCD2 for stroke risk after TIA | 5 fields: age, blood pressure, clinical features, duration, diabetes | Johnston SC et al., Lancet 2007 |
| `ich-score` | ICH score, 30-day mortality in intracerebral haemorrhage | 5 fields: GCS, age, volume, intraventricular extension, infratentorial origin | Hemphill JC et al., Stroke 2001 |
| `hunt-hess` | Hunt and Hess grading of subarachnoid haemorrhage | 1 radio: grade I–V | Hunt WE, Hess RM, J Neurosurg 1968 |

### Gastroenterology (2)

| id | scale | inputs | source |
|---|---|---|---|
| `rockall` | Rockall score for upper GI bleeding | 5 fields: age, shock, comorbidity, diagnosis, stigmata of haemorrhage | Rockall TA et al., Gut 1996 |
| `bisap` | BISAP for acute pancreatitis severity | 5 booleans | Wu BU et al., Gut 2008 |

Rockall complements the existing Glasgow-Blatchford: Blatchford triages before
endoscopy, Rockall prognosticates after it.

### Cardiology (1)

| id | scale | inputs | source |
|---|---|---|---|
| `killip` | Killip class in acute myocardial infarction | 1 radio: class I–IV | Killip T, Kimball JT, Am J Cardiol 1967 |

## Deliberately excluded

- **Ranson** — requires values at admission *and* at 48 h. Every calculator in
  the codebase assumes a single form captured at one moment. Two time points is
  an architecture change, not another calculator. BISAP covers acute
  pancreatitis severity with five admission variables instead.
- **PSI/PORT** — 20 variables. Buildable, but it dominates a batch on its own.
- **EDSS** — functional-system scoring is a nested instrument, not a flat form.

If any of these is wanted later it gets its own spec.

## Architecture

### Per-calculator anatomy

Each new scale follows the shape already established in
`packages/calculators/src/`, e.g. `cows.ts`, `hasbled.ts`:

```
packages/calculators/src/<id>.ts        Zod input schema, formula, interpret,
                                        CalcDefinition incl. fieldsMetadata
                                        and references
packages/calculators/tests/<id>.test.ts unit tests
packages/calculators/src/registry.ts    import + registry entry
packages/calculators/src/index.ts       re-export
apps/web/messages/{ca,es,en}.json       i18n namespace
apps/web/src/app/[locale]/<id>/page.tsx page route rendering DynamicCalcForm
```

### fieldsMetadata is mandatory

`DynamicCalcForm.tsx:96` only populates its render lists inside `if (meta)`,
where `meta` is `calculator.fieldsMetadata`. A calculator without it produces a
form containing nothing but the Reset button, with the score frozen at whatever
`customDefaults` the page passes.

This is not hypothetical: `homa-ir`, `bmi-bsa-ibw` and `free-water-deficit` are
live in the catalogue today and each renders **0** input fields (measured by
counting `<input>` in the served HTML; `cha2ds2vasc` renders 9 and `hasbled`
10 — they are the only two calculators in the repo that define
`fieldsMetadata`).

Therefore:

1. Every new calculator ships `fieldsMetadata` covering **every** field in its
   Zod schema.
2. The three broken calculators above get `fieldsMetadata` added as part of this
   work.

Widget shapes, per `FieldUIMetadata` in `types.ts`:

```ts
age:  { widget: "number",  min: 18, max: 120, defaultValue: 65 }
flag: { widget: "boolean", defaultValue: false }
sex:  { widget: "radio", defaultValue: "male",
        options: [{ value: "male", labelKey: "common.male" }, …] }
```

A radio option without `labelKey` resolves its label from
`<i18nKey>.fields.<field>_<value>`, which is how the multi-level clinical scales
(Epworth, SNOT-22, CAT, 4Ts) will label their options.

### The one new specialty

`hematology` **already exists** as an i18n label in all three locales — it is
simply unused, since no calculator currently claims it. Only
`otorhinolaryngology` is genuinely new and must be added to:

- the `Specialty` union in `packages/calculators/src/types.ts`
- `specialties.*` in `apps/web/messages/{ca,es,en}.json`
- the specialty chips in `apps/web/src/components/Catalog.tsx`

Precedent: the commit that added the psychiatry, pediatrics and obstetrics chips.

### i18n namespace per calculator

Each calculator owns one top-level namespace keyed by its `i18nKey` (camelCase,
e.g. `stopBang`), containing:

| key | contents |
|---|---|
| `title` | calculator name |
| `subtitle` | one-line description |
| `fields` | one entry per schema field, plus `<field>_<value>` per radio option |
| `patient` | `intro`, `result_low`, `result_moderate`, `result_high`, `ask_doctor`, `questions` — the patient-mode copy |
| `content` | `overview`, `interpretation`, `cautions`, `faq` |

All three locales get real translations. Catalan and Spanish are written as
clinical prose, not machine-translated from the English.

### References and PMIDs

Every reference carries a PMID **verified against NCBI**, not recalled. The
protocol is the one that caught seven fabricated PMIDs on 2026-08-02: resolve
the citation with `esearch`, confirm first author, journal, year, volume, issue
and pages with `esummary`, and only then write the number into the file.

`CalcReference.pmid` is optional. If a canonical source turns out not to be
indexed in PubMed, the citation ships without a PMID rather than with a wrong
one, and `scripts/verify-pmids.mjs` reports it in its skipped count.

## Testing

Per calculator:

- **Boundary tests** — minimum score, maximum score, and each tier transition in
  `interpret`. The existing suites (`tests/cows.test.ts` etc.) are the model.
- **Score sum test** — for additive scales, that the maximum attainable score
  equals the documented range in `scoreRange`.
- **Schema/metadata coverage test** — one shared test asserting that for every
  calculator in the registry, `Object.keys(fieldsMetadata)` covers every key of
  the Zod schema shape. This is what makes the empty-form bug impossible to
  reintroduce, and it fails today on the three broken calculators until they are
  fixed.
- **i18n completeness test** — for every radio option value in every schema, the
  key `<i18nKey>.fields.<field>_<value>` exists in all three locales. The
  existing parity gate compares locales to each other and therefore passes when
  all three are missing the same key, as happened with `cows.gi_options.5`.

## Acceptance criteria

1. `pnpm typecheck`, `pnpm lint:i18n`, `pnpm verify:pmids`, `pnpm test` and
   `pnpm build` all pass.
2. `verify:pmids` reports zero mismatches; any PMID-less reference appears in
   the skipped count with a stated reason.
3. The build log contains no `MISSING_MESSAGE`.
4. For each of the 20 affected calculators (17 new + 3 repaired), the rendered
   page contains one input control per schema field. Checked by counting
   rendered fields, not by the page returning 200.
5. Each new calculator appears in the catalogue under the right specialty chip.

## Delivery

The work ships as one pull request per specialty (hematology,
otorhinolaryngology, pulmonology, neurology, gastroenterology, cardiology),
each independently reviewable and revertible.
