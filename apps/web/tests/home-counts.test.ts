import { describe, expect, it } from "vitest";
import { listCalcs } from "@medcalc/calculators";
import ca from "../messages/ca.json";
import es from "../messages/es.json";
import en from "../messages/en.json";

// The homepage copy used to state "49 calculators across 16 specialties" as
// literal text in all three locales. The catalogue is now at 65 across 19, and
// nothing caught the drift — the social card ended up printing 49 in its prose
// and 65 in its strapline, in the same image. These keys must interpolate.

const LOCALES = { ca, es, en } as const;

const REQUIRED: Record<string, string[]> = {
  hero_subheading: ["{count}"],
  api_callout_body: ["{count}"],
  catalog_subheading: ["{count}", "{specialties}"],
};

describe("homepage counts are derived, not written", () => {
  for (const [name, messages] of Object.entries(LOCALES)) {
    for (const [key, placeholders] of Object.entries(REQUIRED)) {
      it(`${name}.home.${key} interpolates instead of stating a number`, () => {
        const value = (messages.home as Record<string, string | undefined>)[key];
        if (typeof value !== "string") {
          throw new Error(`${name}.home.${key} is missing`);
        }

        for (const placeholder of placeholders) {
          expect(value).toContain(placeholder);
        }

        // No bare integer may survive in these three strings. Version-like
        // tokens (OpenAPI 3.1) are fine, so only standalone integers count.
        const bareNumbers = value.match(/(?<![\d.])\d+(?![\d.])/g) ?? [];
        expect(
          bareNumbers,
          `${name}.home.${key} still states a number literally: ${bareNumbers.join(", ")}`,
        ).toEqual([]);
      });
    }
  }

  it("the registry still exposes what the copy claims to count", () => {
    const calcs = listCalcs();
    expect(calcs.length).toBeGreaterThan(0);
    expect(new Set(calcs.map((c) => c.specialty)).size).toBeGreaterThan(0);
  });
});
