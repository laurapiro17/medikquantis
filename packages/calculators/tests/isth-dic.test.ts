import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/isth-dic";

describe("isth-dic calculator", () => {
  it("scores a normal coagulation profile as zero", () => {
    const score = formula({
      platelets: "0",
      fibrinMarker: "0",
      ptProlongation: "0",
      fibrinogen: "0",
    });
    expect(score).toBe(0);
    expect(interpret(score).tier).toBe("low");
    expect(interpret(score).recommendationCode).toBe("ISTH_DIC_NONE");
  });

  it("treats 0 and 1 as different tiers", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(1).tier).toBe("moderate");
  });

  it("reaches the documented maximum of 8", () => {
    const score = formula({
      platelets: "2",
      fibrinMarker: "3",
      ptProlongation: "2",
      fibrinogen: "1",
    });
    expect(score).toBe(8);
    expect(calculator.scoreRange.max).toBe(8);
  });

  it("treats 5 as the overt-DIC threshold", () => {
    const belowThreshold = formula({
      platelets: "2",
      fibrinMarker: "2",
      ptProlongation: "0",
      fibrinogen: "0",
    });
    expect(belowThreshold).toBe(4);
    expect(interpret(belowThreshold).tier).toBe("moderate");
    expect(interpret(belowThreshold).recommendationCode).toBe("ISTH_DIC_NON_OVERT");

    const atThreshold = formula({
      platelets: "2",
      fibrinMarker: "2",
      ptProlongation: "1",
      fibrinogen: "0",
    });
    expect(atThreshold).toBe(5);
    expect(interpret(atThreshold).tier).toBe("high");
    expect(interpret(atThreshold).recommendationCode).toBe("ISTH_DIC_OVERT");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("isth-dic");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("11816725");
  });
});
