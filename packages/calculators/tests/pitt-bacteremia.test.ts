import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/pitt-bacteremia";

const base = {
  temperatureBand: "normal" as const,
  hypotension: false,
  mechanicalVentilation: false,
  cardiacArrestWithin24h: false,
  mentalStatus: "alert" as const,
};

describe("Pitt Bacteraemia Score", () => {
  it("scores 0 for the baseline alert, normotensive, normothermic patient", () => {
    expect(formula(base)).toBe(0);
  });

  it("scores 2 for hypotension, mechanical ventilation, or severe temperature", () => {
    expect(formula({ ...base, hypotension: true })).toBe(2);
    expect(formula({ ...base, mechanicalVentilation: true })).toBe(2);
    expect(formula({ ...base, temperatureBand: "severe" })).toBe(2);
  });

  it("scores 4 for cardiac arrest within 24h", () => {
    expect(formula({ ...base, cardiacArrestWithin24h: true })).toBe(4);
  });

  it("scores 4 for coma", () => {
    expect(formula({ ...base, mentalStatus: "comatose" })).toBe(4);
  });

  it("triggers high tier at ≥4 (Paterson cutoff)", () => {
    expect(interpret(3).tier).toBe("moderate");
    expect(interpret(4).tier).toBe("high");
    expect(interpret(4).recommendationCode).toBe("PITT_HIGH");
  });
});
