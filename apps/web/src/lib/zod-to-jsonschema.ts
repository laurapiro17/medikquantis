import {
  z,
  ZodBoolean,
  ZodEnum,
  ZodNumber,
  ZodObject,
  ZodOptional,
  type ZodTypeAny,
} from "zod";

export interface JsonSchemaPrimitive {
  type: "number" | "integer" | "boolean" | "string";
  enum?: readonly string[];
  minimum?: number;
  maximum?: number;
}

export interface JsonSchemaObject {
  type: "object";
  properties: Record<string, JsonSchemaPrimitive | JsonSchemaObject>;
  required: string[];
  additionalProperties: false;
}

export type JsonSchemaProperty = JsonSchemaPrimitive | JsonSchemaObject;

export function zodObjectToJsonSchema(schema: ZodTypeAny): JsonSchemaObject {
  if (!(schema instanceof ZodObject)) {
    throw new Error("Expected a ZodObject at the top level");
  }
  const shape = schema.shape as Record<string, ZodTypeAny>;
  const properties: Record<string, JsonSchemaProperty> = {};
  const required: string[] = [];

  for (const [key, field] of Object.entries(shape)) {
    properties[key] = fieldToJsonSchema(field);
    if (!field.isOptional()) required.push(key);
  }

  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
}

function fieldToJsonSchema(field: ZodTypeAny): JsonSchemaProperty {
  // Unwrap optional fields — the `required` list at the parent level
  // already records whether the field is mandatory; the JSON Schema for
  // the value itself is just the inner type.
  if (field instanceof ZodOptional) {
    return fieldToJsonSchema((field as z.ZodOptional<ZodTypeAny>).unwrap());
  }
  if (field instanceof ZodNumber) {
    const checks = (field as z.ZodNumber)._def.checks ?? [];
    const isInt = checks.some((c) => c.kind === "int");
    const min = checks.find((c) => c.kind === "min");
    const max = checks.find((c) => c.kind === "max");
    return {
      type: isInt ? "integer" : "number",
      ...(min && "value" in min ? { minimum: min.value } : {}),
      ...(max && "value" in max ? { maximum: max.value } : {}),
    };
  }
  if (field instanceof ZodBoolean) {
    return { type: "boolean" };
  }
  if (field instanceof ZodEnum) {
    return {
      type: "string",
      enum: (field as z.ZodEnum<[string, ...string[]]>).options,
    };
  }
  // Recurse for nested objects — PASI groups its inputs by body region,
  // each region being a sub-object with its own primitive fields.
  if (field instanceof ZodObject) {
    return zodObjectToJsonSchema(field);
  }
  throw new Error(`Unsupported Zod type at field: ${field.constructor.name}`);
}
