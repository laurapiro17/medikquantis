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

// Only calculators with fieldsMetadata and no labelKey resolve their radio
// options through fields.<field>_<value>. Older hand-written forms (e.g.
// cows) key their option labels differently (cows.gi_options.*) and are
// excluded here rather than silently passing.
const CANDIDATES = listCalcs().filter((c) => c.fieldsMetadata);

// A filtered loop over an empty list registers zero test cases and reports a
// pass having asserted nothing.
if (CANDIDATES.length === 0) {
  throw new Error(
    "i18n-option-keys: no calculators with fieldsMetadata found — the filter is broken or the registry is empty",
  );
}

// Every enum value a calculator accepts must have a label in every locale.
// The parity script only compares locales to one another, so a key missing
// from all three passes it while rendering MISSING_MESSAGE everywhere.
describe("i18n option keys", () => {
  for (const calc of CANDIDATES) {
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
