import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/binet";

describe("binet calculator", () => {
  it("maps the three stages onto 0, 1 and 2", () => {
    expect(formula({ stage: "A" })).toBe(0);
    expect(formula({ stage: "B" })).toBe(1);
    expect(formula({ stage: "C" })).toBe(2);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 2 });
  });

  it("escalates the tier with the stage", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(0).recommendationCode).toBe("BINET_A");
    expect(interpret(1).tier).toBe("moderate");
    expect(interpret(1).recommendationCode).toBe("BINET_B");
    expect(interpret(2).tier).toBe("high");
    expect(interpret(2).recommendationCode).toBe("BINET_C");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("binet");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("7237385");
  });
});
