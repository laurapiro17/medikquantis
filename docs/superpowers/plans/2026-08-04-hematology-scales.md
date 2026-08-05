# Hematology Scales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the first of six specialty batches from the clinical-scales spec — four hematology calculators — plus the shared groundwork every later batch depends on.

**Architecture:** Each calculator is a self-contained module in `packages/calculators/src/` exporting a Zod input schema, a `formula`, an `interpret`, and a `CalcDefinition` carrying `fieldsMetadata` and verified references. The web app renders it through the registry-driven `DynamicCalcForm`, which receives only a serializable `calcId`. Three existing calculators are repaired and two new tests lock the contracts that were silently broken this week.

**Tech Stack:** TypeScript, Zod 3.25, Vitest, Next.js App Router, next-intl, pnpm workspaces.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-04-clinical-scales-six-specialties-design.md`
- Branch: `feat/hematology-scales`, based on `main`. One PR. **Never self-merge.**
- Commit messages: conventional-commits, lowercase, no AI attribution, no `Co-Authored-By`.
- Every `CalcDefinition` MUST define `fieldsMetadata` covering **every** key of its Zod schema. A calculator without it renders a form with zero input fields.
- Every reference PMID MUST be verified against NCBI before it is written. The four PMIDs in this plan are already verified (see Task 3–6); do not substitute others without re-verifying.
- All three locales (`ca`, `es`, `en`) get real clinical prose. Catalan and Spanish are not machine-translated from English.
- `specialty: "hematology"` — the label already exists in all three locales. **No new specialty key is needed in this batch.**
- Acceptance for every page: one rendered input control per schema field. "The page returns 200" is not acceptance.

---

### Task 1: Lock the fieldsMetadata contract and repair the three broken calculators

`DynamicCalcForm.tsx:96` only builds its render lists inside `if (meta)`. Of 61 calculators, only `cha2ds2vasc` and `hasbled` define `fieldsMetadata`; `homa-ir`, `bmi-bsa-ibw` and `free-water-deficit` are live in the catalogue rendering zero input fields.

**Files:**
- Create: `packages/calculators/tests/fields-metadata-coverage.test.ts`
- Modify: `packages/calculators/src/homa-ir.ts`, `packages/calculators/src/bmi-bsa-ibw.ts`, `packages/calculators/src/free-water-deficit.ts`

**Interfaces:**
- Consumes: `listCalcs()` from `packages/calculators/src/registry.ts`; `FieldUIMetadata` from `./types`.
- Produces: nothing importable. Establishes the invariant every later task relies on.

- [ ] **Step 1: Write the failing test**

Create `packages/calculators/tests/fields-metadata-coverage.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ZodObject, type ZodTypeAny } from "zod";
import { listCalcs } from "../src/registry";

// A calculator without fieldsMetadata renders a form with no input fields at
// all: DynamicCalcForm only populates its render lists when the metadata is
// present. Every field in the schema must therefore have an entry.
describe("fieldsMetadata coverage", () => {
  for (const calc of listCalcs()) {
    it(`${calc.id} declares metadata for every schema field`, () => {
      const shape = (calc.inputs as unknown as ZodObject<Record<string, ZodTypeAny>>).shape;
      const schemaKeys = Object.keys(shape).sort();
      const metaKeys = Object.keys(calc.fieldsMetadata ?? {}).sort();
      expect(metaKeys).toEqual(schemaKeys);
    });
  }
});
```

- [ ] **Step 2: Run it and confirm it fails on exactly the known calculators**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/fields-metadata-coverage.test.ts 2>&1 | tail -30`

Expected: FAIL. Many calculators fail (only `cha2ds2vasc` and `hasbled` pass). Record the full list of failing ids — it is the true scope of the pre-existing damage and must be reported to Laura before going further. **Do not fix all of them in this task.**

- [ ] **Step 3: Decide scope with the measured number in hand**

If the failure count is the expected 59, the contract cannot be enforced repo-wide in this PR. Narrow the test to the calculators this batch owns and report the rest:

```ts
// Enforced for calculators repaired or added since 2026-08-04. The remaining
// legacy calculators use hand-written form components instead of
// DynamicCalcForm and are tracked separately.
const ENFORCED = new Set([
  "homa-ir",
  "bmi-bsa-ibw",
  "free-water-deficit",
  "isth-dic",
  "4ts-hit",
  "khorana",
  "binet",
]);

describe("fieldsMetadata coverage", () => {
  for (const calc of listCalcs().filter((c) => ENFORCED.has(c.id))) {
```

Before narrowing, verify the premise: run
`git grep -L "DynamicCalcForm" -- 'apps/web/src/app/\[locale\]/*/page.tsx' | wc -l`
to count pages using hand-written forms. A hand-written form supplies its own
fields and does not need `fieldsMetadata`; only `DynamicCalcForm` pages do.

- [ ] **Step 4: Add fieldsMetadata to homa-ir**

In `packages/calculators/src/homa-ir.ts`, inside the `calculator` object, immediately before `references`:

```ts
  fieldsMetadata: {
    fastingGlucoseMgDl: { widget: "number", min: 30, max: 500, defaultValue: 95 },
    fastingInsulinuIUml: { widget: "number", min: 0.5, max: 300, defaultValue: 5 },
  },
```

- [ ] **Step 5: Add fieldsMetadata to bmi-bsa-ibw**

In `packages/calculators/src/bmi-bsa-ibw.ts`, same position:

```ts
  fieldsMetadata: {
    heightCm: { widget: "number", min: 50, max: 250, defaultValue: 170 },
    weightKg: { widget: "number", min: 10, max: 350, defaultValue: 70 },
    sex: {
      widget: "radio",
      defaultValue: "male",
      options: [
        { value: "male", labelKey: "common.male" },
        { value: "female", labelKey: "common.female" },
      ],
    },
  },
```

- [ ] **Step 6: Add fieldsMetadata to free-water-deficit**

In `packages/calculators/src/free-water-deficit.ts`, same position:

```ts
  fieldsMetadata: {
    weightKg: { widget: "number", min: 20, max: 250, defaultValue: 70 },
    currentSodiumMEqL: { widget: "number", min: 140, max: 200, defaultValue: 155 },
    targetSodiumMEqL: { widget: "number", min: 130, max: 145, defaultValue: 140 },
    sex: {
      widget: "radio",
      defaultValue: "male",
      options: [
        { value: "male", labelKey: "common.male" },
        { value: "female", labelKey: "common.female" },
      ],
    },
    ageCategory: {
      widget: "radio",
      defaultValue: "adult",
      options: [{ value: "adult" }, { value: "elderly" }],
    },
  },
```

`ageCategory` options carry no `labelKey`, so they resolve from
`freeWaterDeficit.fields.ageCategory_adult` and `..._elderly`. Those keys do not
exist yet — Step 7 adds them.

- [ ] **Step 7: Add the two missing option labels to all three locales**

