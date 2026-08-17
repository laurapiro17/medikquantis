# Brand mark: MQ monogram

Date: 2026-08-14
Status: approved
Supersedes: the mark introduced in #38 (2026-07-29), live since then.

## Why replace the current mark

The current mark draws an "M" as a single trace whose last leg descends into the
bowl of a "Q". Rendered at real size it has four defects, three of them
structural.

1. **The M has no baseline.** The trace reaches `y=25.8` on the left stem, but
   the right one stops at `y=13.8` and sinks into the circle. An M stands on two
   feet; this one has one. At 96 px it reads as a mountain range beside a
   magnifying glass, not as a letter.
2. **The two apexes are unequal** — the left rounded by a quadratic, the right
   pointed. With no baseline holding them, that reads as a drawing error rather
   than as a style.
3. **The Q is more of a magnifier than the magnifier is.** Measured: lucide's
   `Search` is `circle(r=8)` plus a 4.34 handle at the lower right, so
   handle/radius = **0.77**. The mark is `circle(r=6)` plus a 5.23 handle, so
   **0.87**. That same search glyph renders in the same header
   (`CommandPalette.tsx:125`).
4. **Counters close below about 20 px.**

The wordmark was never designed either: "MedikQuantis" is the body typeface at
`font-semibold`, split across two `<span>`s with a `-ml-2` that cancels the
parent flex `gap-2`.

## Concept

An **MQ** monogram whose two letters are **constructed and separate**, not
fused. Fusing them is precisely what broke the M in July.

An accepted structural constraint: **"MQ" is a wide object** (ink ratio 2.1:1).
Forcing it into a square box is what required the old favicon's `scale(0.46)`
and what mutilated the M in the July redesign. The identity is therefore **two
pieces**:

- **MQ monogram** — header and wide contexts
- **M alone, square** — favicon, PWA icons, mobile header

Both share a single M `path`. They are not two drawings.

## The mark

`viewBox="0 0 59 32"`, `fill="none"`, `stroke-linecap="round"`,
`stroke-linejoin="round"`.

```svg
<path d="M4 26 L4 6 L16 26 L28 6 L28 26" stroke="currentColor" stroke-width="4"/>
<circle cx="44.95" cy="16" r="10" stroke-width="4.1"/>
<path d="M48.70 24.4 L53.30 28.2" stroke-width="4"/>
```

Ink: x 2.0 → 57.0, y 3.95 → 30.2. Side bearings 2.0 / 2.0.

Every value below is set against conventions measured from 15 real typefaces on
disk (Futura, Avenir, Avenir Next, Helvetica, Helvetica Neue, Gill Sans, DIN),
not recalled from memory.

| decision | value | reason |
|---|---|---|
| cap height | 20 on the centreline, **24 in ink** | Round caps add 2 units at each extreme. Every proportion is computed against the ink, not the centreline. |
| M width | centreline 24, ink/cap **1.167** | Measured median 0.995; geometric bolds 1.10–1.25. The only cuts below 0.9 are condensed by design. |
| M vertex | **baseline** (y=26) | Futura, Avenir and Helvetica all take it to the baseline: 0.0%. Only DIN and Gill Sans raise it. It also means the round join forms the same radius-2 dome as the two feet, so all three supports land on one line. |
| M ↔ Q gap | **2.9** (12% of cap) | Measured convention: straight-to-round 16.2% of cap, straight-to-straight 21.0%. 2.9 is tight display tracking. |
| bowl radius | **10.00**, no overshoot | Counter-intuitive: the M's round caps read short under blur, so the bowl already gets about 0.55 units of apparent overshoot for free. Adding geometric overshoot on top gave 3.75%, nearly double the 2.2% convention, and the Q floated. |
| bowl stroke | **4.1** (+2.5%) | Measured O side-stroke ÷ H stem: median 1.025. |
| Q tail | 40°, length 6.0, at 5 o'clock | It must do two things or the Q reads as **O**: leave **off-radius** (a radial tail is a magnifier handle) and **break the bowl's bounding box**. This one breaks 2.2 below it — the Helvetica band. |
| round joins | **unchanged** | Measured, the resulting apexes are leaner than most real Ms (1.00 against a median of 1.54). Coherent style, not an unresolved corner. |

