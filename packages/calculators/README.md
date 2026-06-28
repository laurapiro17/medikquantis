# @medcalc/calculators

The calculator engine behind **[medikquantis.me](https://medikquantis.me)**. Framework-agnostic TypeScript: every clinical score is defined once here, validated with Zod, cited from its primary paper, and tested against published reference values. The web app, the REST API and the MCP server all consume this one package, so a score can never disagree with itself across surfaces.

No UI, no framework, one runtime dependency (`zod`). The logic runs anywhere TypeScript runs, client or server.

## Use

This is a workspace package inside the MedikQuantis monorepo (not published to npm). Within the repo:

```ts
import { getCalc, listCalcIds } from "@medcalc/calculators";

const calc = getCalc("cha2ds2vasc");
if (!calc) throw new Error("unknown calculator");

const inputs = calc.inputs.parse({
  age: 78,
  sex: "female",
  chf: false,
  hypertension: true,
  diabetes: true,
  strokeOrTia: false,
  vascularDisease: false,
});

const score = calc.formula(inputs);          // 5
const result = calc.interpret(score, inputs);
// {
//   tier: "high",
//   recommendation: "Oral anticoagulation is recommended (ESC Class I).",
//   recommendationCode: "CHA2DS2VASC_OAC_RECOMMENDED_I",
//   evidenceGrade: "A",
//   annualRiskPercent: 7.2,
// }
```

`listCalcIds()` returns every id, `getCalc(id)` resolves one, `listCalcs()` returns all of them.

## The contract

Each calculator is a single `CalcDefinition`:

| field | type | purpose |
| --- | --- | --- |
| `id` | `string` | stable slug, e.g. `"cha2ds2vasc"` |
| `inputs` | Zod schema | the only source of truth for valid input; parse at the boundary |
| `formula` | `(inputs) => number` | pure scoring, no side effects |
| `interpret` | `(score, inputs) => InterpretResult` | clinical band + recommendation |
| `references` | `CalcReference[]` | `{ pmid, citation }` from the original paper(s) |
| `scoreRange` | `{ min, max }` | bounds of the raw score |
| `specialty` | `Specialty` | open string union, e.g. `"cardiology"` |
| `i18nKey` | `string` | key into the CA/ES/EN message catalogue |

`interpret` returns:

```ts
interface InterpretResult {
  tier: "low" | "moderate" | "high";
  recommendation: string;       // human-readable, guideline-worded
  recommendationCode: string;   // stable machine code, safe to switch on
  evidenceGrade: "A" | "B" | "C";
  annualRiskPercent?: number;   // where the literature gives one
}
```

Splitting `formula` from `interpret` is deliberate: the score is arithmetic, the recommendation is a guideline judgement, and the edge cases belong in `interpret`. CHA₂DS₂-VASc is the clearest case — a woman who scores 1 *only* because of her sex is read as a 0, no anticoagulation, because under ESC 2024 female sex is a risk modifier rather than an indication on its own. That case is encoded explicitly instead of being left in prose.

## Tested against the literature

Every calculator ships a Vitest suite that pins the cases the papers actually specify: scoring boundaries (age 74 vs 75 in CHA₂DS₂-VASc), the documented edge cases, the maximum score, and published risk-table values (CHA₂DS₂-VASc annual stroke risk follows Friberg et al. 2012, PMID 22246443). Break a cited value and CI goes red.

```
pnpm --filter @medcalc/calculators test
pnpm --filter @medcalc/calculators typecheck
```

## Calculators

49 calculators across 16 specialties. Call `listCalcIds()` for the live list, or browse the searchable catalogue at [medikquantis.me](https://medikquantis.me). The root [README](../../README.md) groups them by specialty.

## Adding one

1. Create `src/<id>.ts` exporting a `CalcDefinition` (`inputs`, `formula`, `interpret`, `references`, `scoreRange`, `specialty`, `i18nKey`).
2. Add `src/<id>.test.ts` with vectors taken from the source paper.
3. Register it in `src/registry.ts`.
4. Add the CA/ES/EN strings for its `i18nKey` (the parity check is CI-gated).

## Related

[`pacharanero/calc`](https://github.com/pacharanero/calc) is an independent, UK-focused clinical-calculator engine in Rust, built around a shared scoring core and literature-vector tests. MedikQuantis is the TypeScript/frontend counterpart; the two are aligning where their calculators overlap.

## License

MIT, same as the parent repo. Informational only; not a diagnostic tool and not a substitute for clinical judgement.
