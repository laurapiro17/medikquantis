import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/ipss";

describe("IPSS", () => {
  it("sums the seven AUA questions", () => {
    expect(
      formula({
        incompleteEmptying: "0",
        frequency: "0",
        intermittency: "0",
        urgency: "0",
        weakStream: "0",
        straining: "0",
        nocturia: "0",
      }),
    ).toBe(0);
    expect(
      formula({
        incompleteEmptying: "5",
        frequency: "5",
        intermittency: "5",
        urgency: "5",
        weakStream: "5",
        straining: "5",
        nocturia: "5",
      }),
    ).toBe(35);
  });
  it("tiers 0–7 mild, 8–19 moderate, 20–35 severe", () => {
    expect(interpret(5).recommendationCode).toBe("IPSS_MILD");
    expect(interpret(12).recommendationCode).toBe("IPSS_MODERATE");
    expect(interpret(25).recommendationCode).toBe("IPSS_SEVERE");
  });
});
