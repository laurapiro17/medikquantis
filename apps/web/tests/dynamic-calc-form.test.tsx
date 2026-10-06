import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { listCalcs } from "@medcalc/calculators";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { listRecommendationCodes } from "@/lib/api-recommendations";
import ca from "../messages/ca.json";
import es from "../messages/es.json";
import en from "../messages/en.json";

const MESSAGES = { ca, es, en } as unknown as Record<"ca" | "es" | "en", AbstractIntlMessages>;

function render(calcId: string, locale: keyof typeof MESSAGES) {
  return renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      <DynamicCalcForm calcId={calcId} />
    </NextIntlClientProvider>,
  );
}

describe("DynamicCalcForm recommendation", () => {
  // Defaults (65-year-old man, no other factor) score 1: CHA2DS2VASC_OAC_CONSIDERED_IIA.
  it.each([
    ["ca", "Cal considerar"],
    ["es", "Debe considerarse anticoagulación oral"],
    ["en", "Oral anticoagulation should be considered"],
  ] as const)("is shown in the page language (%s)", (locale, text) => {
    expect(render("cha2ds2vasc", locale)).toContain(text);
  });

  // Defaults (70 kg man, Na 155 → 140) give a 4.5 L deficit, which the text carries.
  it("keeps the free water deficit volume in the translated text", () => {
    const html = render("free-water-deficit", "ca");
    expect(html).toContain("aigua lliure: 4.5 L");
    expect(html).not.toContain("{score}");
  });
});

// DynamicCalcForm renders every calculator that declares fieldsMetadata.
// Each code those calculators can return needs an entry in
// api-recommendations, or ca/es pages fall back to English.
const CALCS_DIR = path.resolve(__dirname, "../../../packages/calculators/src");
const translated = new Set(listRecommendationCodes());

describe("recommendation codes of DynamicCalcForm calculators", () => {
  for (const calc of listCalcs().filter((c) => c.fieldsMetadata)) {
    const source = readFileSync(path.join(CALCS_DIR, `${calc.id}.ts`), "utf8");
    const codes = [...source.matchAll(/recommendationCode: "([A-Z0-9_]+)"/g)].map((m) => m[1]!);
    it(`${calc.id} has a ca/es translation for every code`, () => {
      expect(codes.length, `no recommendationCode found in ${calc.id}.ts`).toBeGreaterThan(0);
      expect(codes.filter((code) => !translated.has(code))).toEqual([]);
    });
  }
});
