import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/asa-ps";

describe("ASA Physical Status", () => {
  it("maps each class to its ordinal", () => {
    expect(formula({ asaClass: "I", emergency: false })).toBe(1);
    expect(formula({ asaClass: "VI", emergency: false })).toBe(6);
  });
  it("tiers I-II low, III moderate, IV-VI high", () => {
    expect(interpret(1, { asaClass: "I", emergency: false }).tier).toBe("low");
    expect(interpret(2, { asaClass: "II", emergency: false }).tier).toBe("low");
    expect(interpret(3, { asaClass: "III", emergency: false }).tier).toBe("moderate");
    expect(interpret(4, { asaClass: "IV", emergency: false }).tier).toBe("high");
    expect(interpret(6, { asaClass: "VI", emergency: false }).tier).toBe("high");
  });
  it("surfaces an E suffix in the recommendation when emergency", () => {
    const r = interpret(3, { asaClass: "III", emergency: true });
    expect(r.recommendation).toContain("ASA IIIE");
    expect(r.emergency).toBe(true);
  });
});
