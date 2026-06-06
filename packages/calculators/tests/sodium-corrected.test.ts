import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/sodium-corrected";

describe("Hyperglycaemia-corrected sodium (Katz 1973)", () => {
  it("returns measured sodium when glucose is ≤ 100", () => {
    expect(formula({ sodiumMEqL: 138, glucoseMgDl: 90 })).toBe(138);
    expect(formula({ sodiumMEqL: 138, glucoseMgDl: 100 })).toBe(138);
  });

  it("adds 1.6 mEq/L per 100 mg/dL of glucose above 100", () => {
    // Na 132 + 1.6·(600-100)/100 = 132 + 8 = 140
    expect(formula({ sodiumMEqL: 132, glucoseMgDl: 600 })).toBe(140);
  });

  it("classifies < 135 as hyponatraemia", () => {
    expect(interpret(130).category).toBe("hyponatraemia");
  });

  it("classifies 135–145 as normal", () => {
    expect(interpret(135).category).toBe("normal");
    expect(interpret(140).category).toBe("normal");
    expect(interpret(145).category).toBe("normal");
  });

  it("classifies > 145 as hypernatraemia", () => {
    expect(interpret(150).category).toBe("hypernatraemia");
  });
});
