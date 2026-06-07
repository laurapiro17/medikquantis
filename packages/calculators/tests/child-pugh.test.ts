import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/child-pugh";

describe("Child-Pugh", () => {
  it("sums the 5 items 1-3", () => {
    expect(formula({
      bilirubin: "1", albumin: "1", inr: "1", ascites: "1", encephalopathy: "1",
    })).toBe(5);
    expect(formula({
      bilirubin: "3", albumin: "3", inr: "3", ascites: "3", encephalopathy: "3",
    })).toBe(15);
  });
  it("classes by Pugh cut-offs: 5-6=A, 7-9=B, 10-15=C", () => {
    expect(interpret(5).classLabel).toBe("A");
    expect(interpret(6).classLabel).toBe("A");
    expect(interpret(7).classLabel).toBe("B");
    expect(interpret(9).classLabel).toBe("B");
    expect(interpret(10).classLabel).toBe("C");
    expect(interpret(15).classLabel).toBe("C");
  });
});
