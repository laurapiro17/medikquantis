Hi Marcus,

I went back through the repo properly before replying, and your CHA₂DS₂-VASc is already in great shape: the female-sex-only branch (non_sex_score, the NICE NG196 "not an independent indication" interpretation) and the arterial-vs-venous excludes on vascular_disease are exactly right. So this one is basically done, and re-implementing it would be pointless.

A couple of things I noticed that are genuinely additive, if useful:

1. **Annual stroke-risk percentage.** Right now the result is the integer score. The one thing clinicians ask for next is the adjusted annual stroke rate per score (e.g. the Swedish AF cohort: Friberg, Rosenqvist, Lip. Eur Heart J. 2012;33(12):1500-10, PMID 22246443, doi 10.1093/eurheartj/ehr488). Happy to send a small PR adding the per-score table from that paper, citation in the working field, if you'd want it on the flagship.

2. **A language-agnostic test-vector file.** The thing that would actually make us "sister projects" rather than two repos is a shared golden-vector file that both your Rust tests and my TypeScript tests run against, so neither side can silently drift. I've drafted one for CHA₂DS₂-VASc using your exact input field names (attached / in the gist). If the shape works for you I can produce them the same way for the others.

On the bigger picture: I saw the "Future" list and the note that it came largely from MedikQuantis. Almost everything on it is already implemented and tested on my side (Alvarado, anion gap, APACHE II, Barthel, Caprini, Centor, Charlson, FENa, FINDRISC, GCS, Glasgow-Blatchford, LRINEC, MELD 3.0, NIHSS, NYHA, ORBIT, PERC, RCRI, SCORE2, the corrected calcium/sodium, and CHA₂DS₂-VA among them). I know your rule is to implement from the publication rather than port a competitor, which I think is the right call. But I can hand over, per calculator, the primary citation, the input definitions, literature test vectors and the Catalan/Spanish/English strings, so you have everything needed to implement from source quickly. That also lines up with your "translation reciprocity" item.

If you want one concrete next calculator, CHA₂DS₂-VA (the 2024 ESC sex-free update) is on your Future list and I already have it, so it's a natural follow-on from this one.

No rush on any of it. Thanks again for the calc mention.

Laura
