import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CalcReferences } from "@/components/CalcReferences";

describe("CalcReferences", () => {
  it("links a reference that has a PMID", () => {
    const html = renderToStaticMarkup(
      <CalcReferences
        label="References"
        references={[{ pmid: "3657876", citation: "Mosteller RD. N Engl J Med. 1987." }]}
      />,
    );
    expect(html).toContain("https://pubmed.ncbi.nlm.nih.gov/3657876/");
    expect(html).toContain("PMID:3657876");
  });

  it("renders a PMID-less reference as plain text with no link", () => {
    const html = renderToStaticMarkup(
      <CalcReferences
        label="References"
        references={[{ citation: "Devine BJ. Drug Intell Clin Pharm. 1974;8:650-655." }]}
      />,
    );
    expect(html).toContain("Devine BJ.");
    expect(html).not.toContain("pubmed.ncbi.nlm.nih.gov");
    expect(html).not.toContain("undefined");
  });
});
