#!/usr/bin/env node
/**
 * MedikQuantis release automation.
 *
 *   pnpm release 1.0.1                 — full release
 *   pnpm release 1.0.1 --dry-run       — validate without touching remotes
 *
 * Phases (bail-on-failure, ordered cheapest-to-revert first):
 *   1. Pre-flight       (read-only; branch + dirty + token + version sanity)
 *   2. Bump local       (package.json × 3 + CITATION.cff)
 *   3. Validate         (i18n parity, typecheck, tests)
 *   4. Commit + tag     (irreversible without rewrite history)
 *   5. GitHub release   (cost: `gh release delete` to undo)
 *   6. Zenodo publish   (PERMANENT — DOI cannot be deleted)
 *   7. Update CITING    (commit + push)
 *
 * Requires:
 *   - Working tree clean on `main`
 *   - `gh` authenticated for laurapiro17/medikquantis
 *   - Zenodo token in macOS Keychain: `security add-generic-password
 *     -s zenodo-token -a laurapiro17 -w <token>`
 *   - Node 22+ (top-level await + built-in fetch)
 *
 * Security note: every shell-out goes through `execFileSync` with an
 * argument array (never string interpolation). Even though the only
 * external input is NEW_VERSION, regex-gated to digits/dots/hyphens,
 * the array form removes the entire shell-injection class of bugs.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// ─── ANSI minimal ──────────────────────────────────────────────────────────
const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};
const phase = (n, label) => console.log(`\n${c.bold(c.cyan(`▶ Phase ${n}`))} ${c.bold(label)}`);
const ok = (msg) => console.log(`  ${c.green("✓")} ${msg}`);
const info = (msg) => console.log(`  ${c.dim(msg)}`);
const die = (msg) => {
  console.error(`\n${c.red("✗")} ${msg}\n`);
  process.exit(1);
};

// ─── Args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const NEW_VERSION = args.find((a) => /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/.test(a));

if (!NEW_VERSION) {
  console.error("Usage: pnpm release <semver> [--dry-run]");
  console.error("Example: pnpm release 1.0.1");
  process.exit(1);
}

// ─── Shell helpers (no string interpolation; always [cmd, args] form) ──────

/** Capture stdout of a command. Throws on non-zero exit. */
const capture = (file, argv = []) =>
  execFileSync(file, argv, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }).trim();

/** Stream a command's I/O. Honours --dry-run (prints, doesn't run). */
const stream = (file, argv = [], { allowDry = false } = {}) => {
  const pretty = `${file} ${argv.join(" ")}`;
  if (DRY_RUN && !allowDry) {
    console.log(`  ${c.yellow("[dry]")} ${pretty}`);
    return;
  }
  console.log(`  ${c.dim("$")} ${pretty}`);
  execFileSync(file, argv, { stdio: "inherit" });
};

// ───────────────────────────────────────────────────────────────────────────
// Phase 1 — Pre-flight
// ───────────────────────────────────────────────────────────────────────────
phase(1, "Pre-flight");

const branch = capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") die(`Must be on main, currently on ${branch}`);
ok(`On branch main`);

const dirty = capture("git", ["status", "--porcelain"]);
if (dirty) die(`Working tree dirty:\n${dirty}`);
ok(`Working tree clean`);

try {
  execFileSync("git", ["fetch", "origin", "main", "--tags"], { stdio: "pipe" });
} catch (e) {
  info(`(fetch warning: ${String(e.message).split("\n")[0]})`);
}

const ahead = capture("git", ["rev-list", "--count", "origin/main..HEAD"]);
if (ahead !== "0") die(`Local main is ${ahead} commits ahead of origin/main. Push first.`);
ok(`Local main matches origin/main`);

const currentVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
if (currentVersion === NEW_VERSION) die(`Already at ${NEW_VERSION}. Pick a new version.`);

const existingTags = capture("git", ["tag", "--list"]).split("\n");
if (existingTags.includes(`v${NEW_VERSION}`)) {
  die(`Tag v${NEW_VERSION} already exists locally.`);
}
ok(`Version ${currentVersion} → ${NEW_VERSION} (new)`);

