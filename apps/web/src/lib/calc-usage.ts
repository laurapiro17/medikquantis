/**
 * What `calc_computed` counts: one use of one calculator. It is sent once per
 * calculator per tab, the first time the result on screen comes from the user
 * rather than from the defaults: a value typed, ticked or picked in the form,
 * or a shared `?p=` case.
 *
 * Most forms compute the result live from their defaults, so one is on screen
 * the moment the page opens, and ResultPanel keys its panel on the score, so
 * ShareActions remounts on every change. Firing once per mount therefore counted every
 * visitor who never touched the form, then once more per keystroke. The state
 * lives here, outside the React tree, so no remount can reset it.
 */
import { track } from "./analytics";

const used = new Set<string>();
const reported = new Set<string>();

/** The result on this page now reflects the user's own (or a shared) case. */
export function markCalcUsed(): void {
  used.add(window.location.pathname);
}

/** Send `calc_computed` if this page has been used and has not reported yet. */
export function reportCalcUse(data: Parameters<typeof track>[1]): void {
  const path = window.location.pathname;
  if (!used.has(path) || reported.has(path)) return;
  reported.add(path);
  track("calc_computed", data);
}

// A value typed, ticked or picked in a form marks the page as used. Capture
// on the document runs before React's listener at the root, so the mark is in
// place before the re-render the change causes. `click` is needed because
// React fires a checkbox's or radio's onChange from it, before `change`.
if (typeof document !== "undefined") {
  const onUserInput = (event: Event) => {
    const el = event.target;
    if (el instanceof Element && el.matches("input, select, textarea") && el.closest("form")) {
      markCalcUsed();
    }
  };
  for (const type of ["click", "input", "change"]) {
    document.addEventListener(type, onUserInput, true);
  }
}
