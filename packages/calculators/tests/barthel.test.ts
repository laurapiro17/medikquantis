import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/barthel";

const max = {
  feeding: "10",
  bathing: "5",
  grooming: "5",
  dressing: "10",
  bowels: "10",
  bladder: "10",
  toiletUse: "10",
  transfers: "15",
  mobility: "15",
  stairs: "10",
} as const;

const minimal = {
  feeding: "0",
  bathing: "0",
  grooming: "0",
  dressing: "0",
  bowels: "0",
  bladder: "0",
  toiletUse: "0",
  transfers: "0",
  mobility: "0",
  stairs: "0",
} as const;

describe("Barthel Index", () => {
  it("sums each item to 100 at maximum independence", () => {
    expect(formula(max)).toBe(100);
  });
  it("sums to 0 at total dependence", () => {
    expect(formula(minimal)).toBe(0);
  });
  it("tiers per Shah 1989", () => {
    expect(interpret(100).recommendationCode).toBe("BARTHEL_INDEPENDENT");
    expect(interpret(95).recommendationCode).toBe("BARTHEL_MILD");
    expect(interpret(80).recommendationCode).toBe("BARTHEL_MODERATE");
    expect(interpret(40).recommendationCode).toBe("BARTHEL_SEVERE");
    expect(interpret(15).recommendationCode).toBe("BARTHEL_TOTAL");
  });
});