let ZENODO_TOKEN = "";
if (!DRY_RUN) {
  try {
    ZENODO_TOKEN = capture("security", [
      "find-generic-password",
      "-s", "zenodo-token",
      "-a", "laurapiro17",
      "-w",
    ]);
    if (ZENODO_TOKEN.length < 20) throw new Error("token too short");
  } catch {
    die(
      "No Zenodo token in Keychain. Run:\n" +
        "  security add-generic-password -s zenodo-token -a laurapiro17 -w <token>",
    );
  }
  ok(`Zenodo token loaded from Keychain (${ZENODO_TOKEN.length} chars)`);
}

try {
  capture("gh", ["auth", "status"]);
  ok(`gh CLI authenticated`);
} catch {
  die(`gh CLI not authenticated. Run: gh auth login`);
}

// ───────────────────────────────────────────────────────────────────────────
// Phase 2 — Bump local
// ───────────────────────────────────────────────────────────────────────────
phase(2, "Bump version in package.json × 3 + CITATION.cff");

const packageFiles = [
  "package.json",
  "packages/calculators/package.json",
  "apps/web/package.json",
];
for (const f of packageFiles) {
  const pkg = JSON.parse(readFileSync(f, "utf8"));
  pkg.version = NEW_VERSION;
  if (!DRY_RUN) writeFileSync(f, JSON.stringify(pkg, null, 2) + "\n");
  ok(`${f}: → ${NEW_VERSION}`);
}

let cff = readFileSync("CITATION.cff", "utf8");
cff = cff.replace(/^version: .+$/m, `version: ${NEW_VERSION}`);
const today = new Date().toISOString().slice(0, 10);
cff = cff.replace(/^date-released: .+$/m, `date-released: "${today}"`);
if (!DRY_RUN) writeFileSync("CITATION.cff", cff);
ok(`CITATION.cff: version + date-released bumped`);

// ───────────────────────────────────────────────────────────────────────────
// Phase 3 — Validate
// ───────────────────────────────────────────────────────────────────────────
phase(3, "Validate (i18n parity, typecheck, tests)");
stream("pnpm", ["lint:i18n"], { allowDry: true });
stream("pnpm", ["typecheck"], { allowDry: true });
stream("pnpm", ["test"], { allowDry: true });
ok(`All checks green`);

// ───────────────────────────────────────────────────────────────────────────
// Phase 4 — Commit + tag + push
// ───────────────────────────────────────────────────────────────────────────
phase(4, "Commit + tag + push");
stream("git", ["add", "-A"]);
stream("git", ["commit", "-m", `Release ${NEW_VERSION}`]);
stream("git", ["tag", "-a", `v${NEW_VERSION}`, "-m", `MedikQuantis ${NEW_VERSION}`]);
stream("git", ["push", "origin", "main"]);
stream("git", ["push", "origin", `v${NEW_VERSION}`]);
ok(`Tag v${NEW_VERSION} pushed to origin`);

// ───────────────────────────────────────────────────────────────────────────
// Phase 5 — GitHub Release
// ───────────────────────────────────────────────────────────────────────────
phase(5, "GitHub release");
stream("gh", [
  "release", "create", `v${NEW_VERSION}`,
  "--title", `MedikQuantis ${NEW_VERSION}`,
  "--generate-notes",
]);
ok(`Release v${NEW_VERSION} live on GitHub`);

// ───────────────────────────────────────────────────────────────────────────
// Phase 6 — Zenodo deposit + publish
// ───────────────────────────────────────────────────────────────────────────
phase(6, "Zenodo deposit + publish (PERMANENT)");

if (DRY_RUN) {
  console.log(`  ${c.yellow("[dry]")} would: download tarball + create deposition + upload + set metadata + publish`);
  console.log(`\n${c.green(c.bold(`✓ Dry-run complete for ${NEW_VERSION}`))}\n`);
  process.exit(0);
}

const tmp = mkdtempSync(join(tmpdir(), "medikquantis-release-"));
console.log(`  ${c.dim("$")} gh release download v${NEW_VERSION} --archive=tar.gz --dir ${tmp}`);
execFileSync("gh", [
  "release", "download", `v${NEW_VERSION}`,
  "--archive=tar.gz",
  "--dir", tmp,
], { stdio: "inherit" });
const tarballPath = join(tmp, `medikquantis-${NEW_VERSION}.tar.gz`);
const tarballBuf = readFileSync(tarballPath);
ok(`Tarball downloaded (${tarballBuf.length} bytes)`);

const zenodoHeaders = {
  Authorization: `Bearer ${ZENODO_TOKEN}`,
  "Content-Type": "application/json",
};

