import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import ca from "../messages/ca.json";
import es from "../messages/es.json";
import en from "../messages/en.json";

const MESSAGES = { ca, es, en } as unknown as Record<"ca" | "es" | "en", AbstractIntlMessages>;

function render(calcId: string, locale: keyof typeof MESSAGES) {
  return renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="UTC">
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