In `apps/web/messages/ca.json`, inside `freeWaterDeficit.fields`:

```json
"ageCategory_adult": "Adult (18–64 anys)",
"ageCategory_elderly": "Gran (≥ 65 anys)"
```

In `apps/web/messages/es.json`:

```json
"ageCategory_adult": "Adulto (18–64 años)",
"ageCategory_elderly": "Anciano (≥ 65 años)"
```

In `apps/web/messages/en.json`:

```json
"ageCategory_adult": "Adult (18–64 years)",
"ageCategory_elderly": "Elderly (≥ 65 years)"
```

- [ ] **Step 8: Run the coverage test and the full suite**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/fields-metadata-coverage.test.ts && pnpm test 2>&1 | grep -E "Tests |FAIL"`

Expected: coverage test PASSes for the three repaired calculators; full suite still 364 passing.

- [ ] **Step 9: Verify the forms actually render fields now**

Run: `cd ~/dev/medikquantis && pnpm --filter @medcalc/web dev -p 3010 &` then, once it is up:

```bash
for p in homa-ir bmi-bsa-ibw free-water-deficit; do
  echo "$p: $(curl -s http://localhost:3010/ca/$p | grep -c '<input')"
done
```

Expected: `homa-ir: 3` (2 fields + the layout search box), `bmi-bsa-ibw: 5` (2 numbers + 2 radios + search), `free-water-deficit: 8` (3 numbers + 4 radios + search). Anything equal to 1 means the field still is not rendering. Stop the dev server afterwards.

- [ ] **Step 10: Commit**

```bash
git add packages/calculators/tests/fields-metadata-coverage.test.ts \
        packages/calculators/src/homa-ir.ts \
        packages/calculators/src/bmi-bsa-ibw.ts \
        packages/calculators/src/free-water-deficit.ts \
        apps/web/messages/ca.json apps/web/messages/es.json apps/web/messages/en.json
git commit -m "fix(calculators): add fieldsMetadata so three live pages render their inputs

DynamicCalcForm only builds its render lists when fieldsMetadata is
present, so homa-ir, bmi-bsa-ibw and free-water-deficit shipped with a
form containing nothing but the Reset button and a score frozen at the
page's customDefaults. A coverage test now asserts that metadata covers
every key of each schema."
```

---

### Task 2: Stop rendering PMID:undefined

`CalcReference.pmid` became optional on 2026-08-02 so Devine's unindexed 1974 editorial could keep its citation. `CalcJsonLd` was guarded; the page-level reference lists were not. All 61 page templates inline the same `PMID:{r.pmid}` block, and `bmi-bsa-ibw` — the only calculator with a PMID-less reference — currently serves `https://pubmed.ncbi.nlm.nih.gov/undefined/`.

**Files:**
- Create: `apps/web/src/components/CalcReferences.tsx`
- Modify: `apps/web/src/app/[locale]/bmi-bsa-ibw/page.tsx`

**Interfaces:**
- Consumes: `CalcReference` from `@medcalc/calculators`.
- Produces: `<CalcReferences references={calc.references} label={string} />`. Tasks 3–6 use it instead of copying the inline block.

- [ ] **Step 1: Write the failing test**

Create `apps/web/tests/calc-references.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CalcReferences } from "@/components/CalcReferences";

describe("CalcReferences", () => {
  it("links a reference that has a PMID", () => {
    const html = renderToStaticMarkup(
      <CalcReferences
        label="References"
        references={[{ pmid: "3657876", citation: "Mosteller RD. N Engl J Med. 1987." }]}
      />,
    );
    expect(html).toContain("https://pubmed.ncbi.nlm.nih.gov/3657876/");
    expect(html).toContain("PMID:3657876");
  });

  it("renders a PMID-less reference as plain text with no link", () => {
    const html = renderToStaticMarkup(
      <CalcReferences
        label="References"
        references={[{ citation: "Devine BJ. Drug Intell Clin Pharm. 1974;8:650-655." }]}
      />,
    );
    expect(html).toContain("Devine BJ.");
    expect(html).not.toContain("pubmed.ncbi.nlm.nih.gov");
    expect(html).not.toContain("undefined");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/dev/medikquantis && npx vitest run apps/web/tests/calc-references.test.tsx`
Expected: FAIL — cannot resolve `@/components/CalcReferences`.

- [ ] **Step 3: Write the component**

Create `apps/web/src/components/CalcReferences.tsx`:

```tsx
import type { CalcReference } from "@medcalc/calculators";

/**
 * Reference list for a calculator page. A reference whose source predates
 * PubMed indexing carries no PMID; it renders as plain citation text rather
 * than as a link to /undefined/.
 */
export function CalcReferences({
  references,
  label,
}: {
  references: readonly CalcReference[];
  label: string;
}) {
  return (
    <details className="glass-panel p-4 text-sm text-slate-600 dark:text-slate-300">
      <summary className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </summary>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        {references.map((r) => (
          <li key={r.pmid ?? r.citation}>
            {r.citation}
            {r.pmid ? (
              <>
                {" "}
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-trust-600 underline dark:text-neon"
                >
                  PMID:{r.pmid}
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </details>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd ~/dev/medikquantis && npx vitest run apps/web/tests/calc-references.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Use it on the affected page**

In `apps/web/src/app/[locale]/bmi-bsa-ibw/page.tsx`, add the import:

```tsx
import { CalcReferences } from "@/components/CalcReferences";
```

and replace the whole trailing `<details>…</details>` block with:

```tsx
      <CalcReferences
        references={bmiBsaIbw.calculator.references}
        label={t("common.references")}
      />
```

- [ ] **Step 6: Verify the rendered page no longer contains undefined**

Start the dev server, then:

```bash
curl -s http://localhost:3010/ca/bmi-bsa-ibw | grep -o 'pubmed.ncbi.nlm.nih.gov/[^/]*/' | sort -u
```

Expected: only `pubmed.ncbi.nlm.nih.gov/3657876/`. No `undefined`. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/CalcReferences.tsx \
        apps/web/tests/calc-references.test.tsx \
        "apps/web/src/app/[locale]/bmi-bsa-ibw/page.tsx"
git commit -m "fix(web): do not render a pubmed link for references without a pmid

Making CalcReference.pmid optional fixed the JSON-LD but not the visible
reference lists, which every page template inlines. bmi-bsa-ibw carries
Devine's unindexed 1974 editorial and was serving a link to
pubmed.ncbi.nlm.nih.gov/undefined/. Extracted the list into CalcReferences,
which omits the link when there is no pmid; the 60 pages that inline the
old block have no PMID-less reference and are left untouched."
```

Note for the reviewer: the other 60 pages still inline the unguarded block. They are safe today because every one of their references has a PMID, and the coverage is enforced by `scripts/verify-pmids.mjs`. Migrating them is deliberately out of scope.

---

### Task 3: ISTH overt DIC score