const createResp = await fetch("https://zenodo.org/api/deposit/depositions", {
  method: "POST",
  headers: zenodoHeaders,
  body: "{}",
});
if (!createResp.ok) die(`Zenodo create failed: HTTP ${createResp.status}`);
const dep = await createResp.json();
ok(`Deposition created: id=${dep.id}`);

const uploadResp = await fetch(
  `${dep.links.bucket}/medikquantis-${NEW_VERSION}.tar.gz`,
  {
    method: "PUT",
    headers: { Authorization: `Bearer ${ZENODO_TOKEN}` },
    body: tarballBuf,
  },
);
if (!uploadResp.ok) die(`Zenodo upload failed: HTTP ${uploadResp.status}`);
ok(`Tarball uploaded to Zenodo bucket`);

const metadata = {
  title:
    "MedikQuantis: Multilingual clinical calculators with patient-mode explanations",
  upload_type: "software",
  description:
    `<p>MedikQuantis is an open-source collection of clinical calculators ` +
    `localised to Catalan, Spanish and English. Each calculator implements ` +
    `the original published score with PubMed-cited references, exposes a ` +
    `dual-mode interface (clinician compact view and patient narrative ` +
    `view), and is covered by deterministic unit tests. MIT licensed, ` +
    `client-side, no data collection.</p>` +
    `<p>Version ${NEW_VERSION}.</p>`,
  creators: [
    {
      name: "Piñero Roig, Laura",
      orcid: "0009-0008-3390-4029",
      affiliation: "School of Medicine, University of Barcelona",
    },
  ],
  keywords: [
    "clinical calculators",
    "medical informatics",
    "decision support",
    "multilingual",
    "open source",
    "cardiology",
    "typescript",
  ],
  license: "MIT",
  access_right: "open",
  version: NEW_VERSION,
  related_identifiers: [
    {
      identifier: "https://github.com/laurapiro17/medikquantis",
      relation: "isSupplementTo",
      scheme: "url",
    },
  ],
};
const metaResp = await fetch(
  `https://zenodo.org/api/deposit/depositions/${dep.id}`,
  { method: "PUT", headers: zenodoHeaders, body: JSON.stringify({ metadata }) },
);
if (!metaResp.ok) die(`Zenodo metadata failed: HTTP ${metaResp.status}`);
ok(`Metadata set`);

const pubResp = await fetch(
  `https://zenodo.org/api/deposit/depositions/${dep.id}/actions/publish`,
  { method: "POST", headers: { Authorization: `Bearer ${ZENODO_TOKEN}` } },
);
if (!pubResp.ok) die(`Zenodo publish failed: HTTP ${pubResp.status}`);
const published = await pubResp.json();
const doi = published.doi;
const recordUrl = published.links.html;
ok(`Published! DOI: ${c.bold(doi)}`);
ok(`Record: ${recordUrl}`);

rmSync(tmp, { recursive: true, force: true });

// ───────────────────────────────────────────────────────────────────────────
// Phase 7 — Update CITING.md with new DOI
// ───────────────────────────────────────────────────────────────────────────
phase(7, "Update CITING.md with new DOI + push");

let citing = readFileSync("docs/CITING.md", "utf8");
citing = citing.replace(/10\.5281\/zenodo\.\d+/g, doi);
citing = citing.replace(/MedikQuantis v[\d.]+/g, `MedikQuantis v${NEW_VERSION}`);
citing = citing.replace(/version\s+=\s+\{v[\d.]+\}/g, `version      = {v${NEW_VERSION}}`);
writeFileSync("docs/CITING.md", citing);
ok(`docs/CITING.md updated`);

stream("git", ["add", "docs/CITING.md"]);
stream("git", ["commit", "-m", `Update CITING with v${NEW_VERSION} DOI ${doi}`]);
stream("git", ["push", "origin", "main"]);

// ───────────────────────────────────────────────────────────────────────────
// Done
// ───────────────────────────────────────────────────────────────────────────
console.log(`
${c.green(c.bold(`✓ Release ${NEW_VERSION} complete`))}

  ${c.dim("Version:")}  ${NEW_VERSION}
  ${c.dim("DOI:    ")}  ${c.bold(doi)}
  ${c.dim("Record: ")}  ${recordUrl}
  ${c.dim("Release:")}  https://github.com/laurapiro17/medikquantis/releases/tag/v${NEW_VERSION}
`);
