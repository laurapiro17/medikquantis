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
