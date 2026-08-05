import { describe, expect, it } from "vitest";
import { ZodObject, type ZodTypeAny } from "zod";
import { listCalcs } from "../src/registry";

// A calculator without fieldsMetadata renders a form with no input fields at
// all: DynamicCalcForm only populates its render lists when the metadata is
// present. Every field in the schema must therefore have an entry.
//
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
    it(`${calc.id} declares metadata for every schema field`, () => {
      const shape = (calc.inputs as unknown as ZodObject<Record<string, ZodTypeAny>>).shape;
      const schemaKeys = Object.keys(shape).sort();
      const metaKeys = Object.keys(calc.fieldsMetadata ?? {}).sort();
      expect(metaKeys).toEqual(schemaKeys);
    });
  }
});