**Verified reference:** PMID **11816725** — Taylor FB Jr, Toh CH, Hoots WK, Wada H, Levi M. Towards definition, clinical and laboratory criteria, and a scoring system for disseminated intravascular coagulation. Thromb Haemost. 2001;86(5):1327-1330. (Confirmed via NCBI `esummary`: first author, journal, year, volume, issue, pages.)

**Files:**
- Create: `packages/calculators/src/isth-dic.ts`
- Create: `packages/calculators/tests/isth-dic.test.ts`
- Create: `apps/web/src/app/[locale]/isth-dic/page.tsx`
- Modify: `packages/calculators/src/registry.ts`, `packages/calculators/src/index.ts`, `apps/web/messages/{ca,es,en}.json`

**Interfaces:**
- Consumes: `CalcDefinition`, `InterpretResult` from `./types`; `CalcReferences` from Task 2.
- Produces: named export `calculator` with `id: "isth-dic"`, plus `formula(inputs: IsthDicInput): number` and `interpret(score: number): InterpretResult`. Registry key `"isth-dic"`, i18n namespace `isthDic`.

- [ ] **Step 1: Write the failing test**

Create `packages/calculators/tests/isth-dic.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/isth-dic";

describe("isth-dic calculator", () => {
  it("scores a normal coagulation profile as zero", () => {
    const score = formula({
      platelets: "0",
      fibrinMarker: "0",
      ptProlongation: "0",
      fibrinogen: "0",
    });
    expect(score).toBe(0);
    expect(interpret(score).recommendationCode).toBe("ISTH_DIC_NON_OVERT");
  });

  it("reaches the documented maximum of 8", () => {
    const score = formula({
      platelets: "2",
      fibrinMarker: "3",
      ptProlongation: "2",
      fibrinogen: "1",
    });
    expect(score).toBe(8);
    expect(calculator.scoreRange.max).toBe(8);
  });

  it("treats 5 as the overt-DIC threshold", () => {
    const belowThreshold = formula({
      platelets: "2",
      fibrinMarker: "2",
      ptProlongation: "0",
      fibrinogen: "0",
    });
    expect(belowThreshold).toBe(4);
    expect(interpret(belowThreshold).tier).toBe("moderate");
    expect(interpret(belowThreshold).recommendationCode).toBe("ISTH_DIC_NON_OVERT");

    const atThreshold = formula({
      platelets: "2",
      fibrinMarker: "2",
      ptProlongation: "1",
      fibrinogen: "0",
    });
    expect(atThreshold).toBe(5);
    expect(interpret(atThreshold).tier).toBe("high");
    expect(interpret(atThreshold).recommendationCode).toBe("ISTH_DIC_OVERT");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("isth-dic");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("11816725");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/isth-dic.test.ts`
Expected: FAIL — cannot find module `../src/isth-dic`.

- [ ] **Step 3: Write the calculator**

Create `packages/calculators/src/isth-dic.ts`:

```ts
import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// ISTH overt DIC score (Taylor FB Jr et al., 2001, PMID 11816725).
// Applied only when an underlying disorder known to be associated with DIC is
// present. Four laboratory items, maximum 8 points; >= 5 is compatible with
// overt DIC.

export const IsthDicInputs = z.object({
  platelets: z.enum(["0", "1", "2"]),
  fibrinMarker: z.enum(["0", "2", "3"]),
  ptProlongation: z.enum(["0", "1", "2"]),
  fibrinogen: z.enum(["0", "1"]),
});

export type IsthDicInput = z.infer<typeof IsthDicInputs>;

export function formula(inputs: IsthDicInput): number {
  return (
    parseInt(inputs.platelets, 10) +
    parseInt(inputs.fibrinMarker, 10) +
    parseInt(inputs.ptProlongation, 10) +
    parseInt(inputs.fibrinogen, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 5) {
    return {
      tier: "high",
      recommendation:
        "Compatible with overt DIC (score >= 5). Treat the underlying disorder and repeat the score daily.",
      recommendationCode: "ISTH_DIC_OVERT",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "moderate",
    recommendation:
      "Not compatible with overt DIC (score < 5). Suggestive of non-overt DIC; repeat in 1-2 days if clinical suspicion persists.",
    recommendationCode: "ISTH_DIC_NON_OVERT",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof IsthDicInputs> = {
  id: "isth-dic",
  inputs: IsthDicInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "hematology",
  i18nKey: "isthDic",
  fieldsMetadata: {
    platelets: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    fibrinMarker: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "2" }, { value: "3" }],
    },
    ptProlongation: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    fibrinogen: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }],
    },
  },
  references: [
    {
      pmid: "11816725",
      citation:
        "Taylor FB Jr, Toh CH, Hoots WK, Wada H, Levi M. Towards definition, clinical and laboratory criteria, and a scoring system for disseminated intravascular coagulation. Thromb Haemost. 2001;86(5):1327-1330.",
    },
  ],
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/isth-dic.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Register and export it**

In `packages/calculators/src/registry.ts`, add the import beside the other imports:

```ts
import { calculator as isthDic } from "./isth-dic";
```

and the registry entry inside the `registry` object:

```ts
  "isth-dic": isthDic,
