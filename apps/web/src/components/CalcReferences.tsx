import type { CalcReference } from "@medcalc/calculators";

/**
 * Reference list for a calculator page. A reference whose source predates
 * PubMed indexing carries no PMID; it renders as plain citation text rather
 * than as a link to /undefined/.
 */
export function CalcReferences({
  references,
  label,
}: {
  references: readonly CalcReference[];
  label: string;
}) {
  return (
    <details className="glass-panel p-4 text-sm text-slate-600 dark:text-slate-300">
      <summary className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </summary>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        {references.map((r) => (
          <li key={r.pmid ?? r.citation}>
            {r.citation}
            {r.pmid ? (
              <>
                {" "}
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-trust-600 underline dark:text-neon"
                >
                  PMID:{r.pmid}
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </details>
  );
}
