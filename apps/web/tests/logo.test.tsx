import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Logo, LogoMark } from "@/components/Logo";

// The one letterform both marks are built from. If this string changes, the
// monogram and the square icon must change together or they have drifted.
const M_PATH = "M4 26 L4 6 L16 26 L28 6 L28 26";

describe("Logo", () => {
  it("draws the MQ monogram on a 59x32 box", () => {
    const html = renderToStaticMarkup(<Logo />);
    expect(html).toContain('viewBox="0 0 59 32"');
    expect(html).toContain(M_PATH);
    expect(html).toContain('cx="44.95"');
    expect(html).toContain('r="10"');
    expect(html).toContain("M48.70 24.4 L53.30 28.2");
  });

  it("colours the M with currentColor and the Q with the brand pair", () => {
    const html = renderToStaticMarkup(<Logo />);
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain("stroke-trust-700");
    expect(html).toContain("dark:stroke-neon");
  });

  it("is hidden from assistive technology", () => {
    for (const html of [
      renderToStaticMarkup(<Logo />),
      renderToStaticMarkup(<LogoMark />),
    ]) {
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('focusable="false"');
      expect(html).not.toContain("aria-label");
      expect(html).not.toContain('role="img"');
    }
  });

  it("passes className through", () => {
    expect(renderToStaticMarkup(<Logo className="h-6 w-auto" />)).toContain(
      "h-6 w-auto",
    );
  });
});

describe("LogoMark", () => {
  it("reuses the same M on a square box", () => {
    const html = renderToStaticMarkup(<LogoMark />);
    expect(html).toContain('viewBox="0 0 32 32"');
    expect(html).toContain(M_PATH);
    expect(html).toContain("translate(0.57 0.57) scale(0.9643)");
  });

  it("carries no Q", () => {
    expect(renderToStaticMarkup(<LogoMark />)).not.toContain("circle");
  });
});
