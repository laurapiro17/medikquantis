#!/usr/bin/env node
// Verify every PMID in packages/calculators/src/*.ts against NCBI PubMed.
//
// For each entry in a calculator's `references` array, we extract the
// PMID and the citation string, then hit NCBI EUtils `esummary` in one
// batched call. A reference is considered correct when the first
// author's family name (case-insensitive) appears in the citation.
//
// Exit codes:
//   0  every reference matches its PMID
//   1  one or more mismatches OR PMID not in PubMed
//   2  network/transport error after retry (CI should re-run)
//
// Inline `// PMID …` comments are not validated — only structured
// references in the `references: [{ pmid, citation }]` array.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "..", "packages", "calculators", "src");
const IGNORE = new Set(["types.ts", "registry.ts", "popular.ts", "index.ts"]);

const entries = [];
for (const file of readdirSync(SRC)) {
  if (!file.endsWith(".ts") || IGNORE.has(file)) continue;
  const text = readFileSync(join(SRC, file), "utf-8");
  const re = /pmid:\s*"(\d+)",\s*citation:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    entries.push({ file, pmid: m[1], citation: m[2] });
  }
}

if (entries.length === 0) {
  console.error("No PMID/citation pairs found — script extraction broken?");
  process.exit(1);
}

console.log(
  `Verifying ${entries.length} PMID/citation pairs against NCBI…`,
);

const pmids = [...new Set(entries.map((e) => e.pmid))];
const url =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=" +
  pmids.join(",");

async function fetchWithRetry(retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30_000),
      });
      if (r.ok) return await r.json();
      if (r.status === 429 || r.status >= 500) {
        // Transient — wait and retry.
        await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
        continue;
      }
      throw new Error(`HTTP ${r.status} from NCBI`);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
    }
  }
}

let payload;
try {
  payload = await fetchWithRetry();
} catch (err) {
  console.error(`NCBI fetch failed: ${err.message}`);
  process.exit(2);
}

const data = payload?.result;
if (!data) {
  console.error("NCBI response missing `result` key.");
  process.exit(2);
}

const mismatches = [];
const skipped = [];
for (const e of entries) {
  const pubmed = data[e.pmid];
  if (!pubmed || !pubmed.title) {
    mismatches.push({ ...e, reason: "PMID not found in PubMed" });
    continue;
  }
  const firstAuthor = pubmed.authors?.[0]?.name ?? "";
  const lastName = firstAuthor.split(" ")[0];
  if (!lastName) {
    // Corporate / consensus authorship (e.g. SCORAD's "European Task Force
    // on Atopic Dermatitis"). PubMed sometimes stores the group name
    // separately; we cannot do a person-name match. Verify the title
    // overlaps instead — at least 3 distinct words ≥4 chars from the
    // PubMed title must appear in the citation.
    const titleTokens = pubmed.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4);
    const hits = titleTokens.filter((w) =>
      e.citation.toLowerCase().includes(w),
    ).length;
    if (hits < 3) {
      mismatches.push({
        ...e,
        reason: "no first author, and title tokens do not overlap citation",
        pubmedTitle: pubmed.title.slice(0, 100),
      });
    } else {
      skipped.push({ ...e, reason: "corporate author — title overlap OK" });
    }
    continue;
  }
  if (!e.citation.toLowerCase().includes(lastName.toLowerCase())) {
    mismatches.push({
      ...e,
      reason: `first author "${firstAuthor}" missing from citation`,
      pubmedTitle: pubmed.title.slice(0, 100),
      pubmedSource: pubmed.source ?? "",
      pubmedYear: (pubmed.pubdate ?? "").slice(0, 4),
    });
  }
}

if (mismatches.length === 0) {
  const note =
    skipped.length > 0
      ? ` (${skipped.length} corporate-author entries verified by title overlap)`
      : "";
  console.log(
    `✅ All ${entries.length} citations match their PMIDs${note}.`,
  );
  process.exit(0);
}

console.error(
  `\n❌ ${mismatches.length} citation/PMID mismatches found:\n`,
);
for (const m of mismatches) {
  console.error(`  ${m.file}  PMID ${m.pmid}`);
  console.error(`    Citation : ${m.citation.slice(0, 100)}`);
  if (m.pubmedTitle) {
    console.error(
      `    PubMed   : ${m.pubmedTitle} — ${m.pubmedSource} ${m.pubmedYear}`,
    );
  }
  console.error(`    → ${m.reason}\n`);
}
process.exit(1);