```

In `packages/calculators/src/index.ts`, add the re-export following the existing pattern in that file:

```ts
export * as isthDic from "./isth-dic";
```

- [ ] **Step 6: Add the i18n namespace to all three locales**

In `apps/web/messages/ca.json`, at the top level:

```json
"isthDic": {
  "title": "Escala CID de la ISTH",
  "subtitle": "Puntuació de la ISTH per a coagulació intravascular disseminada manifesta, aplicable només si hi ha una malaltia de base associada a CID.",
  "fields": {
    "platelets": "Recompte de plaquetes",
    "platelets_0": "> 100 ×10⁹/L",
    "platelets_1": "50–100 ×10⁹/L",
    "platelets_2": "< 50 ×10⁹/L",
    "fibrinMarker": "Marcador de fibrina (dímer D o PDF)",
    "fibrinMarker_0": "Sense augment",
    "fibrinMarker_2": "Augment moderat",
    "fibrinMarker_3": "Augment intens",
    "ptProlongation": "Allargament del temps de protrombina",
    "ptProlongation_0": "< 3 s",
    "ptProlongation_1": "3–6 s",
    "ptProlongation_2": "> 6 s",
    "fibrinogen": "Fibrinogen",
    "fibrinogen_0": "≥ 1 g/L",
    "fibrinogen_1": "< 1 g/L"
  },
  "patient": {
    "intro": "Aquesta escala valora si la coagulació de la sang s'ha alterat de manera generalitzada com a complicació d'una altra malaltia greu.",
    "ask_doctor": "Preguntes per al teu metge:",
    "questions": [
      "Quina malaltia de base ha provocat aquesta alteració de la coagulació?",
      "Cada quant repetireu aquestes anàlisis?",
      "Quins signes d'hemorràgia o de trombosi he de vigilar?"
    ]
  },
  "content": {
    "overview": "La puntuació de la ISTH quantifica la CID manifesta amb quatre paràmetres de laboratori: plaquetes, un marcador de fibrina, el temps de protrombina i el fibrinogen.",
    "interpretation": "Una puntuació ≥ 5 és compatible amb CID manifesta i s'ha de repetir cada dia. Per sota de 5, suggereix CID no manifesta i es recomana repetir-la en 1–2 dies.",
    "cautions": "Només és aplicable si el pacient té una malaltia de base coneguda per associar-se a CID. No substitueix el judici clínic ni el tractament de la causa subjacent.",
    "faq": []
  }
}
```

In `apps/web/messages/es.json`:

```json
"isthDic": {
  "title": "Escala CID de la ISTH",
  "subtitle": "Puntuación de la ISTH para coagulación intravascular diseminada manifiesta, aplicable solo si existe una enfermedad de base asociada a CID.",
  "fields": {
    "platelets": "Recuento de plaquetas",
    "platelets_0": "> 100 ×10⁹/L",
    "platelets_1": "50–100 ×10⁹/L",
    "platelets_2": "< 50 ×10⁹/L",
    "fibrinMarker": "Marcador de fibrina (dímero D o PDF)",
    "fibrinMarker_0": "Sin aumento",
    "fibrinMarker_2": "Aumento moderado",
    "fibrinMarker_3": "Aumento intenso",
    "ptProlongation": "Alargamiento del tiempo de protrombina",
    "ptProlongation_0": "< 3 s",
    "ptProlongation_1": "3–6 s",
    "ptProlongation_2": "> 6 s",
    "fibrinogen": "Fibrinógeno",
    "fibrinogen_0": "≥ 1 g/L",
    "fibrinogen_1": "< 1 g/L"
  },
  "patient": {
    "intro": "Esta escala valora si la coagulación de la sangre se ha alterado de forma generalizada como complicación de otra enfermedad grave.",
    "ask_doctor": "Preguntas para tu médico:",
    "questions": [
      "¿Qué enfermedad de base ha provocado esta alteración de la coagulación?",
      "¿Cada cuánto repetiréis estos análisis?",
      "¿Qué signos de hemorragia o de trombosis debo vigilar?"
    ]
  },
  "content": {
    "overview": "La puntuación de la ISTH cuantifica la CID manifiesta con cuatro parámetros de laboratorio: plaquetas, un marcador de fibrina, el tiempo de protrombina y el fibrinógeno.",
    "interpretation": "Una puntuación ≥ 5 es compatible con CID manifiesta y debe repetirse a diario. Por debajo de 5, sugiere CID no manifiesta y se recomienda repetirla en 1–2 días.",
    "cautions": "Solo es aplicable si el paciente tiene una enfermedad de base conocida por asociarse a CID. No sustituye al juicio clínico ni al tratamiento de la causa subyacente.",
    "faq": []
  }
}
```

In `apps/web/messages/en.json`:

```json
"isthDic": {
  "title": "ISTH DIC score",
  "subtitle": "ISTH score for overt disseminated intravascular coagulation, applicable only when an underlying disorder associated with DIC is present.",
  "fields": {
    "platelets": "Platelet count",
    "platelets_0": "> 100 ×10⁹/L",
    "platelets_1": "50–100 ×10⁹/L",
    "platelets_2": "< 50 ×10⁹/L",
    "fibrinMarker": "Fibrin-related marker (D-dimer or FDP)",
    "fibrinMarker_0": "No increase",
    "fibrinMarker_2": "Moderate increase",
    "fibrinMarker_3": "Strong increase",
    "ptProlongation": "Prothrombin time prolongation",
    "ptProlongation_0": "< 3 s",
    "ptProlongation_1": "3–6 s",
    "ptProlongation_2": "> 6 s",
    "fibrinogen": "Fibrinogen",
    "fibrinogen_0": "≥ 1 g/L",
    "fibrinogen_1": "< 1 g/L"
  },
  "patient": {
    "intro": "This score assesses whether blood clotting has become disturbed throughout the body as a complication of another serious illness.",
    "ask_doctor": "Questions for your doctor:",
    "questions": [
      "Which underlying illness caused this clotting problem?",
      "How often will these blood tests be repeated?",
      "What signs of bleeding or clotting should I watch for?"
    ]
  },
  "content": {
    "overview": "The ISTH score quantifies overt DIC from four laboratory parameters: platelets, a fibrin-related marker, prothrombin time and fibrinogen.",
    "interpretation": "A score of 5 or more is compatible with overt DIC and should be repeated daily. Below 5 it suggests non-overt DIC; repeat in 1–2 days.",
    "cautions": "Applicable only when the patient has an underlying disorder known to be associated with DIC. It does not replace clinical judgement or treatment of the underlying cause.",
    "faq": []
  }
}
```

- [ ] **Step 7: Create the page**

Create `apps/web/src/app/[locale]/isth-dic/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { isthDic } from "@medcalc/calculators";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { buildCalcMetadata } from "@/lib/calc-metadata";
import { CalcJsonLd } from "@/components/CalcJsonLd";
import { CalcContent } from "@/components/CalcContent";
import { CalcByline } from "@/components/CalcByline";
import { CalcReferences } from "@/components/CalcReferences";

export function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  return buildCalcMetadata("isth-dic", props.params);
}

export default async function IsthDicPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <CalcJsonLd id="isth-dic" locale={locale} />
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("isthDic.title")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t("isthDic.subtitle")}
        </h1>
      </div>

      <DynamicCalcForm calcId="isth-dic" />

      <CalcContent id="isth-dic" locale={locale} />

      <CalcByline locale={locale} />

      <CalcReferences
        references={isthDic.calculator.references}
        label={t("common.references")}
      />
    </div>
  );
}
```

- [ ] **Step 8: Add it to the sitemap**

Open `apps/web/src/app/sitemap.ts` and confirm whether calculator routes are enumerated from the registry or listed by hand. If listed by hand, add `"isth-dic"`. If derived from `listCalcIds()`, no change is needed — note which it was in the commit body.

- [ ] **Step 9: Verify locally**

```bash
cd ~/dev/medikquantis && pnpm typecheck && pnpm lint:i18n && pnpm verify:pmids && pnpm test 2>&1 | grep -E "Tests |FAIL"
```

Expected: all pass; `verify:pmids` now reports 79 pairs.

Then with the dev server up:

```bash
curl -s http://localhost:3010/ca/isth-dic | grep -c '<input'
```

Expected: **12** — 11 radio inputs (3 + 3 + 3 + 2) plus the layout search box. Not 1.

- [ ] **Step 10: Commit**

```bash
git add packages/calculators/src/isth-dic.ts packages/calculators/tests/isth-dic.test.ts \
        packages/calculators/src/registry.ts packages/calculators/src/index.ts \
        apps/web/messages/ca.json apps/web/messages/es.json apps/web/messages/en.json \
        "apps/web/src/app/[locale]/isth-dic/page.tsx"
