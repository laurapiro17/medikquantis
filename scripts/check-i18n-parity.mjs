#!/usr/bin/env node
/**
 * Verifies that every locale message file exposes the same set of leaf keys.
 *
 * Missing keys never break the Next.js build (next-intl renders them as the
 * raw key string in production), so a typo or a forgotten translation slips
 * silently to production. This script makes that drift a hard CI failure.
 *
 * Usage: `node scripts/check-i18n-parity.mjs`
 * Exit codes: 0 = parity OK, 1 = drift detected.
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const messagesDir = resolve(__dirname, "../apps/web/messages");

const files = readdirSync(messagesDir).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.error(`No message files found in ${messagesDir}`);
  process.exit(1);
}

/** Collect all dotted leaf paths of a JSON object. */
function collectLeafPaths(obj, prefix = "") {
  const out = new Set();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const p of collectLeafPaths(value, path)) out.add(p);
    } else {
      out.add(path);
    }
  }
  return out;
}

const byLocale = {};
for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const content = JSON.parse(readFileSync(join(messagesDir, file), "utf8"));
  byLocale[locale] = collectLeafPaths(content);
}

const locales = Object.keys(byLocale).sort();
const reference = locales[0];
let drift = false;

for (const locale of locales.slice(1)) {
  const missingHere = [...byLocale[reference]].filter((k) => !byLocale[locale].has(k));
  const extraHere = [...byLocale[locale]].filter((k) => !byLocale[reference].has(k));

  if (missingHere.length > 0) {
    drift = true;
    console.error(`\nMissing in ${locale}.json (present in ${reference}.json):`);
    for (const k of missingHere.sort()) console.error(`  - ${k}`);
  }
  if (extraHere.length > 0) {
    drift = true;
    console.error(`\nExtra in ${locale}.json (absent from ${reference}.json):`);
    for (const k of extraHere.sort()) console.error(`  + ${k}`);
  }
}

if (drift) {
  console.error(
    `\nKey drift detected between ${locales.join(", ")}. ` +
      `Bring all locales to parity before merging.`,
  );
  process.exit(1);
}

console.log(`All ${locales.length} locales agree on ${byLocale[reference].size} keys.`);
