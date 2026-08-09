#!/usr/bin/env node
// Verify that every "N calculators / N specialties" claim in the docs and in
// the user-facing copy matches the registry.
//
// The counts have drifted twice already: a test asserted "registry of 13
// calculators" when there were 61, and the README advertised 49 when there
// were 65. Both were written by hand and both went stale silently. The fix is
// to derive the numbers from `packages/calculators/src/` and fail here.
//
// Exit codes:
//   0  every claim matches the registry
//   1  one or more claims are stale (or the extraction broke)

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "packages", "calculators", "src");
const IGNORE = new Set(["types.ts", "registry.ts", "popular.ts", "index.ts"]);

// --- the source of truth -----------------------------------------------

const registry = readFileSync(join(SRC, "registry.ts"), "utf-8");
const body = registry.slice(
  registry.indexOf("> = {"),
  registry.indexOf("export function getCalc"),
);
const calculators = (body.match(/^\s{2}"?[a-z0-9-]+"?\s*[,:]/gm) ?? []).length;

const specialties = new Set();
for (const file of readdirSync(SRC)) {
  if (!file.endsWith(".ts") || IGNORE.has(file)) continue;
  const m = readFileSync(join(SRC, file), "utf-8").match(
    /specialty:\s*"([a-z_]+)"/,
  );
  if (m) specialties.add(m[1]);
}

if (calculators === 0 || specialties.size === 0) {
  console.error("Extracted 0 calculators or 0 specialties — script broken?");
  process.exit(1);
}

// --- the claims ---------------------------------------------------------

const CALCULATORS =
  /(\d+)\s+(?:validated\s+)?(?:clinical\s+)?(?:calculators|calculadoras|calculadores|scores)/gi;
const SPECIALTIES = /(\d+)\s+(?:specialties|especialidades|especialitats)/gi;

// Whole-file targets.
const DOCS = [
  "README.md",
  "paper/paper.md",
  "packages/calculators/README.md",
];

// Locale targets are limited to the keys that describe the catalogue as it is
// now. Release notes legitimately quote the counts of an older version.
const LOCALES = ["ca", "es", "en"];
const LOCALE_KEYS = ["catalog_subheading", "api_callout_body"];

const stale = [];

function check(label, text) {
  for (const [re, expected, noun] of [
    [CALCULATORS, calculators, "calculators"],
    [SPECIALTIES, specialties.size, "specialties"],
  ]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (Number(m[1]) !== expected) {
        stale.push(`${label}: says ${m[1]} ${noun}, registry has ${expected}`);
      }
    }
  }
}

for (const doc of DOCS) {
  const text = readFileSync(join(ROOT, doc), "utf-8");
  text.split("\n").forEach((line, i) => check(`${doc}:${i + 1}`, line));
}

for (const locale of LOCALES) {
  const path = join(ROOT, "apps", "web", "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf-8"));
  for (const [namespace, entries] of Object.entries(messages)) {
    if (typeof entries !== "object" || entries === null) continue;
    for (const key of LOCALE_KEYS) {
      if (typeof entries[key] === "string") {
        check(`messages/${locale}.json ${namespace}.${key}`, entries[key]);
      }
    }
  }
}

// --- report -------------------------------------------------------------

if (stale.length > 0) {
  console.error(
    `Registry has ${calculators} calculators across ${specialties.size} specialties, but:`,
  );
  for (const line of stale) console.error(`  ✗ ${line}`);
  console.error("\nUpdate the copy, or the registry, so the two agree.");
  process.exit(1);
}

console.log(
  `✅ Every count matches the registry (${calculators} calculators, ${specialties.size} specialties)`,
);
