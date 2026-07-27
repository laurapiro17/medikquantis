"""RAG Engine integrating vector search and Anthropic Claude generation with PMID citations."""

from typing import List, Dict, Optional
import anthropic

from medical_rag.config import settings
from medical_rag.schemas import RAGResponse, Citation, SearchResult
from medical_rag.vector_store import MedicalVectorStore
from medical_rag.pubmed import fetch_and_search_pubmed

SYSTEM_PROMPT = """You are an expert clinical AI assistant trained to answer medical and clinical queries strictly based on provided PubMed research literature.

RULES:
1. Answer the question using ONLY the provided PubMed excerpts.
2. Every major clinical claim, finding, or statistic MUST be directly cited inline using the format [PMID: <pmid_number>].
3. If the provided literature does NOT contain enough information to answer the question confidently, state clearly: "Based on the provided PubMed literature, there is insufficient evidence to answer..."
4. Do not invent citations or extrapolate beyond the provided text.
5. Maintain a professional, objective, evidence-grounded tone.
"""


class MedicalRAGEngine:
    """Orchestrator for PubMed-grounded Retrieval-Augmented Generation."""

    def __init__(self, vector_store: Optional[MedicalVectorStore] = None):
        self.vector_store = vector_store or MedicalVectorStore()
        self.client = (
            anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            if settings.ANTHROPIC_API_KEY
            else None
        )

    def ingest_topic(self, query: str, max_results: int = 15) -> int:
        """Fetch articles from PubMed for a topic and index them in the vector store.

        Args:
            query: Clinical query or topic.
            max_results: Max articles to fetch.

        Returns:
            Number of chunks added to vector store.
        """
        articles = fetch_and_search_pubmed(query, max_results=max_results)
        return self.vector_store.add_articles(articles)

    def answer_query(self, query: str, top_k: int = 5, auto_fetch: bool = True) -> RAGResponse:
        """Run full RAG pipeline for a clinical question.

        Args:
            query: Clinical question.
            top_k: Number of relevant context chunks to retrieve.
            auto_fetch: If True and vector store has 0 results, auto-fetches PubMed articles.

        Returns:
            RAGResponse object.
        """
        # Step 1: Search vector store
        chunks = self.vector_store.search(query, top_k=top_k)

        # Step 2: Auto-fetch fallback if vector store is empty
        if not chunks and auto_fetch:
            self.ingest_topic(query, max_results=10)
            chunks = self.vector_store.search(query, top_k=top_k)

        if not chunks:
            return RAGResponse(
                query=query,
                answer="No PubMed literature found for this query in the vector store, and automatic retrieval yielded no results.",
                citations=[],
                retrieved_chunks=[],
            )

        # Step 3: Format Context and collect unique citations
        context_blocks: List[str] = []
        citations_map: Dict[str, Citation] = {}

        for idx, chunk in enumerate(chunks, 1):
            meta = chunk.metadata
            pmid = meta.get("pmid", "Unknown")
            title = meta.get("title", "")
            journal = meta.get("journal", "")
            year = meta.get("pub_year", "")
            doi = meta.get("doi", "")

            if pmid not in citations_map:
                citations_map[pmid] = Citation(
                    pmid=pmid,
                    title=title,
                    journal=journal,
                    pub_year=year,
                    doi=doi if doi else None,
                )

            context_blocks.append(
                f"--- EVIDENCE EXCERPT {idx} [PMID: {pmid}] ---\n"
                f"Title: {title}\n"
                f"Journal: {journal} ({year})\n"
                f"Content:\n{chunk.text}\n"
            )

        formatted_context = "\n".join(context_blocks)

        user_prompt = (
            f"CLINICAL QUESTION: {query}\n\n"
            f"PROVIDED EVIDENCE:\n{formatted_context}\n\n"
            "INSTRUCTIONS: Answer the clinical question grounded strictly in the provided evidence. "
            "Use inline [PMID: xxx] citations for all clinical statements."
        )

        # Step 4: Generate answer with Anthropic Claude API (or fallback if API key missing)
        if self.client:
            response = self.client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=1000,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            answer_text = response.content[0].text
        else:
            answer_text = (
                "[DEMO / MOCK MODE - ANTHROPIC_API_KEY not provided]\n\n"
                "Retrieved relevant PubMed evidence:\n"
                + "\n".join([f"- [PMID: {c.pmid}] {c.metadata.get('title')}" for c in chunks])
            )

        # Filter citations to those actually present or retrieved
        citations_list = list(citations_map.values())

        return RAGResponse(
            query=query,
            answer=answer_text,
            citations=citations_list,
            retrieved_chunks=chunks,
        )
