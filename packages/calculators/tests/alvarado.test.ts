import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/alvarado";

const empty = {
  migrationOfPain: false,
  anorexia: false,
  nauseaOrVomiting: false,
  rightLowerQuadrantTenderness: false,
  reboundTenderness: false,
  elevatedTemperature: false,
  leukocytosis: false,
  leftShift: false,
};

describe("Alvarado score (MANTRELS)", () => {
  it("scores 0 with all criteria absent", () => {
    expect(formula(empty)).toBe(0);
  });

  it("weights RLQ tenderness and leukocytosis at 2 points", () => {
    expect(formula({ ...empty, rightLowerQuadrantTenderness: true })).toBe(2);
    expect(formula({ ...empty, leukocytosis: true })).toBe(2);
  });

  it("scores 10 with all criteria present", () => {
    const full = {
      migrationOfPain: true,
      anorexia: true,
      nauseaOrVomiting: true,
      rightLowerQuadrantTenderness: true,
      reboundTenderness: true,
      elevatedTemperature: true,
      leukocytosis: true,
      leftShift: true,
    };
    expect(formula(full)).toBe(10);
  });

  it("classifies 0-4 low, 5-6 possible, 7-10 probable", () => {
    expect(interpret(3).tier).toBe("low");
    expect(interpret(5).tier).toBe("moderate");
    expect(interpret(7).tier).toBe("high");
    expect(interpret(10).recommendationCode).toBe("ALVARADO_PROBABLE");
  });
});
