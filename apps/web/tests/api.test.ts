import { describe, expect, it } from "vitest";

import { GET as IndexGET } from "@/app/api/v1/route";
import {
  GET as CalcGET,
  POST as CalcPOST,
  OPTIONS as CalcOPTIONS,
} from "@/app/api/v1/[calc]/route";
import { GET as OpenApiGET } from "@/app/api/v1/openapi.json/route";

const validCha = {
  age: 72,
  sex: "female" as const,
  chf: false,
  hypertension: true,
  diabetes: false,
  strokeOrTia: true,
  vascularDisease: false,
};

function ctx(calc: string) {
  return { params: Promise.resolve({ calc }) };
}

describe("GET /api/v1", () => {
  it("returns the registry of 13 calculators", async () => {
    const res = IndexGET();
    const body = await res.json();
    expect(body.calculatorCount).toBe(13);
    expect(body.calculators).toHaveLength(13);
    expect(body.openapi).toBe("/api/v1/openapi.json");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});

describe("POST /api/v1/[calc]", () => {
  it("computes a CHA2DS2-VASc score with full response shape", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc", {
      method: "POST",
      body: JSON.stringify(validCha),
    });
    const res = await CalcPOST(req, ctx("cha2ds2vasc"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.calc).toBe("cha2ds2vasc");
    expect(body.score).toBeGreaterThan(0);
    expect(body.tier).toBe("high");
    expect(body.recommendationCode).toBe("CHA2DS2VASC_OAC_RECOMMENDED_I");
    expect(body.recommendation).toContain("Oral anticoagulation");
    expect(body.responseLanguage).toBe("en");
    expect(body.references.length).toBeGreaterThan(0);
    expect(body.computedAt).toMatch(/T.*Z$/);
  });

  it("localises recommendation when ?lang=es is passed", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc?lang=es", {
      method: "POST",
      body: JSON.stringify(validCha),
    });
    const res = await CalcPOST(req, ctx("cha2ds2vasc"));
    const body = await res.json();
    expect(body.responseLanguage).toBe("es");
    expect(body.recommendation).toContain("anticoagulación oral");
    expect(body.recommendationCode).toBe("CHA2DS2VASC_OAC_RECOMMENDED_I");
  });

  it("localises recommendation when ?lang=ca is passed", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc?lang=ca", {
      method: "POST",
      body: JSON.stringify(validCha),
    });
    const res = await CalcPOST(req, ctx("cha2ds2vasc"));
    const body = await res.json();
    expect(body.responseLanguage).toBe("ca");
    expect(body.recommendation).toContain("anticoagulació oral");
  });

  it("falls back to English on unsupported lang", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc?lang=fr", {
      method: "POST",
      body: JSON.stringify(validCha),
    });
    const res = await CalcPOST(req, ctx("cha2ds2vasc"));
    const body = await res.json();
    expect(body.responseLanguage).toBe("en");
  });

  it("returns 422 on validation failure", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc", {
      method: "POST",
      body: JSON.stringify({ age: 200, sex: "male" }),
    });
    const res = await CalcPOST(req, ctx("cha2ds2vasc"));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Validation failed");
    expect(Array.isArray(body.fields)).toBe(true);
  });

  it("returns 400 on malformed JSON", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc", {
      method: "POST",
      body: "not json",
    });
    const res = await CalcPOST(req, ctx("cha2ds2vasc"));
    expect(res.status).toBe(400);
  });

  it("returns 404 on unknown calc", async () => {
    const req = new Request("https://x.example/api/v1/does-not-exist", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await CalcPOST(req, ctx("does-not-exist"));
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/[calc] (metadata)", () => {
  it("returns input schema for cha2ds2vasc", async () => {
    const req = new Request("https://x.example/api/v1/cha2ds2vasc");
    const res = await CalcGET(req, ctx("cha2ds2vasc"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("cha2ds2vasc");
    expect(body.inputs.type).toBe("object");
    expect(body.inputs.properties.age.type).toBe("integer");
    expect(body.inputs.properties.sex.enum).toEqual(["male", "female"]);
  });
});

describe("OPTIONS /api/v1/[calc] (CORS preflight)", () => {
  it("returns 204 with CORS headers", () => {
    const res = CalcOPTIONS();
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("access-control-allow-methods")).toContain("POST");
  });
});

describe("GET /api/v1/openapi.json", () => {
  it("returns a valid OpenAPI 3.1 spec with 13 calc paths", () => {
    const req = new Request("https://medcalc-cardio.vercel.app/api/v1/openapi.json");
    const res = OpenApiGET(req);
    expect(res.status).toBe(200);
    return res.json().then((spec: { openapi: string; paths: Record<string, unknown> }) => {
      expect(spec.openapi).toBe("3.1.0");
      const calcPaths = Object.keys(spec.paths).filter((p) =>
        p.startsWith("/api/v1/") && p !== "/api/v1",
      );
      expect(calcPaths).toHaveLength(13);
    });
  });
});
