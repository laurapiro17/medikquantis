import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/epworth";

const FIELDS = [
  "sittingReading",
  "watchingTv",
  "sittingInactivePublic",
  "passengerInCar",
  "lyingDownAfternoon",
  "sittingTalking",
  "sittingAfterLunch",
  "inCarStoppedInTraffic",
] as const;

const all = (v: "0" | "1" | "2" | "3") =>
  Object.fromEntries(FIELDS.map((f) => [f, v])) as Record<
    (typeof FIELDS)[number],
    "0" | "1" | "2" | "3"
  >;

describe("epworth calculator", () => {
  it("scores all-never as zero and low", () => {
    expect(formula(all("0"))).toBe(0);
    expect(interpret(0).tier).toBe("low");
    expect(interpret(0).recommendationCode).toBe("EPWORTH_NORMAL");
  });

  it("reaches the documented maximum of 24", () => {
    expect(formula(all("3"))).toBe(24);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 24 });
  });

  it("has eight items", () => {
    expect(FIELDS).toHaveLength(8);
    expect(Object.keys(calculator.fieldsMetadata ?? {})).toHaveLength(8);
  });

  it("pins every tier boundary", () => {
    expect(interpret(10).recommendationCode).toBe("EPWORTH_NORMAL");
    expect(interpret(11).recommendationCode).toBe("EPWORTH_MILD");
    expect(interpret(14).recommendationCode).toBe("EPWORTH_MILD");
    expect(interpret(15).recommendationCode).toBe("EPWORTH_MODERATE");
    expect(interpret(17).recommendationCode).toBe("EPWORTH_MODERATE");
    expect(interpret(18).recommendationCode).toBe("EPWORTH_SEVERE");
    expect(interpret(18).tier).toBe("high");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("epworth");
    expect(calculator.specialty).toBe("otorhinolaryngology");
    expect(calculator.references[0].pmid).toBe("1798888");
  });
});
