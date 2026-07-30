import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/apgar";

describe("APGAR Score", () => {
  it("calculates minimum score 0", () => {
    const input = {
      appearance: "0" as const,
      pulse: "0" as const,
      grimace: "0" as const,
      activity: "0" as const,
      respiration: "0" as const,
    };
    expect(formula(input)).toBe(0);
    expect(interpret(0).tier).toBe("high");
    expect(interpret(0).recommendationCode).toBe("APGAR_SEVERE");
  });

  it("calculates maximum score 10", () => {
    const input = {
      appearance: "2" as const,
      pulse: "2" as const,
      grimace: "2" as const,
      activity: "2" as const,
      respiration: "2" as const,
    };
    expect(formula(input)).toBe(10);
    expect(interpret(10).tier).toBe("low");
    expect(interpret(10).recommendationCode).toBe("APGAR_NORMAL");
  });

  it("interprets moderate depression (4-6)", () => {
    expect(interpret(5).tier).toBe("moderate");
    expect(interpret(5).recommendationCode).toBe("APGAR_MODERATE");
  });
});
