import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { GcsForm } from "@/components/GcsForm";
import { NihssForm } from "@/components/NihssForm";
import { translateRecommendation } from "@/lib/api-recommendations";
import ca from "../messages/ca.json";
import es from "../messages/es.json";

const CALCS_DIR = path.resolve(__dirname, "../../../packages/calculators/src");
const COMPONENTS_DIR = path.resolve(__dirname, "../src/components");

// Every interpret() branch reads `recommendation: <literal>, recommendationCode: "<CODE>"`.
const PAIR = /recommendation:\s*("(?:[^"\\]|\\.)*"|`[^`]*`),\s*recommendationCode: "([A-Z0-9_]+)"/g;

// Phq9Form translates through messages (phq9.recommendations), whose wording
// differs from interpret()'s; reconciling the two is a clinical decision.
const VIA_MESSAGES = new Set(["phq-9.ts"]);

const NO_ENTRY = "\u0000no entry";

describe("api-recommendations", () => {
  const files = readdirSync(CALCS_DIR).filter(
    (f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && !VIA_MESSAGES.has(f),
  );
  for (const file of files) {
    const source = readFileSync(path.join(CALCS_DIR, file), "utf8");
    const codeCount = source.match(/recommendationCode: "/g)?.length ?? 0;
    if (codeCount === 0) continue;
    const pairs = [...source.matchAll(PAIR)];

    it(`${file}: every code has an entry whose en matches interpret()`, () => {
      // A code written any other way would escape the checks below.
      expect(pairs.length).toBe(codeCount);
      const problems = pairs.flatMap(([, literal, code]) => {
        const en = translateRecommendation(code!, "en", NO_ENTRY);
        if (en === NO_ENTRY) return [`${code}: no entry`];
        // Template literals carry runtime values; only the entry's presence is checked.
        if (literal!.startsWith("`")) return [];
        return en === JSON.parse(literal!) ? [] : [`${code}: en differs from interpret()`];
      });
      expect(problems).toEqual([]);
    });
  }
});

describe("hand-written forms", () => {
  it("never pass interpret()'s English recommendation straight through", () => {
    const offenders = readdirSync(COMPONENTS_DIR).filter(
      (f) =>
        f.endsWith(".tsx") &&
        readFileSync(path.join(COMPONENTS_DIR, f), "utf8").includes(
          "recommendation={result.recommendation}",
        ),
    );
    expect(offenders).toEqual([]);
  });

  const MESSAGES = { ca, es } as unknown as Record<"ca" | "es", AbstractIntlMessages>;
  const render = (form: ReactElement, locale: "ca" | "es") =>
    renderToStaticMarkup(
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="UTC">
        {form}
      </NextIntlClientProvider>,
    );

  // Defaults: NIHSS 0 (NIHSS_NONE), GCS 15 (GCS_MILD_RULES).
  it.each([
    ["NIHSS", "ca", <NihssForm />, "clínicament detectables"],
    ["NIHSS", "es", <NihssForm />, "clínicamente detectables"],
    ["GCS", "ca", <GcsForm />, "TCE lleu"],
    ["GCS", "es", <GcsForm />, "TCE leve"],
  ] as const)("%s shows its advice in the page language (%s)", (_, locale, form, text) => {
    expect(render(form, locale)).toContain(text);
  });
});
