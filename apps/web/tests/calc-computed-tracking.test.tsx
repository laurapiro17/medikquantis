// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, StrictMode, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { DynamicCalcForm } from "@/components/DynamicCalcForm";
import { EhraForm } from "@/components/EhraForm";
import en from "../messages/en.json";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const umamiTrack = vi.fn();
let root: Root;
let container: HTMLDivElement;

function calcComputed() {
  return umamiTrack.mock.calls.filter(([name]) => name === "calc_computed");
}

// Each test opens its own path: "used" is remembered per calculator for the
// life of the tab, which here is the whole file. StrictMode as in `next dev`,
// which re-runs mount effects.
async function open(path: string, ui: ReactNode) {
  window.history.replaceState(null, "", path);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      <StrictMode>
        <NextIntlClientProvider
          locale="en"
          messages={en as unknown as AbstractIntlMessages}
          timeZone="UTC"
        >
          {ui}
        </NextIntlClientProvider>
      </StrictMode>,
    );
  });
}

beforeEach(() => {
  umamiTrack.mockClear();
  window.umami = { track: umamiTrack };
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("calc_computed", () => {
  it("is not sent when the page opens and nobody touches the form", async () => {
    await open("/en/opened", <DynamicCalcForm calcId="cha2ds2vasc" />);
    expect(calcComputed()).toHaveLength(0);
  });

  // Every score change remounts ShareActions (ResultPanel keys on the score).
  it("is sent once, on the first change, however many changes follow", async () => {
    await open("/en/ticked", <DynamicCalcForm calcId="cha2ds2vasc" />);
    const boxes = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    for (const box of [...boxes].slice(0, 3)) await act(async () => box.click());

    // Defaults (65-year-old man) are moderate; one ticked box makes it high.
    expect(calcComputed()).toEqual([
      ["calc_computed", { tier: "high", source: "manual", lang: "en", mode: "clinician" }],
    ]);
  });

  it("counts a typed number as a use", async () => {
    await open("/en/typed", <DynamicCalcForm calcId="cha2ds2vasc" />);
    const age = container.querySelector<HTMLInputElement>('input[type="number"]')!;
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    await act(async () => {
      setValue.call(age, "80");
      age.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(calcComputed()).toHaveLength(1);
  });

  it("counts a shared ?p= case once, as a permalink, with the shared result", async () => {
    const p = btoa(JSON.stringify({ chf: true })).replace(/=+$/, "");
    await open(`/en/shared?p=${p}`, <DynamicCalcForm calcId="cha2ds2vasc" />);
    expect(calcComputed()).toEqual([
      ["calc_computed", { tier: "high", source: "permalink", lang: "en", mode: "clinician" }],
    ]);
  });

  it("counts a result that only appears once a choice is made", async () => {
    await open("/en/ehra", <EhraForm />);
    expect(calcComputed()).toHaveLength(0);
    const first = container.querySelector<HTMLInputElement>('input[type="radio"]')!;
    await act(async () => first.click());
    expect(calcComputed()).toHaveLength(1);
  });
});