Not adopted: a modulated bowl. Real typefaces thin the top and bottom of an O by
6–17%, which a stroked `<circle>` cannot do — it forces top = side. Getting it
would need a filled path with an elliptical counter, which is disproportionate
maintenance for the gain.

## Colour

- **M:** `currentColor`, inheriting the header text colour, so it needs no
  light/dark variant.
- **Q:** `stroke-trust-700 dark:stroke-neon`, applied to the `<circle>` and the
  tail `<path>`.

The light Q is **`#1d4ed8` (blue-700), not `#2563eb`**. With blue-600 the
lightness difference between M and Q is ΔL\* 29.7 in light theme against 18.3 in
dark, so the Q reads as a thinner letter beside a near-black one. Blue-700 puts
it at 22.6 and makes both themes behave alike. Separation between the letters
comes from hue (ΔE2000 = 23.4, far above threshold), not from lightness.

Trap: the `neon` token is `#93c5fd` in **both** themes
(`tailwind.config.ts:36`), so a bare `stroke-neon` is washed out on white.
`globals.css:100-106` also defines a theme-aware `.text-neon` — dead CSS today —
that would shadow the config value if the bare class were used. Always use the
explicit pair.

Verified: all four element-against-background ratios fall between 5.17:1 and
17.56:1. Under protanopia, deuteranopia and tritanopia, with two simulation
models, the two-tone distinction survives in both themes; ΔE2000 never drops
below 19.5.

## Lockup

Inter Semibold, `tracking-tight`, **6 px** separation (`gap-1.5`).

**Responsive behaviour is required, not cosmetic.** The mobile header already
overflows at 375 px: the group needs about 309 px and has 243. The monogram is
wider than the current mark, so it would push the wrong way.

- below `sm:` → the **square M**
- from `sm:` → the **full monogram**

Height `h-6` (24 px); `h-5` is the fallback if the mark looks large against the
16 px wordmark once deployed.

"Quantis" becomes **nested** inside the "Medik" span, which removes the `-ml-2`.
Both edits must land together: `-ml-2` exactly cancels `gap-2`, so changing one
without the other overlaps the "k" and the "Q" by 2 px.

JSX trap: when nesting, a newline between the spans produces no space but a
stray space does, and "Medik Quantis" is nearly invisible in a diff.

## Square icon

`viewBox="0 0 32 32"`, the **same** M path, scaled uniformly so the letterform
is identical:

```svg
<g transform="translate(0.57 0.57) scale(0.9643)">
  <path d="M4 26 L4 6 L16 26 L28 6 L28 26" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round"/>
</g>
```

The whole group is scaled, stroke included, so the stroke-to-cap ratio is
preserved. At equal rendered height the icon's stroke lands 3.7% under the
monogram's — imperceptible, and the two pieces never appear together.

Ink 27.0 × 23.1 in the 32 box; bearings 2.5 horizontal, 4.4 vertical.

## Accessibility

The inline `<svg>` becomes **`aria-hidden="true"` with `focusable="false"`**,
and loses its `role="img"` and `aria-label`.

It does not double-announce today, but only by accident: the `<Link>`'s
`aria-label` wins the accessible name computation and stops traversal. The
graphic is still a named node in the accessibility tree, so NVDA's graphics
quick-nav stops on it and repeats the brand. The markup is also one deletion
away from a real failure — remove the `<Link>`'s `aria-label` because it looks
redundant next to visible text, and the name falls back to contents and becomes
"MedikQuantis MedikQuantis".

Nothing is lost by hiding it: the adjacent wordmark already says the name.

## Scope

| file | change |
|---|---|
| `apps/web/src/components/Logo.tsx` | New geometry. Exports `Logo` (monogram) and `LogoMark` (square M), sharing the path constant. The header comment currently claims the viewBox is square; rewrite it. |
| `apps/web/src/app/[locale]/layout.tsx` | Lockup: `h-6`, `gap-1.5`, nested spans, `-ml-2` removed, `LogoMark` on mobile. |
| `apps/web/src/app/icon.svg` | The square M. |
| `apps/web/public/icons/icon-192-v2.png` | New; delete `icon-192.png`. |
| `apps/web/public/icons/icon-512-v2.png` | New; delete `icon-512.png`. |
| `apps/web/public/icons/icon-512-maskable-v2.png` | New, from a **white-stroked** variant; delete the old one. |
| `apps/web/src/app/manifest.ts` | Point the three `icons` entries at the new names. |
| `apps/web/public/sw.js` | `VERSION` → `"v2"`. Required; see below. |

