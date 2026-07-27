"""Tests for medical_rag schemas."""

from medical_rag.schemas import PubMedArticle, Citation, RAGResponse, SearchResult


def test_pubmed_article_schema():
    article = PubMedArticle(
        pmid="22246443",
        title="Evaluation of risk stratification schemes for ischaemic stroke",
        abstract="In patients with atrial fibrillation, stroke risk stratification is essential.",
        journal="Eur Heart J",
        pub_year="2012",
        authors=["Friberg L", "Rosenqvist M", "Lip GY"],
        doi="10.1093/eurheartj/ehr488",
    )
    assert article.pmid == "22246443"
    assert len(article.authors) == 3
    assert article.pub_year == "2012"


def test_citation_schema():
    cit = Citation(
        pmid="22246443",
        title="Test Title",
        journal="Eur Heart J",
        pub_year="2012",
        doi="10.1093/eurheartj/ehr488",
    )
    assert cit.pmid == "22246443"
    assert cit.doi == "10.1093/eurheartj/ehr488"


def test_rag_response_schema():
    chunk = SearchResult(
        chunk_id="22246443_0",
        pmid="22246443",
        text="Sample text",
        distance=0.1,
        metadata={"pmid": "22246443"},
    )
    resp = RAGResponse(
        query="What is the stroke risk?",
        answer="The stroke risk varies based on score.",
        citations=[],
        retrieved_chunks=[chunk],
    )
    assert resp.query == "What is the stroke risk?"
    assert len(resp.retrieved_chunks) == 1