git commit -m "feat(calculators): add ISTH overt DIC score"
```

---

### Task 4: 4Ts score for heparin-induced thrombocytopenia

**Verified reference:** PMID **16634744** — Lo GK, Juhl D, Warkentin TE, Sigouin CS, Eichler P, Greinacher A. Evaluation of pretest clinical score (4 T's) for the diagnosis of heparin-induced thrombocytopenia in two clinical settings. J Thromb Haemost. 2006;4(4):759-765.

**Files:**
- Create: `packages/calculators/src/4ts-hit.ts`, `packages/calculators/tests/4ts-hit.test.ts`, `apps/web/src/app/[locale]/4ts-hit/page.tsx`
- Modify: `packages/calculators/src/registry.ts`, `packages/calculators/src/index.ts`, `apps/web/messages/{ca,es,en}.json`

**Interfaces:**
- Produces: `calculator` with `id: "4ts-hit"`, i18n namespace `fourTsHit`. Four fields, each `z.enum(["0","1","2"])`, max 8.

- [ ] **Step 1: Write the failing test**

Create `packages/calculators/tests/4ts-hit.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/4ts-hit";

describe("4Ts calculator", () => {
  it("scores the lowest-risk combination as zero", () => {
    const score = formula({
      thrombocytopenia: "0",
      timing: "0",
      thrombosis: "0",
      otherCauses: "0",
    });
    expect(score).toBe(0);
    expect(interpret(score).tier).toBe("low");
    expect(interpret(score).recommendationCode).toBe("FOURTS_LOW");
  });

  it("reaches the documented maximum of 8", () => {
    const score = formula({
      thrombocytopenia: "2",
      timing: "2",
      thrombosis: "2",
      otherCauses: "2",
    });
    expect(score).toBe(8);
    expect(calculator.scoreRange.max).toBe(8);
    expect(interpret(score).recommendationCode).toBe("FOURTS_HIGH");
  });

  it("separates low, intermediate and high probability at 3/4 and 5/6", () => {
    expect(interpret(3).recommendationCode).toBe("FOURTS_LOW");
    expect(interpret(4).recommendationCode).toBe("FOURTS_INTERMEDIATE");
    expect(interpret(5).recommendationCode).toBe("FOURTS_INTERMEDIATE");
    expect(interpret(6).recommendationCode).toBe("FOURTS_HIGH");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("4ts-hit");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("16634744");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/4ts-hit.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the calculator**

Create `packages/calculators/src/4ts-hit.ts`:

```ts
import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// 4Ts score for heparin-induced thrombocytopenia (Lo GK et al., 2006,
// PMID 16634744). Four items scored 0-2, maximum 8. A low score has a high
// negative predictive value and argues against stopping heparin.

export const FourTsInputs = z.object({
  thrombocytopenia: z.enum(["0", "1", "2"]),
  timing: z.enum(["0", "1", "2"]),
  thrombosis: z.enum(["0", "1", "2"]),
  otherCauses: z.enum(["0", "1", "2"]),
});

export type FourTsInput = z.infer<typeof FourTsInputs>;

export function formula(inputs: FourTsInput): number {
  return (
    parseInt(inputs.thrombocytopenia, 10) +
    parseInt(inputs.timing, 10) +
    parseInt(inputs.thrombosis, 10) +
    parseInt(inputs.otherCauses, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 6) {
    return {
      tier: "high",
      recommendation:
        "High probability of HIT (6-8). Stop all heparin, start a non-heparin anticoagulant and send immunoassay plus functional testing.",
      recommendationCode: "FOURTS_HIGH",
      evidenceGrade: "A",
    };
  }
  if (score >= 4) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate probability of HIT (4-5). Consider stopping heparin and testing; clinical context decides.",
      recommendationCode: "FOURTS_INTERMEDIATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low probability of HIT (0-3). HIT is unlikely; look for another cause of thrombocytopenia and continue heparin if otherwise indicated.",
    recommendationCode: "FOURTS_LOW",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof FourTsInputs> = {
  id: "4ts-hit",
  inputs: FourTsInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "hematology",
  i18nKey: "fourTsHit",
  fieldsMetadata: {
    thrombocytopenia: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    timing: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    thrombosis: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    otherCauses: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
  },
  references: [
    {
      pmid: "16634744",
      citation:
        "Lo GK, Juhl D, Warkentin TE, Sigouin CS, Eichler P, Greinacher A. Evaluation of pretest clinical score (4 T's) for the diagnosis of heparin-induced thrombocytopenia in two clinical settings. J Thromb Haemost. 2006;4(4):759-765.",
    },
  ],
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/4ts-hit.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Register, export, translate and create the page**

Four sub-steps, identical in shape to Task 3 Steps 5–8:

1. `registry.ts` — add `import { calculator as fourTsHit } from "./4ts-hit";` and the entry `"4ts-hit": fourTsHit,` inside the `registry` object.
2. `index.ts` — add `export * as fourTsHit from "./4ts-hit";`.
3. `messages/{ca,es,en}.json` — add the `fourTsHit` namespace (below).
4. `apps/web/src/app/[locale]/4ts-hit/page.tsx` — copy the Task 3 Step 7 page verbatim, substituting `isth-dic`→`4ts-hit`, `isthDic`→`fourTsHit`, `IsthDicPage`→`FourTsHitPage`.

The i18n block for Catalan:

```json
"fourTsHit": {
  "title": "Escala 4T per a trombocitopènia induïda per heparina",
  "subtitle": "Probabilitat pretest de TIH a partir de quatre criteris clínics, amb un valor predictiu negatiu alt quan la puntuació és baixa.",
  "fields": {
    "thrombocytopenia": "Trombocitopènia",
    "thrombocytopenia_0": "Descens < 30 % o nadir < 10 ×10⁹/L",
    "thrombocytopenia_1": "Descens 30–50 % o nadir 10–19 ×10⁹/L",
    "thrombocytopenia_2": "Descens > 50 % i nadir ≥ 20 ×10⁹/L",
    "timing": "Moment del descens de plaquetes",
    "timing_0": "Descens abans del dia 4 sense exposició recent a heparina",
    "timing_1": "Compatible amb dies 5–10 però poc documentat, o inici després del dia 10, o descens ≤ 1 dia amb exposició fa 30–100 dies",
    "timing_2": "Inici clar entre els dies 5 i 10, o descens ≤ 1 dia amb exposició a heparina els últims 30 dies",
    "thrombosis": "Trombosi o altres seqüeles",
    "thrombosis_0": "Cap",
    "thrombosis_1": "Trombosi recurrent o progressiva, lesions cutànies no necròtiques, o trombosi sospitada no confirmada",
    "thrombosis_2": "Trombosi nova confirmada, necrosi cutània, o reacció sistèmica aguda després d'un bolus d'heparina",
    "otherCauses": "Altres causes de trombocitopènia",
    "otherCauses_0": "Causa alternativa clara",
    "otherCauses_1": "Causa alternativa possible",
    "otherCauses_2": "Cap causa alternativa aparent"
  },
  "patient": {
    "intro": "Aquesta escala calcula quina probabilitat hi ha que l'heparina sigui la causa de la baixada de plaquetes.",
    "ask_doctor": "Preguntes per al teu metge:",
    "questions": [
      "Cal que deixi l'heparina mentre espereu els resultats?",
      "Quin anticoagulant alternatiu faré servir?",
      "Podré tornar a rebre heparina en el futur?"
    ]
  },
  "content": {
    "overview": "L'escala 4T puntua de 0 a 2 quatre criteris — trombocitopènia, moment del descens, trombosi i altres causes — per estimar la probabilitat pretest de TIH.",
    "interpretation": "0–3 probabilitat baixa, 4–5 intermèdia, 6–8 alta. Una puntuació baixa té un valor predictiu negatiu alt i permet evitar proves i canvis d'anticoagulant innecessaris.",
    "cautions": "És una probabilitat pretest, no un diagnòstic: una puntuació intermèdia o alta obliga a confirmar-la amb immunoassaig i prova funcional. La decisió de suspendre l'heparina és clínica.",
    "faq": []
  }
}
```

Write the Spanish and English namespaces with the same key set and equivalent clinical prose. Every one of the twelve `<field>_<value>` keys must exist in all three locales — Task 7 fails the build otherwise.

- [ ] **Step 6: Verify and commit**

```bash
cd ~/dev/medikquantis && pnpm typecheck && pnpm lint:i18n && pnpm test 2>&1 | grep -E "Tests |FAIL"
curl -s http://localhost:3010/ca/4ts-hit | grep -c '<input'   # expect 13 (12 radios + search)
git add -A && git commit -m "feat(calculators): add 4Ts score for heparin-induced thrombocytopenia"
```

---

### Task 5: Khorana score

**Verified reference:** PMID **18216292** — Khorana AA, Kuderer NM, Culakova E, Lyman GH, Francis CW. Development and validation of a predictive model for chemotherapy-associated thrombosis. Blood. 2008;111(10):4902-4907.

**Files:**
- Create: `packages/calculators/src/khorana.ts`, `packages/calculators/tests/khorana.test.ts`, `apps/web/src/app/[locale]/khorana/page.tsx`
- Modify: `packages/calculators/src/registry.ts`, `packages/calculators/src/index.ts`, `apps/web/messages/{ca,es,en}.json`

**Interfaces:**
- Produces: `calculator` with `id: "khorana"`, i18n namespace `khorana`. One radio (tumour site, 0/1/2) and four booleans, max 6.

- [ ] **Step 1: Write the failing test**

Create `packages/calculators/tests/khorana.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/khorana";

describe("khorana calculator", () => {
  it("scores a low-risk patient as zero", () => {
    const score = formula({
      tumourSite: "0",
      plateletsHigh: false,
      anaemiaOrEsa: false,
      leukocytesHigh: false,
      bmiHigh: false,
    });
    expect(score).toBe(0);
    expect(interpret(score).recommendationCode).toBe("KHORANA_LOW");
  });

  it("reaches the documented maximum of 6", () => {
    const score = formula({
      tumourSite: "2",
      plateletsHigh: true,
      anaemiaOrEsa: true,
      leukocytesHigh: true,
      bmiHigh: true,
    });
    expect(score).toBe(6);
    expect(calculator.scoreRange.max).toBe(6);
  });

  it("puts the high-risk threshold at 3", () => {
    expect(interpret(1).recommendationCode).toBe("KHORANA_INTERMEDIATE");
    expect(interpret(2).recommendationCode).toBe("KHORANA_INTERMEDIATE");
    expect(interpret(3).recommendationCode).toBe("KHORANA_HIGH");
    expect(interpret(3).tier).toBe("high");
  });

  it("counts a very-high-risk tumour site as two points on its own", () => {
    const score = formula({
      tumourSite: "2",
      plateletsHigh: false,
      anaemiaOrEsa: false,
      leukocytesHigh: false,
      bmiHigh: false,
    });
    expect(score).toBe(2);
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("khorana");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("18216292");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/khorana.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the calculator**

Create `packages/calculators/src/khorana.ts`:

```ts
import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Khorana score for chemotherapy-associated venous thromboembolism
// (Khorana AA et al., 2008, PMID 18216292). Assessed before starting a new
// systemic chemotherapy regimen in an ambulatory patient.

export const KhoranaInputs = z.object({
  tumourSite: z.enum(["0", "1", "2"]),
  plateletsHigh: z.boolean(),
  anaemiaOrEsa: z.boolean(),
  leukocytesHigh: z.boolean(),
  bmiHigh: z.boolean(),
});

export type KhoranaInput = z.infer<typeof KhoranaInputs>;

export function formula(inputs: KhoranaInput): number {
  return (
    parseInt(inputs.tumourSite, 10) +
    (inputs.plateletsHigh ? 1 : 0) +
    (inputs.anaemiaOrEsa ? 1 : 0) +
    (inputs.leukocytesHigh ? 1 : 0) +
    (inputs.bmiHigh ? 1 : 0)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 3) {
    return {
      tier: "high",
      recommendation:
        "High risk of chemotherapy-associated VTE (score >= 3). Thromboprophylaxis is recommended by guideline in the absence of bleeding risk.",
      recommendationCode: "KHORANA_HIGH",
      evidenceGrade: "A",
    };
  }
  if (score >= 1) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk (score 1-2). Routine thromboprophylaxis is not recommended; reassess if the clinical situation changes.",
      recommendationCode: "KHORANA_INTERMEDIATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low risk (score 0). Thromboprophylaxis is not indicated; educate on the symptoms of thrombosis.",
    recommendationCode: "KHORANA_LOW",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof KhoranaInputs> = {
  id: "khorana",
  inputs: KhoranaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 6 },
  specialty: "hematology",
  i18nKey: "khorana",
  fieldsMetadata: {
    tumourSite: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    plateletsHigh: { widget: "boolean", defaultValue: false },
    anaemiaOrEsa: { widget: "boolean", defaultValue: false },
    leukocytesHigh: { widget: "boolean", defaultValue: false },
    bmiHigh: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "18216292",
      citation:
        "Khorana AA, Kuderer NM, Culakova E, Lyman GH, Francis CW. Development and validation of a predictive model for chemotherapy-associated thrombosis. Blood. 2008;111(10):4902-4907.",
    },
  ],
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/khorana.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Register, export, translate and create the page**

Four sub-steps, identical in shape to Task 3 Steps 5–8:

1. `registry.ts` — add `import { calculator as khorana } from "./khorana";` and the entry `khorana,` inside the `registry` object.
2. `index.ts` — add `export * as khorana from "./khorana";`.
3. `messages/{ca,es,en}.json` — add the `khorana` namespace with `title`, `subtitle`, `fields`, `patient` (`intro`, `ask_doctor`, `questions`), `content` (`overview`, `interpretation`, `cautions`, `faq`).
4. `apps/web/src/app/[locale]/khorana/page.tsx` — copy the Task 3 Step 7 page verbatim, substituting `isth-dic`→`khorana`, `isthDic`→`khorana`, `IsthDicPage`→`KhoranaPage`.

Catalan field labels:

```json
"fields": {
  "tumourSite": "Localització del tumor",
  "tumourSite_0": "Altres localitzacions",
  "tumourSite_1": "Risc alt: pulmó, limfoma, ginecològic, bufeta o testicle",
  "tumourSite_2": "Risc molt alt: estómac o pàncrees",
  "plateletsHigh": "Plaquetes ≥ 350 ×10⁹/L abans de la quimioteràpia",
  "anaemiaOrEsa": "Hemoglobina < 10 g/dL o ús d'agents estimulants de l'eritropoesi",
  "leukocytesHigh": "Leucòcits > 11 ×10⁹/L abans de la quimioteràpia",
  "bmiHigh": "IMC ≥ 35 kg/m²"
}
```

- [ ] **Step 6: Verify and commit**

```bash
cd ~/dev/medikquantis && pnpm typecheck && pnpm lint:i18n && pnpm test 2>&1 | grep -E "Tests |FAIL"
curl -s http://localhost:3010/ca/khorana | grep -c '<input'   # expect 8 (3 radios + 4 checkboxes + search)
git add -A && git commit -m "feat(calculators): add Khorana score for chemotherapy-associated VTE"
```

---

### Task 6: Binet staging for chronic lymphocytic leukaemia

**Verified reference:** PMID **7237385** — Binet JL, Auquier A, Dighiero G, et al. A new prognostic classification of chronic lymphocytic leukemia derived from a multivariate survival analysis. Cancer. 1981;48(1):198-206.

**Files:**
- Create: `packages/calculators/src/binet.ts`, `packages/calculators/tests/binet.test.ts`, `apps/web/src/app/[locale]/binet/page.tsx`
- Modify: `packages/calculators/src/registry.ts`, `packages/calculators/src/index.ts`, `apps/web/messages/{ca,es,en}.json`

**Interfaces:**
- Produces: `calculator` with `id: "binet"`, i18n namespace `binet`. Single radio, stage A/B/C mapped to 0/1/2.

- [ ] **Step 1: Write the failing test**

Create `packages/calculators/tests/binet.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/binet";

describe("binet calculator", () => {
  it("maps the three stages onto 0, 1 and 2", () => {
    expect(formula({ stage: "A" })).toBe(0);
    expect(formula({ stage: "B" })).toBe(1);
    expect(formula({ stage: "C" })).toBe(2);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 2 });
  });

  it("escalates the tier with the stage", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(0).recommendationCode).toBe("BINET_A");
    expect(interpret(1).tier).toBe("moderate");
    expect(interpret(1).recommendationCode).toBe("BINET_B");
    expect(interpret(2).tier).toBe("high");
    expect(interpret(2).recommendationCode).toBe("BINET_C");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("binet");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("7237385");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/binet.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the calculator**

Create `packages/calculators/src/binet.ts`:

```ts
import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Binet staging for chronic lymphocytic leukaemia (Binet JL et al., 1981,
// PMID 7237385). The five lymphoid areas are cervical, axillary and inguinal
// nodes (each counted once whether unilateral or bilateral), spleen and liver.

export const BinetInputs = z.object({
  stage: z.enum(["A", "B", "C"]),
});

export type BinetInput = z.infer<typeof BinetInputs>;

const STAGE_SCORE: Record<BinetInput["stage"], number> = { A: 0, B: 1, C: 2 };

export function formula(inputs: BinetInput): number {
  return STAGE_SCORE[inputs.stage];
}

export function interpret(score: number): InterpretResult {
  if (score >= 2) {
    return {
      tier: "high",
      recommendation:
        "Binet stage C: anaemia (Hb < 10 g/dL) and/or thrombocytopenia (platelets < 100 x10^9/L). Treatment is generally indicated.",
      recommendationCode: "BINET_C",
      evidenceGrade: "A",
    };
  }
  if (score === 1) {
    return {
      tier: "moderate",
      recommendation:
        "Binet stage B: three or more involved lymphoid areas without anaemia or thrombocytopenia. Treat if there are active-disease criteria.",
      recommendationCode: "BINET_B",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Binet stage A: fewer than three involved lymphoid areas, no anaemia or thrombocytopenia. Watch and wait is standard.",
    recommendationCode: "BINET_A",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BinetInputs> = {
  id: "binet",
  inputs: BinetInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 2 },
  specialty: "hematology",
  i18nKey: "binet",
  fieldsMetadata: {
    stage: {
      widget: "radio",
      layout: "cards",
      defaultValue: "A",
      options: [{ value: "A" }, { value: "B" }, { value: "C" }],
    },
  },
  references: [
    {
      pmid: "7237385",
      citation:
        "Binet JL, Auquier A, Dighiero G, et al. A new prognostic classification of chronic lymphocytic leukemia derived from a multivariate survival analysis. Cancer. 1981;48(1):198-206.",
    },
  ],
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd ~/dev/medikquantis && npx vitest run packages/calculators/tests/binet.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Register, export, translate and create the page**

Four sub-steps, identical in shape to Task 3 Steps 5–8:

1. `registry.ts` — add `import { calculator as binet } from "./binet";` and the entry `binet,` inside the `registry` object.
2. `index.ts` — add `export * as binet from "./binet";`.
3. `messages/{ca,es,en}.json` — add the `binet` namespace with the same key set as the others.
4. `apps/web/src/app/[locale]/binet/page.tsx` — copy the Task 3 Step 7 page verbatim, substituting `isth-dic`→`binet`, `isthDic`→`binet`, `IsthDicPage`→`BinetPage`.

Catalan field labels:

```json
"fields": {
  "stage": "Estadi de Binet",
  "stage_A": "A — menys de 3 àrees limfoides afectades, sense anèmia ni trombocitopènia",
  "stage_B": "B — 3 o més àrees limfoides afectades, sense anèmia ni trombocitopènia",
  "stage_C": "C — Hb < 10 g/dL i/o plaquetes < 100 ×10⁹/L, sigui quin sigui el nombre d'àrees"
}
```

The `content.overview` must name the five lymphoid areas: cervical, axillary and inguinal nodes (each counted once whether unilateral or bilateral), spleen and liver.

- [ ] **Step 6: Verify and commit**

```bash
cd ~/dev/medikquantis && pnpm typecheck && pnpm lint:i18n && pnpm test 2>&1 | grep -E "Tests |FAIL"
curl -s http://localhost:3010/ca/binet | grep -c '<input'   # expect 4 (3 radios + search)
git add -A && git commit -m "feat(calculators): add Binet staging for chronic lymphocytic leukaemia"
```

---

### Task 7: Lock the i18n option-key contract

`scripts/check-i18n-parity.mjs` compares the three locales to each other, so it passes when all three are missing the same key. That is exactly how `cows.gi_options.5` reached production as `MISSING_MESSAGE` in every language. This task adds the check that runs from the code outwards.

**Files:**
- Create: `apps/web/tests/i18n-option-keys.test.ts`

**Interfaces:**
- Consumes: `listCalcs()` from `@medcalc/calculators`; the three JSON message files.
- Produces: nothing importable.

- [ ] **Step 1: Write the test**

Create `apps/web/tests/i18n-option-keys.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ZodEnum, ZodObject, ZodOptional, ZodDefault, type ZodTypeAny } from "zod";
import { listCalcs } from "@medcalc/calculators";
import ca from "../messages/ca.json";
import es from "../messages/es.json";
import en from "../messages/en.json";

const LOCALES = { ca, es, en } as Record<string, Record<string, any>>;

function unwrap(field: ZodTypeAny): ZodTypeAny {
  if (field instanceof ZodOptional) return unwrap(field.unwrap());
  if (field instanceof ZodDefault) return unwrap(field._def.innerType);
  return field;
}

// Every enum value a calculator accepts must have a label in every locale.
// The parity script only compares locales to one another, so a key missing
// from all three passes it while rendering MISSING_MESSAGE everywhere.
describe("i18n option keys", () => {
  for (const calc of listCalcs()) {
    const shape = (calc.inputs as unknown as ZodObject<Record<string, ZodTypeAny>>).shape;
    for (const [field, rawType] of Object.entries(shape)) {
      const type = unwrap(rawType);
      if (!(type instanceof ZodEnum)) continue;
      const meta = calc.fieldsMetadata?.[field as keyof typeof calc.fieldsMetadata];
      // Options with an explicit labelKey resolve elsewhere (e.g. common.male).
      if (meta?.options?.every((o) => o.labelKey)) continue;
      for (const value of type.options as string[]) {
        for (const [locale, messages] of Object.entries(LOCALES)) {
          it(`${calc.id}.${field}_${value} exists in ${locale}`, () => {
            const ns = messages[calc.i18nKey];
            expect(ns, `namespace ${calc.i18nKey} missing in ${locale}`).toBeTruthy();
            expect(ns.fields?.[`${field}_${value}`]).toBeTruthy();
          });
        }
      }
    }
  }
});
```

- [ ] **Step 2: Run it and record what it finds**

Run: `cd ~/dev/medikquantis && npx vitest run apps/web/tests/i18n-option-keys.test.ts 2>&1 | tail -40`

Expected: the four new calculators PASS. Pre-existing calculators may fail — several use hand-written forms whose option labels live under different key shapes (`cows.gi_options.*` rather than `cows.fields.gi_5`).

- [ ] **Step 3: Scope the test to the shape it actually asserts**

If pre-existing calculators fail because their labels live under a different key shape, restrict the test to calculators whose options genuinely resolve through `fields.<field>_<value>` — that is, those with `fieldsMetadata` and no `labelKey`:

```ts
  for (const calc of listCalcs()) {
    if (!calc.fieldsMetadata) continue;
```

Report the excluded ids rather than silently dropping them. A calculator with no `fieldsMetadata` is already caught by Task 1's test.

- [ ] **Step 4: Verify it catches a real regression**

Temporarily delete `"platelets_2"` from `isthDic.fields` in `apps/web/messages/es.json`, run the test, and confirm it FAILS with `isth-dic.platelets_2 exists in es`. Restore the key and confirm it passes again. A test that cannot fail is not a test.

- [ ] **Step 5: Commit**

```bash
git add apps/web/tests/i18n-option-keys.test.ts
git commit -m "test(i18n): assert every enum option has a label in all three locales

The parity script compares locales to each other, so a key missing from
all three passes it — which is how cows.gi_options.5 shipped as
MISSING_MESSAGE in ca, es and en at once. This checks from the schema
outwards instead."
```

---

### Task 8: Full verification and pull request

- [ ] **Step 1: Run every gate the CI runs, in the CI's order**

```bash
cd ~/dev/medikquantis
pnpm typecheck && pnpm lint:i18n && pnpm verify:pmids && pnpm test && pnpm build
```

Expected: all pass. `verify:pmids` reports 82 pairs (78 before this batch + 4) with zero mismatches and 1 skipped (Devine). The build log must contain **no** `MISSING_MESSAGE`.

- [ ] **Step 2: Verify every new and repaired page renders its fields**

Start the dev server, then:

```bash
for p in isth-dic 4ts-hit khorana binet homa-ir bmi-bsa-ibw free-water-deficit; do
  echo "$p: $(curl -s http://localhost:3010/ca/$p | grep -c '<input')"
done
```

Expected, remembering that 1 of each count is the layout search box: `isth-dic: 12`, `4ts-hit: 13`, `khorana: 8`, `binet: 4`, `homa-ir: 3`, `bmi-bsa-ibw: 5`, `free-water-deficit: 8`. **Any page reporting 1 is broken.** Repeat for `/es/` and `/en/` on at least one calculator to confirm the locales resolve.

- [ ] **Step 3: Confirm the four appear in the catalogue under Hematology**

Load `http://localhost:3010/ca` and confirm a Hematologia group exists containing exactly the four new calculators. Until now no calculator claimed that specialty, so the group is new even though the label already existed.

- [ ] **Step 4: Push and open the PR**

```bash
git push -u origin feat/hematology-scales
```

Open the PR against `main` with a body covering: the four scales and their verified PMIDs; the three repaired calculators and the measured before/after field counts; the `PMID:undefined` regression and why only `bmi-bsa-ibw` was affected; the two new tests and what each would have caught; and the scoping decisions from Task 1 Step 3 and Task 7 Step 3, naming the calculators left out.

**Do not merge.**

- [ ] **Step 5: Watch CI to completion**

```bash
gh run list --branch feat/hematology-scales --limit 1
```

Poll until `completed`. If red, read `gh run view <id> --log-failed` before changing anything — and check whether `main` moved underneath, since CI builds the merge commit, not the branch.

---

## Notes for the implementer

- `patient` namespace shape varies across the codebase: `cha2ds2vasc` has six keys including `result_low`/`result_moderate`/`result_high`, while the newer `homaIr` has three (`intro`, `ask_doctor`, `questions`). Follow the three-key `homaIr` shape; it is what the recent calculators use.
- Radio options with no `labelKey` resolve from `<i18nKey>.fields.<field>_<value>`. Options that reuse a shared label (sex, yes/no) should use `labelKey: "common.male"` and friends instead of duplicating strings.
- `layout: "cards"` is the right choice for multi-line clinical option text; `inline` is the default and suits short options.
- When adding to the JSON message files, keep keys in the same order across the three locales. It makes the diffs reviewable side by side.