The PNGs are **renamed rather than replaced in place**. That is the only way an
already-installed PWA picks up the new icon.

### Rasterising

`rsvg-convert` 2.61.3 is available; `cairosvg` is not. Current PNGs to match:

| file | pixels | mode | background | mark |
|---|---|---|---|---|
| `icon-192.png` | 192×192 | RGBA | transparent | `#2563eb` |
| `icon-512.png` | 512×512 | RGBA | transparent | `#2563eb` |
| `icon-512-maskable.png` | 512×512 | **RGB, no alpha** | `#0c0f10` | **white** |

The maskable icon's mark is **white, not blue** (verified by pixel histogram:
30,689 pure-white pixels). Regenerating it from the blue `icon.svg` would drop
contrast from 19.2:1 to 3.8:1. `rsvg-convert` has no recolour flag, so a
white-stroked variant of the SVG is needed. The maskable must stay alpha-free.

### The service worker must change in the same commit

`sw.js` routes everything under `/icons/` to `cacheFirst` over
`STATIC_CACHE = "mq-static-v1"`, which returns the cache hit and never
revalidates. The file's own comment calls these "content-hashed, immutable
assets" — true for `/_next/static/`, false for `/icons/`, whose names are fixed.

Bumping `VERSION` to `"v2"` is therefore required in the same commit.
`skipWaiting()` and `clients.claim()` are already in place, so the swap takes
effect on the next navigation. `app/icon.svg` is unaffected: Next adds a
content hash to its URL.

## Out of scope

Three pre-existing defects found while auditing this change. None is introduced
by it, and folding them in would make the PR hard to review.

1. **The favicon recedes on dark tab bars.** `#2563eb` gives 3.94:1 on Chrome's
   light tab bar and **2.63:1 on the dark one**, below 3:1; 2.20:1 on the macOS
   dock. No flat blue clears 3:1 against both greys — the luminance window is so
   narrow that the theoretical optimum is 3.22:1 exactly. The fix is a
   theme-aware SVG favicon using `prefers-color-scheme` (brand blue on light,
   `neon` on dark, 7.54:1); Safari ignores the query and falls back. Needs
   verifying on a deployed tab.
2. **The OG image is off-brand.** `app/[locale]/opengraph-image.tsx` draws its
   own mark — a cyan `#00f0ff` dot on `#0b0f14` with a teal gradient and
   `#9fbac8` text. It never imports `Logo` and matches no other surface.
3. **The lockup prints.** `globals.css:297` hides `header, footer, nav, form`,
   but the site header is a `<div>` and so is not hidden, while the content
   pages' `<header>` elements are hidden and should not be.

## Verification

1. `pnpm typecheck` clean, `pnpm test`, `pnpm build` exit 0.
2. `next start`, then real screenshots of the header in **light and dark**. The
   site forces `dark` by default via `themeBootstrapScript`, so reaching light
   theme means injecting `localStorage`.
3. **Header at 375 px wide**: the group must not overflow, and the square M must
   render instead of the monogram.
4. Favicon in a real tab, light and dark.
5. The three PNGs: dimensions, colour mode, and **no alpha channel on the
   maskable**, against the table above.
6. Install the PWA and confirm the launcher icon updates — the case the
   versioned filenames exist to cover.

## Rejected alternatives

- **A "value within a range" mark** — two limits with a disc between them.
  Drawn, rendered at real sizes and rejected by the project owner. It was
  correct and it was not a mark: legible at 16 px, single-colour safe, no
  collisions, and no character at all. The method error was letting a constraint
  drive the design instead of an idea, subtracting until nothing was left.
  Legibility at small size is a floor to clear, not a goal to pursue.
- **A shared-stem monogram**, the M's right stem doubling as the Q's left side.
  Flattening the bowl stops it being a Q: it reads "MD".
- **The Q tucked under the M's arm.** It unbalances the pair — the Q falls below
  cap height and the result reads "Mq".
- **The Q alone as the square icon.** The M is unambiguous at 16 px and does not
  flirt with the search glyph's circle again.
