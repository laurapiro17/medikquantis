import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/gcs";

describe("Glasgow Coma Scale", () => {
  it("sums eye + verbal + motor", () => {
    expect(formula({ eye: "4", verbal: "5", motor: "6" })).toBe(15);
    expect(formula({ eye: "1", verbal: "1", motor: "1" })).toBe(3);
  });

  it("places 3-8 in severe", () => {
    for (const s of [3, 5, 7, 8]) {
      expect(interpret(s).tier).toBe("high");
      expect(interpret(s).recommendationCode).toBe("GCS_SEVERE_AIRWAY");
    }
  });

  it("places 9-12 in moderate", () => {
    for (const s of [9, 10, 11, 12]) {
      expect(interpret(s).tier).toBe("moderate");
      expect(interpret(s).recommendationCode).toBe("GCS_MODERATE_ADMIT");
    }
  });

  it("places 13-15 in mild", () => {
    for (const s of [13, 14, 15]) {
      expect(interpret(s).tier).toBe("low");
      expect(interpret(s).recommendationCode).toBe("GCS_MILD_RULES");
    }
  });

  it("intubation threshold at 8/9 boundary is correct", () => {
    expect(interpret(8).recommendationCode).toBe("GCS_SEVERE_AIRWAY");
    expect(interpret(9).recommendationCode).toBe("GCS_MODERATE_ADMIT");
  });
});
