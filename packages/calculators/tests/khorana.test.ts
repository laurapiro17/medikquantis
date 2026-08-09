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
