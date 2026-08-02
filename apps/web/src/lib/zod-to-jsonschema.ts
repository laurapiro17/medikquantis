import {
  z,
  ZodBoolean,
  ZodDefault,
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
  default?: string | number | boolean;
}

export interface JsonSchemaObject {
  type: "object";
  properties: Record<string, JsonSchemaPrimitive | JsonSchemaObject>;
  required: string[];
  additionalProperties: false;
  default?: string | number | boolean;
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
  // A defaulted field is optional on input, so the parent already leaves it
  // out of `required`; describe the inner type and advertise the default.
  if (field instanceof ZodDefault) {
    const def = (field as z.ZodDefault<ZodTypeAny>)._def;
    return {
      ...fieldToJsonSchema(def.innerType),
      default: def.defaultValue() as string | number | boolean,
    };
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
