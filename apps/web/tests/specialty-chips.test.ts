import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { listCalcs } from "@medcalc/calculators";
import ca from "../messages/ca.json";
import es from "../messages/es.json";
import en from "../messages/en.json";

const catalogSource = readFileSync(
  resolve(__dirname, "../src/components/Catalog.tsx"),
  "utf-8",
);

const SPECIALTIES = [...new Set(listCalcs().map((c) => c.specialty))].sort();

// Every specialty a calculator actually claims needs a colour chip and a label
// in all three locales. Without the chip it silently falls back to DEFAULT_CHIP,
// which is how hematology shipped uncoloured.
describe("specialty presentation", () => {
  it("finds specialties to check", () => {
    expect(SPECIALTIES.length).toBeGreaterThan(10);
  });

  for (const specialty of SPECIALTIES) {
    it(`${specialty} has a catalogue chip`, () => {
      expect(
        new RegExp(`^\\s*${specialty}:`, "m").test(catalogSource),
        `${specialty} is missing from SPECIALTY_CHIP in Catalog.tsx`,
      ).toBe(true);
    });

    for (const [locale, messages] of Object.entries({ ca, es, en })) {
      it(`${specialty} has a ${locale} label`, () => {
        expect(
          (messages as Record<string, Record<string, any>>).specialties?.[
            specialty
          ],
        ).toBeTruthy();
      });
    }
  }
});
